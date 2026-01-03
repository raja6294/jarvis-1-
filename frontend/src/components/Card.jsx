import React, { useContext } from 'react'
import {UserDataContext} from '../context/UserContext'

function Card({image}) {
  const {
    serverURL,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage
  } = useContext(UserDataContext);

  return (
    <div 
      className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#080839] rounded-2xl overflow-hidden m-5 shadow-2xl shadow-blue-950 cursor-pointer hover:scale-105 transition-transform duration-300 hover:border-4 hover:border-white ${
        selectedImage === image ? 'border-4 border-white shadow-2xl shadow-blue-950' : ''
      }`}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null); 
        setFrontendImage(null);
        console.log("Card: image selected", { image });
      }}
    >
      <img src={image} alt="card image" className='w-full h-full object-cover rounded-2xl'/>
    </div>
  )
}

export default Card