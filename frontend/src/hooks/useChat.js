import { useReducer, useEffect, useContext, createContext } from 'react';
import { useAuth } from './useAuth';

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

function reducer(state, action) {
  const { type } = action;
  if (type == 'init') {
    const { users, messages, chat } = action;
    return { ...state, users, messages, socket }
  }
}

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [ state, dispatch ] = useReducer(reducer, {
    users: [],
    messages: [],
    socket: null,
  });
  const { socket } = state;

  useEffect(() => {
    if (!socket) {
      return;
    }

    // First after socket connection
    chatSocket.on('init', (init) => {
      dispatch({ type: 'init', ...init})
    });

    return () => {
      socket.close();
    };
  }, [socket]);

  const value = {
    user,
    socket,
    state,
    dispatch,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}


