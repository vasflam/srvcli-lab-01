import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';

export function GameCard({ game, user, handleJoin }) {

  return (
    <Card
      variant="outlined"
      sx={{ width: 260, bgcolor: 'background.body' }}
    >
      <CardContent
        sx={{ px: 2, pb: 2 }}
      >
        <Typography fontWeight="md" textColor="success.plainColor" mb={0.5}>
          { game.name }
        </Typography>

        <Typography level="body2">{ game.owner.username }</Typography>
      </CardContent>

      <Divider inset="context" />

      <CardOverflow
        variant="soft"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1.5,
          py: 1.5,
          px: 'var(--Card-padding)',
          bgcolor: 'background.level1',
        }}
      >
        <Button fullWidth={true} onClick={() => {handleJoin(game)}}>Join</Button>
      </CardOverflow>
    </Card>
  )
}
