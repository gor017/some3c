import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateCommands = async (
    {
        sessionMin,
        sessionMax,

        scrollMin,
        scrollMax,

        swipeDelayMin,
        swipeDelayMax,

        pauseMin,
        pauseMax,

        pausePercentMin,
        pausePercentMax,

        likeMin,
        likeMax,

        commentMin,
        commentMax,

        uploadMin,
        uploadMax,
    }

) => {
    console.log(`Design a randomized sequence of actions for a ${sessionMin}-${sessionMax} minute TikTok or Instagram session to emulate human behavior and avoid detection by platform algorithms. The sequence should mimic natural user interactions, including scrolling, pausing to watch videos, liking, commenting, sharing, following, visiting profiles, and exploring hashtags. Incorporate the following:
- Session duration: Randomly between ${sessionMin}-${sessionMax} minutes.
- Scroll through ${scrollMin}-${scrollMax} videos with swipe delays of ${swipeDelayMin}-${swipeDelayMax} seconds (randomized, mean ${swipeDelayMin + swipeDelayMax / 2} seconds).
- Pause on ${pausePercentMin}-${pausePercentMax}% of videos for ${pauseMin}-${pauseMax} seconds to simulate watching (70% of pauses 5–8 seconds).
- Like ${likeMin}-${likeMax} videos (5–10% of videos watched), avoiding consecutive likes.
- Comment on ${commentMin}-${commentMax} videos (1–2% of videos watched) with generic, human-like comments (e.g., “Love this!”, “So cool :heart_eyes:”).
- Upload ${uploadMin}-${uploadMax} video per session.

don't write videos: 6, write each action for each video, and make ${sessionMin}-${sessionMax} minutes session

Please make sure your json data duration is minimum ${sessionMin} minutes and maximum is ${sessionMax} minutes
The total duration should be between ${sessionMin} and ${sessionMax} minutes (in seconds), and each action should have a realistic time duration. Add pauses and scrolls frequently to mimic real usage
it will be really big json, please make sure it is right json
give me json like this: [{
{
                        action: "pause",
                        duration: 5,
                    },
                    {
                        action: "scroll",
                    },
                    {
                        action: "like",
                    },
                    {
                        action: "comment",
                        text: "Love this!",
                    },
                     {
                        action: "upload",
                    },
                    {
                        action: "follow",
                    },
                    {
                        action: "share",
                    },
                    {
                        action: "visit_profile",
                        profile_id: "12345",
                    },

}

}]
`);

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
                        type: 'text', text: `Design a randomized sequence of actions for a ${sessionMin}-${sessionMax} minute TikTok or Instagram session to emulate human behavior and avoid detection by platform algorithms. The sequence should mimic natural user interactions, including scrolling, pausing to watch videos, liking, commenting, sharing, following, visiting profiles, and exploring hashtags. Incorporate the following:
- Session duration: Randomly between ${sessionMin}-${sessionMax} minutes.
- Scroll through ${scrollMin}-${scrollMax} videos with swipe delays of ${swipeDelayMin}-${swipeDelayMax} seconds (randomized, mean ${swipeDelayMin + swipeDelayMax / 2} seconds).
- Pause on ${pausePercentMin}-${pausePercentMax}% of videos for ${pauseMin}-${pauseMax} seconds to simulate watching.
- Like ${likeMin}-${likeMax} videos (5–10% of videos watched), avoiding consecutive likes.
- Comment on ${commentMin}-${commentMax} videos (1–2% of videos watched) with generic, human-like comments (e.g., “Love this!”, “So cool :heart_eyes:”).
- Upload ${uploadMin}-${uploadMax} video per session.

don't write videos: 6, write each action for each video, and make ${sessionMin}-${sessionMax} minutes session

Please make sure your json data duration is minimum ${sessionMin} minutes and maximum is ${sessionMax} minutes
The total duration should be between ${sessionMin}  and  ${sessionMax} minutes (in seconds), and each action should have a realistic time duration. Add pauses and scrolls frequently to mimic real usage
it will be really big json, please make sure it is right json
Pauses should be between  ${pauseMin}-${pauseMax} seconds
give me json like this: [{
{
                        action: "pause",
                        duration: 5,
                    },
                    {
                        action: "scroll",
                    },
                    {
                        action: "like",
                    },
                    {
                        action: "comment",
                        text: "Love this!",
                    },
                     {
                        action: "upload",
                    },
                    {
                        action: "follow",
                    },
                    {
                        action: "share",
                    },
                    {
                        action: "visit_profile",
                        profile_id: "12345",
                    },

}

}]
`},

                        // ...screenshots.map((screenshot, index) => ({ type: "image_url", image_url: { url: `data:image/png;base64,${screenshot}` } }
                        // ))
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