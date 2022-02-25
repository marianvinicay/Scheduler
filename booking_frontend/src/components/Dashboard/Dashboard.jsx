import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';

import Calendar from 'react-calendar';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { Calendar as Scheduler, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/sk.js';

import 'react-calendar/dist/Calendar.css';
import 'react-big-calendar/lib/sass/styles.scss';

import AuthManager from '../../managers/AuthManager';
import ScheduleManager from '../../managers/ScheduleManager';

moment.locale('sk');
const localizer = momentLocalizer(moment);

const cEvents = [
  {
    id: 0,
    start: new Date(2022, 1, 10, 9, 0, 0),
    end: new Date(2022, 1, 10, 13, 0, 0),
    resourceId: 1,
  },
  {
    id: 1,
    title: 'MS training',
    allDay: true,
    start: new Date(2018, 0, 29, 14, 0, 0),
    end: new Date(2018, 0, 29, 16, 30, 0),
    resourceId: 2,
  },
  {
    id: 2,
    title: 'Team lead meeting',
    start: new Date(2018, 0, 29, 8, 30, 0),
    end: new Date(2018, 0, 29, 12, 30, 0),
    resourceId: 3,
  },
  {
    id: 4,
    title: 'Birthday Party',
    start: new Date(2021, 11, 21, 9, 0, 0),
    end: new Date(2021, 11, 21, 10, 30, 0),
    resourceId: 4,
  },
];

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

function Dashboard() {
  const navigate = useNavigate();

  const [time, setTime] = useState(['14:00', '15:00']);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState(cEvents);

  const addEvent = () => {
    let startDate = new Date(); 
    startDate.setHours(time[0].split(':')[0]);
    startDate.setMinutes(time[0].split(':')[1]);

    let endDate = new Date();
    endDate.setHours(time[1].split(':')[0]);
    endDate.setMinutes(time[1].split(':')[1]);

    if (checkEvents(events, startDate, endDate)) {
      const newEvent = {
        id: events.length,
        title: 'New event',
        start: startDate,
        end: endDate,
        resourceId: 1,
      };
      setEvents((oldEvents) => [...oldEvents, newEvent]);
    }
  };

  const logout = () => {
    AuthManager.logout()
		.then(() => {
        	navigate('/', { replace: true });
      	});
  };

  ScheduleManager.getForDate(date)

  return (
    <div className="Dashboard">
      <Button variant="contained" onClick={logout}>
        Logout
      </Button>

      <Calendar
        onChange={setDate}
        value={date}
      />

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
      onNavigate={(date) => { setDate(date) }}
      resources={resourceMap}
      resourceIdAccessor="resourceId"
      resourceTitleAccessor="resourceTitle"
      formats={formats}
    />
    </div>
  );
}

export default Dashboard;
