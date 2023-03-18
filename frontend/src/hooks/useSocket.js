import { useState, useEffect, useContext, createContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import { config } from '../config';

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState();

  useEffect(() => {
    if (!user) {
      return;
    }

    const socket = io(`${config.wsUrl}/games`, {
      transports: ['websocket'],
      auth: {
        token: user.access_token,
      },
    });

    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
