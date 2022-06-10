import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import TimeRangePicker from '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker';

import { Container, Stack, Button, TextField } from '@mui/material';
import SettingsManager from '../../managers/SettingsManager';

function Panel() {
  const navigate = useNavigate();
  const location = useLocation();

  const [price, setPrice] = useState(0.0);
  const [slots, setSlots] = useState(1);
  const [hours, setHours] = useState(['14:00', '15:00']);
  //const [exceptDates, setExceptDates] = useState([]);

  useEffect(() => {
    SettingsManager.getSettings()
      .then((settings) => {
        setPrice(settings.price);
        setSlots(settings.slots);
        //setHours(settings.hours);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const userPanel = () => {
    navigate("/admin/users", { state: location.state });
  };

  const reservationPanel = () => {
    navigate("/admin/reservations", { state: location.state });
  };

  const priceChanged = (e) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    SettingsManager.setPrice(newPrice);
  }

  const slotsChanged = (e) => {
    const newSlots = e.target.value;
    setSlots(newSlots);
    SettingsManager.setSlots(newSlots);
  }

  return (
    <div className="Admin">
      <Container fixed>
        <Stack direction="column" spacing={3}>
          <Button variant="contained" onClick={userPanel}>
            Spravovanie Uzivatelov
          </Button>

          <Button variant="contained" onClick={reservationPanel}>
            Sprava Rezervacii
          </Button>

          <TextField id="outlined-required" label="Price" value={price} variant="outlined" autoComplete="email" onChange={priceChanged} />
          <TextField id="outlined-required" label="Slots" value={slots} variant="outlined" autoComplete="email" onChange={slotsChanged} />

          <TimeRangePicker
                onChange={setHours}
                value={hours}
                minTime={'00:01'}
                maxTime={'23:59'}
                disableClock={true}
                format="HH:mm"
            />

        </Stack>
      </Container>
    </div>
  );
}

export default Panel;
