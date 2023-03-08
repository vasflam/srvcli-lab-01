import { useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { useGame } from '../../hooks';
import { GameBoard } from './GameBoard';
import { GameStatus } from './GameStatus';

/**
 * GameBoard 
 */

/**
 * Check if can move
 */
const checkMove = (user, isFirst, moves, game) => {
  if (game.status === 'completed') {
    return false;
  }

  if (moves.length === 0) {
    return isFirst;
  }

  const last = moves[moves.length-1];
  return last.user_id !== user.id;
}

/**/
const reducer = (state, action) => {
  const { type } = action;
  if (type === 'setCanMove') {
    const { canMove } = action;
    return { ...state, canMove };
  }

  if (type === 'gameMove') {
    const { canMove, moves, game } = action;
    const newState = {...state, canMove, moves };
    if (game && game.status === 'completed') {
      newState['completed'] = true;
    }
    return newState;
  }
};


/**/
export function GamePage() {
  const { user, socket, game, setGame } = useGame();
  const isFirst = game.first === user.id;
  const [ state, dispatch ] = useReducer(reducer, {
    moves: game.moves,
    canMove: checkMove(user, isFirst, game.moves, game),
    completed: false,
  });
  const { moves, canMove, completed } = state;

  useEffect(() => {
    if (!socket) {
      return;
    }

    dispatch({
      type: 'gameMove',
      canMove: checkMove(user, isFirst, game.moves, game),
      moves: game.moves,
      game,
    });

    socket.on('gameMove', (game) => {
      dispatch({
        type: 'gameMove',
        canMove: checkMove(user, isFirst, game.moves, game),
        moves: game.moves,
      });

      if (game.status === 'completed') {
        setGame(game);
      }
    });

    return () => {
      socket.off('gameMove');
    };
  }, [socket, game]);

  const cancelGame = () => {
    socket.on('cancelGame', (response) => {
      if (response.success) {
        setGame(null);
      } else {
        // process error
        console.log('cancelGame error', response);
      }
      socket.off('cancelGame');
    });
    socket.emit('cancelGame');
  };

  const handleMove = (x, y) => {
    if (completed) {
      return;
    }

    if (canMove) {
      socket.emit('gameMove', {
        x,
        y,
      });
      dispatch({type: 'setCanMove', value: false});
    }
  };

  const gameProps = {
    game,
    isFirst,
    canMove,
    handleMove,
    moves,
    completed,
  };

  const exitGame = () => {
    setGame(null);
  };

  return (
    <Sheet
      sx={{
        mx: 'auto',
        px: 3,
        py: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography level="h4" component="h1" sx={{ mb: 0 }}>
        <Typography sx={{ mr: 1 }} color="primary">#{game.id}</Typography>
        {game.name}
      </Typography>
      {game.status === 'created' &&
      <Typography color="neutral" sx={{ mb: 7 }}>
        Waiting for opponent...
      </Typography>
      }
      {game.status !== 'created' && <GameStatus completed={completed} game={game} canMove={canMove} user={user} />}

      <GameBoard {...gameProps} />
      {game.status === 'created' && <Button sx={{ mt:4 }} onClick={cancelGame}>Cancel Game</Button>}
      {game.status === 'completed' && <Button sx={{mt:4, width: 100}} onClick={exitGame} component={Link} to="/">Exit</Button>}
    </Sheet>
  );
}
