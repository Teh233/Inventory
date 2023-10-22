import "./App.css";
import PrivateRoute from "./middleware/PrivateRoute";
import { Route, Routes } from "react-router-dom";
import { React, useState, useEffect, lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { useSelector } from "react-redux";
const MyAccount = lazy(() => import("./Pages/MyAccount/MyAccount"));
import Order from "./Pages/Orders/Order";
import OrderDetails from "./Pages/Orders/OrderDetails";
const SignIn = lazy(() => import("./components/Login/test"));
const Login = lazy(() => import("./components/Login/Login"));
const SignupMain = lazy(() => import("./components/Signup/SignupMain"));
// const ForgetPassword = lazy(() => import("./components/Login/forgetPassword"));
import ForgetPassword from "./components/Login/ForgetPassword";
const ResetPassword = lazy(() => import("./components/Login/ResetPassword"));
const Profile = lazy(() => import("./Pages/Profile_Page/Profile"));
const ChangePassword = lazy(() =>
  import("./components/Profile/ChangePassword")
);
const PlaceOrder = lazy(() => import("./Pages/PlaceOrder/PlaceOrder"));
const Cart = lazy(() => import("./Pages/Cart/Cart"));
const Address = lazy(() => import("./Pages/Address/Address"));
import MyAccountDetails from "./Pages/MyAccount/MyAccountComponent/MyAccountDetails";
const Home_page = lazy(() => import("./Pages/Home_Page/Home_Page"));
import Loading from "./components/Common/Loading";
import { Box } from "@mui/material";
import OneProductDetails from "./Pages/OneProduct/OneProductDetails";
import ToggleNav from "./components/Common/Togglenav";
import AddressDetailsMobile from "./Pages/MyAccount/MyAccountComponent/Form/AddressDetailsMobile";
import CartMobile from "./Pages/Cart/CartMobile";
import OrderDetailsMobile from "./Pages/Orders/OrderDetailsMobile";

function App() {
  const Mode = useSelector((state) => state.ui.Mode);

  const [mode, setMode] = useState("light");

  useEffect(() => {
    setMode(Mode === true ? "dark" : "light");
  }, [Mode]);

  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(0,0,0)",
        light: "rgba(0, 0, 0, 0.56)",
      },
      secondary: {
        main: "rgb(3, 99, 34)",
        light: "rgb(5, 158, 54)",
      },
      confirm: {
        main: "rgb(255,69,0)",
        light: "rgb(255,165,0)",
      },
      success: {
        main: "rgb(5, 158, 54)",
      },
      
      colorNew: {
        main: "rgb(252, 191, 73)",
        light: "rgb(252, 191, 128)",
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
      },
    },
  });
  // console.log(Mode);
  return (
    <Box>
      <ToastContainer />

      <Box>
        <ThemeProvider theme={theme}>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignupMain />} />
              <Route path="/test" element={<SignIn />} />
              <Route path="/forgetPassword" element={<ForgetPassword />} />

              <Route
                path="/auth/resetPassword/:token"
                element={<ResetPassword />}
              />
              <Route path="/myAccount" element={<MyAccount />} />

              <Route path="" element={<PrivateRoute />}>
                <Route path="/address" element={<Address />} />
                <Route path="/" element={<Home_page />} />
                <Route
                  path="/changepassword/:id"
                  element={<ChangePassword />}
                />
                <Route path="/placeOrder" element={<PlaceOrder />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Order />} />
                <Route path="/account" element={<Order />} />
                <Route path="/orderDetails/:id" element={<OrderDetails />} />
                <Route
                  path="/OneProductDetails/:id"
                  element={<OneProductDetails />}
                />
                <Route
                  path="/MyAccountDetails"
                  element={<MyAccountDetails />}
                />
              </Route>
              <Route path="/togglenav" element={<ToggleNav />} />
              <Route
                path="/address-mobile"
                element={<AddressDetailsMobile />}
              />
              <Route path="/cart-mobile" element={<CartMobile />} />
              <Route
                path="/orderDetails-mobile"
                element={<OrderDetailsMobile />}
              />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </Box>
    </Box>
  );
}

export default App;
