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
            for (var i = 0; i < json.length; i++) {
                const user = json[i];
                
                var policies = []
                for (var j = 0; j < user.policies.length; j++) {
                    policies.push(user.policies[j]);
                }
                users.push(new User(user, policies));
            }
            return users;

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

    async setPolicyFor(uid, newPolicies) {
        try {
            const input = {
                user_id: uid,
                policies: newPolicies
            };
            const response = await client.post('settings/policy/set', input, {
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            });
            const user = response.data;

            var policies = []
            for (var i = 0; i < user.policies.length; i++) {
                policies.push(user.policies[i]);
            }
            
            return new User(user, policies);

        } catch (error) {
            console.log(error);
        }
    },

    async save(sDate, eDate, slot, userId) {
    },
}
  
  export default UserManager;