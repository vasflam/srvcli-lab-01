import { useReducer, useState, useEffect, useContext, createContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import { config } from '../config';

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

function reducer(state, action) {
  const { type } = action;

  if (type == 'init') {
    const { users, messages, chat } = action;
    return { ...state, users, messages }
  }

  if (type == 'addUser') {
    const { user } = action;
    const { users } = state;
    users.push(user);
    return { ...state, users };
  }

  if (type == 'removeUser') {
    const { user } = action;
    const users = state.users.filter(u => u.id != user.id);
    return { ...state, users };
  }
}

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [ state, dispatch ] = useReducer(reducer, {
    users: [],
    messages: [],
  });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const socket = io(`${config.wsUrl}/chat`, {
      transports: ['websocket'],
      auth: {
        token: user.access_token,
      },
    });
    setSocket(socket);

    // First after socket connection
    socket.on('init', (init) => {
      dispatch({ type: 'init', ...init})
    });

    return () => {
      socket.close();
    };
  }, [user]);

  const value = {
    user,
    socket,
    state,
    dispatch,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}


