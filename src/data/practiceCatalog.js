// Lett katalog: kan lastes på forsiden uten alle spørsmål og svar.
export const practiceTopics = [
  {
    "id": "microphones",
    "label": "Mikrofoner",
    "description": "Plassering, retning og kilder",
    "scenarioIds": [
      "mic-distance",
      "mic-cardioid-wedge",
      "mic-phantom",
      "mic-cupping",
      "mic-two-sources",
      "mic-acoustic-guitar"
    ]
  },
  {
    "id": "gain",
    "label": "Gain og nivå",
    "description": "Headroom og hele gainkjeden",
    "scenarioIds": [
      "gain-input-clips",
      "gain-shared-preamp",
      "gain-headroom",
      "gain-downstream-level",
      "gain-wireless-distortion",
      "gain-trim-not-repair"
    ]
  },
  {
    "id": "eq",
    "label": "EQ og filtre",
    "description": "Klang, tydelighet og frekvenser",
    "scenarioIds": [
      "eq-hpf-rumble",
      "eq-hpf-too-high",
      "eq-narrow-resonance",
      "eq-masking",
      "eq-level-matched",
      "eq-deesser-choice"
    ]
  },
  {
    "id": "dynamics",
    "label": "Dynamikk",
    "description": "Kompressor, gate og sidechain",
    "scenarioIds": [
      "comp-threshold",
      "comp-ratio-math",
      "comp-attack-transient",
      "comp-release-pumping",
      "gate-tail",
      "gate-key-filter"
    ]
  },
  {
    "id": "monitor",
    "label": "Monitor og IEM",
    "description": "Balanse, sends og talkback",
    "scenarioIds": [
      "monitor-pre-fade",
      "monitor-tap-point",
      "monitor-talkback",
      "monitor-balance-first",
      "monitor-feedback",
      "monitor-iem-pair"
    ]
  },
  {
    "id": "routing",
    "label": "Ruting og busser",
    "description": "Aux, DCA, grupper og matrix",
    "scenarioIds": [
      "send-assignment",
      "routing-dca-group",
      "routing-double-main",
      "routing-matrix-lobby",
      "routing-output-patch",
      "routing-tie-line"
    ]
  },
  {
    "id": "fx",
    "label": "Effekter",
    "description": "Klang, delay og returveier",
    "scenarioIds": [
      "fx-post-fade",
      "fx-return-muted",
      "fx-decay-speech",
      "fx-predelay",
      "fx-delay-tempo",
      "fx-feedback-loop"
    ]
  },
  {
    "id": "scenes",
    "label": "Scener og Show",
    "description": "Recall, Safes og sikker lagring",
    "scenarioIds": [
      "scene-store-recall",
      "scene-safe-talk",
      "scene-recall-filter",
      "scene-go-pointer",
      "scene-show-backup",
      "scene-show-live"
    ]
  },
  {
    "id": "workflow",
    "label": "dLive-arbeidsflyt",
    "description": "Sel, Mix, PAFL og faderlag",
    "scenarioIds": [
      "active-mix",
      "workflow-sel-channel",
      "workflow-layer",
      "workflow-pafl-sip",
      "workflow-copy-eq",
      "workflow-dca-spill"
    ]
  },
  {
    "id": "pa",
    "label": "PA og akustikk",
    "description": "Dekning, summering og rom",
    "scenarioIds": [
      "pa-front-back",
      "pa-fill-delay",
      "pa-mono-check",
      "pa-room-reverb",
      "pa-speaker-limit",
      "pa-sub-crossover"
    ]
  },
  {
    "id": "recording",
    "label": "Opptak og stream",
    "description": "Dante, Direct Out og lyd til sending",
    "scenarioIds": [
      "stream-separate-mix",
      "record-direct-out",
      "record-dante-patch",
      "record-vsc-return",
      "record-vsc-pretrim",
      "stream-return-loop"
    ]
  },
  {
    "id": "troubleshooting",
    "label": "Feilsøking",
    "description": "Finn leddet der lyden forsvinner",
    "scenarioIds": [
      "fault-no-input",
      "fault-muted-dca",
      "fault-insert-return",
      "fault-one-change",
      "fault-left-right",
      "fault-feedback-vs-distortion"
    ]
  }
];

export const practiceLevels = [
  { id: 1, label: 'Grunnleggende' },
  { id: 2, label: 'Viderekommen' },
  { id: 3, label: 'Utfordring' },
];
export const practiceScenarioIds = practiceTopics.flatMap(topic => topic.scenarioIds);
export const practiceScenarioCount = practiceScenarioIds.length;
