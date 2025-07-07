import 'dotenv/config';
import { getDevices, getFun } from "./api/some3c.js";
import { generateCommands } from './scripts/ai.js';

const startAutomation = async () => {
    try {
        const devices = await getDevices();
        const deviceList = devices.data.list;

        console.log('Devices:', deviceList);
        if (!deviceList || deviceList.length === 0) {
            console.log('No devices found.');
            return;
        }

        for (const device of deviceList) {
            console.log(`Device ID: ${device.deviceid}, Name: ${device.name}`);
            const res = await getFun("/key/sendkey", {
                fn_key: "win+h",
                id: device.deviceid,
            })

            console.log(`Response for device ${device.deviceid}:`, res);
        }


        const commands = await generateCommands(devices.data.list.map((device) => {
            return {
                deviceid: device.deviceid,
                name: device.name,
                type: device.type,
                model: device.model,
            }
        }));
        console.log({ commands });

        // for (const device of JSON.parse(commands)) {
        //     console.log(`Device ID: ${device.deviceid}, Commands:`, device.commands);
        //     for (const command of device.commands) {
        //         const res = await getFun("/key/sendkey", {
        //             fn_key: command,
        //             id: device.deviceid,
        //         });
        //         console.log(`Response for command ${command} on device ${device.deviceid}:`, res);
        //     }
        // }
        // console.log('Generated Commands:', commands);
    } catch (error) {
        console.error('Error starting automation:', error);
    }
};

startAutomation();