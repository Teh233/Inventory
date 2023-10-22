import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import BASEURL from "../constants/BaseApi";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllSellerQuery } from "../features/api/sellerApiSlice";
import { useGetAllUsersQuery } from "../features/api/usersApiSlice";
import { addAllWholeSaleUsers, addAllUsers } from "../features/slice/authSlice";
// Create a context to hold the socket instance
const WebSocketContext = createContext();

// Custom hook to use the socket instance
export const useSocket = () => {
  return useContext(WebSocketContext);
};

// Provider component that initializes the socket
export const WebSocketProvider = ({ children }) => {
  /// initialization
  const dispatch = useDispatch();
  const { userInfo, isAdmin } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [skip, setSkip] = useState(true);

  /// rtk query
  const { data: getAllUserApi } = useGetAllUsersQuery(null, {
    skip: skip,
  });
  const { data: getAllWholeSellers } = useGetAllSellerQuery(null, {
    skip: skip,
  });

  /// useEffect
  useEffect(() => {
    if (getAllWholeSellers?.status === "success") {
      const newOnlineWholeSaleusers = {};

      getAllWholeSellers.sellers.forEach((item) => {
        newOnlineWholeSaleusers[item.sellerId] = {
          name: item.name,
          isOnline: false,
        };
      });
      dispatch(addAllWholeSaleUsers(newOnlineWholeSaleusers));
    }
  }, [getAllWholeSellers]);

  useEffect(() => {
    if (getAllUserApi?.status === "success") {
      const newOnlineusers = {};

      getAllUserApi.data.forEach((item) => {
        newOnlineusers[item.adminId] = { name: item.name, isOnline: false };
      });
      dispatch(addAllUsers(newOnlineusers));
    }
  }, [getAllUserApi]);

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    if (isAdmin) {
      setSkip(false);
    }

    
    const newSocket = io(BASEURL, {
      query: {
        type: "adminUser",
        id: userInfo?.["_id"],
        userId: userInfo?.adminId,
        userName: userInfo?.name,
        isAdmin: userInfo?.isAdmin,
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
