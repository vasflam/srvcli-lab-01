import { Fragment, useState } from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import { CreateForm } from './CreateForm';

export function CreateGame({ socket }) {
  const [open, setOpen] = useState(false);

  const onClose = async (event, reason) => {
    if (reason === 'backdropClick') {
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
      <Button color="neutral" onClick={() => setOpen(true)}>
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
