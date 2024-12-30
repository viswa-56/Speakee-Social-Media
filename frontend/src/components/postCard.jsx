import React, { useEffect, useState } from "react";
import { BsChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { UserData } from "../context/userContext";
import { PostData } from "../context/postContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import SimpleModal from "./simpleModal";
import { LoadingAnimation } from "./loading";
import toast from "react-hot-toast";
import axios from "axios";

const PostCard = ({ type, value }) => {
  const [isLike, setisLike] = useState(false);
  const [show, setshow] = useState(false);
  const { user } = UserData();
  const [comment, setcomment] = useState("");
  const { likePost, fetchPostsandReels, addComment, deletepost, loading } =
    PostData();

  const formatDate = format(new Date(value.createdAt), "MMMM do");

  const likeHandler = () => {
    setisLike(!isLike);
    likePost(value._id);
  };

  const addcommentHandler = (e) => {
    e.preventDefault();
    addComment(value._id, setshow, comment, setcomment);
  };

  useEffect(() => {
    for (let i = 0; i < value.likes.length; i++) {
      if (value.likes[i] === user._id) setisLike(true);
    }
  }, [value, user._id]);

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const deleteHandler = () => {
    deletepost(value._id);
  };

  const [showInput, setShowInput] = useState(false);

  const editHandler = () => {
    // console.log("edit:")
    setShowInput(true);
    setShowModal(false);
  };

  const [caption, setCaption] = useState(value.caption ? value.caption : "");
  const [captionloading, setCaptionloading] = useState(false);

  async function updateCaption() {
    setCaptionloading(true);
    try {
      const { data } = await axios.put("/api/post/" + value._id, { caption });
      toast.success(data.message);
      fetchPostsandReels();
      setShowInput(false);
      setCaptionloading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setCaptionloading(false);
    }
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center pt-3 pb-14">
      <SimpleModal isOpen={showModal} onClose={closeModal}>
        <div className="flex flex-col gap-3 items-center justify-center">
          <button
            onClick={editHandler}
            className="bg-blue-400 text-white py-1 px-3 rounded-md"
          >
            Edit
          </button>
          <button
            onClick={deleteHandler}
            disabled={loading}
            className="bg-red-400 text-white py-1 px-3 rounded-md"
          >
            {loading ? <LoadingAnimation /> : "Delete"}
          </button>
        </div>
      </SimpleModal>
      <div className="bg-purple-50 p-8 rounded-lg shadow-md max-w-md">
        <div className="flex items-center space-x-2">
          <Link
            className="flex items-center space-x-2"
            to={`/user/${value.owner._id}`}
          >
            <img
              src={value.owner.profilePic.url}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-gray-800 font-semibold">{value.owner.name}</p>
              <div className="text-gray-500 text-sm">{formatDate}</div>
            </div>
          </Link>
          {value.owner._id === user._id && (
            <div className="text-gray-500 cursor-pointer">
              <button
                onClick={() => setShowModal(true)}
                className="hover:bg-gray-500 rounded-full p-1 text-2xl"
              >
                <BsThreeDotsVertical />
              </button>
            </div>
          )}
        </div>
        <div className="mb-4">
          {showInput ? (
            <>
              <input
                className="custom-input"
                style={{ width: "200px" }}
                type="text"
                placeholder="enter caption"
                value={caption}
                required
                onChange={(e) => setCaption(e.target.value)}
              />
              <button
                disabled={captionloading}
                onClick={updateCaption}
                className="text-sm bg-blue-500 text-white px-1 py-1 rounded-md"
              >
                {captionloading ? <LoadingAnimation /> : "Update caption"}
              </button>
              <button
                className="text-sm bg-red-500 text-white px-1 py-1 rounded-md"
                onClick={() => setShowInput(false)}
              >
                X
              </button>
            </>
          ) : (
            <p className="text-gray-800">{value.caption}</p>
          )}
        </div>
        <div className="mb-4">
          {type === "post" ? (
            <img
              src={value.post.url}
              alt=""
              className="object-cover rounded-md"
            />
          ) : (
            <video
              src={value.post.url}
              alt=""
              className="w-[450px] h-[600px] object-cover rounded-md"
              autoPlay
              controls
            />
          )}
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-2">
            <span
              onClick={likeHandler}
              className="text-red-500 text-2xl cursor-pointer"
            >
              {isLike ? <IoHeartSharp /> : <IoHeartOutline />}
            </span>
            <button className="hover:bg-gray-50 rounded-full p-1">
              {value.likes.length} likes
            </button>
          </div>
          <button
            className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1"
            onClick={() => setshow(!show)}
          >
            <BsChatFill />
            <span>{value.comments.length} comments</span>
          </button>
        </div>
        {show && (
          <form onSubmit={addcommentHandler} className="flex gap-3">
            <input
              type="text"
              className="custom-input"
              value={comment}
              onChange={(e) => setcomment(e.target.value)}
              placeholder="Enter comment"
            />
            <button type="submit" className="bg-gray-100 rounded-lg px-5 py-2">
              Add
            </button>
          </form>
        )}
        <hr className="mt-2 mb-2" />
        <p className="text-gray-800 font-semibold">Comments</p>
        <hr className="mt-2 mb-2" />
        <div className="mt-4">
          <div className="comments max-g-[200px] overflow-hidden overflow-y-auto">
            {value.comments && value.comments.length > 0 ? (
              value.comments.map((e) => (
                <Comment value={e} id={value._id} key={e._id} user={user} owner={value.owner._id}/>
              ))
            ) : (
              <p>No comments Yet...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

export const Comment = ({ value, user ,owner ,id}) => {
  // console.log(value)
  const {deletecomment} = PostData()

  const deletecommentHandler =()=>{
    deletecomment(id,value._id)
  }

  return (
    <div className="flex items-center space-x-2 mt-2">
      <Link to={`/user/${value.user._id}`}>
        <img
          className="w-8 h-8 rounded-full"
          src={value.user.profilePic.url}
          alt=""
        />
      </Link>
      <div className="">
        <p className="text-gray-800 font-semibold">{value.user.name}</p>
        <p className="text-gray-500 text-sm">{value.comment}</p>
      </div>
      {owner === user._id ? (
        ""
      ) : (
        <>
          {value.user._id === user._id && (
            <button className="text-red-500">
              <MdDelete onClick={deletecommentHandler}/>
            </button>
          )}
        </>
      )}

      {owner === user._id && (
        <button className="text-red-500">
          <MdDelete onClick={deletecommentHandler} />
        </button>
      )}
    </div>
  );
};
