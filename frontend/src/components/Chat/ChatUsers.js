import { useEffect } from 'react';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import { useChat } from '../../hooks/useChat';

export function ChatUsers() {
  const { user, socket, state, dispatch } = useChat();
  const { users } = state;

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('enterChat', (user) => {
      dispatch({
        type: 'addUser',
        user,
      });
    });
    socket.on('leaveChat', (user) => {
      dispatch({
        type: 'removeUser',
        user,
      });
    });

    return () => {
      socket.off('enterChat');
      socket.off('leaveChat');
    };
  }, [user, socket]);

  return (
    <List>
      <ListItem>OnlineUsers</ListItem>
      { users.map(u => (
        <ListItem key={u.id}>{u.username}</ListItem>
      ))}
    </List>
  );
}

