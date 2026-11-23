import { useEffect, useState } from 'react';

import { pageTitles } from '../data/portalPages.js';
function readRoute() {
  const [page, search = ''] = window.location.hash.slice(1).split('?');
  const params = new URLSearchParams(search);
  return { page: Object.hasOwn(pageTitles, page) ? page : 'home', nodeId: params.get('node'), videoId: params.get('video'), sourceId: params.get('source'), mode: params.get('mode'), tool: params.get('tool'), scenarioId: params.get('scenario'), faultId: params.get('fault'), sceneId: params.get('scene'), trackId: params.get('track'), channelId: params.get('ch'), panelId: params.get('panel'), originChannel: params.get('fromCh') };
}

export function useNavigation() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const navigate = (page, params = {}) => {
    const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value != null && value !== '')).toString();
    window.location.hash = `${page}${search ? `?${search}` : ''}`;
  };
  return { route, navigate };
}
