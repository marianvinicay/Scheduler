import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { Container, Button } from '@mui/material';

function Panel() {
  const navigate = useNavigate();
  const location = useLocation();

  const [price, setPrice] = useState(0.0);
  const [hours, setHours] = useState(['14:00', '15:00']);
  const [exceptDates, setExceptDates] = useState([]);

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

export default Panel;
