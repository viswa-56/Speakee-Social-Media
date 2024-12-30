import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {AiOutlineHome ,AiFillHome} from 'react-icons/ai'
import { BsFillCameraReelsFill ,BsCameraReels  } from "react-icons/bs";
import { IoSearchCircleOutline,IoSearchCircle  } from "react-icons/io5";
import { PiChatsCircleLight,PiChatsCircleFill  } from "react-icons/pi";
import { RiAccountCircleLine ,RiAccountCircleFill } from "react-icons/ri";

const NavigationBar = () => {
    const [tab,setTab] = useState(window.location.pathname);
  return (
    <div className="fixed bottom-0 w-full bg-white py-3">
        <div className="flex justify-around">
            <Link to={'/'} onClick={()=>setTab('/')}className="flex flex-col items-center text-2xl">
                <span>
                    {tab==="/"?<AiFillHome/>:<AiOutlineHome/>}
                </span>
            </Link>
            <Link to={'/reels'} onClick={()=>setTab('/reels')} className="flex flex-col items-center text-2xl">
                <span>
                {tab==="/reels"?<BsFillCameraReelsFill/>:<BsCameraReels/>}
                </span>
            </Link>
            <Link to={'/search'} onClick={()=>setTab('/search')} className="flex flex-col items-center text-2xl">
                <span>
                {tab==="/search"?<IoSearchCircle/>:<IoSearchCircleOutline/>}
                </span>
            </Link>
            <Link to={'/chat'} onClick={()=>setTab('/chat')} className="flex flex-col items-center text-2xl">
                <span>
                {tab==="/chat"?<PiChatsCircleFill/>:<PiChatsCircleLight/>}
                </span>
            </Link>
            <Link to={'/account'} onClick={()=>setTab('/account')} className="flex flex-col items-center text-2xl">
                <span>
                {tab==="/account"?<RiAccountCircleFill/>:<RiAccountCircleLine/>}
                </span>
            </Link>
        </div>
    </div>
  )
}

export default NavigationBar
