import React, { useState } from "react";
import axios from "axios";
import { UserData } from "../../context/userContext";
const Message = ({ message, ownMessage, Sender,senderName }) => {
  // console.log(Name)
  const [name, setName] = useState();

  async function fetchuser() {
    try {
      const { data } = await axios.get("/api/user/" + Sender);
      setName(data.name);
      // setisAuth(true)
      // setLoading(false)
    } catch (error) {
      console.log(error);
      // setisAuth(false)
      // setLoading(false)
    } finally {
      // setLoading(false); // Always set loading to false, even if there is an error.
    }
  }
  // if (!senderName){
  //   fetchuser();
  // }
  return (
    <div className={`mb-2 ${ownMessage ? "text-right" : "text-left"}`}>
      {/* <span className={`inline-block rounded-lg text-black`}> Name </span> */}

      <span
        className={`inline-block p-2 rounded-lg ${
          ownMessage ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        <p className={`${ownMessage ? "text-black" : "text-orange-950"} font-serif`}>{ownMessage ? "You" : senderName}</p>
        {message}
      </span>
    </div>
  );
};

export default Message;
