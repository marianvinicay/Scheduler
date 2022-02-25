import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Container, Box, Button, TextField, Divider } from '@mui/material';

import AuthManager from '../../managers/AuthManager';

function Login() {
  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");

  const navigate = useNavigate();

  const register = () => {
    navigate("/register");
  };

  const login = () => {
    if (emailValue === "" || emailValue == null) {
      alert("Please enter a valid email address");
      return;
    }
    if (passValue === "" || passValue == null) {
      alert("Please enter a password address");
      return;
    }

    AuthManager.login(emailValue, passValue)
      .then((auth) => {
        navigate('/dashboard', { replace: true });
      });
  };

  const emailChange = (e) => {
    setEmailValue(e.target.value);
  };

  const passChange = (e) => {
    setPassValue(e.target.value);
  };

  return (
    <div className="Dashboard">
      <Container fixed>
      <Box sx={{ 
        display: 'grid',
        gap: 3,
        gridTemplateRows: 'repeat(5, 1fr)' 
      }}>
        <TextField id="outlined-required" label="E-mail" variant="outlined" autoComplete="email" onChange={emailChange} />
        
        <TextField id="outlined-password-input" label="Heslo" variant="outlined" type="password"
          autoComplete="current-password" onChange={passChange} />

        <Divider />

        <Button variant="contained" onClick={login}>
          Prihlásiť sa
        </Button>

        <Button variant="contained" onClick={register}>
          Registerovať sa
        </Button>
      </Box>
      </Container>
    </div>
  );
}

export default Login;
