import { React, useState } from "react";
import { Box, styled } from "@mui/material";
import ProductHistory from "../Home_Page/Components/ProductHistory";
import ProductStatusGrid from "./Components/ProductStatusGrid";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const ProductStatus = () => {
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
      <ProductStatusGrid
        setOpenHistory={setOpenHistory}
        setProductDetails={setProductDetails}
      />
      <ProductHistory
        openHistory={openHistory}
        setOpenHistory={setOpenHistory}
        handleCloseHistory={handleCloseHistory}
        productDetails={productDetails}
      />
    </Box>
  );
};

export default ProductStatus;
