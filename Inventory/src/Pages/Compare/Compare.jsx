import { React, useState } from "react";
import { Box, styled } from "@mui/material";
import CompareTable from "./Components/CompareTable";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Compare = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <CompareTable />
    </Box>
  );
};

export default Compare;
