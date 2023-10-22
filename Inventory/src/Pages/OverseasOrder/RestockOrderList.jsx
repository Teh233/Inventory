import React from "react";
import { Box, styled } from "@mui/material";
import RestockOrderDetails from "./component/RestockOrderDetails";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const OverseasOrder = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />

      <RestockOrderDetails />
    </Box>
  );
};

export default OverseasOrder;
