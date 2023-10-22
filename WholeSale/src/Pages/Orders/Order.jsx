import React from 'react';
import Navbar from '../../components/Common/Navbar';
import Side_navbar from '../../components/Common/Side_navbar';
import { Box, Button, Stack, styled, Grid } from '@mui/material';
import OrderList from './OrderComponents/OrderList';
import { useSelector, useDispatch } from 'react-redux';
import ToggleNav from '../../components/Common/Togglenav';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'grey' : '#eee',
  height: '100vh',
}));
const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const Order = () => {
  const toggleShowNav = useSelector((state) => state.ui.ShowSide_nav);

  return (
    <StyledBox sx={{ display: 'flex' }}>
      <ToggleNav />

      <Box
        component='main'
        sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
      >
        <DrawerHeader />

        <OrderList />
      </Box>

      {/* <Navbar />
      <Grid container columnSpacing={20} >
      <Grid item xl={2} >
   {toggleShowNav ?    
 <Side_navbar
     
       
          />
   
        

               : "" }
       
       </Grid>
       <Grid item xl={toggleShowNav ? 10 : 12} >
  
          <OrderList />
          </Grid>
     </Grid> */}
    </StyledBox>
  );
};

export default Order;
