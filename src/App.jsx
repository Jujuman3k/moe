import { lazy, Suspense, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { RoomBoundary } from './components/layout/RoomBoundary.jsx';
import { pageTitles } from './data/portalPages.js';
import { PortalSearch } from './components/search/PortalSearch.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { useLearningProgress } from './hooks/useLearningProgress.js';
import { useNavigation } from './hooks/useNavigation.js';

const BandRoomPage = lazy(() => import('./pages/BandRoomPage.jsx'));
const SignalPage = lazy(() => import('./pages/SignalPage.jsx'));
const VideoPage = lazy(() => import('./pages/VideoPage.jsx'));
const ListenPage = lazy(() => import('./pages/ListenPage.jsx'));
const PracticePage = lazy(() => import('./pages/PracticePage.jsx'));

export default function App() {
  const { route, navigate } = useNavigation();
  const learning = useLearningProgress();
  const openVideo = videoId => {
    learning.rememberVideo(videoId);
    navigate('videos', { video: videoId });
  };
  const explore = (node, options = {}) => navigate('signal', { node, ...options });

  useEffect(() => {
    document.title = `${pageTitles[route.page]} · LydTeam Pro`;
    window.scrollTo(0, 0);
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [route.page]);

  return (
    <AppLayout page={route.page} navigate={navigate} searchButton={<PortalSearch navigate={navigate} onOpenVideo={openVideo} />}>
      {!learning.storageAvailable && <p role="status" className="mb-4 rounded-xl border border-amber-700 bg-amber-900/20 p-3 text-sm text-amber-200">Nettleseren tillater ikke lagring. Du kan fortsatt øve, men progresjonen beholdes bare mens appen er åpen.</p>}
      <RoomBoundary key={route.page}><Suspense fallback={<p role="status" className="p-8 text-center text-slate-400">Laster verktøyene …</p>}>
        {route.page === 'home' && <HomePage navigate={navigate} learning={learning} onOpenVideo={openVideo} />}
        {route.page === 'signal' && <SignalPage key={JSON.stringify([route.nodeId,route.sourceId,route.mode,route.tool])} initialNodeId={route.nodeId} initialSourceId={route.sourceId} initialMode={route.mode} initialTool={route.tool} />}
        {route.page === 'bandroom' && <BandRoomPage initialScene={route.sceneId} onSceneChange={scene => navigate('bandroom', {scene})} />}
        {route.page === 'videos' && <VideoPage key={route.videoId || 'videos'} learning={learning} initialVideoId={route.videoId} onExplore={explore} initialTrackId={route.trackId} navigate={navigate} />}
        {route.page === 'practice' && <PracticePage key={JSON.stringify([route.scenarioId, route.faultId])} initialScenarioId={route.scenarioId} initialFaultId={route.faultId} onFault={fault => navigate('practice', fault ? {fault} : {})} learning={learning} onExplore={explore} />}
        {route.page === 'listen' && <ListenPage key={route.trackId || 'mixed'} initialTrack={route.trackId} onTrackChange={track => navigate('listen', {track})} onExplore={params => navigate('signal', params)} />}
      </Suspense></RoomBoundary>
    </AppLayout>
  );
}
