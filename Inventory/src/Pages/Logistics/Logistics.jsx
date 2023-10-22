import { React } from "react";
import { Box, styled } from "@mui/material";
import InwardLogistics from "./Components/InwardLogistics";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Logistics = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <InwardLogistics />
    </Box>
  );
};

export default Logistics;
