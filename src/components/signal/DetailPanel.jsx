import { VideoPlayer } from '../video/VideoPlayer.jsx';
import { useId, useState } from 'react';
import { SignalDepth } from './depth/SignalDepth.jsx';
import { signalJourney } from '../../data/signalJourney.js';
import { useSwipe } from '../../hooks/useSwipe.js';
import { IconHelper } from '../ui/IconHelper.jsx';
import { ArrowLeft, ChevronRight, GraduationCap, Layers, Layout, Lightbulb, Play, SlidersHorizontal, Youtube } from 'lucide-react';
import { FXInfoVisualizer } from '../visualizers/FXInfoVisualizer.jsx';
import { GainStructureVisualizer } from '../visualizers/GainStructureVisualizer.jsx';
import { FaderSectionVisualizer } from '../visualizers/FaderSectionVisualizer.jsx';
import { MatrixVisualizer } from '../visualizers/MatrixVisualizer.jsx';
import { PAVisualizer } from '../visualizers/PAVisualizer.jsx';
import { MixBusVisualizer } from '../visualizers/MixBusVisualizer.jsx';
import { MonitorVisualizer } from '../visualizers/MonitorVisualizer.jsx';
import { InputConnectorsVisualizer } from '../visualizers/InputConnectorsVisualizer.jsx';
import { HPFVisualizer } from '../visualizers/HPFVisualizer.jsx';
import { Dyn8Visualizer } from '../visualizers/Dyn8Visualizer.jsx';
import { CompressorVisualizer } from '../visualizers/CompressorVisualizer.jsx';
import { GateVisualizer } from '../visualizers/GateVisualizer.jsx';
import { PEQVisualizer } from '../visualizers/PEQVisualizer.jsx';
import { DeEsserVisualizer } from '../visualizers/DeEsserVisualizer.jsx';
import { InsertsVisualizer } from '../visualizers/InsertsVisualizer.jsx';

