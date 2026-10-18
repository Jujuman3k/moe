"""Recreate the bundled CC0 excerpts. Requires Python 3 and ffmpeg on PATH.

Run from the repository root: python scripts/prepare-audio.py
The public preview URLs, original hashes and adaptation settings are pinned in
public/audio/credits.json. A changed download is rejected before conversion.
"""
import hashlib
import json
import subprocess
import tempfile
import urllib.request
from pathlib import Path

root = Path(__file__).resolve().parent.parent
credits = json.loads((root / 'public/audio/credits.json').read_text())
with tempfile.TemporaryDirectory(prefix='lydteam-audio-') as temporary:
    for sound in credits['sounds']:
        with urllib.request.urlopen(sound['preview'], timeout=30) as response:
            data = response.read()
        assert hashlib.sha256(data).hexdigest() == sound['previewSha256'], f"Changed source: {sound['id']}"
        source = Path(temporary) / f"{sound['id']}.mp3"
        source.write_bytes(data)
        duration = sound['trimSeconds']
        output = root / 'public' / sound['file'].lstrip('/')
        filters = f"atrim=0:{duration},asetpts=PTS-STARTPTS,afade=t=in:d=0.003,afade=t=out:st={max(0,duration-0.03)}:d=0.03,apad,atrim=0:{sound['duration']}"
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(source), '-af', filters,
                        '-ac', '1', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '160k', str(output)], check=True)
        print(f"Prepared {output.name}. Encoder-version differences can change the file hash; review before updating credits.")
