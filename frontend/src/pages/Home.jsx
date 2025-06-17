import React, { useRef, useState, useEffect, useContext } from 'react';
import { userDataContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ai from "../assets/AI.gif";
import voice from "../assets/Voice.gif";
import { HiOutlineMenu } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";

const Home = () => {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch (error) {
      if (!error.message.includes("start")) {
        console.error("recognition error:", error);
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      startRecognition();
    };
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    const openNewTab = (url) => window.open(url, '_blank');

    switch (type) {
      case 'google-search':
        openNewTab(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`);
        break;
      case 'calculator-open':
        openNewTab(`https://www.google.com/search?q=calculator`);
        break;
      case 'instagram-open':
        openNewTab(`https://www.instagram.com/`);
        break;
      case 'facebook-open':
        openNewTab(`https://www.facebook.com/`);
        break;
      case 'weather-show':
        openNewTab('https://www.google.com/search?q=weather');
        break;
      case 'youtube-search':
      case 'youtube-play':
        openNewTab(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.log('Start error:', error);
          }
        }
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition();
      }
    }, 10000);

    safeRecognition();

    return () => {
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
      clearInterval(fallback);
    };
  }, []);

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#030346] flex justify-center items-center flex-col gap-[20px] overflow-hidden relative'>
      
      {/* Mobile Hamburger Menu */}
      <HiOutlineMenu
        className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] z-50'
        onClick={() => setHam(true)}
      />
      <div className={`absolute lg:hidden top-0 w-full h-full bg-black/50 backdrop-blur-lg flex flex-col gap-[20px] items-start px-[30px] py-[30px] z-40
        ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
        
        <RxCross2
          className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]'
          onClick={() => setHam(false)}
        />

        <button className='min-w-[120px] h-[50px] bg-white rounded-full text-black font-semibold text-[15px]'
          onClick={handleLogout}>
          Log Out
        </button>
        <button className='min-w-[200px] h-[50px] bg-white rounded-full text-black font-semibold text-[15px]'
          onClick={() => navigate("/customize")}>
          Customize Your Assistant
        </button>
        <div className='w-full h-[2px] bg-gray-400' />
        <h1 className='text-white font-semibold text-[19px]'>History</h1>
        <div className='w-full h-[700px] gap-[15px] overflow-y-auto flex flex-col'>
          {
            userData.history && userData.history.length > 0 ? (
              [...userData.history].reverse().map((his, index) => (
                <span
                  key={index}
                  className='text-gray-200 text-[16px] bg-white/10 px-4 py-2 rounded-md break-words'
                >
                  {his}
                </span>
              ))
            ) : (
              <p className='text-gray-400'>No history found.</p>
            )
          }
        </div>
      </div>

      {/* Desktop Buttons + Toggle History */}
      <div className='hidden lg:flex flex-col gap-4 absolute top-[20px] right-[20px] items-end'>
        <button className='min-w-[120px] h-[50px] bg-white rounded-full text-black font-semibold text-[15px]'
          onClick={handleLogout}>
          Log Out
        </button>
        <button className='min-w-[200px] h-[50px] bg-white rounded-full text-black font-semibold text-[15px]'
          onClick={() => navigate("/customize")}>
          Customize Your Assistant
        </button>
        <button className='min-w-[120px] h-[40px] bg-white rounded-full text-black font-medium text-[14px]'
          onClick={() => setShowHistory(prev => !prev)}>
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {/* Desktop History Section */}
      {
  showHistory && (
    <div className='hidden lg:flex flex-col w-[600px] max-h-[400px] overflow-y-auto bg-white/10 text-white p-6 rounded-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-3 shadow-xl border border-white/20 backdrop-blur-md'>
      <h2 className='text-lg font-semibold mb-2'>Interaction History</h2>
      {
        userData.history && userData.history.length > 0 ? (
          [...userData.history].reverse().map((his, index) => (
            <span key={index} className='text-sm bg-white/10 px-4 py-2 rounded-md break-words'>
              {his}
            </span>
          ))
        ) : (
          <p className='text-gray-400'>No history found.</p>
        )
      }
    </div>
  )
}


      {/* Assistant Display */}
      <div className='w-[250px] h-[300px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
      </div>
      <h1 className='text-white text-[25px] font-semibold'>I am {userData?.assistantName}</h1>
      {!aiText && <img src={ai} alt="" className='w-[200px]' />}
      {aiText && <img src={voice} alt="" className='w-[200px]' />}
      <h1 className='text-white text-[18px] font-semibold text-wrap max-w-[700px] text-center px-4'>
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
};

export default Home;
