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

  async register(name, email, password, passwordConfirmation) {
    const json = JSON.stringify({
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation
    });

    try {
      const response = await client.post("/register", json);
      console.log(response.data.user);
      return new User(response.data.user);

    } catch (error) {
      throw error;
    }
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
      await client.delete("/logout", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      cookies.remove('token');

    } catch (error) {
      cookies.remove('token');
      throw (error.response.data);
    }
  }
}

export default AuthManager;