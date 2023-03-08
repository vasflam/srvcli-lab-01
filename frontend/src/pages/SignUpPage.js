import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';

export function SignUpPage() {
  return (
    <Sheet
      sx={{
        width: 300,
        mx: 'auto',
        my: 4,
        py: 3,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 'sm',
        boxShadow: 'md',
      }}
      variant="outlined"
    >
      <div>
        <Typography level="h4" component="h1">
          <b>Sign Up</b>
        </Typography>
        <Typography level="body2">Create your account.</Typography>
      </div>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          name="username"
          type="text"
          placeholder="Username"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input
          name="password"
          type="password"
          placeholder="Password"
        />
      </FormControl>

      <Button sx={{ mt: 1 /* margin top */ }}>Sign up</Button>
      <Typography
        endDecorator={<Link href="/login">Log in</Link>}
        fontSize="sm"
        sx={{ alignSelf: 'center' }}
      >
        Already have an account?
      </Typography>
    </Sheet>
  )
}

