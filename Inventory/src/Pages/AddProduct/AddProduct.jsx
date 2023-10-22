import React from 'react';

import TextField from '@mui/material/TextField';
import { Box, Container, styled } from '@mui/material';
import ToggleNav from '../../components/Common/Togglenav';

import AddProductComponent from './component/AddProductComponent';
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'grey' : '#eee',
}));
const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const AddRoboProducts = () => {
  return (
 


      <Box
        component='main'
        sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
      >
        <DrawerHeader />
        <AddProductComponent />
      </Box>

  );
};

export default AddRoboProducts;
