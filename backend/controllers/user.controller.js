import User from "../models/user.model.js";   // ✅ VERY IMPORTANT

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
