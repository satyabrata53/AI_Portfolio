const { Groq } = require('groq-sdk');
const { SYSTEM_PROMPT } = require('../config/prompt');

let groqClient = null;

function getGroqClient() {
    if (!groqClient) {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY environment variable is missing or empty.");
        }
        groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return groqClient;
}

async function getAIResponse(question, mode) {
    let modeInstruction = "";
    switch(mode) {
        case "recruiter":
            modeInstruction = "You are currently speaking to a Recruiter. Provide short, impactful, and concise answers, focusing on outcomes and broad experience.";
            break;
        case "technical":
            modeInstruction = "You are currently speaking to an Engineer. Provide detailed, structured, technical answers, focusing on architecture, specific tools, and the mechanics of your implementations.";
            break;
        case "project":
            modeInstruction = "Provide project-focused answers. Focus exclusively on your own projects and implementations to answer the question.";
            break;
        default:
            modeInstruction = "Provide short and helpful answers.";
            break;
    }

    try {
        const groq = getGroqClient();
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT + "\n\n" + modeInstruction
                },
                {
                    role: "user",
                    content: question
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2, // low temperature to reduce hallucinations
            max_tokens: 1024
        });

        return chatCompletion.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
        console.error("Error communicating with Groq API:", error);
        throw error;
    }
}

module.exports = { getAIResponse };
