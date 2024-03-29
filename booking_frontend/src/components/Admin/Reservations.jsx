import { useState, useEffect } from 'react';

import { Container, Stack, Grid, FormControl, InputLabel, NativeSelect, Button } from '@mui/material';
import ReservationPopup from './ReservationPopup';

import Calendar from 'react-calendar';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker';
import { Calendar as Scheduler, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/sk.js';

import 'react-calendar/dist/Calendar.css';
import 'react-big-calendar/lib/sass/styles.scss';

import ScheduleManager from '../../managers/ScheduleManager';

moment.locale('sk');
const localizer = momentLocalizer(moment);

const resourceMap = [
  { resourceId: 1, resourceTitle: 'Slot 1' },
  { resourceId: 2, resourceTitle: 'Slot 2' },
  { resourceId: 3, resourceTitle: 'Slot 3' },
  { resourceId: 4, resourceTitle: 'Slot 4' },
];

const formats = {
  timeGutterFormat: 'HH:mm',
};

const checkEvents = (events, startDate, endDate) => {
  const eventsOnDate = events.filter((event) => {
    const start = moment(event.start);
    const end = moment(event.end);
    const dateToCheckStart = moment(startDate);
    const dateToCheckEnd = moment(endDate);

    const startNotClear = dateToCheckStart.isBetween(start, end);
    const endNotClear = dateToCheckEnd.isBetween(start, end);
    return startNotClear && endNotClear;
  });

  return eventsOnDate.length === 0;
};

function Reservations() {
  const [time, setTime] = useState(['14:00', '15:00']);
  const [date, setDate] = useState(new Date());
  const [slot, setSlot] = useState(1);
  const [events, setEvents] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    ScheduleManager.getForDateAdmin(date)
      .then((events) => {
        setEvents(events);
      });
  }, [date]);

  const addEvent = () => {
    let startDate = new Date(date.valueOf());
    startDate.setHours(time[0].split(':')[0]);
    startDate.setMinutes(time[0].split(':')[1]);

    let endDate = new Date(date.valueOf());
    endDate.setHours(time[1].split(':')[0]);
    endDate.setMinutes(time[1].split(':')[1]);

    if (checkEvents(events, startDate, endDate)) {
      ScheduleManager.save(startDate, endDate, slot)
        .then((newEvent) => {
          const calEvent = {
            id: newEvent.id,
            title: 'Booked',
            start: startDate,
            end: endDate,
            resourceId: slot,
          };
          setEvents((oldEvents) => [...oldEvents, calEvent]);
        });
    }
  };

  return (
    <Container maxWidth="lg" className="Dashboard">
      <Stack direction="column" spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Calendar
              onChange={(date) => setDate(date)}
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
                  <option value={1}>Slot 1</option>
                  <option value={2}>Slot 2</option>
                  <option value={3}>Slot 3</option>
                  <option value={4}>Slot 4</option>
                </NativeSelect>
              </FormControl>

              <TimeRangePicker
                onChange={setTime}
                value={time}
                minTime={'08:00'}
                maxTime={'20:00'}
                disableClock={true}
                format="HH:mm"
              />

              <Button variant="contained" onClick={addEvent}>
                Rezervovať
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Scheduler
              culture='sk'
              localizer={localizer}
              events={events}
              defaultView={Views.DAY}
              views={['day']}
              step={30}
              min={moment('08:00', 'HH:mm').toDate()}
              max={moment('20:00', 'HH:mm').toDate()}
              toolbar={true}
              defaultDate={date}
              date={date}
              onNavigate={(date) => setDate(date)}
              onSelectEvent={(event) => setSelectedReservation(event)}
              resources={resourceMap}
              resourceIdAccessor="resourceId"
              resourceTitleAccessor="resourceTitle"
              formats={formats}
            />
          </Grid>
        </Grid>
      </Stack>

      <ReservationPopup 
        event={selectedReservation} 
        handleClose={() => setSelectedReservation(null)}
        handleDelete={() => {
          ScheduleManager.deleteAdmin(selectedReservation.id)
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
  );
}

export default Reservations;
