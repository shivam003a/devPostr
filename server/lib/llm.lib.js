import OpenAI from 'openai';
import { jsonrepair } from 'jsonrepair'

const client = new OpenAI({
    apiKey: process.env.TOGETHER_AI_API,
    baseURL: 'https://api.together.xyz/v1',
});

export const getAiResponseByPrompt = async (systemPrompt, userPrompt) => {
    try {
        const response = await client.chat.completions.create({
            model: 'mistralai/Mistral-Small-24B-Instruct-2501',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_completion_tokens: 1500,
        });

        let raw = response?.choices[0]?.message?.content || "";

        // 1. Strip markdown code fences
        raw = raw.replace(/```json|```/g, "").trim();

        // 2. Extract array safely
        let jsonString = raw.substring(raw.indexOf("["), raw.lastIndexOf("]") + 1);

        // 3. Fix escaped newlines/tabs/backslashes
        jsonString = jsonString
            .replace(/\\n/g, "\\n")
            .replace(/\\t/g, "\\t")
            .replace(/\r?\n/g, " ")

        let posts;
        posts = jsonrepair(jsonString);

        try {
            posts = JSON.parse(jsonString);
        } catch (e) {
            console.error("❌ Failed to parse AI response:", e.message);
            console.error("Raw JSON string:", posts);
            throw new Error("AI returned invalid JSON");
        }

        return posts;

    } catch (e) {
        console.error('Error Getting AI response: ', e);
        throw new Error('Failed to get AI response');
    }
};
