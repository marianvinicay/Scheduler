// ScheduleManager.js

import axios from 'axios';
import { DateTime } from 'luxon';
import Cookies from 'js-cookie';

const apiReservationURL = `http://127.0.0.1:8000/api/reservation`;
const cookies = Cookies.withAttributes({ path: '/', sameSite: 'strict' }); // add domain...

const client = axios.create({
    baseURL: apiReservationURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const getToken = () => {
    const token = cookies.get('token');
    if (token !== undefined) {
        return cookies.get('token');
    } else {
        return "null";
    }
};

const extractComponents = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const newDate = new DateTime(year, month, day, hour, minute, 0, 0);
    newDate.setZone(timezone)
    return newDate;
};

const sqlDateToJSDate = (sqlDateString, timezone) => {
    return DateTime.fromSQL(sqlDateString, { zone: timezone }).toJSDate();
    /*
    const dateParts = sqlDateString.split("-");
    const year = dateParts[0];
    const month = dateParts[1] - 1;

    const tail = dateParts[2].split(" ");
    const day = tail[0];
    console.log(tail);
    const timeParts = tail[1].split(":");
    const hour = timeParts[0];
    const minutes = timeParts[1];

    const jsDate = new Date(year, month, day, hour, minutes, 0);
    return jsDate;
    */
};

const ScheduleManager = {

    async get(rid) {
        try {
            const response = await client.get(`/${rid}`, {
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            });

            const reservationJson = response.data;

            return reservationJson;

        } catch (error) {
            console.log(error);
        }
    },

    async getForDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        try {
            const response = await client.get(`/for-date/${year}-${month}-${day}`, {
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            });

            const json = response.data;
            var events = [];
            for (var i = 0; i < json.length; i++) {
                const obj = json[i];

                const timezone = obj.timezone;
                const sDate = sqlDateToJSDate(obj.start, timezone);
                const eDate = sqlDateToJSDate(obj.end, timezone);

                const event = {
                    id: obj.id,
                    editable: obj.editable,
                    title: obj.editable ? 'My Session' : 'Booked',
                    start: sDate,
                    end: eDate,
                    resourceId: obj.slot,
                };
                events.push(event);
            }
            return events;

        } catch (error) {
            console.log(error);
            return []
        }
    },

    async getForDateAdmin(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        try {
            const response = await client.get(`/admin/for-date/${year}-${month}-${day}`, {
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            });

            const json = response.data;
            var events = [];
            for (var i = 0; i < json.length; i++) {
                const obj = json[i];
                const sDate = sqlDateToJSDate(obj.start);
                const eDate = sqlDateToJSDate(obj.end);

                const event = {
                    id: obj.id,
                    title: obj.user.name,
                    start: sDate,
                    end: eDate,
                    resourceId: obj.slot,
                };
                events.push(event);
            }
            return events;

        } catch (error) {
            console.log(error);
        }
    },

    async save(sDate, eDate, slot) {
        const sComps = DateTime.fromJSDate(sDate);
        const eComps = DateTime.fromJSDate(eDate);
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const json = JSON.stringify({
            slot: slot,
            start: sComps.toFormat('yyyy-LL-dd HH:mm'),
            end: eComps.toFormat('yyyy-LL-dd HH:mm'),
            timezone: timezone,
            //start: `${sComps.year}-${sComps.month}-${sComps.day} ${sComps.hour}:${sComps.minute}:00`,
            //end: `${eComps.year}-${eComps.month}-${eComps.day} ${eComps.hour}:${eComps.minute}:00`
        });
        console.log(json);
        try {
            const response = await client.post("/", json, {
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            });
            return response.data;

        } catch (error) {
            throw error.response.data.error;
        }
    },

    async delete(rId) {
        try {
            const response = await client.delete(`/${rId}`, {
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            });
            return response.data;

        } catch (error) {
            console.log(error);
        }
    },

    async deleteAdmin(rId) {
        try {
            const response = await client.delete(`/admin/${rId}`, {
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            });
            return response.data;

        } catch (error) {
            console.log(error);
        }
    },
}

export default ScheduleManager;