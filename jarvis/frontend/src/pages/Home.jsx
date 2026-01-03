import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import useJarvisVoice from "../hooks/useJarvisVoice";

function Home() {
  const navigate = useNavigate();

  const {
    userData,
    setUserData,
    handleCurrentUser,
    serverURL,
    selectedImage,
  } = useContext(UserDataContext);

  // 🎙️ Activate Jarvis voice system
  useJarvisVoice();

  // 🔐 Handle logged-in user
  useEffect(() => {
    if (!userData && !localStorage.getItem("token")) return;

    if (!userData) {
      handleCurrentUser();
    }
  }, [userData, handleCurrentUser]);

  // ⏳ Loading state
  if (!userData) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-t from-black to-[#151569] text-white">
        Loading your assistant...
      </div>
    );
  }

  // 🖼️ Assistant Image
  const assistantImgSrc =
    selectedImage ||
    (userData.assistantImage &&
      (userData.assistantImage.startsWith("http")
        ? userData.assistantImage
        : `${serverURL}${userData.assistantImage}`));

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#151569] flex flex-col items-center justify-center p-5 text-white relative">

      {/* ⬅️ Back */}
      <button
        onClick={() => navigate("/customize2")}
        className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/10 border border-white/30 text-sm hover:bg-white/20 hover:scale-105 transition"
      >
        ← Back
      </button>

      {/* 🚪 Logout */}
      <button
        onClick={() => {
          setUserData(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/signup", { replace: true });
        }}
        className="absolute top-4 right-4 px-4 py-2 rounded-full bg-red-500/20 border border-red-400/40 text-sm text-red-300 hover:bg-red-500/30 hover:scale-105 transition"
      >
        Log Out
      </button>

      {/* 🤖 Assistant Image */}
      <div className="relative w-72 h-72 rounded-full overflow-hidden mt-10">
        <img
          src={assistantImgSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
        />
        <img
          src={assistantImgSrc}
          alt="Assistant"
          className="relative w-full h-full object-contain"
        />
      </div>

      {/* 👋 Greeting */}
      <p className="mt-6 text-center text-lg font-semibold">
        Hello <span className="text-blue-300">{userData.name}</span>, I am{" "}
        <span className="text-blue-400">
          {userData.assistantName || "your virtual assistant"}
        </span>
      </p>

      {/* 🎤 Hint */}
      <p className="mt-2 text-sm text-white/70">
        Say <span className="text-blue-300 font-medium">“Hey Jarvis”</span> to talk to me
      </p>
    </div>
  );
}

export default Home;
