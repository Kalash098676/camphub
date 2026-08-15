import { processAIChatRequest } from '../services/aiService.js';

export const chatWithAI = async (req, res) => {
  try {
    const { messages, message, context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.'
      });
    }

    const aiResult = await processAIChatRequest({
      message,
      messages: messages || [],
      context: context || {},
      user: req.user || null
    });

    return res.status(200).json(aiResult);
  } catch (error) {
    console.error('CampusHub AI Controller Error:', error);
    return res.status(500).json({
      success: false,
      text: "I'm having trouble communicating with the CampusHub AI service right now. Please try again in a moment.",
      error: error.message
    });
  }
};
