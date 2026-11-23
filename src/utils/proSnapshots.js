// Persist only controls that are in the active Pro signal path. Output volume,
// listening point, playback and the independent Enkel processor are not presets.
import { audioSources } from '../data/audioSources.js';

const scalar = (label, unit, min, max) => ({ label, unit, accepts: n => Number.isFinite(n) && n >= min && n <= max });
const toggle = label => ({ label, accepts: v => typeof v === 'boolean' });
const choice = (label, values) => ({ label, accepts: v => values.includes(v) });
const db = (label, min = -60, max = 0) => scalar(label, 'dB', min, max);
const hz = (label, min = 20, max = 20000) => scalar(label, 'Hz', min, max);
const ms = (label, min, max) => scalar(label, 'ms', min, max);
const detector = { keyEnabled: toggle('Sidechain'), keyHPF: hz('Key HPF', 20, 5000), keyLPF: hz('Key LPF', 120) };
const band = (index) => ({ frequency: hz('Frekvens'), gain: db('Gain', -15, 15), width: scalar('Bredde', 'okt', .11, 1.5),
  type: choice('Type', index === 0 ? ['peaking','lowshelf','highpass'] : index === 3 ? ['peaking','highshelf','lowpass'] : ['peaking']), enabled: toggle('Aktivt') });
const schema = {
  gain: db('Inngangsgain',0,60), sourceLevel: scalar('Kildenivå','dBFS',-72,-24), connected: toggle('Inngang tilkoblet'),
  fader: db('Kanalfader'), pan: scalar('Panorama','%',-100,100), muted: toggle('Kanal-mute'), bypass: toggle('Bypass'),
  mainAssigned: toggle('Til Main LR'), mainLevel: db('Main-fader'), monitorPre: toggle('Monitor pre-fade'), monitorSend: db('Monitorsend'),
  fxType: choice('Effekt',['off','reverb','delay']), fxSend: db('Effektsend'), decay: scalar('Klangtid','s',.3,3),
  delayMs: ms('Delaytid',80,800), feedback: scalar('Delay-feedback','%',0,75), fxReturn: toggle('Effektretur'), returnLevel: db('Returfader',-60,6),
  matrixLevel: db('Matrix til PA'), paEnabled: toggle('PA-utgang'),
  pro: {
    trim: db('Digital trim',-24,24), polarity: toggle('Vend polaritet'),
    filters: { hpf: toggle('Høypass'), hpfHz: hz('HPF-frekvens',20,2000), slope: choice('HPF-bratthet',[12,24]), lpf: toggle('Lavpass'), lpfHz: hz('LPF-frekvens',50) },
    eq: { enabled: toggle('PEQ aktiv'), bands: Array.from({length:4}, (_,i)=>band(i)) },
    gate: { enabled: toggle('Aktiv'), threshold: scalar('Terskel','dBFS',-72,0), depth: db('Demping',0,60), attack: ms('Åpning',.05,300), hold: ms('Hold',10,5000), release: ms('Lukking',10,1000), ...detector },
    comp: { enabled: toggle('Aktiv'), threshold: scalar('Terskel','dBFS',-60,0), ratio: scalar('Ratio',':1',1,20), attack: ms('Attack',.1,300), release: ms('Release',10,2000),
      knee: db('Kne',0,24), makeup: db('Make-up',-12,24), mix: scalar('Wet','%',0,100), rms: toggle('RMS-detektor'), ...detector },
  },
};
const bands = ['LF','LM','HM','HF'];
const names = { peaking:'Klokke', lowshelf:'Lav hylle', highshelf:'Høy hylle', highpass:'Høypass', lowpass:'Lavpass', off:'Av', reverb:'Klang', delay:'Delay' };
function walk(spec, value, visitor, path = []) {
  if (spec.accepts) {
    if (!spec.accepts(value)) throw Error('Ugyldig verdi');
    visitor?.(path, spec, value);
    return value;
  }
  if (!value || typeof value !== 'object' || Array.isArray(spec) !== Array.isArray(value)) throw Error('Ugyldig miks');
  if (Array.isArray(spec)) {
    if (value.length !== spec.length) throw Error('Ugyldige EQ-bånd');
    return spec.map((item,i)=>walk(item,value[i],visitor,[...path,i]));
  }
  return Object.fromEntries(Object.entries(spec).map(([key,item])=>[key,walk(item,value[key],visitor,[...path,key])]));
}
export function captureProMix(state) { return walk(schema,state); }
function format(value, spec, path) {
  if (typeof value === 'boolean') return value ? 'På' : 'Av';
  if (typeof value === 'string') return names[value] || value;
  const n = String(+value.toFixed(3)).replace('.',',');
  return path.at(-1) === 'slope' ? n+' dB/okt' : spec.unit === ':1' ? n+':1' : n+(spec.unit ? ' '+spec.unit : '');
}
export function compareProMixes(a, b) {
  if (!a || !b) return [];
  const changes = [];
  walk(schema,a,(path,spec,v)=>{
    const w = path.reduce((obj,key)=>obj[key],b);
    if (v === w) return;
    const prefix = path.includes('gate') ? 'Gate · ' : path.includes('comp') ? 'Comp · ' : path.includes('bands') ? bands[path[3]]+' · ' : '';
    changes.push({ label:prefix+spec.label, before:format(v,spec,path), after:format(w,spec,path) });
  });
  return changes;
}
export function snapshotName(name, slot) { return String(typeof name === 'string' ? name : '').trim().slice(0,32) || 'Miks '+slot; }
export function parseProBank(raw) {
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return {};
    const slots = {};
    for (const slot of ['A','B']) {
      try { const item = data[slot]; if (item && typeof item.name === 'string') slots[slot] = { name:snapshotName(item.name,slot), mix:captureProMix(item.mix) }; }
      catch { /* A malformed slot must not invalidate the other slot. */ }
    }
    return slots;
  } catch { return {}; }
}
const session = new Map();
const slotKey = id => {
  if (!audioSources.some(source=>source.id===id)) throw Error('Ukjent kilde');
  return 'lydteam.pro.miksminne.v1.'+id;
};
export function readProBank(id) {
  const key = slotKey(id);
  if (session.has(key)) return session.get(key);
  try { return parseProBank(window.localStorage.getItem(key)); } catch { return {}; }
}
export function writeProBank(id, slots) {
  const key = slotKey(id);
  session.set(key,slots);
  try { window.localStorage.setItem(key,JSON.stringify({version:1,...slots})); return true; } catch { return false; }
}
