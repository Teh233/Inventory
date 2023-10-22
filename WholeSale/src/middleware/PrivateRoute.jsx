import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../features/api/usersApiSlice";
import { useEffect } from "react";

const PrivateRoute = () => {
  /// initialize

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const isVerified =
    useSelector((state) => state?.auth?.userInfo?.personalQuery) === "verify"
      ? true
      : false;
  const isSubmit =
    useSelector((state) => state?.auth?.userInfo?.personalQuery) === "submit"
      ? true
      : false;

  /// rtk query
  const [logout, { error }] = useLogoutMutation();

  useEffect(() => {
    const logoutAsync = async () => {
      if (!userInfo) {
        try {
          const res = await logout().unwrap();
          dispatch(dispatchLogout());
        } catch (error) {
          console.error("An error occurred during Navbar:", error);
        }
      }
    };

    logoutAsync();
  }, [userInfo]);

  //myAccount

  return isVerified ? (
    <Outlet />
  ) : isSubmit ? (
    <Navigate to="/myAccount" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
