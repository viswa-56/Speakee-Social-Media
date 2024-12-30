import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";

// Context imports (adjust as per your actual context setup)
import { PostData } from "../context/postContext";
import { UserData } from "../context/userContext";

// Component imports
import PostCard from "../components/postCard";
import { Loading } from "../components/loading";
import Modal from "../components/modal";

const UserAccount = ({ user: loggedInUser }) => {
  // Hooks and state management
  const navigate = useNavigate();
  const params = useParams();
  const { posts, reels } = PostData();
  const { followuser } = UserData();

  // State variables
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [follow, setFollow] = useState(false);
  const [viewType, setViewType] = useState("post");
  const [reelIndex, setReelIndex] = useState(0);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingsModal, setShowFollowingsModal] = useState(false);
  const [followData, setFollowData] = useState({
    followers: [],
    followings: [],
  });

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user/${params.id}`);
      setUser(data);

      // Check if logged-in user is already following
      const isFollowing = data.followers.includes(loggedInUser._id);
      setFollow(isFollowing);
    } catch (err) {
      setError("Failed to fetch user data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch follow data
  const fetchFollowData = async () => {
    if (!user?._id) return;

    try {
      const { data } = await axios.get(`/api/user/followdata/${user._id}`);
      setFollowData({
        followers: data.followers || [],
        followings: data.followings || [],
      });
    } catch (err) {
      console.error("Failed to fetch follow data", err);
    }
  };

  // Handle follow/unfollow
  const handleFollowToggle = () => {
    setFollow(!follow);
    followuser(user._id, fetchUserData);
  };

  // Reel navigation
  const navigateReel = (direction) => {
    const myReels = reels.filter((reel) => reel.owner._id === user._id);

    if (direction === "next" && reelIndex < myReels.length - 1) {
      setReelIndex((prev) => prev + 1);
    } else if (direction === "prev" && reelIndex > 0) {
      setReelIndex((prev) => prev - 1);
    }
  };

  // Fetch data on component mount and when user ID changes
  useEffect(() => {
    fetchUserData();
  }, [params.id]);

  // Fetch follow data when user is available
  useEffect(() => {
    if (user?._id) {
      fetchFollowData();
    }
  }, [user]);

  // Filter user's posts and reels
  const userPosts = posts?.filter((post) => post.owner._id === user?._id) || [];
  const userReels = reels?.filter((reel) => reel.owner._id === user?._id) || [];

  // Render loading state
  if (loading) return <Loading />;

  // Render error state
  if (error) return <div className="text-red-500">{error}</div>;

  // Render user account
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center pt-3 pb-14">
      {/* Followers Modal */}
      {showFollowersModal && (
        <Modal
          value={followData.followers}
          title="Followers"
          setShow={setShowFollowersModal}
        />
      )}

      {showFollowingsModal && (
        <Modal
          value={followData.followings}
          title="Followings"
          setShow={setShowFollowingsModal}
        />
      )}

      {/* User Profile Section */}
      <div className="bg-white flex justify-between gap-5 p-8 rounded-lg shadow-md max-w-md">
        <div className="image flex flex-col justify-between mb-4 gap-4">
          <img
            src={user.profilePic.url}
            alt="Profile"
            className="w-[180px] h-[180px] rounded-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-gray-800 font-semibold">{user.name}</p>
          <p className="text-gray-500 font-sm">{user.email}</p>
          <p className="text-gray-500 font-sm">{user.gender}</p>
          <p
            onClick={() => setShowFollowersModal(true)}
            className="text-gray-500 font-sm cursor-pointer"
          >
            {user.followers.length} Followers
          </p>
          <p
            onClick={() => setShowFollowingsModal(true)}
            className="text-gray-500 font-sm cursor-pointer"
          >
            {user.followings.length} Followings
          </p>

          {user._id !== loggedInUser._id && (
            <button
              onClick={handleFollowToggle}
              className={`py-2 px-5 text-white rounded-md ${
                follow ? "bg-red-500" : "bg-blue-400"
              }`}
            >
              {follow ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {/* Content Type Selector */}
      <div className="controls flex justify-center items-center p-4 bg-white rounded-md gap-7">
        <button onClick={() => setViewType("post")}>Posts</button>
        <button onClick={() => setViewType("reel")}>Reels</button>
      </div>

      {/* Posts or Reels Display */}
      {viewType === "post" ? (
        userPosts.length > 0 ? (
          userPosts.map((post) => (
            <PostCard type="post" value={post} key={post._id} />
          ))
        ) : (
          <p>No posts yet...</p>
        )
      ) : userReels.length > 0 ? (
        <div className="flex justify-center items-center gap-3">
          <PostCard
            type="reel"
            value={userReels[reelIndex]}
            key={userReels[reelIndex]._id}
          />
          <div className="button flex flex-col justify-center items-center gap-6">
            {reelIndex > 0 && (
              <button
                onClick={() => navigateReel("prev")}
                className="bg-gray-500 text-white py-5 px-5 rounded-full"
              >
                <FaArrowAltCircleUp />
              </button>
            )}
            {reelIndex < userReels.length - 1 && (
              <button
                onClick={() => navigateReel("next")}
                className="bg-gray-500 text-white py-5 px-5 rounded-full"
              >
                <FaArrowAltCircleDown />
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>No Reels yet...</p>
      )}
    </div>
  );
};

export default UserAccount;
