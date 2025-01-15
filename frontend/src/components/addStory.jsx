import React, { useState } from 'react'
import { StoryData } from '../context/storyContext'
import { LoadingAnimation } from './loading'

const AddStory = ({type,setsShowAdd}) => {
    const [file,setFile] = useState("")
    const [filePrev,setFilePrev] = useState("")
    const {addStory,loading} = StoryData()


    const submitHandler = (e)=>{
        e.preventDefault()
        // const formdata = new FormData()
        // formdata.append("caption",caption)
        // formdata.append("file",file)
        addStory(file,setFilePrev,setFile,type)
        setsShowAdd(false)
    }

    const changeFileHandler = (e) =>{
        const file = e.target.files[0]
        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onloadend=()=>{
            setFilePrev(reader.result)
            setFile(file)
        }
    }
  return (
    <div className="bg-gray-100 flex items-center justify-center pt-3 pb-5">
            <div className="bg-purple-50 p-8 rounded-lg shadow-md max-w-md">
                <form onSubmit={submitHandler} className='flex flex-col gap-4 items-center justify-between mb-4'>
                    <input required type="file" className='custom-input' accept={type === "post" ? "image/*" : "video/*"} onChange={changeFileHandler}/>
                    {
                        filePrev && <>
                        {type==='post'?<img src={filePrev}/>:<video controlsList='nodownload' controls src={filePrev} className='h-[450px] w-[300px]'/>}</>
                    }
                    <button disabled={loading} className='bg-blue-500 text-white px-4 py-2 rounded-md'>{loading?<LoadingAnimation/>:"+ Add Story"}</button>
                </form>
            </div>
        </div>
  )
}

export default AddStory
