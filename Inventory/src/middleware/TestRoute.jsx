import { Navigate } from "react-router-dom";
import React from "react";
import { Box, styled, Button } from "@mui/material";
import ToggleNav from "../components/Common/Togglenav";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#eee",
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const TestRoute = ({ children }) => {
  return (
    <StyledBox sx={{ display: "flex", gap: "10px",overflow: 'hidden' }}>
      <ToggleNav />
      {children}
    </StyledBox>
  );
};

export default TestRoute;
