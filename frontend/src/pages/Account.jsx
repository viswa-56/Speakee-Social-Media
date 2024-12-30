import React, { useState ,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { UserData } from '../context/userContext'
import { PostData } from '../context/postContext'
import PostCard from '../components/postCard'
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import {Loading} from "../components/loading"
import Modal from "../components/modal";
import axios from "axios";
import {CiEdit} from "react-icons/ci"
import toast from 'react-hot-toast'

const Account = ({user}) => {

    const navigate = useNavigate()
    const {logoutUser,updateprofilepic,updateprofilename} = UserData();
    const {posts,reels,loading} = PostData();
    const logoutHandler =()=>{
        logoutUser(navigate);
    }

    const [index, setIndex] = useState(0);
    let myposts;
    let myreels;
    if(posts){
        myposts = posts.filter((post)=> post.owner._id === user._id);
    }

    if(reels){
        myreels = reels.filter((reel)=> reel.owner._id === user._id);
    }   
    // console.log(myreels)
    const [type,settype] = useState("post")
    
      const prevReel = () => {
        if (index === 0) {
          return null;
        }
        setIndex(index - 1);
      };
    
      const nextReel = () => {
        if (index === myreels.length - 1) {
          return null;
        }
        setIndex(index + 1);
      };
      const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingsModal, setShowFollowingsModal] = useState(false);
  const [followData, setFollowData] = useState({
    followers: [],
    followings: [],
  });

  // Fetch follow data
  const fetchFollowData = async () => {
    if (!user?._id) return;

    try {
      const { data } = await axios.get(`/api/user/followdata/${user._id}`);
      setFollowData({
        followers: data.followers || [],
        followings: data.followings || [],
      });
    } catch (err) {
      console.error("Failed to fetch follow data", err);
    }
  };
  
  const [file,setFile] = useState("")
  const changeFileHandler = (e)=>{
    const file = e.target.files[0]
    setFile(file)
  }

  const changeImageHandler=()=>{
    const formdata =new FormData()
    formdata.append("file",file)
    updateprofilepic(user._id,formdata,setFile)
    setUpdatepic(false)
  }

    // Fetch follow data when user is available
    useEffect(() => {
      if (user?._id) {
        fetchFollowData();
      }
    }, [user]);

    const [showInput,setshowInput] = useState(false)
    const [name,setName] = useState(user.name?user.name:"")
    const updateName =()=>{
      updateprofilename(user._id,name,setshowInput)
    }
    const [showUpdatePassword,setShowUpdatePassword] = useState(false)
    
    const [oldPassword,setoldpassword] = useState("")
    const [newPassword,setnewpassword] = useState("")

    async function updatePassword(e) {
      e.preventDefault()
      try {
        const {data} = await axios.post('/api/user/'+user._id,{oldPassword,newPassword})
        toast.success(data.message)
        setoldpassword("")
        setnewpassword("")
        setShowUpdatePassword(false)
      } catch (error) {
        toast.error(error.response.data.message)
      }
    }

    const [updatepic,setUpdatepic] = useState(false)

    return (
    <>
    {user && (
        <>
        {loading ? <Loading/>:<div className='bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center pt-3 pb-14'>
        
          {showFollowersModal && (
        <Modal
          value={followData.followers}
          title="Followers"
          setShow={setShowFollowersModal}
        />
      )}
      {showFollowingsModal && (
        <Modal
          value={followData.followings}
          title="Followings"
          setShow={setShowFollowingsModal}
        />
      )}
        <div className="bg-white flex justify-between gap-5 p-8 rounded-lg shadow-md max-w-md">
            <div className="image flex flex-col justify-between mb-4 gap-4">
                <img src={user.profilePic.url} alt="No profile pic" className='w-[180px] h-[180px] rounded-full'/>
                {updatepic?<div className="update w-[150px] flex flex-col ml-12 justify-center items-center">
                <input type="file" onChange={changeFileHandler} required/>
                <button className="bg-blue-500 text-white px-3 py-2" onClick={changeImageHandler}>Update Profile</button>
                <button className="bg-red-500 text-white my-2 px-3 py-2" onClick={()=>setUpdatepic(false)}>Cancel</button>
                </div>:
                <button className="bg-blue-500 text-white px-3 py-2" onClick={()=>setUpdatepic(true)}>Update Pic</button>}
            </div>
            <div className="flex flex-col gap-2">
                {showInput?<>
                  <div className="flex justify-center items-center gap-2">
                    <input type="text" value={name} placeholder="enter name" required onChange={(e)=>setName(e.target.value)} className='custom-input' style={{width:"80px"}}/>
                    <button onClick={updateName}>Update</button>
                    <button onClick={()=>setshowInput(false)} className='bg-red-400 text-white p-2 rounded-full'>X</button>
                  </div>
                </>:<p className='text-gray-800 font-semibold'>{user.name} <button onClick={()=>setshowInput(true)}><CiEdit/></button></p>}
                <p className='text-gray-500 font-sm'>{user.email}</p>
                <p className='text-gray-500 font-sm'>{user.gender}</p>
                <p onClick={() => setShowFollowersModal(true)} className='text-gray-500 font-sm cursor-pointer'>{user.followers.length} Followers</p>
                <p onClick={() => setShowFollowingsModal(true)} className='text-gray-500 font-sm cursor-pointer'>{user.followings.length} Followings</p>
                <button className='bg-red-500 text-white rounded-md' onClick={logoutHandler}>Logout</button>
            </div>
        </div>
        <button className='bg-blue-500 px-2 py-1 rounded-sm text-white' onClick={()=>setShowUpdatePassword(!showUpdatePassword)}>{showUpdatePassword?"X":"Update Password"}</button>
        {showUpdatePassword && <form onSubmit={updatePassword} className='flex justify-center items-center flex-col bg-white p-2 rounded-sm gap-4'>
          <input type="password" value={oldPassword} onChange={(e)=>setoldpassword(e.target.value)} className='custom-input' placeholder='Old password' required/>
          <input type="password" value={newPassword} onChange={(e)=>setnewpassword(e.target.value)}  className='custom-input' placeholder='New password' required/>
          <button type="submit" className='bg-blue-500 px-2 py-1 rounded-sm text-white'>Update Password</button>
          </form>
        }
        <div className="controls flex justify-center items-center p-4 bg-white rounded-md gap-7">
        <button onClick={()=>settype("post")}>Posts</button>
        <button onClick={()=>settype("reel")}>Reels</button>
        </div>

        {type ==="post"?<>
            {myposts && myposts.length>0? ( myposts.map((e)=>(
                <PostCard type={"post"} value={e} key={e._id} />
            )) ): (
                <p>No posts Yet..</p>
            )}
        </>:<>
        {myreels && myreels.length> 0? ( 
            <div className='flex justify-center items-center gap-3'>
              <div className="ml-12">
             <PostCard type={"reel"} value={myreels[index]} key={myreels[index]._id} />
             </div>
                    <div className="button flex flex-col justify-center items-center gap-6">
                      {index===0?"":<button
                        onClick={prevReel}
                        className="bg-gray-500 text-white py-5 px-5 rounded-full"
                      >
                        <FaArrowAltCircleUp/>
                      </button>}
                      {index===myreels.length - 1?"":<button
                        onClick={nextReel}
                        className="bg-gray-500 text-white py-5 px-5 rounded-full"
                      >
                        <FaArrowAltCircleDown />
                      </button>}
                    </div>
            </div>
         ): (
                <p>No Reels Yet..</p>
            )}
        </>}
    </div>}
    
    </>
    )}
    </>
  )
}

export default Account
