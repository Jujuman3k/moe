import { createProAudioGraph } from './proAudioGraph.js';
import { METER_FLOOR } from './bandRoomGraph.js';

const linear = db => 10 ** (db / 20);
const faderGain = db => db <= -60 ? 0 : linear(db);
const clampADC = new Float32Array([-1, 0, 1]);
// Provide clean headroom at ordinary levels and protect the listening output
// when several +10 dB channels sum. This isn't a model of an A&H mix bus.
const safety = Float32Array.from({length:8193}, (_,i) => {
  const x = (i/4096-1)*8, a = Math.abs(x);
  return Math.sign(x)*(a <= .8 ? a : .8+.17*Math.tanh((a-.8)/.17));
});

export function silentC3500Meters() { return {left:METER_FLOOR,right:METER_FLOOR,channels:{}}; }
function makeMeter(context, own, size=2048) {
  const node=own(context.createAnalyser()); node.fftSize=size;
  const data=new Float32Array(size);
  return {node, read() {
    node.getFloatTimeDomainData(data); let peak=0;
    for(let i=0;i<size;i++) peak=Math.max(peak,Math.abs(data[i]));
    return Math.max(METER_FLOOR,20*Math.log10(peak||1e-10));
  }};
}
const needsRack = p => p.filters.hpf || p.filters.lpf || p.gate.enabled || p.comp.enabled ||
  (p.eq.enabled && p.eq.bands.some(b=>b.enabled && (b.gain!==0 || b.type==='highpass' || b.type==='lowpass')));

export function createC3500Graph(context, mix) {
  const busNodes=[], strips=new Map(), sockets=new Map(), targets=new WeakMap();
  const ownBus = n => (busNodes.push(n),n);
  const bus = () => ownBus(context.createGain());
  const master=bus(), phonesBus=bus(), mainFeed=bus(), pflFeed=bus(), output=bus();
  function stereoGuard(input) {
    const scale=bus(), shape=ownBus(context.createWaveShaper());
    scale.gain.value=1/8; shape.curve=safety; input.connect(scale).connect(shape);
    return shape;
  }
  const mainOutput=stereoGuard(master), pflOutput=stereoGuard(phonesBus);
  const split=ownBus(context.createChannelSplitter(2));
  const left=makeMeter(context,ownBus,4096),right=makeMeter(context,ownBus,4096);
  mainOutput.connect(split); split.connect(left.node,0); split.connect(right.node,1);
  mainOutput.connect(mainFeed).connect(output); pflOutput.connect(pflFeed).connect(output);
  function set(param,value,immediate) {
    if(targets.get(param)===value) return;
    targets.set(param,value);
    if(immediate) param.setValueAtTime(value,context.currentTime);
    else param.setTargetAtTime(value,context.currentTime,.008);
  }
  function socket(sourceId) {
    if(!sockets.has(sourceId)) sockets.set(sourceId,bus());
    return sockets.get(sourceId);
  }
  function createStrip(sourceId) {
    const owned=[];const own=n=>(owned.push(n),n); const gain=()=>own(context.createGain());
    const preamp=gain(), adc=own(context.createWaveShaper()), dryTrim=gain(), processed=gain(), fader=gain();
    const pan=own(context.createStereoPanner()),pfl=gain();
    const inputMeter=makeMeter(context,own), procMeter=makeMeter(context,own), postMeter=makeMeter(context,own);
    adc.curve=clampADC;
    const inputSocket=socket(sourceId); inputSocket.connect(preamp).connect(adc).connect(inputMeter.node);
    inputMeter.node.connect(dryTrim).connect(processed).connect(procMeter.node);
    procMeter.node.connect(fader).connect(postMeter.node).connect(pan).connect(master);
    procMeter.node.connect(pfl).connect(phonesBus);
    let rack=null, previousPro=null;
    function update(ch,initial) {
      set(preamp.gain,linear(ch.gain-28),initial);
      set(fader.gain,ch.mute ? 0 : faderGain(ch.fader),initial);
      set(pan.pan,ch.pan/100,initial);
      // The mono PFL tap is centred and post processing, before channel fader/mute.
      set(pfl.gain,ch.pafl ? Math.SQRT1_2 : 0,initial);
      if(ch.pro===previousPro) return;
      const p=ch.pro; previousPro=p;
      // A newly patched flat channel needs no worklets and no bank of filters.
      // Once enabled, keep its rack alive so live edits never restart the sound.
      if(!rack && needsRack(p)) {
        rack=createProAudioGraph(context,own,(_name,node)=>node);
        rack.update(p,true,false,(param,val)=>set(param,val,true));
        inputMeter.node.connect(rack.input); rack.output.connect(processed);
      }
      set(dryTrim.gain,rack ? 0 : linear(p.trim)*(p.polarity?-1:1),initial || Boolean(rack));
      rack?.update(p,true,false,(param,val,discrete)=>set(param,val,initial||discrete));
    }
    return {sourceId,update,read() {return {input:inputMeter.read(),processed:procMeter.read(),post:postMeter.read(),...(rack?.levels() || {gateReduction:0,gateClosed:false,reduction:0})};},
      dispose() {inputSocket.disconnect(preamp);rack?.dispose();for(const n of owned)n.disconnect();}};
  }
  function setMix(next,initial=false) {
    const anyPFL=next.channels.some(ch=>ch.pafl);
    set(master.gain,faderGain(next.masterDb),initial);
    set(mainFeed.gain,anyPFL ? 0:1,initial); set(pflFeed.gain,anyPFL ? 1:0,initial);
    for(const ch of next.channels) {
      let strip=strips.get(ch.id);
      if(strip && strip.sourceId!==ch.sourceId) {strip.dispose();strips.delete(ch.id);strip=null;}
      if(!ch.sourceId) continue;
      if(!strip) {strip=createStrip(ch.sourceId);strips.set(ch.id,strip);strip.update(ch,true);}
      else strip.update(ch,initial);
    }
  }
  setMix(mix,true);
  return {output,mainOutput,socket,setMix,
    readMeters() {return {left:left.read(),right:right.read(),channels:Object.fromEntries([...strips].map(([id,s])=>[id,s.read()]))};},
    fadeOut() {set(output.gain,0,false);},
    dispose() {for(const strip of strips.values())strip.dispose();strips.clear();for(const n of busNodes)n.disconnect();sockets.clear();}
  };
}
