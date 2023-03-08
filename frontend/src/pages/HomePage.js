import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Button from '@mui/joy/Button';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import { useGame } from '../hooks';
import { Game } from '../components/Game';
import { CreateGame } from '../components/CreateGame';

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

  const refresh = () => {
    socket.emit("listGames");
  };

  const handleJoin = (game) => {
    socket.emit('joinGame', {
      id: game.id,
    });
  };

  const list = games.map(game => {
    return (
      <ListItem key="game-{game.id}">
        <Game handleJoin={handleJoin} game={game} user={user} />
      </ListItem>
    );
  });

  return (
    <div>
      <Button onClick={refresh}>Refresh</Button>
      <CreateGame {...{socket, game, setGame}} />
      <List>{list}</List>
    </div>
  );
}
