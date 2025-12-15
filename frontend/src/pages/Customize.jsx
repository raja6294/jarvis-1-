import React, { useRef, useState,useContext } from "react";
import { UserDataContext } from "../context/UserContext";

import Card from "../components/Card";
import { LuImagePlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";


import image1 from "../assets/image1.png";
import image2 from "../assets/image.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";

export default function Customize() {
  const inputImageRef = useRef(null);
 
const {serverURL,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(UserDataContext)



const navigate=useNavigate();  

   
  

  
  const [cards, setCards] = useState([
    image1,
    image2,
    image3,
    image4,
    image5,
  ]);

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    setCards((prev) => [...prev, imageURL]);
    setBackendImage(file);
    setSelectedImage(imageURL); // Set the newly uploaded image as selected

    // Log what is being selected / uploaded
    console.log("Customize: image uploaded & selected", {
      imageURL,
      fileName: file.name,
      fileType: file.type,
    });

    e.target.value = "";
  };

  return (
    <div
      className="w-full h-screen bg-gradient-to-t from-black to-[#151569]
                 flex flex-col justify-center items-center p-5 gap-5"
    >
      <h1 className="text-amber-50 mb-8 text-3xl text-center">
        Select your <span className="text-blue-300">Assistant Image</span>
      </h1>

      <div className="w-full max-w-[900px] flex flex-wrap justify-center gap-4">
        
        {cards.map((img) => (
          <Card key={img} image={img} />
        ))}

        
        <div
          onClick={() => inputImageRef.current.click()}
          className="w-[150px] h-[250px] bg-[#030326] border-2 border-[#080839]
                     rounded-2xl shadow-2xl shadow-blue-950 cursor-pointer
                     hover:scale-105 transition duration-300
                     hover:border-white flex items-center justify-center"
        >
          <LuImagePlus className="text-white w-6 h-6" />
        </div>

      
        <input
          type="file"
          accept="image/*"
          ref={inputImageRef}
          hidden
          onChange={handleAddImage}
        />
      </div>

      {selectedImage && (
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 transition hover:shadow-lg
                     hover:scale-105 font-semibold"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
}
