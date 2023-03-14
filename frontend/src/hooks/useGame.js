import { useState, useEffect, useContext, createContext } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [game, setGame] = useState();
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!socket) {
      return;
    }

    // First after socket connection
    socket.on('init', (state) => {
      const { game, stats } = state;
      if (game) {
        setGame(game);
      }
      setStats(stats);
    });

    socket.on('createGame', (game) => {
      setGame(game);
    });

    socket.on('startGame', (game) => {
      setGame(game);
    });

    socket.on('gameStats', (stats) => {
      setStats(stats);
    });
  }, [socket]);

  const value = {
    user,
    socket,
    stats,
    game,
    setGame,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

