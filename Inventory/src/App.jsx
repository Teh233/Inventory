import "./App.css";
import PrivateRoute from "./middleware/PrivateRoute";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, Box } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { useSelector, useDispatch } from "react-redux";
import Order from "./Pages/Orders/Order";
import Test from "./Pages/Test/Test";
import OrderDetails from "./Pages/Orders/OrderDetails";
import UpdateSellerPriceBulk from "./Pages/UpdateSellerPrice/UpdateSellerPriceBulk";
import UpdateSellerPrice from "./Pages/UpdateSellerPrice/UpdateSellerPrice";
import NoPageFound from "./Pages/NoPageFound/NoPageFound";
import RestockOrder from "./Pages/RestockOrder/RestockOrder";
import MyAccount from "./Pages/MyAccount/MyAccount";
import Login from "./components/Login/Login";
import Profile from "./Pages/Profile_Page/Profile";
import AllSellers from "./Pages/AllSellers/AllSellers";
import SellerVerification from "./Pages/SellerVerification/SellerVerification";
import AllSellerOrder from "./Pages/AllSellers/AllSellerComponent/AllSellerOrderList";
import ChangePassword from "./components/Profile/ChangePassword";
import ForgetPassword from "./components/Login/ForgetPassword";
import ResetPassword from "./components/Login/ResetPassword";
import Users from "./Pages/Users/Users";
import Home_page from "./Pages/Home_Page/Home_Page";
import Loading from "./components/Common/Loading";
import OneProductDetails from "./Pages/OneProduct/OneProductDetails";
import ProductStatus from "./Pages/ProductStatus/ProductStatus";
import UploadImageCom from "./Pages/UploadImage/UploadImageCom";
import UserRole from "./middleware/UserRole";
import RestockOrderList from "./Pages/OverseasOrder/RestockOrderList";
import OrderSelection from "./Pages/OverseasOrder/component/OrderSelection";
import OverseasOrder from "./Pages/OverseasOrderList/OverseasOrder";
import OverSeasOrderProductGrid from "./Pages/OverseasOrderList/Components/OverSeasOrderProductGrid";
import Verify from "./Pages/Barcode/Verify";
import BarcodeGenerate from "./Pages/Barcode/BarcodeGenerate";
import BarcodeHistory from "./Pages/Barcode/component/BarcodeHistory";
import Dispatch_Return from "./Pages/Barcode/Dispatch_Return";
import Approval from "./Pages/Approval/Approval";
import PriceHistroyMain from "./Pages/PriceHistory/PriceHistroyMain";
import DiscountQuery from "./Pages/DiscountQuery/DiscountQuery";
import ViewQuery from "./Pages/DiscountQuery/ViewQuery";
import AdminDiscountQuery from "./Pages/DiscountQuery/AdminDiscountQuery";
import Compare from "./Pages/Compare/Compare";
import Calc from "./Pages/Calc/Calc";
import PriceComparisonOrder from "./Pages/RestockOrder/Component/PriceComparisonOrder";
import Logistics from "./Pages/Logistics/Logistics";
import AddRoboProducts from "./Pages/AddProduct/AddProduct";
import OneUpdateProduct from "./Pages/UpdateProduct/OneUpdateProductDial";
import SubSerialNumber from "./Pages/Barcode/component/SubSerialNumber";
import { useGetAllUsersQuery } from "./features/api/usersApiSlice";
import { useGetAllSellerQuery } from "./features/api/sellerApiSlice";
import { useNavigate } from "react-router-dom";
import OneInwardLogistics from "./Pages/Logistics/Components/OneInwardLogistics";
import LogisticsList from "./Pages/Logistics/Components/LogisticsList";
import LandingPage from "./Pages/LandingPage/Landing";
import irsLogo from "../public/irs.png";
import {
  addAllUsers,
  addOnlineUsers,
  addLiveStatus,
  addLiveWholeSaleStatus,
  addAllWholeSaleUsers,
  addOnlineWholeSaleUsers,
} from "./features/slice/authSlice";
import { useSocket } from "./CustomProvider/useWebSocket";
import { onMessage, getToken } from "firebase/messaging"; // Import necessary functions from Firebase messaging
import { initializeApp } from "firebase/app";
import { messaging } from "./firebase";
import { logout } from "./features/slice/authSlice";
import { useLogoutMutation } from "./features/api/usersApiSlice";
import AddBoxDetails from "./Pages/Logistics/Components/AddBoxDetails";
import SellerDetails from "./Pages/SellerDetails/SellerDetails";
import AddBrand from "./Pages/AddBrand/AddBrand";
import AddCustomer from "./Pages/Barcode/component/AddCustomer";
import addNotification from "react-push-notification";
import { formatDate } from "./commonFunctions/commonFunctions";
import CalcEdit from "./Pages/Calc/CalcEdit";

