import { React, useState } from "react";
import "./Home_Page.css";
import { Box, styled } from "@mui/material";
import ProductHistory from "./Components/ProductHistory";
import Content from "./Components/Content";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,

}));

const Home_Page = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
    >
    <DrawerHeader />
      <Content/>
   
    </Box>
  );
};

export default Home_Page;
