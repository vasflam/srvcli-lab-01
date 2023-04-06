import { useRef, useEffect } from 'react';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { useChat } from '../../hooks/useChat';
import { ChatMessageUser } from './ChatMessageUser';

const ChatMessage = ({ me, message, msgBoxRef }) => {
  const isMy = me?.id === message.to?.id;
  const sx = {
    display: 'block',
    width: '100%',
    marginBottom: '1px',
  };
  if (isMy) {
    sx['backgroundColor'] = 'rgb(37, 150, 190, 0.3)';
  }

  return (
    <Sheet sx={sx}>
      <Typography>
        <ChatMessageUser user={message.from} msgBoxRef={msgBoxRef} />
        { message.to && <ChatMessageUser user={message.to} msgBoxRef={msgBoxRef} to/> }
        <Typography component="span" sx={{ ml: 2, }} color="neutral">
          {message.message}
        </Typography>
      </Typography>
    </Sheet>
  )
};

export function ChatMessages({ msgBoxRef }) {
  const { user, state } = useChat();
  const { messages } = state;
  const ref = useRef(null);

  useEffect(() => {
    if (ref?.current.lastElementChild) {
      ref.current.lastElementChild.scrollIntoView({ block: "nearest" });
    }
  }, [messages, ref]);


  return (
    <Sheet sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, }}>
      <Sheet sx={{ display: 'flex', flexGrow: 1, height: '250px', overflow: 'scroll', mb: 2}}>
        <Sheet ref={ref} sx={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
          {messages.map(message => (
            <ChatMessage me={user} key={message.id} message={message} msgBoxRef={msgBoxRef} />
        ))}
        </Sheet>
      </Sheet>
    </Sheet>
  );
}
