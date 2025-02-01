// socketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import io from 'socket.io-client';
import { UserData } from "./userContext";

const SocketContext = createContext();
const EndPoint = "http://localhost:7000";

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = UserData();

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(EndPoint, {
      query: { userId: user._id },
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('getOnlineUser', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const SocketData = () => useContext(SocketContext);