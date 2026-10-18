import { practiceTopics } from './practiceCatalog.js';
import { practiceSources } from './practice/sources.js';
import { microphonesScenarios } from './practice/microphones.js';
import { gainScenarios } from './practice/gain.js';
import { eqScenarios } from './practice/eq.js';
import { dynamicsScenarios } from './practice/dynamics.js';
import { monitorScenarios } from './practice/monitor.js';
import { routingScenarios } from './practice/routing.js';
import { fxScenarios } from './practice/fx.js';
import { scenesScenarios } from './practice/scenes.js';
import { workflowScenarios } from './practice/workflow.js';
import { paScenarios } from './practice/pa.js';
import { recordingScenarios } from './practice/recording.js';
import { troubleshootingScenarios } from './practice/troubleshooting.js';

const topicScenarios = {
  microphones: microphonesScenarios,
  gain: gainScenarios,
  eq: eqScenarios,
  dynamics: dynamicsScenarios,
  monitor: monitorScenarios,
  routing: routingScenarios,
  fx: fxScenarios,
  scenes: scenesScenarios,
  workflow: workflowScenarios,
  pa: paScenarios,
  recording: recordingScenarios,
  troubleshooting: troubleshootingScenarios,
};

// Katalog og innhold kontrolleres mot hverandre i testene. ID-er må være stabile
// slik at tidligere lagret progresjon fortsetter å fungere.
export const practiceScenarios = practiceTopics.flatMap(topic =>
  topicScenarios[topic.id].map(scenario => ({
    ...scenario,
    topicId: topic.id,
    tag: topic.label,
    source: practiceSources[scenario.sourceId].url,
    sourceLabel: practiceSources[scenario.sourceId].label,
  })),
);
