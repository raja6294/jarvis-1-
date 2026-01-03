import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";

export default function Customize2() {
  const navigate = useNavigate();
  
 
  const {
    backendImage,
    selectedImage,
    serverURL,
    setUserData,
  } = useContext(UserDataContext);

  /* =======================
     LOCAL STATE
  ======================== */
  const [assistantName, setAssistantName] = useState("");

  /* =======================
     BUTTON CLICK HANDLER
     (Runs when button is clicked)
  ======================== */
  const handleUpdateAssistant = async () => {
    try {
      // Create form data (needed for image upload)
      const formData = new FormData();
      formData.append("assistantName", assistantName);

      // If user uploaded a new image
      if (backendImage) {
        formData.append("image", backendImage); // matches upload.single("image")
      } else {
        // If user selected an existing image
        formData.append("imageUrl", selectedImage);
      }

      // Log exactly what we are sending to backend
      console.log("Customize2: sending assistant update", {
        url: `${serverURL}/api/user/update-assistant`,
        assistantName,
        hasBackendImage: !!backendImage,
        selectedImage,
      });

      // Send data to backend
      const response = await axios.post(
        `${serverURL}/api/user/update-assistant`,
        formData,
        { withCredentials: true }
      );

      // Update user data in context
      setUserData(response.data.user);

      console.log("Customize2: assistant updated successfully", {
        userFromResponse: response.data.user,
      });
      
      // Navigate to home page after successful update
      navigate("/");

    } catch (error) {
      console.error(
        "Error updating assistant:",
        error.response?.data || error.message
      );
    }
  };

  /* =======================
     UI
  ======================== */
  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#151569]
                    flex flex-col justify-center items-center p-5 relative">

      {/* Back button to go to Customize (step 1) */}
      <button
        onClick={() => navigate("/customize")}
        className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/10 border border-white/30 text-sm text-white hover:bg-white/20 hover:scale-105 transition"
      >
        ← Back
      </button>

      {/* Heading */}
      <h1 className="text-white text-4xl font-bold text-center">
        Enter Your{" "}
        <span className="text-blue-400">Assistant Name</span>
      </h1>

      {/* Input */}
      <div className="w-full max-w-md mt-6">
        <input
          type="text"
          placeholder="eg: Jarvis"
          value={assistantName}
          onChange={(e) => setAssistantName(e.target.value)}
          className="w-full px-5 py-3 rounded-xl
                     bg-[#0b0b2a] text-white placeholder-gray-400
                     border border-[#1f1f5c]
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     transition duration-300"
        />
      </div>

      {/* Button (shows only when input has value) */}
      {assistantName.trim() && (
        <button
          onClick={handleUpdateAssistant}
          className="
            mt-6 px-8 py-3 rounded-xl
            bg-gradient-to-r from-blue-600 to-indigo-600
            text-white font-semibold text-lg
            shadow-lg shadow-blue-900/50
            hover:scale-105 hover:shadow-2xl hover:shadow-blue-700/70
            hover:from-blue-500 hover:to-indigo-500
            transition-all duration-300 ease-out
            active:scale-95
          "
        >
          Create Your Assistant
        </button>
      )}
    </div>
  );
}
