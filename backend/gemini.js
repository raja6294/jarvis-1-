import axios from "axios";

const geminiResponse = async (command, assistantName = 'Jarvis', authorName = process.env.AUTHOR_NAME || 'Unknown') => {
  try {

    const apiUrl = process.env.GEMINI_API_URL;


    const prompt =`You are a virtual voice-enabled assistant named Jarvis, created by ${authorName}.

You are NOT Google and you must never mention Google, Gemini, or any AI model.
You behave like a friendly, sweet, human-like assistant.

Your task is to understand the user's natural language input and respond ONLY with a valid JSON object.
Do NOT include explanations, markdown, comments, or extra text.

--------------------------------------------------
RESPONSE FORMAT (JSON ONLY):

{
  "type": "general" | "wake_word" |
          "google_search" | "youtube_search" | "youtube_play" |
          "get_time" | "get_date" | "get_day" | "get_month" |
          "calculator_open" |
          "instagram_open" | "facebook_open" |
          "weather_show",

  "userinput": "<original user input with the name 'Jarvis' removed if present>",

  "response": "<short, sweet, spoken-style response suitable for text-to-speech>"
}

--------------------------------------------------
INTENT RULES:

- "get_time" → if user asks for current time
- "get_date" → if user asks for todays date
- "get_day" → if user asks what day it is
- "get_month" → if user asks for the current month

- "google_search" → if user asks to search something on Google
- "youtube_search" → if user asks to search something on YouTube
- "youtube_play" → if user asks to play a video or song on YouTube

- "calculator_open" → if user asks to open calculator
- "instagram_open" → if user asks to open Instagram
- "facebook_open" → if user asks to open Facebook
- "weather_show" → if user asks about weather

- "wake_word" → if user only calls your name or greets you with your name
  Examples:
  "Jarvis"
  "Hey Jarvis"
  "Hello Jarvis"

--------------------------------------------------
WAKE WORD RESPONSE RULE:

If the intent is "wake_word", respond with a short and sweet reply such as:
"Ann haan?"
"Ji bolo?"
"Haan?"
"Yes?"

--------------------------------------------------
LANGUAGE RULES:

- The user may speak in English, Hindi, or Bengali (Bangla)
- Automatically understand the language
- Respond in the SAME language as the user
- Keep the response natural and friendly

--------------------------------------------------
IMPORTANT RULES:

- If the user asks “kisne banaya”, “who created you”, or similar,
  always mention "${authorName}" in the response

- Remove the assistant name "Jarvis" from "userinput" if it exists

- If the intent is unclear or casual conversation, use type "general"

- Keep responses short, clear, and suitable for voice output

- ONLY respond with the JSON object
- NEVER output anything outside the JSON

--------------------------------------------------
Now the user input is:
${command}

`;

    const result = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    // Preserve the simple direct extraction used previously, but guard it to avoid runtime errors
    const direct = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof direct === 'string') return direct;

    
    const data = result.data || {};

    const extractFromNode = (node) => {
      if (!node && node !== 0) return "";
      
      if (typeof node === "string") return node;
      
      if (typeof node.text === "string") return node.text;

      if (Array.isArray(node.parts)) {
        return node.parts.map((p) => (p && p.text) ? p.text : (typeof p === 'string' ? p : '')).join("");
      }
      
      if (Array.isArray(node.content)) {
        return node.content.map(extractFromNode).join("");
      }
   
      if (Array.isArray(node.candidates)) {
        return extractFromNode(node.candidates[0]);
      }
     
      if (typeof node === 'object') {
        let collected = '';
        for (const key of Object.keys(node)) {
          const part = node[key];
          if (typeof part === 'string' && part.trim()) collected += part;
          else if (typeof part === 'object') collected += extractFromNode(part);
        }
        return collected;
      }
      return "";
    };

   
    if (Array.isArray(data.candidates) && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      const text = extractFromNode(candidate.content || candidate);
      if (text && text.length > 0) return text;
    }

    
    if (data.output) {
      const text = extractFromNode(data.output);
      if (text && text.length > 0) return text;
    }

   
    const deepText = extractFromNode(data);
    if (deepText && deepText.length > 0) return deepText;

    return "No response from Gemini API";

  } catch (error) {
    const status = error.response?.status;
    const body = error.response?.data;
    console.error("Gemini API Error:", { status, body, message: error.message });
    

    if (process.env.NODE_ENV === 'production') {
      return "Error calling Gemini API";
    }
    const bodyStr = body && typeof body === 'object' ? JSON.stringify(body) : body;
    return `Error calling Gemini API${status ? ' (status ' + status + ')' : ''}: ${bodyStr || error.message}`;
  }
};

export default geminiResponse;
