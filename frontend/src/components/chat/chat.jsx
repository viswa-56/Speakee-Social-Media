import React from 'react';
import { UserData } from "../../context/userContext";
import { BsSendCheck } from "react-icons/bs";

const Chat = ({ chat, setselectedchat, isOnline }) => {
  const { user: loggedInUser } = UserData();
  let user;

  if (chat) user = chat.users[0];

  // console.log(chat)
  return (
    <div>
      {user && (
        <div
          className="bg-gray-200 py-3 px-4 rounded-md cursor-pointer mt-3 w-full sm:w-[200px] flex-shrink-0 flex flex-col justify-between"
          onClick={() => setselectedchat(chat)}
          style={{ minHeight: "70px", maxWidth: "100%" }}
        >
          {/* Top Section */}
          <div className="flex items-center gap-3">
            {isOnline && (
              <div
                className="w-3 h-3 rounded-full bg-green-400"
                title="Online"
              ></div>
            )}
            <img
              src={user.profilePic.url}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="truncate font-semibold text-gray-700 flex-grow">
              {user.name}
            </span>
          </div>

          {/* Bottom Section */}
          <div
            className="flex items-center gap-2 text-sm mt-2 text-gray-600"
            style={{ overflow: "hidden" }}
          >
            {loggedInUser._id === chat.latestMessage.sender && (
              <BsSendCheck className="text-blue-500" />
            )}
            <span className="truncate">
              {chat.latestMessage.text.slice(0, 18)}...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
