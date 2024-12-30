import React, { useState } from 'react'
import { ChatData } from '../context/chatContext'
import axios from 'axios'
import { useEffect } from 'react'
import { FaSearch } from "react-icons/fa";
import Chat from '../components/chat/chat';
import MessageContainer from '../components/chat/messageContainer';
import { SocketData } from '../context/socketContext';

const ChatPage = ({user}) => {
    const {setselectedchat,selectedchat,setChats,chats,createChat} = ChatData()

    const [users,setUsers] = useState([])
    const [query,setQuery] = useState("")
    const [search,setSearch] = useState(false)

    async function fetchAllUsers() {
        try {
            const {data} = await axios.get("/api/user/all?search="+query)
            setUsers(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchAllUsers()
    },[query])

    const getAllChats = async()=>{
        try {
            const {data} = await axios.get('/api/messages/chats')
            setChats(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getAllChats()
    },[])

    async function createNewChat(id) {
        await createChat(id)
        setSearch(false)
        getAllChats()
    }

    const {onlineUsers , socket} = SocketData()
    // console.log(onlineUsers)

  return (
    <div className="w-[100%] md:w-[750px] md:p-4">
        <div className="flex gap-4 mx-auto">
            <div className="w-[30%]">
                <div className="top">
                    <button onClick={()=>setSearch(!search)} className='bg-blue-500 text-white px-3 py-1 rounded-full'>{search?"X":<FaSearch/>}</button>
                
                    {
                        search?(
                        <>
                            <input type="text" className='custom-input' style={{width:"100px",border:"gray solid 1px"}} placeholder='Enter Name' value={query} onChange={(e)=>setQuery(e.target.value)}/>
                            <div className="users">
                                {users && users.length>0?(users.map((e)=>(
                                    <div key={e._id} onClick={()=> createNewChat(e._id)} className="bg-gray-400 text-white mt-2 p-2 cursor-pointer flex justify-center items-center gap-1">
                                        <img src={e.profilePic.url} alt="" className='w-8 h-8 rounded-full'/>
                                        {e.name}
                                    </div>
                                ))):
                                <p>No users</p>}
                            </div>
                        </>):
                        <div className='flex flex-col justify-center items-center mt-2'>
                            {
                                chats.map(e=>(
                                    <Chat key={e._id} chat={e} setselectedchat={setselectedchat} isOnline={onlineUsers.includes(e.users[0]._id)}/>
                                ))
                            }
                        </div>
                    }

                </div>
            </div>
            {
                selectedchat === null ?( 
                <div className="w-[70%] mx-20 mt-40 text-2xl">Hello 👋 {user.name} select a chat to start a conversation</div> 
                ):(
                <div className="w-[70%]">
                    <MessageContainer selectedchat={selectedchat} setChats={setChats}/>
                </div>)
                }
            
        </div>
    </div>
  )
}

export default ChatPage
