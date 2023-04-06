import { useState, useEffect } from 'react';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Grid from '@mui/joy/Grid';
import Typography from '@mui/joy/Typography';
import { useGame } from '../hooks';
import { GameCard, GameStats } from '../components/Game';
import { CreateGame } from '../components/CreateGame';
import { Chat } from '../components/Chat';

export function HomePage() {
  const { user, socket, game, setGame } = useGame();
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('listGames', (games) => {
      setGames(games);
    });
    socket.emit('listGames');

    socket.on('joinGame', (response) => {
      if (!response.success) {
        console.log('joinGame error:', response);
      }
    });

    return () => {
      socket.off('listGames');
      socket.off('joinGame');
    };
  }, [socket, game]);

  const handleJoin = (game) => {
    socket.emit('joinGame', {
      id: game.id,
    });
  };

  const list = games.map(game => {
    return (
      <ListItem key="game-{game.id}">
        <GameCard handleJoin={handleJoin} game={game} user={user} />
      </ListItem>
    );
  });

  return (
    <Grid container spacing={2} sx={{ flexGrow: 1, height: '100vh' }}>
      <Grid xs={8} md={8}>
        <Typography level="h4" component="h1">Games:</Typography>
        <List>{list}</List>
      </Grid>
      <Grid xs={4} md={4}>
        <GameStats>
          <CreateGame {...{socket, game, setGame}} />
        </GameStats>
      </Grid>
      <Chat />
    </Grid>
  );
}
