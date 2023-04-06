import { useRef, useEffect } from 'react';
import Typography from '@mui/joy/Typography';
import { useChat } from '../../hooks';

export function ChatMessageUser(props) {
  const { user, state, dispatch } = useChat();
  const { selectedUser } = state;
  const { noclick, msgBoxRef } = props;
  const isMe = user?.id == props.user?.id;

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedUser]);

  const handleEscape = (event) => {
    if (msgBoxRef?.current?.lastElementChild == document.activeElement) {
      if (event.keyCode === 27) {
        dispatch({
          type: 'selectedUser',
          selectedUser: null,
        });
      }
    }
  };

  const onClick = () => {
    if (noclick || isMe) {
      return;
    }

    msgBoxRef.current?.lastElementChild?.focus();
    dispatch({
      type: 'selectedUser',
      selectedUser: props.user,
    });
  };

  const sx = {};
  if (!noclick && !isMe) {
    sx['cursor'] = 'pointer';
  }
  const color = isMe ? 'secondary' : 'primary';

  return (
    <Typography onClick={onClick} sx={sx} color={color}>
      { props.to && <Typography color="neutral" mx={1}>></Typography>}
      {props.user.username}
    </Typography>
  );
};

