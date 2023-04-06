import { forwardRef, useState } from 'react';
import Input from '@mui/joy/Input';
import { useChat } from '../../hooks';
import { ChatMessageUser } from './ChatMessageUser';

const ChatMessageInput = forwardRef((props, ref) => {
  const { state, socket } = useChat();
  const { selectedUser } = state;
  const [message, setMessage] = useState();

  const sendMessage = async (event) => {
    if (event.key === 'Enter') {
      socket.emit('message', {
        to: selectedUser ? selectedUser.id : null,
        isPrivate: false,
        message,
      });
      event.target.value = '';
    }
  }

  const updateMessage = (event) => {
    setMessage(event.target.value);
  };

  return (
    <Input
      ref={ref}
      startDecorator={selectedUser && <ChatMessageUser user={selectedUser} noclick/>}
      placeholder="You message here..."
      onKeyPress={sendMessage}
      onChange={updateMessage}
    />
  )
});

export {
  ChatMessageInput,
};
