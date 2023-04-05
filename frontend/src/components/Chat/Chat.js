import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';
import { ChatMessages } from './ChatMessages';
import { ChatUsers } from './ChatUsers';

export function Chat() {
  return (
    <Grid sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      <Box sx={{ display: 'flex', flexGrow: 1, }}>
        <ChatMessages />
      </Box>
      <Box sx={{ display: 'flex', order: 1, justifyContent: 'right'}}>
        <ChatUsers />
      </Box>
    </Grid>
  );
}

