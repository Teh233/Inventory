import { React } from "react";
import { Box, styled } from "@mui/material";
import SellerDetailsGrid from "./components/SellerDetailsGrid";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const SellerDetails = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1,overflow:"hidden"}}
    >
      <DrawerHeader />
      <SellerDetailsGrid />
    </Box>
  );
};

export default SellerDetails;
