const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: "your-openai-api-key", // Replace with your OpenAI API key
});

// Health and Wellness AI Endpoint
app.post("/ask-ai", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Use GPT-4 or GPT-3.5
      messages: [
        {
          role: "system",
          content:
            "You are a health and wellness assistant. Provide helpful, accurate, and concise advice on fitness, nutrition, mental health, and general wellness.",
        },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});