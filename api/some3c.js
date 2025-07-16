import axios from 'axios';
import fs from 'fs';
const apiUrl = process.env.SOME3C_API;
const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    }
});


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

export const getScreenshot = async (deviceid, name) => {
    try {
        const data = await Some3C.fetchData('/api/pic/screenshot', { id: deviceid, jpg: true });
        return data.data.image;
        // console.log(data.data.image);
        // const decoded = Buffer.from(data.data.image, "base64");

        // fs.writeFileSync(`./screenshots/${name}.png`, decoded, {
        //     encoding: 'base64'
        // });
        // console.log(`Screenshot saved for device ${deviceid}`);


        return data;
    } catch (error) {
        console.error('Error taking screenshot:', error);
        throw error;
    }
}

export const getClick = async (deviceid, x, y) => {
    try {
        const data = await Some3C.fetchData('/api/mouse/click', { id: deviceid, x, y });
        console.log({ data });

        return data;
    } catch (error) {
        console.error('Error clicking on screenshot:', error);
        throw error;
    }
}