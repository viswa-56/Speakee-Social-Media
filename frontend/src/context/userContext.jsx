import { useContext, createContext, useState, useEffect } from "react";
import toast, {Toaster} from "react-hot-toast";
import axios from "axios"

const UserContext = createContext()

export const UserContextProvider = ({children})=>{

    const [user,setUser] = useState([]);
    const [isAuth,setisAuth] = useState(false);
    const [loading,setLoading] = useState(true);

    async function registerUser(formdata,navigate,fetchPostsandReels) {
        setLoading(true)
        try {
            const {data}  = await axios.post('/api/auth/register',formdata)

            toast.success(data.message)
            setisAuth(true)
            setUser(data.user)
            navigate('/')
            setLoading(false)
            fetchPostsandReels()
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
            setLoading(false)
        }
    }


    async function loginUser(email,password,navigate,fetchPostsandReels) {
        setLoading(true)
        try {
            const {data}  = await axios.post('/api/auth/login',{email,password,navigate})

            toast.success(data.message)
            setisAuth(true)
            setUser(data.user)
            navigate('/')
            setLoading(false)
            fetchPostsandReels()
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
            setLoading(false)
        }
    }
    async function fetchuser() {
        try {
            const {data} = await axios.get('/api/user/me')
            setUser(data)
            setisAuth(true)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setisAuth(false)
            setLoading(false)
        }finally {
            setLoading(false); // Always set loading to false, even if there is an error.
        }
    }
    async function logoutUser(navigate) {
        try {
            const {data} = await axios.get('api/auth/logout')
            console.log(data)
            if(data.message){
                toast.success(data.message)
                setUser([])
                setisAuth(false)
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        }
    }

    async function followuser(id,fetchuser) {
        try {
            const {data} = await axios.post("/api/user/follow/"+id)
            
            toast.success(data.message)
            fetchuser()
        } catch (error) {
            toast.error(error.response.data.message);            
        }
    }

    async function updateprofilepic(id,formdata,setFile) {
        try {
            const {data} = await axios.put("/api/user/"+id,formdata)
            toast.success(data.message)
            fetchuser()
            setFile(null)
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function updateprofilename(id,name,setshowInput) {
        try {
            const {data} = await axios.put("/api/user/"+id,{name})
            toast.success(data.message)
            fetchuser()
            setshowInput(false)
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(()=>{
        fetchuser();
    },[])
    return (
        <UserContext.Provider value={{ loginUser ,isAuth ,setisAuth , user ,setUser ,loading,logoutUser,registerUser,followuser,updateprofilepic,updateprofilename}}>
            {children}
            <Toaster/>
        </UserContext.Provider>
    )
}

export const UserData = () => useContext(UserContext)