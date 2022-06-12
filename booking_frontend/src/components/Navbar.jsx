import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Stack, Grid, Button } from '@mui/material';

import AuthManager from '../managers/AuthManager';

function Navbar(props) {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    const user = props.user;
    if (user) {
      setUserName(user.name);
      setUserBalance(user.balance);
      setPolicies(user.policies);
    }
  }, [props.user]);

  const logout = () => {
    AuthManager.logout()
		  .then(() => {
     	  navigate('/', { replace: true });
      })
      .catch((error) => {
        navigate('/', { replace: true });
        console.log(error);
      });
  };

  const goBack = () => {
    navigate('/admin');
  };

  let label;
  if (policies.includes('admin')) {
    label = <p>{userName}   |   Admin Login</p>;
  } else {
    label = <p>{userName}   |   Kredit: {userBalance} €</p>;
  }

  return (
    <div>
      <Stack direction="column" spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            {label}
          </Grid>

          {policies.includes('admin') && 
          <Grid item xs={3}>
            <Button variant="contained" onClick={goBack}>
              Back
            </Button>
          </Grid>}

          <Grid item xs={3}>
            <Button variant="contained" onClick={logout}>
              Logout
            </Button>
          </Grid>
        </Grid>
        
        {props.content ? props.content : props.children}
      </Stack>
    </div>
  );
}

export default Navbar;
