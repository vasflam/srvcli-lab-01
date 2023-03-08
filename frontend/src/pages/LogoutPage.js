import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';

export function LogoutPage() {
  const { handleLogout } = useAuth();
  useEffect(() => {
    handleLogout();
  });
  return (
    <Navigate to="/login" />
  )
}
