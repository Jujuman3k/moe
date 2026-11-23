// These are relative fader positions for listening experiments, not measured loudness targets.
const track = (id, gainDb, role) => ({ id, gainDb, pan: 0, role });

export const bandScenes = [
  { id:'grunnmur', title:'Kick og bass', topic:'Anslag og puls', icon:'rhythm', focus:'kick',
    brief:'Bassen fyller bunnen og skarpen tar oppmerksomheten. La kicket lede pulsen i et fast trommemønster på 110 BPM.',
    tip:'Hør etter hvor hvert bass-spill starter mot kicket. Slå av solo før du vurderer om anslaget fortsatt er lett å følge.',
    target:'Prøv kicket minst 1 dB over bassen og minst 3 dB over skarpen. Behold alle tre kanalene i miksen.',
    why:'Du har gitt de tre rollene ulik plass. Hør spesielt på et svakt bassanslag mellom to kick.',
    tracks:[track('kick',-9,'Puls'),track('bass',1,'Fundament'),track('snare',0,'Motpuls')] },
  { id:'vokalplass', title:'Plass til vokalen', topic:'Nivåbalanse', icon:'vocal', focus:'male',
    brief:'Vokalen forsvinner mellom piano og gitar. Kan du hente fram ordene uten å løfte hele miksen?',
    tip:'Lytt til slutten av en stavelse. Trekk ned ett akkompagnement om gangen til du kan følge vokalen mens begge fortsatt er med.',
    target:'Prøv minst 4 dB mer på vokalfaderen enn på både piano og gitar. La begge instrumentene være hørbare.',
    why:'Du skapte avstand mellom kanalene. Vokalen kan få mer plass selv om masteren står stille.',
    tracks:[track('male',-10,'Ledestemme'),track('piano',0,'Akkompagnement'),track('guitar',-1,'Rytmegitar')] },
  { id:'duett', title:'To stemmer', topic:'Stereobilde', icon:'stereo', focus:'female',
    brief:'Begge stemmene ligger i midten. Lag to tydelige posisjoner med piano som anker.',
    tip:'Bruk hodetelefoner eller to høyttalere. Panorer stemmene ut fra sentrum i hver sin retning, og lytt etter om noen av dem fremdeles dominerer.',
    target:'Plasser stemmene på hver sin side, minst 25 % ut. Hold vokalfaderne innen 4 dB fra hverandre og pianoet nær midten (±10 %).',
    why:'Nå er posisjon og nivå to ulike virkemidler. Bytt til startmiksen og hør hvordan stemmene samler seg igjen.',
    tracks:[track('female',2,'Stemme én'),track('male',-4,'Stemme to'),track('piano',-6,'Senteranker')] },
];

export const getBandScene = id => bandScenes.find(scene=>scene.id===id) || bandScenes[0];
export function initialBandMix(scene) {
  return { masterDb:-6, channels:scene.tracks.map(({ id,gainDb,pan })=>({id,gainDb,pan,mute:false,solo:false})) };
}
const bounded = (v,min,max,fallback) => Number.isFinite(v) ? Math.max(min,Math.min(max,v)) : fallback;
export function restoreBandMix(scene, raw) {
  const clean=initialBandMix(scene);
  if (!raw || !Array.isArray(raw.channels)) return clean;
  return { masterDb:bounded(raw.masterDb,-60,6,clean.masterDb), channels:clean.channels.map(base=>{
    const c=raw.channels.find(item=>item?.id===base.id);
    return c ? { ...base, gainDb:bounded(c.gainDb,-60,6,base.gainDb), pan:bounded(c.pan,-1,1,0), mute:c.mute===true, solo:c.solo===true } : base;
  }) };
}

export function checkBandBalance(scene,mix) {
  const c=Object.fromEntries(mix.channels.map(item=>[item.id,item]));
  if (mix.masterDb<=-50) return 'Masteren er nesten stille. Gi utgangen lyttevolum før du vurderer kanalbalansen.';
  if (mix.channels.some(t=>t.solo)) return 'Slå av solo. Vurder balansen med hele besetningen i øret.';
  if (mix.channels.some(t=>t.mute || t.gainDb < -35)) return 'Én eller flere kanaler er nesten stille. La alle tre delta i øvelsen.';
  if (scene.id==='vokalplass') {
    if(c.male.gainDb-c.piano.gainDb<4) return 'Pianoet konkurrerer fremdeles med vokalen i øvingsmålet. Prøv å senke pianoet og lytt til ordene igjen.';
    if(c.male.gainDb-c.guitar.gainDb<4) return 'Hør på gitaranslaget mot stavelsene. Prøv et par dB mindre gitar.';
  } else if (scene.id==='grunnmur') {
    if(c.kick.gainDb-c.bass.gainDb<1) return 'Prøv å trekke bassen litt tilbake i forhold til kicket. Kommer starten av slaget tydeligere fram?';
    if(c.kick.gainDb-c.snare.gainDb<3) return 'Prøv litt mindre skarp. Hør om kicket får lede pulsen mellom skarpslagene.';
  } else {
    if(c.female.pan*c.male.pan>=0 || Math.min(Math.abs(c.female.pan),Math.abs(c.male.pan))<.25) return 'Gi hver stemme sin side. Prøv minst en fjerdedel av panoramalengden på hver side.';
    if(Math.abs(c.female.gainDb-c.male.gainDb)>4) return 'Stemmene er plassert, men faderne står langt fra hverandre. Samle vokalnivåene litt.';
    if(Math.abs(c.piano.pan)>.1) return 'La pianoet ligge nær midten, så har de to stemmene et felles anker.';
  }
  return null;
}
