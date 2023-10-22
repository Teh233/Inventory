import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logout, addError } from "./features/slice/authSlice";
import { apiSlice } from "./features/api/apiSlice";
import productReducer from "./features/slice/productSlice";
import uiReducer from "./features/slice/uiSlice";
import SellerDetailsAndAddressReducer from "./features/slice/sellerDtatailsAndAddrssSlice";
import { toast } from "react-toastify";

/// Custom error handling middleware

/// error middle ware
const errorMiddleware = (store) => (next) => (action) => {
  const endpointName = action?.meta?.arg?.endpointName;

  if (
    action.error &&
    action.payload?.status === 401 &&
    endpointName !== "login"
  ) {
    store.dispatch(addError("Session expired !Login Again"));
    store.dispatch(logout());
  }
  if (
    action.error &&
    action?.payload?.status === 401 &&
    endpointName === "login"
  ) {
    if (
      action.payload.data?.message &&
      Array.isArray(action.payload.data.message)
    ) {
      action.payload?.data?.message.forEach((item) => {
        toast.error(item);
      });
    } else {
      toast.error(action.payload.data?.message || action.payload?.error);
    }
  }

  if (action.error && action.payload?.status !== 401) {
    if (
      action.payload?.data?.message &&
      Array.isArray(action.payload?.data?.message)
    ) {
      action.payload?.data?.message.forEach((item) => {
        toast.error(item);
      });
    } else if (
      action.payload?.status === "FETCH_ERROR" &&
      endpointName === "login"
    ) {
      toast.error("Server Down");
    } else if (action.payload?.status === "FETCH_ERROR") {
      store.dispatch(addError("Server Error"));

      store.dispatch(logout());
    } else {
      toast.error(action.payload?.data?.message || action.payload?.error);
    }
  }

  // console.log(action);
  return next(action);
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    ui: uiReducer,
    sellerDetailsAndAddress: SellerDetailsAndAddressReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware).concat(errorMiddleware), // Add the error middleware
  devTools: true,
});

export default store;
