import React from "react";
import { Box, Stack, styled, Grid } from "@mui/material";
import Navbar from "../../components/Common/Navbar";
import Side_navbar from "../../components/Common/Side_navbar";
import AddressComponent from "./AddressComponent/AddressComponent";
import { useSelector, useDispatch } from "react-redux";
import ToggleNav from "../../components/Common/Togglenav";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#eee",
  height: "100vh",
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const Address = () => {
  const toggleShowNav = useSelector((state) => state.ui.ShowSide_nav);

  return (
    <StyledBox sx={{ display: "flex", gap: "1rem" }}>
      <ToggleNav />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
      >
        <DrawerHeader />
        <AddressComponent />
      </Box>

      {/* <Grid container columnSpacing={20}>
        <Grid item xl={2}>
          {toggleShowNav ? <Side_navbar /> : ""}
        </Grid>
        <Grid item xl={toggleShowNav ? 10 : 12}>
          <AddressComponent />
        </Grid>
      </Grid> */}
    </StyledBox>
  );
};

export default Address;
