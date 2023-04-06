import { useRef } from 'react';
import Grid from '@mui/joy/Grid';
import Sheet from '@mui/joy/Sheet';
import Divider from '@mui/joy/Divider';
import { ChatMessages } from './ChatMessages';
import { ChatUsers } from './ChatUsers';
import { ChatProvider } from '../../hooks';
import { ChatMessageInput } from './ChatMessageInput';

export function Chat() {
  const ref = useRef();

  return (
    <ChatProvider>
      <Grid sx={{ display: 'flex', flexDirection: 'column', width: '100%', flexGrow: 1, }}>
        <Divider sx={{ width: '100%', mb: 1 }} />
        <Sheet sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1, }}>
          <ChatMessages msgBoxRef={ref} />
          <ChatUsers msgBoxRef={ref} />
        </Sheet>
        <ChatMessageInput ref={ref} />
      </Grid>
    </ChatProvider>
  );
}

