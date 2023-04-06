import { useEffect } from 'react';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { useChat } from '../../hooks/useChat';
import { ChatMessageUser } from './ChatMessageUser';

export function ChatUsers({ msgBoxRef }) {
  const { user, socket, state, dispatch } = useChat();
  const { users } = state;
  const { selectedUser } = state;

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
    <Sheet sx={{ display: 'flex', order: 1, justifyContent: 'right', flexDirection: 'row', }}>
      <Sheet sx={{px: 2}}>
        <Typography color="primary">Online Users ({users.length})</Typography>
        <Sheet sx={{pl: 1}}>
          { users.map(u => (
            <ChatMessageUser key={u.id} user={u} msgBoxRef={msgBoxRef} />
        ))}
        </Sheet>
      </Sheet>
    </Sheet>
  );
}

