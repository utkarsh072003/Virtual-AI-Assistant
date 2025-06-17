import React, { useContext, useState } from 'react'
import bg from "../assets/authBg.png"
import { IoEyeSharp, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom"
import { userDataContext } from '../context/userContext';
import axios from "axios"

const SignUp = () => {

  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { serverUrl,userData, setUserData } = useContext(userDataContext)
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`, {
        name, email, password
      }, { withCredentials: true });
      setUserData(result.data)
      setLoading(false);
      navigate("/customize")

    } catch (error) {
      console.log(error);
      setUserData(null); 
      setErr(error.response.data.message)
      setLoading(false);
    }
  }

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
      <form className='w-[70%] h-[500px] max-w-[400px] bg-black/40 backdrop-blur shadow-lg shadow-black rounded-2xl
       flex flex-col items-center justify-center gap-10 px-[15px]' onSubmit={handleSignUp}>
        <h1 className='text-white text-[25px] font-semibold mb-[10px]'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>
        <input type="text" placeholder='Enter Your Name' className='w-full h-[50px]
        outline-none border-2 border-white bg-transparent text-white placeholder:text-gray-300 px-[20px] py-[10px] rounded-full '
          required onChange={(e) => setName(e.target.value)} value={name} />
        <input type="email" placeholder='Email' className='w-full h-[50px]
        outline-none border-2 border-white bg-transparent text-white placeholder:text-gray-300 px-[20px] py-[10px] rounded-full'
          required onChange={(e) => setEmail(e.target.value)} value={email} />
        <div className='w-full h-[50px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
          <input type={showPassword ? "text" : "password"} placeholder='Password' className='w-full h-full rounded-full outline-none bg-transparent placeholder:text-gray-300 px-[20px] py-[10px]'
            required onChange={(e) => setPassword(e.target.value)} value={password} />
          {
            !showPassword && <IoEyeSharp className='absolute top-[13px] right-[20px] h-[20px] w-[20px] text-white cursor-pointer'
              onClick={() => setShowPassword(true)} />
          }
          {
            showPassword && <IoEyeOff className='absolute top-[13px] right-[20px] h-[20px] w-[20px] text-white cursor-pointer'
              onClick={() => setShowPassword(false)} />
          }
        </div>
        {err.length>0 && <p className='text-red-400'>*{err}</p> }
        <button className='min-w-[120px] h-[50px] bg-white rounded-full text-black font-semibold text-[15px]' disabled={loading} >
          {loading ? "Loading...." : "Sign Up"}
        </button>
        <div className='flex gap-1 text-white text-[20px]'>
          <p>Already have an account?</p>
          <span className='text-blue-500 cursor-pointer' onClick={() => navigate("/signin")}>Sign In</span>
        </div>

      </form>

    </div>
  )
}

export default SignUp
