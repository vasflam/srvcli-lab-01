import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  useAuth,
  useGame,
  SocketProvider,
  GameProvider,
} from '../../hooks';

/**
 * We must redirect user to /game if he is in game
 */
function PrivateLayoutWrapper({ children }) {
  const location = useLocation();
  const { game } = useGame();

  if (game && location.pathname !== '/game') {
    return <Navigate to="/game" state={{ game }} />
  }

  if (!game && location.pathname === '/game') {
    return <Navigate to="/" />
  }

  return children;
}

export function PrivateLayout() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <SocketProvider>
      <GameProvider>
          <PrivateLayoutWrapper>
            <Outlet />
          </PrivateLayoutWrapper>
      </GameProvider>
    </SocketProvider>
  );
}

