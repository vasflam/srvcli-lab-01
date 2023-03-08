import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import { useState } from 'react';
import { useAuth, useAxios } from '../hooks';

export function LoginPage() {
  const axios = useAxios();
  const {handleLogin, user} = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const doLogin = async () => {
    const response = await axios.post('/auth/login', {
      username,
      password,
    });
    handleLogin(response.data);
  };

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
          <b>Welcome!</b>
        </Typography>
        <Typography level="body2">Sign in to continue.</Typography>
      </div>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          name="username"
          type="text"
          placeholder="Username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input
          name="password"
          type="password"
          placeholder="Password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </FormControl>

      <Button sx={{ mt: 1 /* margin top */ }} onClick={doLogin}>Log in</Button>
      <Typography
        endDecorator={<Link href="/signup">Sign up</Link>}
        fontSize="sm"
        sx={{ alignSelf: 'center' }}
      >
        Don&apos;t have an account?
      </Typography>
    </Sheet>
  )
}
