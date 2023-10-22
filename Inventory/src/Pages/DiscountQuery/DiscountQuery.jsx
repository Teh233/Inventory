import { React } from "react";
import { Box, styled } from "@mui/material";
import DiscountQueryGrid from "./Components/DiscountQueryGrid";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const DiscountQuery = () => {
  /// local state

  /// rtk query

  /// handlers

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <DiscountQueryGrid />
    </Box>
  );
};

export default DiscountQuery;
