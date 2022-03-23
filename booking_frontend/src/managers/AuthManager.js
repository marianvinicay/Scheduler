// AuthManager.js

import axios from 'axios';
import Cookies from 'js-cookie';

import User from '../models/User';

const apiAuthURL = `http://127.0.0.1:8000/api/auth`;
const cookies = Cookies.withAttributes({ path: '/', sameSite: 'strict' }); // add domain...

const client = axios.create({
    baseURL: apiAuthURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const AuthManager = {
    
    register(name, email, password, passwordConfirmation) {
        const json = JSON.stringify({
            name: name,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation
        });

        client.post("/register", json)
            .then((response) => {
                const user = response.data.user;
                // TODO: redirect to login page
            })
            .catch((error) => {
                console.log(error);
            });
    },

    async login(email, password) {
        const json = JSON.stringify({
            email: email,
            password: password
        });
        try {
            const response = await client.post("/login", json);

            const user = response.data.user;
            const policy = response.data.policy;
            cookies.set('token', user.token, { expires: 1 });
            
            return new User(user, policy);

        } catch (error) {
            console.log(error);
        }
    },

    async currentUser() {
        const token = cookies.get('token');
        if (!token) {
            return null;
        }
        try {
            const response = await client.get("/user", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const user = response.data.user;
            const policy = response.data.policy;
            
            return new User(user, policy);

        } catch (error) {
            console.log(error);
            return null;
        }
    },

    async logout() {
        const token = cookies.get('token');
        if (!token) {
            return;
        }
        try {
            const response = await client.delete("/logout", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                cookies.remove('token');
            }
        } catch (error) {
            console.log(error);
        }
    }
}
  
  export default AuthManager;