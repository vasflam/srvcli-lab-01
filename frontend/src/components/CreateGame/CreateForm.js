import { useState } from 'react';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

export function CreateForm({ handleSubmit }) {
  const [name, setName] = useState('');
  const [size, setSize] = useState(3);
  const submit = () => {
    if (name.length < 4) {
    }
    return handleSubmit({
      name,
      size,
    })
  };

  return (
    <>
      <Typography
        component="h2"
        id="close-modal-title"
        level="h4"
        textColor="inherit"
        fontWeight="lg"
      >
        Create game
      </Typography>
      <Sheet
        sx={{
          width: 300,
          mx: 'auto',
          py: 3,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          //borderRadius: 'sm',
          //boxShadow: 'md',
        }}
      >
        <FormControl>
          <FormLabel>
            Game name
          </FormLabel>
          <Input
            name="name"
            type="text"
            placeholder="Game name"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>
            Field size
          </FormLabel>
          <Select defaultValue="3" onChange={(e, v) => {setSize(v)}}>
            {["3", "4", "5", "6", "7", "8"].map((i) => {
              return (<Option key={"field-size-"+i} value={i} label={i}>{i}</Option>);
            })}
          </Select>
        </FormControl>

        <Button sx={{ mt: 1 }} onClick={submit}>Create</Button>
      </Sheet>
    </>
  );
}
