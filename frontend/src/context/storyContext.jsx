import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StoryContext = createContext();

export const StoryContextProvider = ({children}) => {
    const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchStories (){
    setLoading(true);
    try {
      const response = await axios.get("/api/story/all");
      setStories(response.data.stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  async function addStory (file,setFile,setFilePrev, type){
    setLoading(true);
    try {
      const formData = new FormData();
      console.log(file)
      formData.append("file", file);
      console.log(`/api/story/new?type=${type}`)
      const response = await axios.post(`/api/story/new?type=${type}`,formData,{
        headers: {
          'Content-Type': 'multipart/form-data',  // Ensure proper content type
        },});
      setStories([response.data.story, ...stories]); // Add new story to the state
      // console.log(response)
      toast.success(response.data.message)
      fetchStories()
      setFile("")
      setFilePrev("")
        // setLoading();
    } catch (error) {
      console.error("Error adding story:", error);
      toast.error("Error adding story");
    } finally {
      setLoading(false);
    }
  };

  async function deleteStory (storyId) {
    setLoading(true);
    try {
      const {data} =await axios.delete(`/api/story/${storyId}`);
      toast.success(data.message)
      setStories(stories.filter((story) => story._id !== storyId));// Remove story from the state
      fetchStories() 
    } catch (error) {
      console.error("Error deleting story:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <StoryContext.Provider value={{ stories, loading, fetchStories, addStory, deleteStory }}>
    {children}
  </StoryContext.Provider>
  )
}

export const StoryData = () => useContext(StoryContext);