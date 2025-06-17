import React from 'react'
import { useContext } from 'react'
import { userDataContext } from '../context/userContext'

const Card = ({image}) => {

   const {serverUrl, userData, setUserData,frontendImage, setFrontendImage,
       backendImage, setBackendImage , selectedImage, setSelectedImage }  = useContext(userDataContext)

  return (
    <div className={`w-[70px] h-[100px] lg:w-[100px] lg:h-[200px] bg-[#030326] border-2 border-[#0000ff5b] rounded-2xl
    overflow-hidden hover:shadow-2xl hover:shadow-blue-800 cursor-pointer hover:border-2 hover:border-[white] ${selectedImage===image?
        "border-2 border-white shadow-2xl shadow-blue-800":null
    }`} 
    onClick={()=>{setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
    }} >
      <img src={image} className=' h-full  object-cover' />
    </div>
  )
}

export default Card
