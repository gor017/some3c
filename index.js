import 'dotenv/config';
import { getClick, getDevices, getFun, getScreenshot } from "./api/some3c.js";
import { clickOnSearchBar, generateCommands } from './scripts/ai.js';

const screenshotsBase64 = {};

const testDeviceId = '14:D0:0D:81:B8:AF';

const positions = {
    like: {
        y: {
            min: 380,
            max: 400,
        },
        x: {
            min: 390,
            max: 450,
        }
    },
    scroll: {
        sx: {
            min: 10,
            max: 320
        },
        sy: {
            min: 110,
            max: 600
        }
    },
    comment: {
        icon: {

            y: {
                min: 450,
                max: 500,
            },
            x: {
                min: 390,
                max: 450,
            }
        },
        commentBar: {
            y: {
                min: 760,
                max: 795,
            },
            x: {
                min: 100,
                max: 290,
            }
        },
        outSideClick: {
            y: {
                min: 100,
                max: 200,
            },
            x: {
                min: 10,
                max: 290,
            }
        }
    }
}

const pause = async (duration) => {
    return new Promise(resolve => setTimeout(resolve, duration * 1000));
};

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const testt = async () => {
    await getClick(testDeviceId, 210, 830);
    await pause(1);
    await getClick(testDeviceId, getRandomNumber(350, 400), getRandomNumber(650, 720), {
        time: 0
    });

    await pause(2);
    await getClick(testDeviceId, getRandomNumber(150, 200), 250);
    await pause(3);
    await getClick(testDeviceId, 140, 350);


    await getClick(testDeviceId, 300, 770);
    await pause(1);
    await getClick(testDeviceId, 300, 770);
    await pause(1);
    await getClick(testDeviceId, 310, 770);

    await pause(12);
    await getClick(testDeviceId, 50, 800);
}
// testt();

// getFun("/mouse/swipe", {
//     direction: "up",
//     id: testDeviceId,
//     len,
//     sx,
//     sy,
//     ex,
//     ey,
// }).then((res) => {
//     console.log({ res });

//     console.log('Swipe action completed')
// });
// await getClick(testDeviceId, getRandomNumber(positions.like.x.min, positions.like.x.max), getRandomNumber(positions.like.y.min, positions.like.y.max));

