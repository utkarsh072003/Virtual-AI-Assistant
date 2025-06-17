import React from 'react'
import Card from '../componenets/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { BiImageAdd } from "react-icons/bi";
import { useState } from 'react'
import { useRef } from 'react'
import { useContext } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from 'react-icons/md'

const Customize = () => {

    const {serverUrl, userData, setUserData,frontendImage, setFrontendImage,
    backendImage, setBackendImage , selectedImage, setSelectedImage }  = useContext(userDataContext)
   
    const inputImage =useRef();
    const navigate = useNavigate();

    const handleImage =(e)=>{
        const file = e.target.files[0];
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    return (
        <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030346] flex justify-center items-center flex-col'>
            <MdKeyboardBackspace  className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate("/")}/>
            <h1 className='text-white text-[30px] p-[10px]'>Select Your Assistant Image </h1>
            <div className='w-[90%] max-w-[60%] flex items-center justify-center flex-wrap gap-5 p-[20px]'>
                <Card image={image1} />
                <Card image={image2} />
                <Card image={image3} />
                <Card image={image4} />
                <Card image={image5} />
                <Card image={image6} />
                <Card image={image7} />
                <div className={`w-[70px] h-[100px] lg:w-[100px] lg:h-[200px] bg-[#030326] border-2 border-[#0000ff5b] rounded-2xl
    overflow-hidden hover:shadow-2xl hover:shadow-blue-800 cursor-pointer hover:border-2 hover:border-[white] flex items-center justify-center ${selectedImage==="input"?
        "border-2 border-white shadow-2xl shadow-blue-800":null
    }`}
    onClick={()=>{
        inputImage.current.click()
        setSelectedImage("input")
        }}>
                    {
                        !frontendImage && <BiImageAdd className='text-white w-[23px] h-[23px] ' />
                    }
                    {
                        frontendImage && <img src={frontendImage} className='h-full object-cover' />
                    }
                </div>
                 <input type="file" ref={inputImage} accept='image/*' hidden onChange={handleImage}/>
            </div>
            {selectedImage && <button className='min-w-[120px] h-[50px] bg-white rounded-full cursor-pointer text-black font-semibold text-[15px]' 
            onClick={()=>navigate("/customize2")}>
                Next
        </button>}
              
        </div>
    )
}

export default Customize
