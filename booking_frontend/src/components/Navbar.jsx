import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { Stack, Grid, Button } from '@mui/material';

import AuthManager from '../managers/AuthManager';

function Navbar({ content }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState('');
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    if (location.state) {
      setUserName(location.state.name);
      setUserBalance(location.state.balance);
    }
  }, [location]);

  const logout = () => {
    AuthManager.logout()
		  .then(() => {
     	  navigate('/', { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Stack direction="column" spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={9}>
            <p>{userName}   |   Kredit: {userBalance} €</p>
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" onClick={logout}>
              Logout
            </Button>
          </Grid>
        </Grid>
        
        {content}
      </Stack>
    </div>
  );
}

export default Navbar;
