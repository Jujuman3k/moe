// Stable hashes used by navigation, shared links and the browser title.
export const portalPages = [
  { id: 'home', label: 'Hjem', title: 'Hjem' },
  { id: 'c3500', label: 'C3500', title: 'C3500-pulten' },
  { id: 'signal', label: 'Signalvei', title: 'Signalvei' },
  { id: 'bandroom', label: 'Bandrom', title: 'Bandrommet' },
  { id: 'listen', label: 'Lyttetest', title: 'Lyttetest' },
  { id: 'practice', label: 'Øv selv', title: 'Øv selv' },
  { id: 'videos', label: 'Videoer', title: 'Videoarkiv' },
];
export const pageTitles = Object.fromEntries(portalPages.map(({ id, title }) => [id, title]));
