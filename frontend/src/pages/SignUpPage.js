import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import { useAxios } from '../hooks';

export function SignUpPage() {
  const axios = useAxios();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const doSignup = async () => {
    const response = await axios.post('/users/create', {
      username,
      password,
    });
    setUser(response.data);
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

      <Button sx={{ mt: 1 /* margin top */ }} onClick={doSignup}>Sign up</Button>
      <Typography
        endDecorator={<Link href="/login">Log in</Link>}
        fontSize="sm"
        sx={{ alignSelf: 'center' }}
      >
        Already have an account?
      </Typography>
      { user && <Navigate to="/login" />}
    </Sheet>
  )
}

