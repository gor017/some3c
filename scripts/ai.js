import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateCommands = async (devices) => {
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
                    content: `Generate automated fun and params commands for the Some3C box for the following devices.

Each device should have a separate set of commands

Each set must include at least 3 unique interaction steps 

Choose from this list: swiping, clicking, typing, mouse up, mouse down, mouse movement, mouse reset, mouse wheel (from here https://doc.some3c.com/xp-api-documentation/keyboard-and-mouse#xiang-ying-jie-guo-5)

The output should be in JSON format.

Devices: ${JSON.stringify(devices)}

Genrate for each device!!!!!!! give only json output, no other text or explanation.`
                }
            ],
        });
        
        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating commands:', error);
        throw error;
    }
}