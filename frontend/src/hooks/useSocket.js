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
  const [gameSocket, setGameSocket] = useState();
  const [chatSocket, setChatSocket] = useState();

  useEffect(() => {
    if (!user) {
      return;
    }

    const opts = {
      transports: ['websocket'],
      auth: {
        token: user.access_token,
      },
    };
    const gameSocket = io(`${config.wsUrl}/games`, opts);
    const chatSocket = io(`${config.wsUrl}/chat`, opts);

    setGameSocket(gameSocket);
    setChatSocket(chatSocket);
    return () => {
      gameSocket.close();
      chatSocket.close();
    };
  }, []);

  const value = {
    gameSocket,
    chatSocket,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
