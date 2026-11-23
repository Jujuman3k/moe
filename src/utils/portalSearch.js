import { allVideos } from './videoLibrary.js';
import { practiceScenarios } from '../data/practiceScenarios.js';
import { audioSources } from '../data/audioSources.js';
import { signalJourney } from '../data/signalJourney.js';

import { diagnosticIndex } from '../data/practice/diagnosticIndex.js';
import { bandScenes } from '../data/bandScenes.js';
import { listenTracks } from '../data/listenRounds.js';
import { learningPaths } from '../data/learningPaths.js';

const fold = value => value.toLocaleLowerCase('nb-NO').replaceAll('æ', 'ae').replaceAll('ø', 'o').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const nodes = {
  input: 'Mikrofon, kabler og stageboks', preamp: 'Preamp og gain', processing: 'EQ, filtre, gate og kompressor', fader: 'Fader og panorering',
  monitor_branch: 'Monitor og pre/post-fade', fx_branch: 'Klang, delay og FX-retur', mixbus: 'Mixbuss og Main LR', matrix: 'Matrix og soner', speakers: 'PA og høyttalere',
};
const result = (kind, title, detail, page, params, keywords = '') => ({
  kind, title, detail, page, params, key: JSON.stringify([kind,page,params]), name: fold(title), text: fold([title,detail,keywords].join(' ')),
});
const index = [
  result('Verktøy','Lyttetest','Sammenlign opptak A og B med ørene.','listen',{},'blindtest lyttetrening øretrening'),
  ...Object.entries(listenTracks).filter(([id])=>id!=='mixed').map(([id,t]) => result('Verktøy','Hør forskjell: ' + t.label,t.cue,'listen',{track:id},'lyttetest gehør øretrening ' + id)),
  ...bandScenes.map(s => result('Verktøy',s.title,'Bandrommet · ' + s.topic,'bandroom',{scene:s.id},'bandrom kanalstriper bandmiks flerkanal solo mute panorama ' + s.id)),
  ...diagnosticIndex.map(d => result('Feilsak',d.title,d.context + ' · ' + d.station,'practice',{fault:d.id},'diagnose feilsøking feilsøk ' + d.station)),
  ...learningPaths.map(p => result('Læringsløp',p.title,p.goal,'videos',{track:p.id},p.tag + ' læringsløp se miks løs')),
  ...audioSources.map(source => result('Verktøy', 'Miks ' + source.label.toLocaleLowerCase('nb-NO'), 'Åpne opptaket i Pro-mikseren.', 'signal', {node:'processing',source:source.id,mode:'pro'}, source.detail)),
  ...signalJourney.map(step => result('Signalvei',nodes[step.id],step.title,'signal',{node:step.id},step.text)),
  ...practiceScenarios.map(s => result('Oppgave',s.title,s.tag,'practice',{scenario:s.id},[s.question,s.lesson,s.id].join(' '))),
  ...allVideos.map(v => result('Video',v.title,v.categoryName,'videos',{video:v.videoId},v.desc)),
];
export const searchKinds = ['Verktøy','Signalvei','Oppgave','Feilsak','Video','Læringsløp'];
export function searchPortal(input = '', kind = 'Alle') {
  const query = fold(input), terms = query.split(' ').filter(Boolean);
  if (!terms.length && kind === 'Alle') return [
    index.find(i => i.params.scene==='vokalplass'), index.find(i=>i.kind==='Feilsak'), index.find(i=>i.kind==='Læringsløp'), index[0], index.find(i => i.params.source === 'kick'), index.find(i => i.params.node === 'preamp'),
    index.find(i => i.params.scenario === 'monitor-pre-fade'), index.find(i => i.kind === 'Video'),
  ];
  const score = entry => (entry.name === query ? 100 : 0) + (query && entry.name.includes(query) ? 24 : 0)
    + terms.reduce((sum, term) => sum + (entry.name.startsWith(term) ? 8 : entry.name.includes(term) ? 5 : 0), 0);
  return index.filter(i => (kind === 'Alle' || i.kind === kind) && terms.every(t => i.text.includes(t)))
    .map(item => ({item,score:score(item)})).sort((a,b) => b.score-a.score).map(row => row.item);
}
