import React from "react";
import Dispatch_Return_Grid from "./component/Dispatch_Return_Grid";
import { Box, styled } from "@mui/material";
import AddCustomer from "./component/AddCustomer";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Dispatch_Return = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Dispatch_Return_Grid />
      {/* <AddCustomer/> */}
    </Box>
  );
};

export default Dispatch_Return;
