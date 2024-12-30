import axios from "axios";
import {  createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const PostContext = createContext()

export const PostContextProvider = ({children}) =>{

    const [posts,setPosts] = useState([])
    const [reels,setReels] = useState([])
    const [loading,setLoading] = useState(true)

    async function fetchPostsandReels() {
        try {
            const {data} = await axios.get("/api/post/all")

            setPosts(data.posts);
            setReels(data.reels);
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
        
    }

    const [addloading,setAddloading] = useState(false)

    async function addPost(formdata,setFile,setFilePrev,setCaption,type) {
        setAddloading(true)
        try {
            const {data} = await axios.post('/api/post/new?type='+type,formdata)
            toast.success(data.message)
            fetchPostsandReels()
            setFile("")
            setFilePrev("")
            setCaption("")
            setAddloading(false)
        } catch (error) {
            toast.error(error.response.data.message);
            setAddloading(false)
        }
    }

    async function likePost(id) {
        try {
            const {data} = await axios.post("/api/post/like/"+id)
            toast.success(data.message)
            fetchPostsandReels()
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function addComment(id,setshow,comment,setcomment) {
        try {
            const {data} = await axios.post("/api/post/comment/"+id,{comment})
            toast.success(data.message)
            fetchPostsandReels()
            setcomment("")
            setshow(false)
        } catch (error) {
            toast.error(error.response.data.message);            
        }
    }

    async function deletepost(id) {
        setLoading(true)
        try {
            const {data} = await axios.delete('/api/post/'+id)
            toast.success(data.message)
            fetchPostsandReels()
            setLoading(false)
        } catch (error) {
            toast.error(error.response.data.message);            
            setLoading(false)
        }
    }

    async function deletecomment(id,commentId) {
        try {
            const {data} = await axios.delete(`/api/post/comment/${id}?commentId=${commentId}`)
            toast.success(data.message)
            fetchPostsandReels()
        } catch (error) {
            toast.error(error.response.data.message);            
        }
    }

    useEffect(()=>{
        fetchPostsandReels();
    },[]);
    return <PostContext.Provider value={{reels,posts,deletecomment,addPost,likePost,addComment,fetchPostsandReels,loading,addloading,deletepost}}>{children}</PostContext.Provider>
}

export const PostData = () => useContext(PostContext);