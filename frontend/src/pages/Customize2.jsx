import React from 'react'
import { useContext } from 'react'
import { userDataContext } from '../context/userContext'
import { useState } from 'react'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom'

const Customize2 = () => {
    const {userData, backendImage, selectedImage, serverUrl, setUserData} = useContext(userDataContext)
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
    const navigate= useNavigate();

    const handleUpdateAssistant = async()=>{
        try {
            let formData= new FormData()
            formData.append("assistantName", assistantName)
            if(backendImage){
                formData.append("assistantImage",backendImage)
            }else{
                formData.append("imageUrl", selectedImage)
            }
 

            const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
            console.log(result.data);
            setUserData(result.data);
            navigate("/");
            
        } catch (error) {
            console.log(error);
            
        }
    }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030346] flex justify-center items-center flex-col gap-[25px]'>
        <MdKeyboardBackspace  className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate("/customize")}/>
       <h1 className='text-white text-[30px] p-[10px]'>Enter Your Assistant Name </h1>
       <input type="text" placeholder='Assistant Name' className='w-full max-w-[500px] h-[50px]
        outline-none border-2 border-white bg-transparent text-white placeholder:text-gray-300 px-[20px] py-[10px] rounded-full '
          required onChange={(e)=> setAssistantName(e.target.value)}  value={assistantName}/>

          {assistantName && <button className='min-w-[200px] h-[50px] bg-white rounded-full cursor-pointer text-black font-semibold text-[15px]' 
            onClick={()=>{
                handleUpdateAssistant()
                
            }}>
                Create Your Assistant
        </button> }
         
    
    </div>

  )
}

export default Customize2
