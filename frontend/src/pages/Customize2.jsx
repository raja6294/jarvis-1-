import { useState } from "react";

export default function Customize2() {
  const [assistantName, setAssistantName] = useState("");

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#151569]
                    flex flex-col justify-center items-center p-5">

      <h1 className="text-white text-4xl font-bold text-center">
        Enter Your{" "}
        <span className="text-blue-400">Assistant Name</span>
      </h1>

      
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

     
      {assistantName.trim() && (
        <button
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
