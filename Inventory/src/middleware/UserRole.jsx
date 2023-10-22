import { Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetOneUsersQuery } from "../features/api/usersApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/slice/authSlice";
const UserRole = ({ children, name }) => {
  /// intialization
  const dispatch = useDispatch();

  /// global state
  const { isAdmin, userRole, userInfo } = useSelector((state) => state.auth);
  const userAccess = userRole?.some((item) => item.name === name);

  /// RTK query
  const { refetch: refetchOneUser, data: oneUserData } = useGetOneUsersQuery(
    userInfo.adminId
  );

  /// useEffect
  useEffect(() => {
    if (oneUserData?.status === "success") {
      dispatch(setCredentials(oneUserData.data));
    }
  }, [oneUserData]);

  if (name === "Home") {
    return children;
  }

  return isAdmin || userAccess ? (
    children
  ) : (
    <Navigate to="/NoPageFound" replace />
  );
};

export default UserRole;
