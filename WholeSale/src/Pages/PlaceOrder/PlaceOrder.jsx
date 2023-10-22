import React from "react";
import {
  Box,
  Stack,
  Typography,
  styled,
  Paper,
  Grid,
  Tooltip,
} from "@mui/material";
import Navbar from "../../components/Common/Navbar";
import Side_navbar from "../../components/Common/Side_navbar";
import PlaceOrderComponent from "./PlaceOrderComponent/PlaceOrderComponent";
import { useSelector } from "react-redux";
import ToggleNav from "../../components/Common/Togglenav";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#eee",
  height: "100vh",
}));
const DrawerHeader = styled('div')(({ theme }) => ({

  ...theme.mixins.toolbar,
}));
const PlaceOrder = () => {


  const toggleShowNav = useSelector((state) => state.ui.ShowSide_nav);

  return (
    <StyledBox sx={{ display: 'flex' }}>

      <ToggleNav filter_show={false} />

      <Box component="main" sx={{
        flexGrow: 1, p: 0,
         width: "100%",
        overflowY: "scroll",
        height: '85vh'
      }}>
        <DrawerHeader />
        <PlaceOrderComponent />
      </Box>


      {/* <Navbar />
      <Grid container columnSpacing={20} >
      <Grid item xl={2}  >
      {toggleShowNav ?    
 <Side_navbar
     
 filter_show={false}
          />  : "" }
                 </Grid>
     
                 <Grid item xl={toggleShowNav ? 10: 12}
     >
        <Box
          sx={{
            width: "100%",
         
            overflowY:"scroll",
            height:'85vh'
          }}
        >
          <PlaceOrderComponent />
        </Box>
        </Grid>
        </Grid> */}
    </StyledBox>
  );
};

export default PlaceOrder;
