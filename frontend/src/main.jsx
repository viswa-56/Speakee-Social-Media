import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserContextProvider } from './context/userContext.jsx'
import React from "react"
import {PostContextProvider} from "./context/postContext.jsx"
import {ChatContextProvider} from "./context/chatContext.jsx"
import { SocketContextProvider } from './context/socketContext.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
      <PostContextProvider>
        <ChatContextProvider>
          <SocketContextProvider>
            <App /> 
          </SocketContextProvider>
        </ChatContextProvider>
    </PostContextProvider>
    </UserContextProvider>
  </React.StrictMode>
)
