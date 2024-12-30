import React, { useState } from "react";
import AddPost from "../components/addPost";
import { PostData } from "../context/postContext";
import PostCard from "../components/postCard";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { Loading } from '../components/loading';
import { IoAddCircle } from "react-icons/io5";

const Reels = () => {
  const { reels, loading } = PostData();
  const [index, setIndex] = useState(0);
  const [showAdd,setsShowAdd] = useState(false)
  const prevReel = () => {
    if (index === 0) {
      return null;
    }
    setIndex(index - 1);
  };

  const nextReel = () => {
    if (index === reels.length - 1) {
      return null;
    }
    setIndex(index + 1);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="bg-gray-100 p-4">
          {showAdd?<AddPost type="reel" setsShowAdd={setsShowAdd}/>:
          <div className='flex items-center justify-center bg-gray-100 py-3'>
                  <button className="px-5 py-5 rounded-full bg-gray-500" onClick={()=>setsShowAdd(true)}><IoAddCircle/></button>
                </div>
          }
          <div className="flex m-auto gap-3 w-[350px] md:w-[500px] mt-6">
            {reels && reels.length > 0 ? (
              <div className="ml-12"> {/* Slightly shift PostCard to the right */}
                <PostCard value={reels[index]} key={reels[index]._id} type={"reel"} />
              </div>
            ) : (
              <p>No Reels Yet..</p>
            )}
            <div className="button flex flex-col justify-center items-center gap-6">
              {index === 0 ? (
                ""
              ) : (
                <button
                  onClick={prevReel}
                  className="bg-gray-500 text-white py-5 px-5 rounded-full"
                >
                  <FaArrowAltCircleUp />
                </button>
              )}
              {index === reels.length - 1 ? (
                ""
              ) : (
                <button
                  onClick={nextReel}
                  className="bg-gray-500 text-white py-5 px-5 rounded-full"
                >
                  <FaArrowAltCircleDown />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reels;
