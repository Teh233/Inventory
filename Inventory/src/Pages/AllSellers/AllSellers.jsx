import React from "react";
import { Box, styled } from "@mui/material";
import AllSellersList from "./AllSellerComponent/AllSellersList";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const AllSellers = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <AllSellersList />
    </Box>
  );
};

export default AllSellers;
