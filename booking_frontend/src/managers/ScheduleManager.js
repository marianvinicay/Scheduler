// ScheduleManager.js

import axios from 'axios';
import { DateTime } from 'luxon';
import Cookies from 'js-cookie';

import SchedulerEvent from '../models/SchedulerEvent';

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
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const response = await client.get(`/for-date/${year}-${month}-${day}/timezone/${timezone}`, {
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            });

            const json = response.data;
            var events = [];
            for (var i = 0; i < json.length; i++) {
                events.push(new SchedulerEvent(json[i]));
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
                events.push(new SchedulerEvent(json[i]));
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
            start_date: sComps.toFormat('yyyy-LL-dd HH:mm'),
            end_date: eComps.toFormat('yyyy-LL-dd HH:mm'),
            timezone: timezone
        });

        try {
            const response = await client.post("/", json, {
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            });

            return { event: new SchedulerEvent(response.data), user: response.data.user };

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