const startAutomation = async () => {
    try {
        const devices = await getDevices();
        const deviceList = devices.data.list;

        console.log('Devices:', deviceList);
        if (!deviceList || deviceList.length === 0) {
            console.log('No devices found.');
            return;
        }

        // for await (const device of deviceList) {
        //     console.log(`Device ID: ${device.deviceid}, Name: ${device.name}`);
        //     const res = await getFun("/key/sendkey", {
        //         fn_key: "win+h",
        //         id: device.deviceid,
        //     })

        //     const base64 = await getScreenshot(device.deviceid, device.device_name)
        //     screenshotsBase64[device.deviceid] = base64;
        //     console.log(`Screenshot taken for device ${device.deviceid}`);


        //     console.log(`Response for device ${device.deviceid}:`, res);
        // }


        const commands = await generateCommands(
            //     devices.data.list.map((device) => {
            //     return {
            //         deviceid: device.deviceid,
            //         name: device.name,
            //         type: device.type,
            //         model: device.model,
            //         width: device.width,
            //         height: device.height,
            //     }
            // }), Object.values(screenshotsBase64)
        );
        console.log({ commands });

        const parsedCommands = JSON.parse(commands.slice(commands.indexOf('['), commands.lastIndexOf(']') + 1));
        console.log('Parsed Commands:', parsedCommands);
        await getClick(testDeviceId, 200, 530);
        await pause(5);
        for await (const command of parsedCommands) {
            console.log(`Device ID: ${command.deviceid}, Commands:`, command.commands);
            if (command.action === 'scroll') {
                const sx = getRandomNumber(positions.scroll.sx.min, positions.scroll.sx.max);
                const sy = getRandomNumber(positions.scroll.sy.min, positions.scroll.sy.max);
                const ey = getRandomNumber(80, sy - 35);
                const len = Math.random() * 0.5 + 0.5;
                const ex = getRandomNumber(sx, sx + getRandomNumber(-5, 5));
                console.log({ sx, ex, sy, ey, len });
                await getFun("/mouse/swipe", {
                    direction: "up",
                    id: testDeviceId,
                    len, // Random length between 0.5 and 1.0
                    sx,
                    sy,
                    ex: sx,
                    ey,
                });
                // await getClick(command.deviceid, command.x, command.y);
                console.log(`Swipe on device ${command.deviceid} at start: (${sx}, ${sy}) to end: (${ex}, ${ey}) with length ${len}`);
            } else if (command.action === 'pause') {
                console.log(`Paused for ${command.duration} seconds on device ${command.deviceid}`);
                await pause(command.duration);
                // await getFun("/key/sendkey", {
                //     key: command.text,
                //     id: command.deviceid,
                // });

                // await getFun("/key/sendkey", {
                //     fn_key: "ENTER",
                //     id: command.deviceid,
                // });

                // await getFun("/mouse/swipe", {
                //     direction: "up",
                //     id: command.deviceid,
                //     len: 0.8
                // });
                // console.log(`Typed on device ${command.deviceid}: ${command.text}`);
            } else if (command.action === 'like') {
                const y = getRandomNumber(positions.like.y.min, positions.like.y.max);
                const x = getRandomNumber(positions.like.x.min, positions.like.x.max);
                await getClick(testDeviceId, x, y);
                await pause(getRandomNumber(1, 3));
                console.log(`Liked, Clicked on device ${command.deviceid} at (${x}, ${y})`);
            } else if (command.action === 'comment') {
                const y = getRandomNumber(positions.comment.icon.y.min, positions.comment.icon.y.max);
                const x = getRandomNumber(positions.comment.icon.x.min, positions.comment.icon.x.max);
                await getClick(testDeviceId, x, y);

                const commentBarY = getRandomNumber(positions.comment.commentBar.y.min, positions.comment.commentBar.y.max);
                const commentBarX = getRandomNumber(positions.comment.commentBar.x.min, positions.comment.commentBar.x.max);
                await getClick(testDeviceId, commentBarX, commentBarY);

                await getFun("/key/sendkey", {
                    key: command.text,
                    id: testDeviceId,
                });

                await getFun("/key/sendkey", {
                    fn_key: "ENTER",
                    id: testDeviceId,
                })

                const outSideClickY = getRandomNumber(positions.comment.outSideClick.y.min, positions.comment.outSideClick.y.max);
                const outSideClickX = getRandomNumber(positions.comment.outSideClick.x.min, positions.comment.outSideClick.x.max);
                await getClick(testDeviceId, outSideClickX, outSideClickY);
            } else if (command.action === 'upload') {
                console.log(`Uploading video on device ${command.deviceid}`);
                await getClick(testDeviceId, 210, 830);
                await pause(1);
                await getClick(testDeviceId, getRandomNumber(350, 400), getRandomNumber(650, 720), {
                    time: 0
                });

                await pause(2);
                await getClick(testDeviceId, getRandomNumber(150, 200), 250);
                await pause(3);
                await getClick(testDeviceId, 140, 350);


                await getClick(testDeviceId, 300, 770);
                await pause(1);
                await getClick(testDeviceId, 300, 770);
                await pause(1);
                await getClick(testDeviceId, 310, 770);

                await pause(12);
                await getClick(testDeviceId, 50, 800);
                // Implement upload logic here
                // For example, you might need to click on an upload button and select a file
            }

        };

        //                             if (command.action === 'click') {
        //         await getClick(device.deviceid, command.x, command.y);
        //         console.log(`Clicked on device ${device.deviceid} at (${command.x}, ${command.y})`);
        //         const base64 = await getScreenshot(device.deviceid, device.device_name)
        //         screenshotsBase64[device.deviceid] = base64;

        //         const commands = await clickOnSearchBar(device, base64);
        //         const parsedCommands = JSON.parse(commands.slice(commands.indexOf('['), commands.lastIndexOf(']') + 1));

        //         for (const cmd of parsedCommands.commands) {
        //             if (cmd.action === 'click') {
        //                 await getClick(device.deviceid, cmd.x, cmd.y);
        //                 console.log(`Clicked on device ${device.deviceid} at (${cmd.x}, ${cmd.y})`);
        //             } else if (cmd.action === 'type') {

        //                 const res = await getFun("/key/sendkey", {
        //                     key: cmd.text,
        //                     id: device.deviceid,
        //                 });

        //                 await getFun("/key/sendkey", {
        //                     fn_key: "ENTER",
        //                     id: device.deviceid,
        //                 })

        //                 await getFun("/mouse/swipe", {
        //                     direction: "up",
        //                     id: device.deviceid,
        //                     len: 0.8
        //                 });
        //                 console.log(`Typed on device ${device.deviceid}: ${cmd.text}`);
        //             }
        //         }

        //         console.log(`Clicked on search bar for device ${device.deviceid}`);
        //     }
        // }
        // console.log('Generated Commands:', commands);
    } catch (error) {
        console.error('Error starting automation:', error);
    }
};

// startAutomation();
import express from "express";

import router from './routes/index.js';
import cors from "cors";
import bodyParser from 'body-parser';
const app = express();
app.use(cors())
app.use(bodyParser.json());
router(app);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log("App is listening on port " + PORT);
})
