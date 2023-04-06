import { useReducer, useState, useEffect, useContext, createContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import { useSocket } from './useSocket';
import { config } from '../config';

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

const sortUsersAlpha = (a, b) => {
  const u1 = a.username.toUpperCase();
  const u2 = b.username.toUpperCase();
  if (u1 == u2) {
    return 0;
  }
  return u1 < u2 ? -1 : 1;
};

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

    return { ...state, users: users.sort(sortUsersAlpha) };
  }

  if (type == 'removeUser') {
    const { user } = action;
    const users = state.users.filter(u => u.id != user.id).sort(sortUsersAlpha);
    return { ...state, users };
  }

  if (type == 'message') {
    const { message } = action;
    const messages = [ ...state.messages, message ];
    return { ...state, messages };
  }

  if (type == 'selectedUser') {
    const { selectedUser } = action;
    return { ...state, selectedUser };
  }
}

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const { chatSocket } = useSocket();
  const [ state, dispatch ] = useReducer(reducer, {
    users: [],
    messages: [],
    selectedUser: null,
  });
  const socket = chatSocket;

  useEffect(() => {
    if (!user || !socket) {
      return;
    }

    // First after socket connection
    socket.on('init', (init) => {
      dispatch({ type: 'init', ...init})
    });

    socket.on('message', (message) => {
      dispatch({type: 'message', message});
    });

    return () => {
      socket.close();
    };
  }, [user, socket]);

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


