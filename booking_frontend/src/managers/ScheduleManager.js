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

const ScheduleManager = {

    async getForDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        try {
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
            console.log(error.response.data.errors);
        }
    },

    async save(sDate, eDate, slot, userId) {
        /*const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();*/

        const json = JSON.stringify({
            user: userId,
            slot: slot,
            timezone: "UTC",
            start: "2014-04-02 08:49:43",
            end: "2014-04-02 08:49:43"
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