import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";
import { Box, styled, Button } from "@mui/material";
import ToggleNav from "../components/Common/Togglenav";
import Dropup from "../components/Dropup/Dropup";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#fff",
  display: "flex",
  gap: "5px",
  overflow: "hidden",
}));

const PrivateRoute = ({ nav }) => {
  const { userInfo, isAdmin } = useSelector((state) => state.auth);

  if (nav) {
    return userInfo ? (
      <Box>
        {" "}
        <ToggleNav /> <Outlet />{" "}
      </Box>
    ) : (
      <Navigate to="/login" replace />
    );
  }

  return userInfo ? (
    <StyledBox>
      {isAdmin ? <Dropup /> : ""}
      <ToggleNav />
      <Outlet />
    </StyledBox>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
