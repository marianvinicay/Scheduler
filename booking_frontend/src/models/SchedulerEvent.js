// SchedulerEvent.js

import { DateTime } from "luxon"

class SchedulerEvent {
    constructor(jsonEvent) {
        this.id = jsonEvent.id;
        this.editable = jsonEvent.editable;
        this.title = jsonEvent.editable ? 'My Session' : 'Booked';
        this.start = DateTime.fromSQL(jsonEvent.start_date, { zone: jsonEvent.timezone }).toJSDate();
        this.end = DateTime.fromSQL(jsonEvent.end_date, { zone: jsonEvent.timezone }).toJSDate();
        this.resourceId = jsonEvent.slot + 1;
    }
}

export default SchedulerEvent;