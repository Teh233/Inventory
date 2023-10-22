import { React, useState } from "react";
import { Box, styled } from "@mui/material";
import PriceHistroy from "./Component/PriceHistroy";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const PriceHistroyMain = () => {
  /// local state

  const [openHistory, setOpenHistory] = useState(false);
  const [productDetails, setProductDetails] = useState({});

  /// rtk query

  /// handlers
  const handleCloseHistory = () => {
    setOpenHistory(false);
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden" }}
    >
      <DrawerHeader />
      <PriceHistroy />
    </Box>
  );
};

export default PriceHistroyMain;
