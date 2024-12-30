import React from 'react'
import { BrowserRouter , Routes ,Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { UserData } from './context/userContext'
import Account from './pages/Account'
import NavigationBar from './components/navigationBar'
import NotFound from './components/notFound'
import Reels from './pages/Reels'
import {Loading} from "./components/loading"
import UserAccount from './pages/userAccount'
import Search from "./pages/search"
import ChatPage from './pages/chatPage'

const App = () => {
  const {loading,isAuth,user} = UserData()
  return (
    <>
    {loading?<Loading/>:
    <BrowserRouter>
    <Routes>
        <Route path="/" element={isAuth?<Home/>:<Login/>} />
        <Route path="/reels" element={isAuth?<Reels/>:<Login/>} />
        <Route path="/account" element={isAuth?<Account user={user}/>:<Login/>} />
        <Route path="/search" element={isAuth?<Search/>:<Login/>} />
        <Route path="/chat" element={isAuth?<ChatPage user={user}/>:<Login/>} />
        <Route path="/user/:id" element={isAuth?<UserAccount user={user}/>:<Login/>} />
        <Route path="/login" element={!isAuth?<Login/>:<Home/>} />
        <Route path="/register" element={!isAuth?<Register/>:<Home/>} />
        <Route path="*" element={<NotFound/>} />
    </Routes>
    {isAuth && <NavigationBar/>}
    </BrowserRouter>
    }
    </>
  )
}

export default App
