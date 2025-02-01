// MessageInput.jsx
import React, { useState } from "react";
import { ChatData } from "../../context/chatContext";
import toast from "react-hot-toast";
import axios from "axios";

const MessageInput = ({ setMessages, selectedchat, isGroup, messagesRef }) => {
  const [textmsg, setTextmsg] = useState("");
  const { setChats } = ChatData();
  const [sending, setSending] = useState(false);

  const handleMessage = async (e) => {
    e.preventDefault();
    if (!textmsg.trim() || sending) return;

    const tempId = `temp-${Date.now()}`;
    setSending(true);
    
    try {
      const endpoint = isGroup 
        ? "/api/group/sendmsg"
        : "/api/messages/";
      
      const payload = isGroup 
        ? { groupId: selectedchat._id, message: textmsg }
        : { recieverId: selectedchat.users[0]._id, message: textmsg };

      const { data } = await axios.post(endpoint, payload);
      
      // Add message ID to tracking Set
      if (data._id && !messagesRef.current.has(data._id)) {
        messagesRef.current.add(data._id);
        setMessages(prev => [...prev, {
          ...data,
          uniqueKey: `${data._id}-${Date.now()}`
        }]);
      }
      
      setTextmsg("");
      
      setChats(prev => prev.map(chat => {
        if (chat._id === selectedchat._id) {
          return {
            ...chat,
            latestMessage: {
              text: textmsg,
              sender: data.sender,
            },
          };
        }
        return chat;
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleMessage} className="flex gap-2">
      <input
        type="text"
        placeholder="Enter Message"
        className="border border-gray-300 rounded-lg p-2 flex-grow"
        value={textmsg}
        onChange={(e) => setTextmsg(e.target.value)}
        disabled={sending}
        required
      />
      <button 
        type="submit" 
        className="bg-blue-500 text-white p-2 rounded-lg min-w-[80px]"
        disabled={sending}
      >
        {sending ? "..." : "Send"}
      </button>
    </form>
  );
};

export default MessageInput;