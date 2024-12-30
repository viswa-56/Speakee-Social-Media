import React, { useState } from 'react'
import AddPost from "../components/addPost";
import PostCard from '../components/postCard';
import { PostData } from '../context/postContext';
import { Loading } from '../components/loading';
import { IoAddCircle } from "react-icons/io5";

const Home = () => {
  const {posts,loading} = PostData()
  const [showAdd,setsShowAdd] = useState(false)
  return (
    <>
    {loading?<Loading/>:<div>
      {showAdd?<AddPost type="post" setsShowAdd={setsShowAdd}/>:
      <div className='flex items-center justify-center bg-gray-100 py-3'>
        <button className="px-5 py-5 rounded-full bg-gray-500" onClick={()=>setsShowAdd(true)}><IoAddCircle/></button>
      </div>
      }
      {posts && posts.length>0 ? (posts.map((e)=>
        <PostCard value={e} key={e._id} type={"post"}/>
      )):(<p>No posts Yet..</p>)}
    </div>}
    </>
  )
}

export default Home
