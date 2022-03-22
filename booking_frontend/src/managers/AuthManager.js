// AuthManager.js

import axios from 'axios';
import Cookies from 'js-cookie';

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
                const token = response.data.token;
                cookies.set('token', token, { expires: 1 });
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
            const r_data = response.data;
            cookies.set('token', r_data.token, { expires: 1 });
            
            const userId = r_data.id;
            const userName = r_data.name;
            const userBalance = r_data.balance;
            return { userId: userId, userName: userName, userBalance: userBalance };

        } catch (error) {
            console.log(error);
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