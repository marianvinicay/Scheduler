import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

//import TimeRangePicker from '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

import { Container, Stack, Button, TextField } from '@mui/material';
import SettingsManager from '../../managers/SettingsManager';
import Formats from '../Calendar/Formats';

import moment from 'moment';
import 'moment/locale/sk.js';

const dayStart = new moment('00:01', 'HH:mm');
const dayEnd = new moment('23:59', 'HH:mm');

function Panel() {
  const navigate = useNavigate();
  const location = useLocation();

  const [price, setPrice] = useState(0.0);
  const [slots, setSlots] = useState('');
  const [minimumIncrement, setMinimumIncrement] = useState(15);
  const [allowedDurations, setAllowedDurations] = useState('60');
  const [startTime, setStartTime] = useState(dayStart);
  const [endTime, setEndTime] = useState(dayEnd);
  const [exceptDates, setExceptDates] = useState([]);

  useEffect(() => {
    SettingsManager.getSettings()
      .then((settings) => {
        setPrice(settings.price);
        if (settings.slots) {
          setSlots(settings.slots.join(', '));
        }
        setStartTime(new moment(settings.start_time, 'HH:mm'));
        setEndTime(new moment(settings.end_time, 'HH:mm'))
        setMinimumIncrement(settings.minInc);
        if (settings.allowedDurations) {
          setAllowedDurations(settings.allowedDurations.join(', '));
        }
        if (settings.except_days) {
          setExceptDates(settings.except_days.join(', '));
        }
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

  const slotsChanged = (i) => {
    const newSlots = i.target.value;
    const splitted = newSlots.split(',');
    splitted.forEach((val, i) => splitted[i] = val.trim());
    setSlots(splitted.join(', '));
    SettingsManager.setSlots(splitted);
  }

  const slotsChangedd = (i) => {
    const newSlots = i.target.value;
    setSlots(newSlots);
  }

  const allowedDurationsChanged = (e) => {
    const newDurations = e.target.value;
    const splitted = newDurations.split(',');
    splitted.forEach((val, i) => splitted[i] = val.trim());
    setAllowedDurations(splitted);
    SettingsManager.setAllowedDurations(newDurations);
  }

  const minIncrementChanged = (e) => {
    const newInc = Number(e.target.value);
    setMinimumIncrement(newInc);
    SettingsManager.setMinimumIncrement(newInc);
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

          <TextField id="outlined-required" label="Price" value={price} variant="outlined" type='number' onChange={priceChanged} />
          <TextField id="outlined-required" label="Slots" value={slots} variant="outlined" onChange={slotsChangedd} onBlur={slotsChanged} />
          <TextField id="outlined-required" label="Except Dates" value={exceptDates} variant="outlined" />

          <TimePicker
            defaultValue={dayStart}
            value={startTime}
            format={Formats.timeGutterFormat}
            use12Hours={false}
            showSecond={false}
            minuteStep={minimumIncrement}
            onChange={setStartTime}
          />

          <TimePicker
            defaultValue={dayEnd}
            value={endTime}
            format={Formats.timeGutterFormat}
            use12Hours={false}
            showSecond={false}
            minuteStep={minimumIncrement}
            onChange={setStartTime}
          />

          <TextField id="outlined-required" label="Durations" value={allowedDurations} variant="outlined" onChange={allowedDurationsChanged} />
          <TextField id="outlined-required" label="Minimum step" value={minimumIncrement} variant="outlined" type='number' onChange={minIncrementChanged} />

        </Stack>
      </Container>
    </div>
  );
}

export default Panel;
