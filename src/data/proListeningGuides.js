// Each cue is an experiment on the recorded phrase, not a universal recipe.
export const proListeningGuides = {
  male: { aim:'Behold kroppen i stemmen og få fram hvert ord.', steps:[
    ['preamp','Finn den sterkeste stavelsen','Spill frasen et par ganger. Still gain etter toppen og la det være plass til sterkere sang.'],
    ['peq','Skill kropp fra uklarhet','Prøv et lite kutt i lav mellomtone. Bytt tilbake: blir ordet tydeligere, eller bare stemmen mindre?',1],
    ['comp','Behold starten på ordet','La bare de sterkeste stavelsene gi utslag på GR. Sammenlign med samme opplevde nivå.'],
  ]},
  female: { aim:'Få frem den svakeste delen av frasen uten å løfte pusten for mye.', steps:[
    ['preamp','Lytt til hele frasen','Finn både de sterke vokalene og de forsiktige avslutningene før du endrer noe.'],
    ['filter','Finn hvor kroppen forsvinner','Slå på høypass og hev det sakte. Trekk det tilbake når de lave tonene mister bæreevne.'],
    ['comp','La pusten være naturlig','Senk terskelen mens du lytter til mellomrommene. For mye kompresjon kan trekke pusten fram relativt til ordene.'],
  ]},
  piano: { aim:'La både hammeranslaget og tonen etterpå få plass.', steps:[
    ['preamp','Fang det kraftigste anslaget','Følg toppmåleren over en hel pianosløyfe. La den sterkeste tonen bestemme marginen.'],
    ['peq','Skill hammer fra resonans','Prøv et lite kutt i lav mellomtone. Blir neste tone lettere å skille, eller tynnes hele akkorden ut?',1],
    ['comp','Lytt mellom tonene','Sammenlign med og uten kompressor. En for rask attack kan gjøre hammeranslaget flatt.'],
  ]},
  bass: { aim:'Jevne ut tonene uten at anslaget eller grunntonen forsvinner.', steps:[
    ['filter','Ta vare på den dype tonen','Slå på høypass og lytt mens du flytter det opp. Trekk ned igjen før grunntonen mister tyngde.'],
    ['peq','Hør tonen, ikke bare bunnen','Lytt etter strengelyden høyere i mellomtonen. Prøv et lite løft før du legger til mer dypbass.',2],
    ['comp','Følg hver tone gjennom sløyfen','Se om GR slipper mellom tonene. Hør om forskjellen mellom sterke og svake toner blir mindre.'],
  ]},
  guitar: { aim:'Finn balansen mellom gitarkassen og strengeanslaget.', steps:[
    ['filter','Behold størrelsen på kassen','Prøv høypass og lytt til den laveste tonen. Trekk tilbake når gitaren mister kroppen.'],
    ['peq','Skill klangbunn fra streng','Flytt et smalt kutt i lav mellomtone mens akkorden klinger. Behold kuttet bare hvis akkorden åpner seg.',1],
    ['comp','La plekteret komme gjennom','På samme frase: kort ned attack og forleng den igjen. Lytt til første øyeblikk av hvert anslag.'],
  ]},
  kick: { aim:'Behold slagets start og kontroller hvor lenge bunnen varer.', steps:[
    ['preamp','La første topp få plass','Se på inngangsmåleren over flere slag. En lav fader reparerer ikke et klippet anslag.'],
    ['gate','Form slutten av slaget','Slå på gate. Prøv kortere hold og release, og hør akkurat når den dype kroppen begynner å bli kuttet.'],
    ['peq','Skill kropp og klubbe','Sammenlign et lite løft i bunnen med et i øvre mellomtone. Førstnevnte skal gi vekt; sistnevnte kan synliggjøre anslaget.',0],
  ]},
  snare: { aim:'Behold smellet og la seidingen dø naturlig ut.', steps:[
    ['preamp','Finn transienten','Hør på første millisekund av slaget og se på toppmåleren før du legger til behandling.'],
    ['gate','Følg seidingen helt ut','Senk depth eller forleng release til den raslende halen dør naturlig, uten et brått kutt.'],
    ['comp','Sammenlign to anslag','Kort attack kan runde av smellet. Bytt mellom to innstillinger med samme opplevde nivå og vurder hvilken som passer.'],
  ]},
};
