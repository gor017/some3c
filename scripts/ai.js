import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateCommands = async (devices, screenshots) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4.1',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that generates automation commands'
                },
                {
                    role: 'user',
                    content: [{
                        type: 'text', text: `Generate automated fun and params commands for the Some3C box for the following devices.
                        Each device should have a separate set of commands
                        All devices should click on safari icon x=160&y=750, then click on searchbar, and type something and hit enter.
                        Devices: ${JSON.stringify(devices)}
                        give me structure like this:
                        [
                            {
                                "deviceid": "device_id",
                                "commands": [
                                    {
                                        "action": "click",
                                        "x": 100,
                                        "y": 200,
                                        "description": "Click on the icon at (100, 200)"
                                    },
                                    {
                                        "action": "swipe",
                                        "direction": "up",
                                        "duration": 500
                                    },
                                ]
                            }
                        ]
                            the images order is the same as the devices order, so you can match them.
                        Genrate for each device!!!!!!! give only json output, no other text or explanation. give me only JSON!!!!!!!!!!!!!! not another things`},

                    ...screenshots.map((screenshot, index) => ({ type: "image_url", image_url: { url: `data:image/png;base64,${screenshot}` } }
                    ))
                    ]
                },
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating commands:', error);
        throw error;
    }
}

export const clickOnSearchBar = async (device, screenshot) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4.1',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that generates automation commands'
                },
                {
                    role: 'user',
                    content: [{
                        type: 'text', text: `
                        I need to click on the search bar of the device and type. 
                        it is on x=160&y=750

                        please make coordinates correct as much as possible. get the coordinates from the screenshot. and width and height form my json
Devices: ${device}
give me structure like this:
    {
        "deviceid": "device_id",
        "commands": [
            {
                "action": "click",
                "x": 100,
                "y": 200,
            },
            {
                "action": "type",
                "text": "search text",
            },
        ]
    }
Genrate for each device!!!!!!! give only json output, no other text or explanation. give me only JSON!!!!!!!!!!!!!! not another things`},

                    { type: "image_url", image_url: { url: `data:image/png;base64,${screenshot}` } }
                    ]
                },
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating commands:', error);
        throw error;
    }
}