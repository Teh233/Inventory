import React from "react";
import { Box, styled } from "@mui/material";
import CartList from "./CartComponent/CartList";
import ToggleNav from "../../components/Common/Togglenav";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#eee",
  height: "100vh",
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Cart = () => {
  return (
    <StyledBox sx={{ display: "flex" }}>
      <ToggleNav filter_show={false} />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
      >
        <DrawerHeader />
        <CartList />
      </Box>
    </StyledBox>
  );
};

export default Cart;
