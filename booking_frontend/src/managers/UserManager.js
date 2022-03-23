// UserManager.js

import axios from 'axios';
import Cookies from 'js-cookie';

import User from '../models/User';

const apiURL = `http://127.0.0.1:8000/api/`;
const cookies = Cookies.withAttributes({ path: '/', sameSite: 'strict' }); // add domain...

const client = axios.create({
    baseURL: apiURL,
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

const UserManager = {

    async getWithID(uid) {
        try {
            const response = await client.get(`/user/${uid}`, {
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            });

            const json = response.data;
            return json;

        } catch (error) {
            console.log(error);
        }
    },

    async getCount() {
        try {
            const response = await client.get(`users/count`, {
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            });
            return response.data.count;

        } catch (error) {
            console.log(error);
        }
    },

    async getLimited(skip, take) {
        try {
            const response = await client.get(`users/skip/${skip}/take/${take}`, {
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            });
            const json = response.data;
            var users = [];
            for(var i = 0; i < json.length; i++) {
                const obj = json[i];
                users.push(new User(obj, null));
            }
            return users;

        } catch (error) {
            console.log(error);
        }
    },

    async save(sDate, eDate, slot, userId) {
    },
}
  
  export default UserManager;