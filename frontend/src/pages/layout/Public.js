import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, SocketProvider } from '../../hooks';

export function PublicLayout() {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/ "/>
  }

  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
}