function App() {
  /// initialize
  const dispatch = useDispatch();
  const socket = useSocket();
  const navigate = useNavigate();

  /// global state
  const { isAdmin, notificationSound, userInfo } = useSelector(
    (state) => state.auth
  );
  const Mode = useSelector((state) => state.ui.Mode);

  /// local state
  const [registrationToken, setRegistrationToken] = useState("");
  const [mode, setMode] = useState("light");

  /// Push Notification

  const pushNotification = (title, data, navigateTo) => {
    addNotification({
      title: title,
      subtitle: data.time,
      message: data.message,
      duration: 30000,
      icon: irsLogo,
      native: true,
      onClick: () => {
        navigate(navigateTo);
      },
    });
  };

  /// webSocket Event Handlers

  // OnMessage
  const handleNewMessage = (data) => {
    console.log("Handling new message:", data);
  };

  //onlineUsers

  const handleOnlineUsers = (data) => {
    const userIds = Object.keys(data);

    dispatch(addOnlineUsers([...userIds]));
  };
  // online WholeSalUsers
  const handleOnlineWholeSaleUsers = (data) => {
    const userIds = Object.keys(data);

    dispatch(addOnlineWholeSaleUsers([...userIds]));
  };
  // liveStatusClient
  const handleLiveStatus = (data) => {
    dispatch(addLiveStatus(data));

    pushNotification("LiveStatus", data, "/UpdateSellerPrice");
  };

  // liveWholeSaleStatusClient
  const handleLiveWholeSaleStatus = (data) => {
    dispatch(addLiveWholeSaleStatus(data));
    pushNotification("Live WholeSeller Status", data, "/UpdateSellerPrice");
  };

  /// webSocket Events

  useEffect(() => {
    if (socket) {
      if (isAdmin) {
        // emitting events to get online Wholesale users
        socket.emit("getOnlineWholeSaleUsers", "true");

        // Listen for the 'onMessage' event
        socket.on("onMessage", (data) => {
          // console.log("Received Event onMessage for Admin :", data);
          handleNewMessage(data);
        });

        // Listen for the 'onlineUsers' event
        socket.on("onlineUsers", (data) => {
          // console.log('Received Event onlineUsers for Admin :', data);

          handleOnlineUsers(data);
        });
        // Listen for the 'onlineWholeSaleUsers' event
        socket.on("onlineWholeSaleUsers", (data) => {
          // console.log('Received Event onlineWholeSaleUsers for Admin :', data);

          handleOnlineWholeSaleUsers(data);
        });

        // Listen for the 'liveStatusClient' event
        socket.on("liveStatusClient", (data) => {
          // console.log('Received Event liveStatusClient for Admin :', data);

          handleLiveStatus(data);
        });
        // Listen for the 'liveWholeSaleStatus' event
        socket.on("WholeSaleSeller", (data) => {
          // console.log('Received Event liveWholeSaleStatus for Admin :', data);

          handleLiveWholeSaleStatus(data);
        });
      }

      /// events for all
      // Listen for the 'logout' event
      socket.on("userLogout", (data) => {
        const userId = data.userId;
        const currentUserId = userInfo?.adminId;
        if (userId === currentUserId) {
          console.log("logout");
          handleLogout();
        }
      });
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [socket]);

  /// rtk query
  // const { data: getAllUserApi } = useGetAllUsersQuery();
  // const { data: getAllWholeSellers } = useGetAllSellerQuery();
  const [logoutApi, { error }] = useLogoutMutation();

  useEffect(() => {
    setMode(Mode === true ? "dark" : "light");
  }, [Mode]);
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        // console.log("Notification permission granted.");
        // const messaging = getMessaging();
        getToken(messaging, {
          vapidKey:
            "BM3r8o8qHsrmxPGM2sHJUlabsSEs-EONb1wg4mOPrNi0r8JYi86BI85wqtWhduF3fdnsfhr8nu814QdYzCHj3VU",
        })
          .then((currentToken) => {
            // console.log("Current token:", currentToken); // Debug log
            if (currentToken) {
              setRegistrationToken(currentToken);
            } else {
              console.log("No registration token available.");
            }
          })
          .catch((err) => {
            console.log("An error occurred while retrieving token.", err);
          });
      } else {
        console.log("Unable to get permission to notify.");
      }
    });

    onMessage(messaging, (payload) => {
      console.log("Message received.", payload);
      // Handle the received message here
    });
  }, []);

  ///Functoins
  const handleLogout = async () => {
    try {
      const res = await logoutApi().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("An error occurred during Navbar:", error);
    }
  };
  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(9, 41, 92)",
        light: "rgb(66, 135, 245)",
      },
      secondary: {
        main: "rgb(3, 99, 34)",
        light: "rgb(5, 158, 54)",
      },
      confirm: {
        main: "rgb(255,69,0)",
        light: "rgb(255,165,0)",
      },
      FontDark: {
        main: "#fff",
        dark: "#0000",
      },
      mode: mode,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        xxl: 1900,
      },
    },
  });

  return (
    <Box>
      <ToastContainer closeOnClick autoClose={1000} />

      <Box>
        <ThemeProvider theme={theme}>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route
                path="/login"
                element={<Login registrationToken={registrationToken} />}
              />
              <Route path="/forgetPassword" element={<ForgetPassword />} />
              <Route
                path="/admin/resetPassword/:token"
                element={<ResetPassword />}
              />
              {/* Home Router */}
              <Route path="*" element={<PrivateRoute nav={true} />}>
                {" "}
                <Route path="*" element={<NoPageFound />} />
              </Route>
              <Route path="/profile" element={<PrivateRoute nav={true} />}>
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Admin Router */}
              <Route path="" element={<PrivateRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="product-list" element={<Home_page />} />
                <Route
                  path="/Users"
                  element={
                    <UserRole name={"Users"}>
                      <Users />
                    </UserRole>
                  }
                />
                <Route
                  path="/viewQuery/admin"
                  element={
                    <UserRole name={"View Query Admin"}>
                      <ViewQuery />
                    </UserRole>
                  }
                />
                <Route
                  path="/discountquery/:id"
                  element={<AdminDiscountQuery />}
                />

                {/* Products Router */}
                <Route path="/addRoboProduct" element={<AddRoboProducts />} />
                <Route path="/addBrand" element={<AddBrand />} />
                <Route
                  path="/UpdateSellerPrice"
                  element={
                    <UserRole name={"Update Product"}>
                      <UpdateSellerPrice />
                    </UserRole>
                  }
                />
                <Route
                  path="/UpdateSellerPriceBulk/:query"
                  element={<UpdateSellerPriceBulk />}
                />
                <Route
                  path="/ProductStatus"
                  element={
                    <UserRole name={"Product Status"}>
                      <ProductStatus />
                    </UserRole>
                  }
                />
                <Route
                  path="/PriceHistory"
                  element={
                    <UserRole name={"Price History"}>
                      <PriceHistroyMain />
                    </UserRole>
                  }
                />

                {/* WholeSale Buyer Router */}
                <Route
                  path="/AllSellerList"
                  element={
                    <UserRole name={"Sellers List"}>
                      <AllSellers />
                    </UserRole>
                  }
                />
                <Route
                  path="/sellerOrders/:id"
                  element={
                    <UserRole name={"Seller Orders"}>
                      <AllSellerOrder />
                    </UserRole>
                  }
                />
                <Route
                  path="/myAccount/:id"
                  element={
                    <UserRole name={"Sellers List"}>
                      <MyAccount />
                    </UserRole>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <UserRole name={"Seller Orders"}>
                      <Order />
                    </UserRole>
                  }
                />
                <Route
                  path="/SubSerialNumber"
                  element={
                    <UserRole name={"Sub Serial No"}>
                      <SubSerialNumber />
                    </UserRole>
                  }
                />
                <Route
                  path="/orderDetails/:id"
                  element={
                    <UserRole name={"Seller Orders"}>
                      <OrderDetails />{" "}
                    </UserRole>
                  }
                />
                <Route
                  path="/sellerVerify"
                  element={
                    <UserRole name={"Seller Req"}>
                      <SellerVerification />
                    </UserRole>
                  }
                />

                {/* Account Router */}
                <Route path="/OverseasOrder" element={<OverseasOrder />} />
                <Route
                  path="/RestockOrderList"
                  element={
                    <UserRole name={"Restock Order"}>
                      <RestockOrderList />
                    </UserRole>
                  }
                />
                <Route
                  path="/RestockOrderView"
                  element={
                    <UserRole name={"Restock Order View"}>
                      <RestockOrderList />
                    </UserRole>
                  }
                />
                <Route
                  path="/OrderSelection/:id"
                  element={<OrderSelection />}
                />
                <Route
                  path="/OverseasOrderlist/:id"
                  element={<OverSeasOrderProductGrid />}
                />
                <Route path="/RestockOrder" element={<RestockOrder />} />
                <Route
                  path="/ComparisionOrder"
                  element={
                    <UserRole name={"Comparision Order"}>
                      <PriceComparisonOrder />
                    </UserRole>
                  }
                />
                <Route path="/compare/:id" element={<Compare />} />

                {/* Sales Router */}
                <Route
                  path="/uploadimage"
                  element={
                    <UserRole name={"Upload Image"}>
                      <UploadImageCom />
                    </UserRole>
                  }
                />
                <Route path="/discountquery" element={<DiscountQuery />} />
                <Route
                  path="/viewQuery"
                  element={
                    <UserRole name={"View Query"}>
                      <ViewQuery />
                    </UserRole>
                  }
                />
                <Route
                  path="/OneProductDetails/:id"
                  element={<OneProductDetails />}
                />
                <Route path="/salesDetails" element={<SellerDetails />} />

                {/* Barcode Router */}
                <Route path="/generate" element={<BarcodeGenerate />} />
                <Route path="/verify" element={<Verify />} />
                <Route
                  path="/barcodeHistory"
                  element={
                    <UserRole name={"History"}>
                      <BarcodeHistory />
                    </UserRole>
                  }
                />
                <Route
                  path="/addCustomer"
                  element={<AddCustomer/>}
                />

                {/* Logistics */}
                <Route path="/inwardLogistic" element={<Logistics />} />
                <Route
                  path="/OneinwardLogistic/:id"
                  element={<OneInwardLogistics />}
                />
                <Route path="/logisticList" element={<LogisticsList />} />
                <Route path="/addBoxDetails/:id" element={<AddBoxDetails />} />

                <Route path="/calc" element={<Calc />} />
                <Route path="/savedCalc" element={<CalcEdit />} />
                <Route path="/calc/:id" element={<Calc />} />
                <Route path="/dispatch_Return" element={<Dispatch_Return />} />

                {/* Approval Router */}
                <Route path="/Approval/:query" element={<Approval />} />

                {/* Others Admin Profile Related Router */}
                <Route
                  path="/changepassword/:id"
                  element={<ChangePassword />}
                />
                <Route path="/test" element={<Test />} />
              </Route>
            </Routes>
          </Suspense>
        </ThemeProvider>
      </Box>
    </Box>
  );
}

export default App;
