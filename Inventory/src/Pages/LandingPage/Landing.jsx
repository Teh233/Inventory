import React from 'react';

import TextField from '@mui/material/TextField';
import { Box, Container, styled } from '@mui/material';
import ToggleNav from '../../components/Common/Togglenav';
import LandingComponent from './Component/LandingComponent';
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'grey' : '#eee',
  display: 'flex', gap: '5px' ,overflow: 'hidden'
}));
const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Verify = () => {
  return (
    <StyledBox>
     <Box>
        <DrawerHeader />
        <LandingComponent />
        </Box>
    
    </StyledBox>
  );
};

export default Verify;
