import User from "../models/user.model.js";
import geminiResponse from "../gemini.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });

  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateAssistant = async (req, res) => {
  try {
    const userId = req.userId;
    const { assistantName, imageUrl } = req.body;
    
    // Prepare update object
    const updateData = {};
    
    if (assistantName) {
      updateData.assistantName = assistantName;
    }
    
    // If file was uploaded, use the file path
    if (req.file) {
      updateData.assistantImage = `/public/${req.file.filename}`;
    } 
    // If imageUrl was provided (existing image selected), use that
    else if (imageUrl) {
      updateData.assistantImage = imageUrl;
    }
    
    const user = await User
      .findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      )
      .select("-password");
      
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({ user });
  } catch (error) {
    console.error("updateAssistant error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    if (!command) return res.status(400).json({ message: "Missing command" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userName = user.name;
    const assistantName = user.assistantName || 'Jarvis';

    // Call the assistant once
    const result = await geminiResponse(command, assistantName, userName);

    if (typeof result !== 'string') {
      return res.status(500).json({ message: 'Invalid assistant response type' });
    }

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(400).json({ message: "Invalid response format from assistant" });
    }

    let gemResult;
    try {
      gemResult = JSON.parse(jsonMatch[0]);
    } catch (e) {
      return res.status(400).json({ message: 'Malformed JSON response from assistant' });
    }

    const type = gemResult.type;

   switch(type){
    case "get_date":
      return res.json({
        type,
        userinput: gemResult.userinput || gemResult.userInput || '',
        response:`Today's date is ${moment().format('YYYY-MM-DD')}.`
      });

      case "get_time":
      return res.json({
        type,
        userinput: gemResult.userinput || gemResult.userInput || '',
        response:`The current time is ${moment().format('HH:mm A')}.`
      });

      case "get_month":
      return res.json({
        type,
        userinput: gemResult.userinput || gemResult.userInput || '',
        response:`The current month is ${moment().format('MMMM')}.`
      });
      case "get_day":
      return res.json({
        type,
        userinput: gemResult.userinput || gemResult.userInput || '',
        response:`Today is ${moment().format('dddd')}.`
      });

      default:
      // Check for youtube_open type
      if (gemResult.type === "youtube_open") {
        return res.json({
          type: "youtube_open",
          userinput: gemResult.userinput || gemResult.userInput || '',
          response: gemResult.response || "Opening YouTube for you"
        });
      }
      
      return res.json({
        type: gemResult.type || "general",
        userinput: gemResult.userinput || gemResult.userInput || '',
        response: gemResult.response || ''
      });
      
   }
  }
  catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });

  }

};

