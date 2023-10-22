import { useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import OTPverify from './OTPverify';
import RegisterForm from './RegisterForm';
import Swal from 'sweetalert2';
import { Card, CardMedia, useMediaQuery, Box, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import Image1 from '../../assets/Signup.png';
import {
  useSignupMutation,
  useOtpVerifyMutation,
  useOtpRegenerateMutation,
} from '../../features/api/usersApiSlice';

const theme = createTheme();
export default function SignupMain() {
  /// initialize
  const navigate = useNavigate();

  /// rtk query
  const [signup, { isLoading: signupLoading, error: signupError }] =
    useSignupMutation();
  const [otpVerify, { isLoading: otpVerifyLoading, error: otpVerifyError }] =
    useOtpVerifyMutation();
  const [otpRegenerate, { isLoading: otpRegenLoading, error: otpRegenError }] =
    useOtpRegenerateMutation();

  /// local state
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSection, setOtpSection] = useState(false);
  const [resendButton, setResendButton] = useState(false);
  /// useEffect
  const isSmOrDown = useMediaQuery(theme.breakpoints.between('xs', 'xl'));

  /// Handlers
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const mobileNumber = parseInt(data.get('mobileNumber'));
    console.log(data);
    // Validate mobile number
    if (isNaN(mobileNumber) || mobileNumber.toString().length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Check if all fields are filled
    const requiredFields = ['userName', 'companyName', 'email', 'password'];
    for (const field of requiredFields) {
      if (!data.get(field)) {
        toast.error(`${field} is required.`);
        return;
      }
    }
    try {
      const res = await signup({
        name: data.get('userName'),
        companyName: data.get('companyName'),
        mobileNo: mobileNumber,
        email: data.get('email'),
        password: data.get('password'),
      }).unwrap();

      if (res?.status === 'success') {
        setEmail(data.get('email'));
        setOtpSection(true);
        toast.success(`OTP sent to ${data.get('email')}`);
      }
    } catch (err) {
      console.log('An error occurred during Signup:', err);
    }
  };
  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await otpVerify({
        email: email,
        otp: +otp,
      }).unwrap();
      console.log(res);
      if (res?.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'OTP successfully verified!',
          text: 'You can login now',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.log('An error occurred during OTP verify:', err);
    }
  };

  const handleOtpRegenerate = async (event) => {
    event.preventDefault();

    try {
      const res = await otpRegenerate({
        email: email,
      }).unwrap();
      console.log(res);
      if (res?.status === 'success') {
        toast.success(`OTP sent again to ${email}`);
        setResendButton(false);
      }
    } catch (err) {
      console.log(err);
      if (err?.data?.message && Array.isArray(err.data.message)) {
        err.data.message.forEach((item) => {
          toast.error(item);
        });
      } else {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={6} sx={{ width: '80%', marginTop: '5rem' }}>
        <Box
          sx={{ display: 'flex' }}
          flexDirection={isSmOrDown ? 'column' : 'row'}
        >
          <Box sx={{ flexBasis: '50%' }}>
            <img
              src="https://ik.imagekit.io/f68owkbg7/Screenshot%202023-10-18%20222901.png?updatedAt=1697648370507"
              alt=""
              title=""
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </Box>
          <Box sx={{ flexBasis: '50%' }}>
            <ThemeProvider theme={theme}>
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                  sx={{
                    display: 'flex',

                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {otpSection ? (
                    <OTPverify
                      email={email}
                      otp={otp}
                      setOtp={setOtp}
                      handleOtpSubmit={handleOtpSubmit}
                      resendButton={resendButton}
                      setResendButton={setResendButton}
                      handleOtpRegenerate={handleOtpRegenerate}
                      otpRegenLoading={otpRegenLoading}
                      otpVerifyLoading={otpVerifyLoading}
                    />
                  ) : (
                    <RegisterForm
                      handleSubmit={handleSubmit}
                      signupLoading={signupLoading}
                    />
                  )}
                  {signupLoading || otpVerifyLoading ? (
                    <LinearProgress color="success" />
                  ) : (
                    ''
                  )}
                </Box>
              </Container>
            </ThemeProvider>
          </Box>
        </Box>
      </Paper>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 4, mb: 4 }}
      >
        {'Copyright © '}
        <Link>
          <span style={{ color: 'black' }}> WholeSale Portal </span>
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
