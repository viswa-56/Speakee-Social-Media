// MessageContainer.jsx
import React, { useEffect, useRef, useState } from "react";
import { UserData } from "../../context/userContext";
import axios from "axios";
import { LoadingAnimation } from "../loading";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { SocketData } from "../../context/socketContext";
import { HiEllipsisVertical } from "react-icons/hi2";
import { CiCircleRemove } from "react-icons/ci";
import { MdOutlineAddModerator } from "react-icons/md";

const MessageContainer = ({ selectedchat, setChats, isGroup }) => {
  const [messages, setMessages] = useState([]);
  const { user } = UserData();
  const [loading, setLoading] = useState(false);
  const { socket } = SocketData();
  const messageContainerRef = useRef(null);
  const messagesRef = useRef(new Set()); // Track message IDs

  // Fetch messages when chat is selected
  const fetchAllMessages = async () => {
    if (!selectedchat?._id) return;
    
    setLoading(true);
    try {
      const endpoint = isGroup 
        ? `/api/group/${selectedchat._id}`
        : `/api/messages/${selectedchat.users[0]._id}`;
      
      const { data } = await axios.get(endpoint);
      
      // Reset message tracking
      messagesRef.current = new Set(data.map(msg => msg._id));
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [usersNotInGroup, setUsersNotInGroup] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleAddMemberClick = () => {
    setShowOptions(false);
    setShowModal(true);
    fetchUsersNotInGroup();
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };


  const fetchUsersNotInGroup = async () => {
    try {
      // Fetch all users
      const { data } = await axios.get('/api/user/all?search=');
      
      // Filter out users already in the group based on selectedchat._id
      const usersInGroup = selectedchat.members.map(user => user._id); // assuming users in the group are available in selectedchat
      const usersNotInGroup = data.filter(user => !usersInGroup.includes(user._id));
  
      setUsersNotInGroup(usersNotInGroup);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddMembers = async () => {
    try {
      await Promise.all(
        selectedUsers.map(async (memberId) => {
          await axios.post("/api/group/addmember", {
            groupId: selectedchat._id,
            memberId,
          });
        })
      );
      setShowModal(false);
      setSelectedUsers([]);
      console.log("Members added successfully");
    } catch (error) {
      console.error("Error adding members:", error);
    }
  };
  // Handle real-time message updates
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      // console.log("Received message:", message); // Debug log
      
      if (selectedchat?._id === message.chatId) {
        // Only add message if we haven't seen this ID before
        if (!messagesRef.current.has(message._id)) {
          messagesRef.current.add(message._id);
          setMessages(prev => [...prev, {
            ...message,
            uniqueKey: `${message._id}-${Date.now()}`
          }]);
          
          setChats(prev => prev.map(chat => {
            if (chat._id === message.chatId) {
              return {
                ...chat,
                latestMessage: {
                  text: message.text,
                  sender: message.sender,
                },
              };
            }
            return chat;
          }));
        }
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("newGroupMessage", handleNewMessage);

    if (isGroup && selectedchat?._id) {
      socket.emit("joinGroup", selectedchat._id);
    }

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newGroupMessage", handleNewMessage);
      
      if (isGroup && selectedchat?._id) {
        socket.emit("leaveGroup", selectedchat._id);
      }
    };
  }, [socket, selectedchat, setChats, isGroup]);

  // Reset messages when chat changes
  useEffect(() => {
    setMessages([]);
    messagesRef.current = new Set();
    fetchAllMessages();
  }, [selectedchat?._id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Generate a guaranteed unique key for a message
  const getMessageKey = (message) => {
    return message.uniqueKey || `${message._id}-${message.sender}-${Date.now()}`;
  };
  const [showOptions, setShowOptions] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const handleExitGroup = async () => {
    try {
      const {data} = await axios.post("/api/group/exit", { groupId: selectedchat._id });

      // Close chat if the user leaves
      setChats((prev) => prev.filter((chat) => chat._id !== selectedchat._id));
      setShowOptions(false);
      console.log("Exited the group successfully");
    } catch (error) {
      console.error("Error exiting the group:", error);
    }
  };

  const fetchGroupMembers = async () => {
    try {
      const { data } = await axios.get(`/api/group/members/${selectedchat._id}`);
      setGroupMembers(data);
      setShowMembersModal(true);
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
  };

  const handleRemoveMember= async(memberId)=>{
    try {
      const {data} = await axios.post("/api/group/removemember", { groupId: selectedchat._id ,memberId:memberId });

      setShowOptions(false);
      console.log("removed the member successfully");
    } catch (error) {
      console.error("Error removing the member:", error);
    }
  }

  const handleaddAdmin= async(memberId)=>{
    try {
      const {data} = await axios.post("/api/group/addadmin", { groupId: selectedchat._id ,newAdminId:memberId });

      fetchGroupMembers()
      setShowOptions(false);
      console.log("added the member as admin successfully");
    } catch (error) {
      console.error("Error adding the member as admin ", error);
    }
  }

  return (
    <div>
      {selectedchat && (
        <div className="flex flex-col">
          <div className="flex w-full h-12 items-center gap-3">
          {selectedchat && (
    <div className="flex flex-col">
      <div className="flex w-full h-12 items-center gap-3 relative">
        {!isGroup ? (
          <>
            <img
              src={selectedchat.users[0].profilePic.url}
              className="w-8 h-8 rounded-full"
              alt="User avatar"
            />
            <span>{selectedchat.users[0].name}</span>
          </>
        ) : (
          <>
            <img
              src="https://tse4.mm.bing.net/th?id=OIP.mlfx4V9QaUTi21obJvQ4YAAAAA&pid=Api&P=0&h=180"
              className="w-8 h-8 rounded-full"
              alt="Group avatar"
            />
            <span>{selectedchat.name}</span>
            <button 
              className="w-10 h-10 p-2 rounded-full hover:bg-gray-200"
              onClick={() => setShowOptions(!showOptions)}
            >
              <HiEllipsisVertical />
            </button>

            {/* Dropdown Menu */}
            {showOptions && (
              <div className="absolute top-12 right-2 bg-white border shadow-lg rounded-lg w-40">
                <ul className="flex flex-col text-sm">
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      handleAddMemberClick();
                    }}
                  >
                    Add Member
                  </li>
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleExitGroup}
                  >
                    Exit Group
                  </li>
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setShowOptions(false);
                      fetchGroupMembers();
                    }}
                  >
                    All Members
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )}
          </div>
          
          {loading ? (
            <LoadingAnimation />
          ) : (
            <>
              <div
                ref={messageContainerRef}
                className="flex flex-col gap-4 my-4 h-[400px] overflow-y-auto border border-gray-300 bg-gray-100 p-3"
              >
                {messages.map((message) => (
                  <Message
                    key={getMessageKey(message)}
                    message={message.text}
                    ownMessage={message.sender === user._id}
                    Sender={message.sender}
                    senderName={message.senderName}
                  />
                ))}
              </div>
              <MessageInput
                setMessages={setMessages}
                selectedchat={selectedchat}
                isGroup={isGroup}
                messagesRef={messagesRef}
              />
            </>
          )}
        </div>
      )}

{showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-80">
            <h2 className="text-lg font-bold mb-3">Add Members</h2>
            <ul className="max-h-40 overflow-y-auto border p-2 rounded">
              {usersNotInGroup.length > 0 ? (
                usersNotInGroup.map((user) => (
                  <li
                    key={user._id}
                    className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <div className="flex items-center gap-2">
                    <img
                      src={user.profilePic.url}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user.name}</span>
                    </div>
                    {selectedUsers.includes(user._id) && <span>✔</span>}
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">No users available</p>
              )}
            </ul>
            <div className="flex justify-end mt-3">
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleAddMembers}
                disabled={selectedUsers.length === 0}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Members Modal */}
      {showMembersModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-80">
            <h2 className="text-lg font-bold mb-3">Group Members</h2>
            <ul className="max-h-40 overflow-y-auto border p-2 rounded">
              {groupMembers.map((member) => (
                <li key={member._id} className="flex justify-between items-center p-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={member.profilePic.url}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{member.name}</span>
                  </div>
                  {member.isAdmin && <span className="text-red-500 text-xs">Admin</span>}
                  { selectedchat.admins.includes(user._id)?<button onClick={()=>handleRemoveMember(member._id)}><CiCircleRemove/></button>:<></>}
                  { selectedchat.admins.includes(user._id) && !selectedchat.admins.includes(member._id)?<button onClick={()=>handleaddAdmin(member._id)}><MdOutlineAddModerator/></button>:<></>}

                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-3">
              <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => setShowMembersModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;