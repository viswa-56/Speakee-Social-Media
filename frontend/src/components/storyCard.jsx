import React, { useEffect, useState } from "react";
import { UserData } from "../context/userContext";
import { StoryData } from "../context/storyContext";
import { LoadingAnimation } from "./loading";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsTrash } from "react-icons/bs";
import { IoTrashBin } from "react-icons/io5";

import { FaArrowAltCircleRight ,FaArrowAltCircleLeft } from "react-icons/fa";

const StoryCard = ({ isOpen,onClose, value}) => {
  // console.log(type)
  const { stories, loading, addStory, deleteStory } = StoryData();
  const { user } = UserData();
  const [file, setFile] = useState(null);
  const [index, setIndex] = useState(0);
  
  const prevReel = () => {
    if (index === 0) {
      return null;
    }
    setIndex(index - 1);
  };
  const nextReel = () => {
    if (index === value.stories.length - 1) {
      return null;
    }
    setIndex(index + 1);
  };
  const handleDelete=()=>{
    deleteStory(value.stories[index].storyId)
    onClose()
  }
  if(!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg p-4 shadow-lg w-64">
        <div className="flex justify-end">
          {value._id === user._id ? <button className="mr-2 text-gray-500 text-1xl z-20 ml-1" onClick={handleDelete}>
            <IoTrashBin/>
          </button>:<></>}
          <button onClick={onClose} className="text-gray-500 text-2xl z-20 ml-1">
            &times;
          </button>
        </div>
        {/*  */}
        <div className="flex justify-between items-center absolute inset-y-0 left-0 right-0 z-10">
          {index===0?<button
            onClick={prevReel}
            className="text-gray-400 text-4xl px-2 disabled"
          >
            <FaArrowAltCircleLeft />
          </button>:<button
            onClick={prevReel}
            className="text-gray-900 text-4xl px-2"
          >
            <FaArrowAltCircleLeft />
          </button>}

          {index=== value.stories.length - 1 ?<button
            onClick={nextReel}
            className="text-gray-400 text-4xl px-2 disabled"
          >
            <FaArrowAltCircleRight />
          </button>:<button
            onClick={nextReel}
            className="text-gray-900 text-4xl px-2"
          >
            <FaArrowAltCircleRight />
          </button>}
        </div>
        {/*  */}
        <div className="flex flex-col space-y-2 mt-2 mb-4">
          {value.stories[index].type === "post" ? (
            <img
              src={value.stories[index].story.url}
              alt=""
              className="object-cover rounded-md"
            />
          ) : (
            <video
              src={value.stories[index].story.url}
              alt=""
              className="w-[450px] h-[600px] object-cover rounded-md"
              autoPlay
              controls
            />
          )}
        </div>
      </div>
    </div>

  );
};

export default StoryCard;
