import React from 'react';

import TextField from '@mui/material/TextField';
import { Box, Container, styled } from '@mui/material';
import ToggleNav from '../Common/Togglenav';
import FakeComponent from './component/FakeComponent2';
import FakeComponent2 from './component/FakeComponent2';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'grey' : '#eee',
}));
const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Verify = () => {
  return (
    <StyledBox sx={{ display: 'flex', gap: '10px' }}>
      <ToggleNav />

      <Box
        component='main'
        sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
      >
        <DrawerHeader />
        <FakeComponent2 />
      </Box>
    </StyledBox>
  );
};

export default Verify;
