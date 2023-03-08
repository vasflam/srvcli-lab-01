import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import CircularProgress from '@mui/joy/CircularProgress';

function GameComplete({game, completed, user}) {
  const isWinner = game.winner.id === user.id;
  const color = isWinner ? 'success' : 'danger';
  return (
    <>
      <Typography color="neutral" textAlign="center">
        Game is complete.
      </Typography>
      <Typography color={color} textAlign="center" sx={{ mb: 4 }} fontWeight="lg">
        {isWinner ? 'You WIN' : 'You LOOSE'}
      </Typography>
    </>
  );
}

function GameInProgress({game, canMove}) {
  //const first = game.first == user.id ? true : false;
  //const opponent = game.owner.id == user.id ? game.opponent : game.owner;
  return (
    <>
      <Typography textAlign="center">
        <Typography color="primary">
          {game.owner.username}
        </Typography>
        <Typography color="neutral" sx={{ mx: 1 }} fontSize="sm">vs</Typography>
        <Typography color="primary">
          {game.opponent.username}
        </Typography>
      </Typography>
      <Typography color="neutral" sx={{ mb: 4}} endDecorator={!canMove && <CircularProgress size="sm" />} textAlign="center">
        {canMove ? 'your turn' : 'waiting for opponent'}
      </Typography>
    </>
  );
}

export function GameStatus({ user, game, canMove, completed  }) {
  return (
    <Sheet
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {
        completed
          ? <GameComplete game={game} user={user} />
          : <GameInProgress game={game} user={user} canMove={canMove} />
      }
    </Sheet>
  );
}
