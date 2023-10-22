import React from "react";
import { Box, styled } from "@mui/material";
import BarcodeGenerateGrid from "./component/BarcodeGenerateGrid";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,

}));
function BarcodeGenerate() {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%",overflow: "hidden" }}
    >
      <DrawerHeader />
      <BarcodeGenerateGrid />
    </Box>
  );
} 

export default BarcodeGenerate;
