"""Regenerate homepage waveform peaks from bundled MP3s. Requires ffmpeg."""
import json
import struct
import subprocess
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
credits = json.loads((repo / 'public/audio/credits.json').read_text())
out = ["// Generated from the bundled recordings by scripts/prepare-waveforms.py.",
       "// Heights are peak amplitudes in equal time windows, normalized per clip.",
       "export const sourceWaveforms = {"]
for sound in credits['sounds']:
    audio_path = repo / 'public' / sound['file'].lstrip('/')
    pcm = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(audio_path),
                                   '-ac', '1', '-ar', '16000', '-f', 's16le', '-'])
    samples = struct.unpack(f'<{len(pcm)//2}h', pcm)
    bars = 112
    peak = [max(map(abs, samples[i*len(samples)//bars:(i+1)*len(samples)//bars])) for i in range(bars)]
    scale = max(peak) or 1
    out.append(f"  {sound['id']}: {{ duration: {sound['duration']}, peaks: [{','.join(str(round(v/scale*100)) for v in peak)}] }},")
out.append('};')
(repo / 'src/data/sourceWaveforms.js').write_text('\n'.join(out) + '\n')
