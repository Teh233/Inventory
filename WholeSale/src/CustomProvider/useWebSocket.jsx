import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import BASEURL from "../constants/BaseApi";
import { useSelector } from "react-redux";

// Create a context to hold the socket instance
const WebSocketContext = createContext();

// Custom hook to use the socket instance
export const useSocket = () => {
  return useContext(WebSocketContext);
};

// Provider component that initializes the socket
export const WebSocketProvider = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    const newSocket = io(BASEURL, {
      query: {
        type: "wholeSaleUser",
        id: userInfo?.["_id"],
        userId: userInfo?.sellerId,
        userName: userInfo?.name,
      },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userInfo]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
