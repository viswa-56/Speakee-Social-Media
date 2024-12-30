import React, { useState } from 'react'
import { ChatData } from '../../context/chatContext'
import toast from 'react-hot-toast'
import axios from 'axios'
// import { text } from 'express'

const MessageInput = ({setMessages,selectedchat}) => {
  const [textmsg,setTextmsg] =useState("")
  const {setChats} = ChatData()

  const handleMessage =async(e)=>{
    e.preventDefault()
    try {
        const {data} = await axios.post('/api/messages/',{
            recieverId:selectedchat.users[0]._id,
            message: textmsg
        })        
        setMessages((message)=>[...message,data]);
        setTextmsg("")
        setChats((prev)=>{
            const updatedChat = prev.map((chat)=>{
                if (chat._id === selectedchat._id){
                    return {
                        ...chat,
                        latestMessage:{
                            text:textmsg,
                            sender:data.sender,
                        }
                    }
                }
                return chat;
            })
            return updatedChat;
        })
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error)
    }

  }
    return (
    <div>
        <form onSubmit={handleMessage}>
            <input type="text" placeholder='Enter Message' className='border border-gray-300 rounded-lg p-2 w-[80%]' value={textmsg} onChange={(e)=>setTextmsg(e.target.value)} required/>
            <button type='submit' className='bg-blue-500 text-white p-2 rounded-lg'>Send</button>
        </form>
    </div>
  )
}

export default MessageInput
