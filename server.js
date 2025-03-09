// server.js
require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const ApiConnector = require('./ApiConnector'); // Import the ApiConnector class

const app = express();
const PORT = process.env.PORT || 3000;

// Get the token from the environment variable
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Create an instance of the ApiConnector
const apiConnector = new ApiConnector('https://generativelanguage.googleapis.com'); // Replace with your API base URL

// Handle incoming messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    // Example API call
    try {
        bot.sendChatAction(chatId, 'typing');
        const apiResponse = await apiConnector.post('/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBm8V7u1IlL4nhi2xkb_sn2-n34eHExx_Q',
            {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": messageText
                            }
                        ]
                    }
                ]
            }
        ); // Replace with your endpoint
        const formattedMessage = apiResponse["candidates"][0]["content"]["parts"][0]["text"]; // Markdown formatting
        bot.sendMessage(chatId, formattedMessage, { parse_mode: 'Markdown' });
    } catch (error) {
        console.log(error);
        bot.sendMessage(chatId, 'Failed to fetch data from API.');
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});