import React, { useState } from 'react'
import { PostData } from '../context/postContext'
import { LoadingAnimation } from './loading'

const AddPost = ({type,setsShowAdd}) => {
    const [caption,setCaption] = useState("")
    const [file,setFile] = useState("")
    const [filePrev,setFilePrev] = useState("")

    const {addPost,addloading} = PostData()

    const submitHandler = (e)=>{
        e.preventDefault()
        // console.log("submit pressed")
        const formdata = new FormData()

        formdata.append("caption",caption)
        formdata.append("file",file)
        addPost(formdata,setFilePrev,setFile,setCaption,type)
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
                <input type="text" className='custom-input' value={caption} onChange={e=>setCaption(e.target.value)} placeholder='Enter Caption'/>
                <input required type="file" className='custom-input' accept={type === "post" ? "image/*" : "video/*"} onChange={changeFileHandler}/>
                {
                    filePrev && <>
                    {type==='post'?<img src={filePrev}/>:<video controlsList='nodownload' controls src={filePrev} className='h-[450px] w-[300px]'/>}</>
                }
                <button disabled={addloading} className='bg-blue-500 text-white px-4 py-2 rounded-md'>{addloading?<LoadingAnimation/>:"+ Add Post"}</button>
            </form>
        </div>
    </div>
  )
}

export default AddPost
