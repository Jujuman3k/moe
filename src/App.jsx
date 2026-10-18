import { lazy, Suspense, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { useLearningProgress } from './hooks/useLearningProgress.js';
import { useNavigation } from './hooks/useNavigation.js';

const SignalPage = lazy(() => import('./pages/SignalPage.jsx'));
const VideoPage = lazy(() => import('./pages/VideoPage.jsx'));
const PracticePage = lazy(() => import('./pages/PracticePage.jsx'));

export default function App() {
  const { route, navigate } = useNavigation();
  const learning = useLearningProgress();
  const openVideo = videoId => {
    learning.rememberVideo(videoId);
    navigate('videos', { video: videoId });
  };
  const explore = nodeId => navigate('signal', { node: nodeId });

  useEffect(() => {
    const titles = { home: 'Hjem', signal: 'Signalvei', videos: 'Videoarkiv', practice: 'Øv selv' };
    document.title = `${titles[route.page]} · LydTeam Pro`;
    window.scrollTo(0, 0);
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [route.page]);

  return (
    <AppLayout page={route.page} navigate={navigate}>
      {!learning.storageAvailable && <p role="status" className="mb-4 rounded-xl border border-amber-700 bg-amber-900/20 p-3 text-sm text-amber-200">Nettleseren tillater ikke lagring. Du kan fortsatt øve, men progresjonen beholdes bare mens appen er åpen.</p>}
      <Suspense fallback={<p role="status" className="p-8 text-center text-slate-400">Laster verktøyene …</p>}>
        {route.page === 'home' && <HomePage navigate={navigate} learning={learning} onOpenVideo={openVideo} />}
        {route.page === 'signal' && <SignalPage key={route.nodeId || 'signal'} initialNodeId={route.nodeId} />}
        {route.page === 'videos' && <VideoPage key={route.videoId || 'videos'} learning={learning} initialVideoId={route.videoId} />}
        {route.page === 'practice' && <PracticePage learning={learning} onExplore={explore} />}
      </Suspense>
    </AppLayout>
  );
}
