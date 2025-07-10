import 'dotenv/config';
import { getClick, getDevices, getFun, getScreenshot } from "./api/some3c.js";
import { clickOnSearchBar, generateCommands } from './scripts/ai.js';

const screenshotsBase64 = {};

const startAutomation = async () => {
    try {
        const devices = await getDevices();
        const deviceList = devices.data.list;

        console.log('Devices:', deviceList);
        if (!deviceList || deviceList.length === 0) {
            console.log('No devices found.');
            return;
        }

        for await (const device of deviceList) {
            console.log(`Device ID: ${device.deviceid}, Name: ${device.name}`);
            const res = await getFun("/key/sendkey", {
                fn_key: "win+h",
                id: device.deviceid,
            })

            const base64 = await getScreenshot(device.deviceid, device.device_name)
            screenshotsBase64[device.deviceid] = base64;
            console.log(`Screenshot taken for device ${device.deviceid}`);


            console.log(`Response for device ${device.deviceid}:`, res);
        }


        const commands = await generateCommands(devices.data.list.map((device) => {
            return {
                deviceid: device.deviceid,
                name: device.name,
                type: device.type,
                model: device.model,
                width: device.width,
                height: device.height,
            }
        }), Object.values(screenshotsBase64));

        const parsedCommands = JSON.parse(commands.slice(commands.indexOf('['), commands.lastIndexOf(']') + 1));
        console.log('Parsed Commands:', parsedCommands);

        parsedCommands.forEach(async (device) => {
            console.log(`Device ID: ${device.deviceid}, Commands:`, device.commands);
            for (const command of device.commands) {
                if (command.action === 'click') {
                    await getClick(device.deviceid, command.x, command.y);
                    console.log(`Clicked on device ${device.deviceid} at (${command.x}, ${command.y})`);
                    const base64 = await getScreenshot(device.deviceid, device.device_name)
                    screenshotsBase64[device.deviceid] = base64;

                    const commands = await clickOnSearchBar(device, base64);
                    const parsedCommands = JSON.parse(commands.slice(commands.indexOf('{'), commands.lastIndexOf('}') + 1));

                    for (const cmd of parsedCommands.commands) {
                        if (cmd.action === 'click') {
                            await getClick(device.deviceid, cmd.x, cmd.y);
                            console.log(`Clicked on device ${device.deviceid} at (${cmd.x}, ${cmd.y})`);
                        } else if (cmd.action === 'type') {

                            const res = await getFun("/key/sendkey", {
                                key: cmd.text,
                                id: device.deviceid,
                            });

                            await getFun("/key/sendkey", {
                                fn_key: "ENTER",
                                id: device.deviceid,
                            })

                            await getFun("/mouse/swipe", {
                                direction: "up",
                                id: device.deviceid,
                                len: 0.8
                            });
                            console.log(`Typed on device ${device.deviceid}: ${cmd.text}`);
                         }
                    }

                    console.log(`Clicked on search bar for device ${device.deviceid}`);
                }
            }
        })
        // console.log('Generated Commands:', commands);
    } catch (error) {
        console.error('Error starting automation:', error);
    }
};

startAutomation();