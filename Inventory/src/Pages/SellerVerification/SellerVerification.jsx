import React from "react";
import { Box, styled } from "@mui/material";
import SellerVerificationList from "./Component/SellerVerificationList";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const SellerVerification = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />

      <SellerVerificationList />
    </Box>
  );
};

export default SellerVerification;
