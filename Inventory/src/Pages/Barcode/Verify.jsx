import React from "react";
import VerifyComponent from "./component/VerifyComponent";
import { Box, styled } from "@mui/material";
import ToggleNav from "../../components/Common/Togglenav";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Verify = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <VerifyComponent />
    </Box>
  );
};

export default Verify;
