import React, { useState } from "react";
import { ChatData } from "../context/chatContext";
import axios from "axios";
import { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Chat from "../components/chat/chat";
import MessageContainer from "../components/chat/messageContainer";
import { SocketData } from "../context/socketContext";
import { groupchatData } from "../context/groupchatContext";
import { MdGroupAdd } from "react-icons/md";

const ChatPage = ({ user }) => {
  const { setselectedchat, selectedchat, setChats, chats, createChat } =
    ChatData();
  const { setselectedGroup, selectedGroup, setGroups, groups, createGroup } =
    groupchatData();

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(false);

  async function fetchAllUsers() {
    try {
      const { data } = await axios.get("/api/user/all?search=" + query);
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, [query]);

  const getAllChats = async () => {
    try {
      const { data } = await axios.get("/api/messages/chats");
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllChats();
  }, []);

  const getAllGroups = async () => {
    try {
      // console.log("called")
      const { data } = await axios.get("/api/group/allgroups");
      // console.log(data)
      setGroups(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllGroups();
  }, []);

  async function createNewChat(id) {
    await createChat(id);
    setSearch(false);
    getAllChats();
  }

  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [file, setFile] = useState("");
  const [filePrev, setFilePrev] = useState("");

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setFilePrev(reader.result);
      setFile(file);
    };
  };
  async function createNewGroup() {
    if (!groupName || selectedUsers.length === 0) {
      alert("Please enter a group name and select at least one member.");
      return;
    }
    const formdata = new FormData();
    const members = selectedUsers.map((user) => user._id);
    formdata.append("name", groupName);
    formdata.append("file", file);
    formdata.append("members", JSON.stringify(members));
    // const groupData = {
    //   name: groupName,
    //   members: selectedUsers.map((user) => user._id),
    //   file:file
    // };

    await createGroup(formdata);
    setShowModal(false);
    setGroupName("");
    setSelectedUsers([]);
    getAllGroups();
  }

  //    const toggleUserSelection = (user) => {
  //     if (selectedUsers.find((u) => u._id === user._id)) {
  //       setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  //     } else {
  //       setSelectedUsers([...selectedUsers, user]);
  //     }
  //   };
  const toggleUserSelection = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.find((u) => u._id === user._id)) {
        return prevSelectedUsers.filter((u) => u._id !== user._id);
      } else {
        return [...prevSelectedUsers, user];
      }
    });
  };

  const { onlineUsers, socket } = SocketData();
  // console.log(onlineUsers)
  // console.log(groups,chats)
  return (
    <div className="w-[100%] md:w-[750px] md:p-4">
      <div className="flex gap-4 mx-auto">
        <div className="w-[30%]">
          <div className="top">
            <button
              onClick={() => setSearch(!search)}
              className="bg-blue-500 text-white px-3 py-1 rounded-full"
            >
              {search ? "X" : <FaSearch />}
            </button>
            {!search ? (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 text-white px-3 py-1 ml-2 rounded-full"
              >
                {search ? "X" : <MdGroupAdd />}
              </button>
            ) : (
              <></>
            )}
            {search ? (
              <>
                <input
                  type="text"
                  className="custom-input"
                  style={{ width: "100px", border: "gray solid 1px" }}
                  placeholder="Enter Name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="users">
                  {users && users.length > 0 ? (
                    users.map((e) => (
                      <div
                        key={e._id}
                        onClick={() => createNewChat(e._id)}
                        className="bg-gray-400 text-white mt-2 p-2 cursor-pointer flex justify-center items-center gap-1"
                      >
                        <img
                          src={e.profilePic.url}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        {e.name}
                      </div>
                    ))
                  ) : (
                    <p>No users</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center mt-2">
                {groups.map((e) => (
                  <Chat
                    key={e._id}
                    chat={e}
                    setselectedGroup={setselectedGroup}
                    setselectedchat={setselectedchat}
                    isOnline={false}
                    isGroup={true}
                  />
                ))}
                {chats.map((e) => (
                  <Chat
                    key={e._id}
                    chat={e}
                    setselectedchat={setselectedchat}
                    setselectedGroup={setselectedGroup}
                    isOnline={onlineUsers.includes(e.users[0]._id)}
                    isGroup={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {selectedchat === null && selectedGroup === null ? (
          <div className="w-[70%] mx-20 mt-40 text-2xl">
            Hello 👋 {user.name} select a chat to start a conversation
          </div>
        ) : (
          <div className="w-[70%]">
            {selectedchat ? (
              <MessageContainer
                key={selectedchat}
                selectedchat={selectedchat}
                setChats={setChats}
                isGroup={false}
              />
            ) : (
              <MessageContainer
                key={selectedchat}
                selectedchat={selectedGroup}
                setChats={setGroups}
                isGroup={true}
              />
            )}
          </div>
        )}
      </div>
      {/* Group Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-3">Create Group</h2>
            <input
              type="text"
              placeholder="Enter group name"
              className="w-full p-2 border border-gray-300 rounded mb-3"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <input
              required
              type="file"
              className="custom-input"
              accept="image/*"
              onChange={changeFileHandler}
            />
            {filePrev && <img src={filePrev} />}
            <div className="max-h-[200px] overflow-y-auto border p-2 rounded">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-2 p-2 cursor-pointer"
                  onClick={() => toggleUserSelection(user)}
                >
                  <img
                    src={user.profilePic.url}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.name}</span>
                  {selectedUsers.find((u) => u._id === user._id) && (
                    <span className="text-green-500 font-bold ml-auto">✓</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={createNewGroup}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
