import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";

function Home() {
  const navigate = useNavigate();
  const { userData, handleCurrentUser, serverURL, selectedImage } = useContext(UserDataContext);

  // If userData is empty (e.g. on page refresh), fetch it from backend
  useEffect(() => {
    if (!userData) {
      handleCurrentUser();
    }
  }, [userData, handleCurrentUser]);

  if (!userData) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-t from-black to-[#151569] text-white">
        Loading your assistant...
      </div>
    );
  }

  // Prefer currently selected image (from Customize page) then fall back to saved assistant image
  const assistantImgSrc =
    // If user selected an image in Customize, use it directly (could be a blob or module URL)
    selectedImage ||
    // Otherwise use the image saved on the user (uploaded to backend)
    (userData.assistantImage &&
      (userData.assistantImage.startsWith("http")
        ? userData.assistantImage
        : `${serverURL}${userData.assistantImage}`));

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#151569] flex flex-col items-center justify-center p-5 text-white relative">
      {/* Back button to go to Customize2 (assistant name step) */}
      <button
        onClick={() => navigate("/customize2")}
        className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/10 border border-white/30 text-sm text-white hover:bg-white/20 hover:scale-105 transition"
      >
        ← Back
      </button>

      {/* Assistant card (image fills the card) */}
<div className="relative w-72 h-72 rounded-full overflow-hidden">
  {/* Blurred fill */}
  <img
    src={assistantImgSrc}
    alt=""
    className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
  />

  {/* Actual image (not cut) */}
  <img
    src={assistantImgSrc}
    alt="Assistant"
    className="relative w-full h-full object-contain"
  />
</div>



<p className="mt-4 text-center text-lg font-semibold text-white">
  Hello{" "}
  <span className="text-blue-300">{userData.name}</span>, I am{" "}
  <span className="text-blue-400">
    {userData.assistantName || "your virtual assistant"}
  </span>
</p>



    </div>
  );
}

export default Home;
