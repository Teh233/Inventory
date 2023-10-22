import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import logo from '../../assets/irs.png';
import CircularProgress from '@mui/material/CircularProgress';
const RegisterForm = ({ handleSubmit, signupLoading }) => {
  return (
    <div>
      {' '}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '5%', // Use a percentage value for padding
        }}
      >
        <Avatar
          src="https://ik.imagekit.io/f68owkbg7/Company%20Logo.png?updatedAt=1697648520219"
          variant="square"
          sx={{ width: 80, height: 'auto' }}
        />

        <Typography component="h1" variant="h6" sx={{ mt: 1 }}>
          Register as Wholesale Buyer
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            required
            fullWidth
            id="userName"
            label="User Name"
            name="userName"
            autoFocus
            sx={{ marginTop: '10px' }}
          />
          <TextField
            sx={{ marginTop: '10px' }}
            required
            fullWidth
            id="companyName"
            label="Company Name"
            name="companyName"
            autoFocus
          />
          <TextField
            sx={{
              marginTop: '10px',
              // Set the background color to white
            }}
            required
            fullWidth
            type="number"
            id="mobileNo"
            label="Mobile Number"
            name="mobileNumber"
            autoFocus
          />
          <TextField
            sx={{ marginTop: '10px' }}
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            sx={{ marginTop: '10px' }}
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            style={{ backgroundColor: 'black' }}
          >
            {signupLoading ? (
              <CircularProgress style={{ color: '#fcbf49' }} />
            ) : (
              'Sign up'
            )}
          </Button>
          <Grid container justify="center" alignItems="center">
            <Grid item>
              <Link to="/login">Already have an Account? Sign in</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default RegisterForm;
