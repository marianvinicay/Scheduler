// ScheduleManager.js

import axios from 'axios';
import Cookies from 'js-cookie';

const apiReservationURL = `http://127.0.0.1:8000/api/reservation`;
const cookies = Cookies.withAttributes({ path: '/', sameSite: 'strict' }); // add domain...

const client = axios.create({
    baseURL: apiReservationURL
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
    return { day, month, year, hour, minute };
};

const ScheduleManager = {

    async getForDate(date) {
        console.log("GET");
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        try {
            console.log(`for-date/${year}-${month}-${day}`);
            const response = await client.get(`/for-date/${year}-${month}-${day}`, {
                headers: {
                    'Authorization': 'Bearer ' + getToken(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const json = response.data;
            for(var i = 0; i < json.length; i++) {
                const obj = json[i];
                console.log(obj);
            }

        } catch (error) {
            console.log(error);
        }
    },

    async save(sDate, eDate, slot, userId) {
        const sComps = extractComponents(sDate);
        const eComps = extractComponents(eDate);

        const json = JSON.stringify({
            user: userId,
            slot: slot,
            timezone: "UTC",
            start: `${sComps.year}-${sComps.month}-${sComps.day} ${sComps.hour}:${sComps.minute}:00`,
            end: `${eComps.year}-${eComps.month}-${eComps.day} ${eComps.hour}:${eComps.minute}:00`
        });

        try {
            const response = await client.post("/", json, {
                headers: {
                    'Authorization': 'Bearer ' + getToken(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log(response.data);

        } catch (error) {
            console.log(error.response.data.errors);
        }
    },
}
  
  export default ScheduleManager;