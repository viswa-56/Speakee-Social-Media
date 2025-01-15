import React, { useState } from "react";
import AddPost from "../components/addPost";
import { PostData } from "../context/postContext";
import PostCard from "../components/postCard";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { Loading } from '../components/loading';
import { IoAddCircle } from "react-icons/io5";
import { StoryData } from "../context/storyContext";
import AddStory from "../components/addStory";
import StoryCard from "../components/storyCard"; // Import the StoryCard component

const Reels = () => {
  const { reels, loading } = PostData();
  const [index, setIndex] = useState(0);
  const [showAdd,setsShowAdd] = useState(false)
  const { stories } = StoryData();
  const [selectedStory, setSelectedStory] = useState(null); // For showing the clicked story
    const [buttonstory,setButtonstory] = useState(false)
    const [buttonpost,setButtonpost] = useState(false)
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
          {/* {showAdd?<AddPost type="reel" setsShowAdd={setsShowAdd}/>:
          <div className='flex items-center justify-center bg-gray-100 py-3'>
                  <button className="px-5 py-5 rounded-full bg-gray-500" onClick={()=>setsShowAdd(true)}><IoAddCircle/></button>
                </div>
          } */}

          {showAdd ? <>
            {buttonpost !== true && buttonstory !== true ? <>
              <div className="bg-gray-100 flex items-center justify-center pt-3 pb-5">
                <div className="bg-purple-50 p-8 rounded-lg shadow-md max-w-md flex flex-col justify-center gap-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={()=>{setButtonstory(false);
                  setButtonpost(true)
                }}>
                Add Post
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={()=>{setButtonstory(true);
                  setButtonpost(false)
                }}>
                Add Story
              </button>
                </div>
              </div>
            </> : 
            <>
            {
              buttonpost ? <AddPost type="reel" setsShowAdd={setsShowAdd} /> :
              <AddStory type="reel" setsShowAdd={setsShowAdd}/>
            }
            </>}
            </> : (
            <div className="flex items-center justify-strech bg-gray-100 py-3">
              <div className="pl-2">
                <button
                  className="px-4 py-4 rounded-full bg-gray-500"
                  onClick={() => setsShowAdd(true)}
                >
                  <IoAddCircle />
                </button>
              </div>
              <div className="mx-1 flex items-center space-x-3">
                {/* Display user profile pics for stories */}
                {stories &&
                  stories.length > 0 &&
                  stories.map((story) => (
                    // console.log(story)
                    <button
                      key={story._id}
                      onClick={() => setSelectedStory(story)} // Open the StoryCard
                      className="w-12 h-12 rounded-full border-2 border-purple-500"
                    >
                      <img
                        src={story.ownerProfilePic}
                        alt={story.ownerName}
                        className="w-full h-full object-cover rounded-full"
                      />
                      <p className="w-1 h-1">{story.ownerName}</p>
                    </button>
                  ))}
              </div>
            </div>
          )}
          {/* Show the clicked StoryCard */}
          {selectedStory && (
            <div className="flex items-center justify-center">
              <StoryCard value={selectedStory} 
              isOpen={true}
              onClose={() => setSelectedStory(null)}
              type={selectedStory.stories[0].type}/>
            </div>
          )}

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
