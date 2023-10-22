import React, { useState } from "react";
import { Box, styled, Grid } from "@mui/material";
import Navbar from "../../components/Common/Navbar";
import Side_navbar from "../../components/Common/Side_navbar";
import MyAccountDetails from "./MyAccountComponent/MyAccountDetails";
import { useSelector } from "react-redux";
import { Alert } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import ToggleNav from "../../components/Common/Togglenav";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#eee",
  height: "100vh",
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const MyAccount = () => {
  const filter_show = false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleShowNav = useSelector((state) => state.ui.ShowSide_nav);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (

    
   <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, width: "100%", height:"100vh", overflowY: "auto" }}
      >
        <DrawerHeader />

        <MyAccountDetails />
      </Box>


  );
};

export default MyAccount;
