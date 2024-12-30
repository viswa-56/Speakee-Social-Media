import axios from "axios";
import { Children, createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const chatContext = createContext();

export const ChatContextProvider = ({children})=>{
    
    const [chats,setChats] = useState([])
    const [selectedchat,setselectedchat] = useState(null)

    async function createChat(id) {
        try {
            const {data} =await axios.post("/api/messages/",{recieverId :id,message:"hi"})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    return <chatContext.Provider value={{setselectedchat,selectedchat,setChats,chats,createChat}}>{children}</chatContext.Provider> 
}

export const ChatData = () => useContext(chatContext)