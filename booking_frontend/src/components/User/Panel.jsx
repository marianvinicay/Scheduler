import { useState, useEffect } from 'react';

import { Container, Stack, Grid, FormControl, InputLabel, NativeSelect, Button } from '@mui/material';
import ReservationPopup from '../Admin/ReservationPopup';

import Calendar from 'react-calendar';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
//import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { Calendar as Scheduler, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/sk.js';

import 'react-calendar/dist/Calendar.css';
import 'react-big-calendar/lib/sass/styles.scss';

import ScheduleManager from '../../managers/ScheduleManager';
import SettingsManager from '../../managers/SettingsManager';
import AuthManager from '../../managers/AuthManager';
import Navbar from '../Navbar';
import CustomToolbar from '../Calendar/CustomToolbar';
import Formats from '../Calendar/Formats';

moment.locale('sk');
const localizer = momentLocalizer(moment);

const datesOverlap = (a_start, a_end, b_start, b_end) => {
  if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
  if (a_start <= b_end   && b_end   <= a_end) return true; // b ends in a
  if (b_start <  a_start && a_end   <  b_end) return true; // a in b
  return false;
};

const checkEvents = (events, startDate, endDate, slot) => {
  const eventsInTheSlot = events.filter((event) => {
    return event.slot === slot;
  });

  eventsInTheSlot.forEach((event, i) => {
    if (datesOverlap(event.start, event.end, startDate, endDate)) {
      return false;
    }
  }); 

  return true;
};

function Panel() {

  const [startTime, setStartTime] = useState(new moment());
  const [date, setDate] = useState(new Date());
  const [slot, setSlot] = useState(0);
  const [events, setEvents] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [settings, setSettings] = useState(JSON.parse(sessionStorage.getItem('settings')));

  useEffect(() => {
    AuthManager.currentUser()
      .then((newUser) => {
        setUser(newUser);
        sessionStorage.setItem('user', JSON.stringify(newUser));
      });

    SettingsManager.getSettings()
      .then((newSettings) => {
        setSettings(newSettings);
        console.log(newSettings);
        sessionStorage.setItem('settings', JSON.stringify(newSettings));
      });

    ScheduleManager.getForDate(date)
      .then((events) => {
        setEvents(events);
      });
  }, [date, user.balance, settings.price]);

  const addEvent = () => {
    let startDate = new Date(date.valueOf());
    startDate.setHours(startTime.hour());
    startDate.setMinutes(startTime.minute());

    let endDate = new Date(startDate.valueOf());
    endDate.setHours(startDate.getHours() + 1);

    if (checkEvents(events, startDate, endDate)) {
      ScheduleManager.save(startDate, endDate, slot)
        .then((json) => {
          console.log(user);
          console.log(json.user.balance);
          const newUser = user;
          newUser.balance = json.user.balance;
          setUser(newUser);
          console.log(user);
          sessionStorage.setItem('user', JSON.stringify(newUser));
          setEvents((oldEvents) => [...oldEvents, json.event]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const nextDay = () => {
    const next = new Date(date.valueOf());
    next.setDate(next.getDate() + 1)
    setDate(next);
  };

  const previousDay = () => {
    const previous = new Date(date.valueOf());
    console.log(previous);
    previous.setDate(previous.getDate() - 1)
    console.log(previous);
    setDate(previous);
  };

  return (
    <Navbar user={user}>
    <Container maxWidth="lg" className="Dashboard">
      <Stack direction='column' spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Calendar
              onChange={setDate}
              value={date}
            />
          </Grid>

          <Grid item xs={6}>
            <Stack direction="column" spacing={3}>
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Slot
                </InputLabel>
                <NativeSelect
                  defaultValue={slot}
                  inputProps={{
                    name: 'slot',
                    id: 'uncontrolled-native',
                  }}
                  onChange={(p) => setSlot(parseInt(p.target.value))}
                >
                  {settings.slots.map((value, index) => {
                    return <option key={index} value={index}>{value}</option>
                  })}
                </NativeSelect>
              </FormControl>

              <TimePicker
                disabledHours={() => {
                  const all = Array.from({length: 25}, (_, i) => i);
                  const sTime = moment(settings.start_time, 'HH:mm');
                  const eTime = moment(settings.end_time, 'HH:mm');
                  const diff = eTime.diff(sTime, 'hours');
                  const positiveRange = Array.from({length: diff}, (_, i) => i + sTime.hours());
                  return all.filter(h => !positiveRange.includes(h));
                }}
                disabledMinutes={() => {
                  const all = Array.from({length: 61}, (_, i) => i);
                  const sTime = moment(settings.start_time, 'HH:mm');
                  const eTime = moment(settings.end_time, 'HH:mm');
                  const diff = eTime.diff(sTime, 'minutes');
                  const positiveRange = Array.from({length: diff}, (_, i) => i + sTime.minutes());
                  return all.filter(m => !positiveRange.includes(m));
                }}
                hideDisabledOptions={true}
                defaultValue={new Date()}
                value={startTime}
                format={Formats.timeGutterFormat}
                use12Hours={false}
                showSecond={false}
                minuteStep={15}
                onChange={setStartTime}
              />

              <Button variant="contained" onClick={addEvent}>
                Rezervovať
              </Button>

              <div>Cena: {settings.price}€</div>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <CustomToolbar date={date} back={previousDay} next={nextDay} />
          <Grid item xs={12}>
            <Scheduler
              culture='sk'
              localizer={localizer}
              events={events}
              defaultView={Views.DAY}
              views={['day']}
              step={30}
              min={moment(settings.start_time, 'HH:mm').toDate()}
              max={moment(settings.end_time, 'HH:mm').toDate()}
              toolbar={false}
              defaultDate={date}
              date={date}
              onNavigate={setDate}
              selected={selectedReservation}
              onSelectEvent={(event) => {
                if (event.editable) {
                  setSelectedReservation(event);
                } else {
                  setSelectedReservation(null);
                }
              }}
              resources={settings.slots.map((value, index) => {
                return { resourceId: (index + 1), resourceTitle: value }
              })}
              resourceIdAccessor="resourceId"
              resourceTitleAccessor="resourceTitle"
              formats={Formats}
            />
          </Grid>
        </Grid>
      </Stack>

      <ReservationPopup
        event={selectedReservation}
        handleClose={() => setSelectedReservation(null)}
        handleDelete={() => {
          ScheduleManager.delete(selectedReservation.id)
            .then(() => {
              setEvents(events.filter((event) => event.id !== selectedReservation.id));
              setSelectedReservation(null);
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      />
    </Container>
    </Navbar>
  );
}

export default Panel;
