import { useEffect, useState } from 'react';

const pageIds = new Set(['home', 'signal', 'videos', 'practice']);
function readRoute() {
  const [page, search = ''] = window.location.hash.slice(1).split('?');
  const params = new URLSearchParams(search);
  return { page: pageIds.has(page) ? page : 'home', nodeId: params.get('node'), videoId: params.get('video') };
}

export function useNavigation() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const navigate = (page, params = {}) => {
    const search = new URLSearchParams(params).toString();
    window.location.hash = `${page}${search ? `?${search}` : ''}`;
  };
  return { route, navigate };
}
