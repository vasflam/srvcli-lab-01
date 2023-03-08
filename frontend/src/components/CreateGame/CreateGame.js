import { Fragment, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import { CreateForm } from './CreateForm';

export function CreateGame({ socket }) {
  const [open, setOpen] = useState(false);

  const onClose = async (event, reason) => {
    if (reason == 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = (input) => {
    /*
    socket.on('createGame', (game) => {
      setGame(game);
      socket.off('createGame');
    });
    */
    socket.emit('createGame', input);
  };

  return (
    <Fragment>
      <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}>
        Create game
      </Button>

      <Modal
        aria-labelledby="close-modal-title"
        open={open}
        onClose={onClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            minWidth: 300,
            borderRadius: 'md',
            p: 3,
          }}
        >
          <ModalClose variant="outlined" />
          <CreateForm handleSubmit={handleSubmit}/>
        </Sheet>
      </Modal>
    </Fragment>
  );
}
