import React from 'react'
import axios from "axios";
import {  createContext, useContext, useState } from "react";
import toast from 'react-hot-toast';
const groupchatContext = createContext();


export const GroupchatContextProvider = ({children}) => {
    const [groups , setGroups] = useState([])
    const [selectedGroup,setselectedGroup] = useState(null)


    async function createGroup (formdata){
        try {
            const {data} = await axios.post('/api/group/new',formdata)
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error)
        }
    }
    return <groupchatContext.Provider value={{setGroups,groups,createGroup,selectedGroup,setselectedGroup}}>{children}</groupchatContext.Provider> 

}

export const groupchatData = () => useContext(groupchatContext)