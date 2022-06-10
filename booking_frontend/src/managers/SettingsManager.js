// SettingsManager.js

import axios from 'axios';

import getToken from './TokenUtility';

const apiURL = `http://127.0.0.1:8000/api/`;

const client = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const SettingsUpdater = {
  async update(json) {
    try {
      const response = await client.post('/settings', json, {
        headers: {
          'Authorization': 'Bearer ' + getToken()
        }
      });

      return response.data;

    } catch (error) {
      throw error;
    }
  }
}


const AdminManager = {

  async getSettings() {
    try {
      const response = await client.get('/settings', {
        headers: {
          'Authorization': 'Bearer ' + getToken()
        }
      });

      const settings = response.data;
      if (settings.slots) {
        settings.slots = JSON.parse(settings.slots);
      }

      if (settings.exceptDays) {
        settings.exceptDays = JSON.parse(settings.exceptDays);
      }

      return settings;

    } catch (error) {
      throw error;
    }
  },

  async setPrice(newPrice) {
    const json = JSON.stringify({ price: newPrice });
    try {
      return await SettingsUpdater.update(json);
    } catch (error) {
      console.log(error);
    }
  },

  async setSlots(newSlots) {
    const json = JSON.stringify({ slots: newSlots });
    try {
      return await SettingsUpdater.update(json);
    } catch (error) {
      console.log(error);
    }
  },

}

export default AdminManager;