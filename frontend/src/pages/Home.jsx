import React, { useState } from "react";
import AddPost from "../components/addPost";
import PostCard from "../components/postCard";
import { PostData } from "../context/postContext";
import { StoryData } from "../context/storyContext";
import { Loading } from "../components/loading";
import { IoAddCircle } from "react-icons/io5";
import StoryCard from "../components/storyCard"; // Import the StoryCard component
import AddStory from "../components/addStory";
const Home = () => {
  const { posts, loading } = PostData();
  const { stories } = StoryData(); // Assuming stories are fetched from a context
  const [showAdd, setsShowAdd] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null); // For showing the clicked story
  const [buttonstory,setButtonstory] = useState(false)
  const [buttonpost,setButtonpost] = useState(false)
  // const [storyModal,showStoryModal] = useState(false)
  // console.log(stories)
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          {/* {showStoryModal && (
        <StoryCard
          selectedStory={selectedStory}
          setShow={showStoryModal}
          type="post"
        />
      )} */}
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
              buttonpost ? <AddPost type="post" setsShowAdd={setsShowAdd} /> :
              <AddStory type="post" setsShowAdd={setsShowAdd}/>
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
              // type={selectedStory.stories[0].type}

              />
            </div>
          )}
          {posts && posts.length > 0 ? (
            posts.map((e) => <PostCard value={e} key={e._id} type={"post"} />)
          ) : (
            <p>No posts Yet..</p>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
