// A route joins a specific lesson, a hands-on exercise and a transfer task.
// Durations are deliberately omitted: learners set the pace with their ears.
export const learningPaths = [
  {id:'tydelig-vokal', title:'Få fram ordene', tag:'Vokal', goal:'Behold nærheten i stemmen når piano og gitar kommer inn.', video:311,
    watch:'Lytt til konsonantene og klangen i vokalens mellomtone. Hvilke detaljer ønsker du å beholde når bandet spiller?',
    lab:{label:'Balanser vokal mot bandet', detail:'Start med alle kanalene åpne. Senk akkompagnementet før du vurderer å løfte vokalen.',page:'bandroom', params:{scene:'vokalplass'}},
    finish:{label:'Løs «Pianoet skjuler ordene»',detail:'Avgjør om maskering kan løses med nivå, klang eller plassering.',page:'practice',params:{scenario:'eq-masking'}}},
  {id:'skarptromme', title:'Bevar slaget og halen', tag:'Trommer',goal:'La skarptromma rydde plass mellom slagene uten at svake slag forsvinner.', video:11,
    watch:'Legg merke til forskjellen på når gaten åpner, og hvor lenge den lar tromma klinge.',
    lab:{label:'Still gaten på skarptromma',detail:'Start opptaket. Lytt til siste del av slaget mens du endrer hold og release.',page:'signal',params:{node:'processing',source:'snare',mode:'pro',tool:'gate'}},
    finish:{label:'Finn feilen i trommekanalen',detail:'Sammenlign signalet før og etter behandling. Finn et tiltak som bevarer halen.',page:'practice',params:{fault:'snare-tail'}}},
  {id:'trygg-monitor', title:'Skill scenen fra salen', tag:'Monitor',goal:'Juster nivået i salen uten at sangeren mister vokalen i monitoren.',video:713,
    watch:'Følg hvilken buss faderne styrer, og hvor signalet til monitoren hentes.',
    lab:{label:'Sammenlign pre og post',detail:'Velg Monitor som lyttepunkt. Dra ned kanalfaderen og sammenlign de to send-punktene.',page:'signal',params:{node:'monitor_branch',source:'female',mode:'easy'}},
    finish:{label:'Feilsøk sangerens monitor',detail:'Sangeren hører plutselig mindre av seg selv. Følg nivået fra kanalen til monitorsenden.',page:'practice',params:{fault:'monitor-follows'}}},
];
