import { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { Container, Button } from '@mui/material';

function Users() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state || !location.state.userPolicy.includes('admin')) {
      navigate("/login", { replace: true });
    }
  }, []);

  const userPanel = () => {
    navigate("/admin/users", { state: location.state });
  };

  const reservationPanel = () => {
    navigate("/admin/reservations", { state: location.state });
  };

  return (
    <div className="Admin">
      <Container fixed>
        <Button variant="contained" onClick={userPanel}>
          Spravovanie Uzivatelov
        </Button>

        <Button variant="contained" onClick={reservationPanel}>
          Sprava Rezervacii
        </Button>
      </Container>
    </div>
  );
}

export default Users;
