const express = require('express');
const router = express.Router();
const { getAIResponse } = require('../services/groqService');

const MAX_QUESTION_LENGTH = 1000;
const VALID_MODES = ['recruiter', 'technical', 'project'];

router.post('/ask-ai', async (req, res) => {
    try {
        const { question, mode } = req.body;

        // Validate question
        if (!question || typeof question !== 'string') {
            return res.status(400).json({ error: 'A valid "question" string is required.' });
        }

        const trimmedQuestion = question.trim();

        if (trimmedQuestion.length === 0) {
            return res.status(400).json({ error: 'Question cannot be empty.' });
        }

        if (trimmedQuestion.length > MAX_QUESTION_LENGTH) {
            return res.status(400).json({ error: `Question is too long. Max ${MAX_QUESTION_LENGTH} characters.` });
        }

        // Validate and normalize mode
        const appliedMode = VALID_MODES.includes(mode) ? mode : 'recruiter';

        // Check API key before using it
        if (!process.env.GROQ_API_KEY) {
            console.error('GROQ_API_KEY is missing in environment.');
            return res.status(503).json({ answer: 'AI service is not configured. Please contact the administrator.' });
        }

        const answer = await getAIResponse(trimmedQuestion, appliedMode);

        return res.json({ answer });
    } catch (error) {
        console.error('Error in /ask-ai:', error.message || error);
        return res.status(500).json({ answer: 'Unable to process the request at the moment.' });
    }
});

module.exports = router;