export const DetailPanel = ({ node, subItem, setSubItem, onClose, onTry, onConsole, onVideoTab }) => {
  const moduleListId = useId();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const swipeSubItem = useSwipe(() => setSubItem(null));

  // Hent videoer
  const getVideos = () => {
    const target = subItem || node;
    if (!target) return [];
    if (target.relatedVideos && target.relatedVideos.length > 0) return target.relatedVideos;
    if (target.videoId) return [{ videoId: target.videoId, title: target.videoTitle, desc: "Instruksjonsvideo" }];
    return [];
  };

  const videos = getVideos();
  const hasVideos = videos.length > 0;

  // Sjekk innhold
  const target = subItem || node;
  const hasDeepDive = target?.deepDive && target.deepDive.length > 0;
  const hasTips = target?.proTips && target.proTips.length > 0; // <--- NY SJEKK FOR TIPS

  const selectedVideo = videos.find(video => video.videoId === selectedVideoId) || videos[0];

  if (!node) return null;

  return (
    <section aria-label={`Detaljer: ${node.label}`} className="sd-panel animate-fade-in">
      <nav className="sd-crumb" aria-label="Plassering i signalveien">
        {onClose ? <button type="button" onClick={onClose}>Signalveien</button> : <span>Signalveien</span>}
        <ChevronRight size={13} aria-hidden="true"/>
        {subItem ? <><button type="button" onClick={() => setSubItem(null)}>{node.label}</button><ChevronRight size={13} aria-hidden="true"/><span aria-current="page">{subItem.label}</span></>
          : <span aria-current="page">Ledd {signalJourney.findIndex(item => item.id === node.id) + 1} av {signalJourney.length} · {node.label}</span>}
      </nav>
      <header className="sd-frame-title"><span className="sd-title-icon"><IconHelper name={node.iconName} size={24} /></span>
        <div><h2>{node.label}</h2><p>{subItem ? subItem.label : 'Følg forbindelsen fra inngang til utgang'}</p></div>
      </header>
      <div className="sd-tabbar" role="group" aria-label="Velg innhold i leddet">
        <button type="button" aria-pressed={activeTab === 'overview'} onClick={()=>setActiveTab('overview')}><Layout size={16}/>Oversikt</button>
        {!subItem && (node.viz || node.subChain) && <button type="button" aria-pressed={activeTab === 'tools'} onClick={()=>setActiveTab('tools')}><SlidersHorizontal size={16}/>Verktøy</button>}
        {hasDeepDive && <button type="button" aria-pressed={activeTab === 'theory'} onClick={()=>setActiveTab('theory')}><GraduationCap size={17}/>Fordypning</button>}
        {hasTips && <button type="button" aria-pressed={activeTab === 'tips'} onClick={()=>setActiveTab('tips')}><Lightbulb size={16}/>Tips &amp; Triks</button>}
        {hasVideos && <button type="button" aria-pressed={activeTab === 'video'} onClick={()=>{ if (activeTab !== 'video') onVideoTab?.(); setActiveTab('video'); }}><Youtube size={17}/>Video {videos.length > 1 && <span>{videos.length}</span>}</button>}
      </div>
      <div>
        {!subItem && <div hidden={activeTab !== 'overview'} className="mb-5">
          <SignalDepth nodeId={node.id} onTry={onTry} onConsole={onConsole}/>
        </div>}
        {/* --- FANE 1: OVERSIKT --- */}
        {(activeTab === 'overview' || activeTab === 'tools') && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-slate-100">{subItem ? 'Modulverksted' : 'Prøv verktøyene'}</h3>
              <p className="mt-1 text-slate-300 leading-relaxed text-sm md:text-base">
                 {subItem ? subItem.desc : node.details}
              </p>
              <p className="mt-2 text-xs text-slate-400">Disse illustrasjonene har egne innstillinger og endrer ikke miksen din.</p>
            </div>

            {/* Visualizers */}
            {!subItem && (
                <>
                    {node.viz === "fx_info" && <FXInfoVisualizer deepDive={node.deepDive} />}
                    {node.viz === "gain_structure" && <GainStructureVisualizer />}
                    {node.viz === "fader_section" && <FaderSectionVisualizer />}
                    {node.viz === "matrix" && <MatrixVisualizer />}
                    {node.viz === "pa" && <PAVisualizer />}
                    {node.viz === "mixbus_map" && <MixBusVisualizer />}
                    {node.viz === "monitor_map" && <MonitorVisualizer />}
                    {node.viz === "input_connectors" && <InputConnectorsVisualizer />}
                </>
            )}

            {/* Sub-Chain */}
            {node.subChain && !subItem && (
              <div>
                <h3 id={moduleListId} className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                  <Layers size={14} aria-hidden="true"/> Velg prosesseringsmodul
                </h3>
                <div role="group" aria-labelledby={moduleListId} className="space-y-2">
                  {node.subChain.map((step, idx) => (
                    <button type="button"
                      key={step.label}
                      aria-labelledby={moduleListId + '-title-' + idx}
                      aria-describedby={moduleListId + '-desc-' + idx}
                      onClick={() => setSubItem(step)}
                      className="w-full text-left flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-blue-500 border border-blue-500/30 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <span id={moduleListId + '-title-' + idx} className="font-bold text-slate-200 text-sm block group-hover:text-blue-400">{step.label}</span>
                        <span id={moduleListId + '-desc-' + idx} className="text-xs text-slate-500">{step.desc}</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-600"/>
                    </button>
                  ))}
                </div>
              </div>
            )}

{/* Sub-Item View */}
            {subItem && (
              <div role="region" aria-label={`Modulverksted: ${subItem.label}`}
                className="mt-2 bg-slate-950 border border-blue-500/30 rounded-xl p-4 animate-fade-in-up shadow-2xl"
                {...swipeSubItem}
              >
                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                  <button type="button" autoFocus onClick={() => setSubItem(null)} title="Til prosesseringsmodulene" className="flex min-h-11 items-center gap-1 rounded px-2 text-sm text-blue-300 font-bold hover:text-white">
                    <ArrowLeft size={12}/> Tilbake
                  </button>
                  <span className="text-xs text-slate-500 uppercase">{subItem.label}</span>
                </div>

                {subItem.viz === "hpf" && <HPFVisualizer />}
                {subItem.viz === "dyn8" && <Dyn8Visualizer />}
                {subItem.viz === "comp" && <CompressorVisualizer />}
                {subItem.viz === "gate" && <GateVisualizer />}
                {subItem.viz === "peq" && <PEQVisualizer />}
                {subItem.viz === "deesser" && <DeEsserVisualizer />}
                {subItem.viz === "inserts" && <InsertsVisualizer />}

                {subItem.deepDive && subItem.deepDive.some(d => d.interactive) && !subItem.interactive && !subItem.viz && (
                  <div className="space-y-2 mt-4">
                      <h5 className="text-[10px] uppercase font-bold text-slate-500">Tilgjengelige Moduler:</h5>
                      {subItem.deepDive.map((d, i) => {
                        const Item = d.interactive ? 'button' : 'div';
                        return <Item
                           key={i}
                           {...(d.interactive ? { type: 'button', onClick: () => setSubItem(d) } : {})}
                           className={`w-full text-left bg-slate-900 p-3 rounded border border-slate-700 flex justify-between items-center transition-colors ${d.interactive ? 'cursor-pointer hover:border-blue-500 hover:bg-slate-800' : ''}`}
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-200 block">{d.name}</span>
                            <span className="text-[10px] text-slate-500">{d.info}</span>
                          </div>
                          {d.interactive ? <ChevronRight size={14} className="text-blue-500"/> : (d.tag && <span className="text-[9px] bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded">{d.tag}</span>)}
                        </Item>;
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- FANE 2: FORDYPNING (Teori) --- */}
        {activeTab === "theory" && hasDeepDive && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                <h3 className="text-green-400 font-bold flex items-center gap-2">
                    <GraduationCap size={20}/>
                    {target.deepDiveTitle || "Teori & Hardware"}
                </h3>
                <p className="text-xs text-green-200/70 mt-1">
                    Teknisk dybdeinformasjon og routing.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {target.deepDive.map((item, i) => {
                  if (item.interactive) return null;
                  return (
                    <div key={i} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-green-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-200 text-sm">{item.name}</span>
                        <span className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-400 uppercase tracking-wider">{item.tag || "Info"}</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{item.info}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* --- FANE 3: TIPS & TRIKS (NY!) --- */}
        {activeTab === "tips" && hasTips && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg">
                <h3 className="text-yellow-400 font-bold flex items-center gap-2">
                    <Lightbulb size={20}/>
                    Praktiske Innstillinger
                </h3>
                <p className="text-xs text-yellow-200/70 mt-1">
                    Konkrete tall og triks for å få det til å låte bra.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {target.proTips.map((item, i) => (
                    <div key={i} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-yellow-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                           <span className="font-bold text-slate-200 text-sm">{item.name}</span>
                           <span className="text-[10px] bg-yellow-900/40 text-yellow-200 border border-yellow-700/50 px-2 py-0.5 rounded uppercase tracking-wider">{item.tag || "Tips"}</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{item.info}</p>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* --- FANE 4: VIDEO --- */}
        {activeTab === "video" && selectedVideo && (
          <div className="animate-fade-in space-y-4 pt-2">
            <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black relative">
              <div className="relative">
                <VideoPlayer videoId={selectedVideo.videoId} title={selectedVideo.title} muted={false} />
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h3 className="font-bold text-white text-lg mb-1">{selectedVideo.title || "Instruksjonsvideo"}</h3>
              <p className="text-slate-400 text-sm">{selectedVideo.desc}</p>
            </div>
            {videos.length > 1 && (
               <div className="mt-6">
                 <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 px-1">Flere videoer i denne modulen:</h4>
                 <div className="space-y-2">
                   {videos.map((vid, idx) => (
                     <button type="button"
                        key={idx}
                        onClick={() => setSelectedVideoId(vid.videoId)}
                        className={`w-full text-left flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                          selectedVideo.videoId === vid.videoId
                            ? "bg-slate-800 border-red-500/50"
                            : "bg-slate-900 border-transparent hover:bg-slate-800 hover:border-slate-700"
                        }`}
                     >
                       <div className="relative w-24 aspect-video bg-black rounded overflow-hidden shrink-0 border border-slate-700">
                          <img
                            src={`https://img.youtube.com/vi/${vid.videoId}/mqdefault.jpg`}
                            alt="thumbnail"
                            className="w-full h-full object-cover opacity-80"
                          />
                          {selectedVideo.videoId === vid.videoId && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                               <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                 <Play size={10} className="fill-white text-white ml-0.5"/>
                               </div>
                            </div>
                          )}
                       </div>
                       <div>
                         <p className={`text-xs font-bold leading-tight mb-1 ${selectedVideo.videoId === vid.videoId ? 'text-white' : 'text-slate-300'}`}>
                           {vid.title}
                         </p>
                         <p className="text-[10px] text-slate-500 line-clamp-2">{vid.desc}</p>
                       </div>
                     </button>
                   ))}
                 </div>
               </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
