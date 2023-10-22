import React from 'react'
import { styled, Box } from '@mui/material';
import PriceComparisionComponent from './component/PriceComparisionComponent';


const PriceComparisons = () => {
  const DrawerHeader = styled('div')(({ theme }) => ({
    ...theme.mixins.toolbar,
  }));
  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />
      <PriceComparisionComponent />
    </Box>
  );
}

export default PriceComparisons;


