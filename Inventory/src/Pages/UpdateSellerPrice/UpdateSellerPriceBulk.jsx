import React from 'react';
import { Box, styled } from '@mui/material';
import UpdatePriceBulk from './components/UpdatePriceBulkGrid';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const UpdateSellerPrice = () => {
  return (
    <Box
      component='main'
      sx={{
        flexGrow: 1,
        p: 0,
        width: '100%',
        paddingTop: '20px',
        // overflowY: 'auto',

      }}
    >
      <DrawerHeader />

      <UpdatePriceBulk />
    </Box>
  );
};

export default UpdateSellerPrice;
