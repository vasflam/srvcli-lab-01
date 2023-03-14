import { useState } from 'react';
import { styled } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import { useGame } from '../../hooks';

function StatsData({ title, value }) {
  return (
    <Typography sx={{ ml: 2 }} color="neutral" level="body2" fontWeight="lg">
      {title}
      <Typography sx={{ ml: 1 }}>{value}</Typography>
    </Typography>
  );
}

export function GameStats({ children }) {
  const { user, socket, game, stats } = useGame();
  return (
    <Sheet
      sx={{
        px: 3,
        pb: 2,
        gap: 2,
        borderRadius: 'sm',
        boxShadow: 'lg',
      }}>
      <Typography level="h5">
        Welcome
        <Typography level="h5" color="primary" sx={{ml:1}}>
          {user.username}
        </Typography>
      </Typography>
      <StatsData title="Total games" value={stats.total}/>
      <StatsData title="Wins" value={stats.wins}/>
      <StatsData title="Loses" value={stats.loses}/>
      <StatsData title="Draws" value={stats.draws}/>
      <Sheet sx={{ mt: 4 }}>
        {children}
      </Sheet>
    </Sheet>
  );
}
