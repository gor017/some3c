import axios from 'axios';

const apiUrl = process.env.SOME3C_API;
class Some3C {
    static async fetchData(endpoint, params = {}) {
        try {
            const response = await axios.get(`${apiUrl}${endpoint}`, {
                params
            });
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}

export const getDevices = async () => {
    try {
        const data = await Some3C.fetchData('/api/device/get');
        return data;
    } catch (error) {
        console.error('Error getting devices:', error);
        throw error;
    }
}

export const getFun = async (fun, params) => {
    try {
        const data = await Some3C.fetchData(`/api${fun}`, params);
        return data;
    } catch (error) {
        console.error('Error getting function data:', error);
        throw error;
    }
}