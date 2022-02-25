import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Box, Button, TextField, Divider } from '@mui/material';

import AuthManager from '../../managers/AuthManager';

function Register() {
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");

  const navigate = useNavigate();

  const register = () => {
    navigate("/register");
    AuthManager.register(nameValue, emailValue, passValue, confirmValue);
  };

  return (
    <div className="Dashboard">
      <Box sx={{ 
        display: 'grid',
        gap: 3,
        gridTemplateRows: 'repeat(7, 1fr)' 
      }}>
		<TextField id="outlined-required" label="Meno" variant="outlined" autoComplete="name" 
			onChange={(e)=>{ setNameValue(e.target.value) }} />

        <TextField id="outlined-required" label="E-mail" variant="outlined" autoComplete="email" 
			onChange={(e)=>{ setEmailValue(e.target.value) }} />
        
        <TextField id="outlined-password-input" label="Heslo" variant="outlined" type="password"
          autoComplete="new-password" onChange={(e)=>{ setPassValue(e.target.value) }} />
        
		<TextField id="outlined-password-input" label="Zopakujte heslo" variant="outlined" type="password"
          autoComplete="new-password" onChange={(e)=>{ setConfirmValue(e.target.value) }} />

        <Divider />

        <Button variant="contained" onClick={register}>
          Registerovať sa
        </Button>

		<Button variant="contained" onClick={()=>{ navigate("/") }}>
          Späť
        </Button>
      </Box>
    </div>
  );
}

export default Register;