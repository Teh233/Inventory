import React from "react";
import { Box, styled } from "@mui/material";
import OrderList from "./OrderComponents/OrderList";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const Order = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />

      <OrderList />
    </Box>
  );
};

export default Order;
