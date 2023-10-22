import { useEffect, useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLoginMutation,
  useOtpLoginMutation,
  useLogoutMutation,
} from '../../features/api/usersApiSlice';
import {
  logout,
  removeError,
  setCredentials,
} from '../../features/slice/authSlice';
import droneWallpaoer from '../../assets/drone-wall-2.jpg';
import irsLogo from '../../assets/irs.png';
import { toast } from 'react-toastify';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Inventory Management Soft.
      </Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

const theme = createTheme();
export default function Login({ registrationToken }) {
  //  show password
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isShowOtp, setIsShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [remainingTime, setRemainingTime] = useState(5 * 60);
  const [timerExpired, setTimerExpired] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  const errorToastShown = useRef(false);
  const [ButtonDisable, setButtonDisable] = useState(true);
  const [Location, setLocation] = useState({
    Latitude: 0,
    Longitude: 0,
  });

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  /// isLocalServer Check

  const isLocalServer = import.meta.env.VITE_API_LOCAL_SERVER ? true : false;

  /// function

  const tick = () => {
    setRemainingTime((prevTime) => {
      if (prevTime > 0) {
        return prevTime - 1;
      } else {
        setTimerExpired(true);
        return prevTime; // Return the value to make sure the state doesn't change when expired
      }
    });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setButtonDisable(false);
    });
  }, [navigator.geolocation]);

  useEffect(() => {
    let timer;

    if (isShowOtp) {
      timer = setInterval(tick, 1000); // Update remaining time every second
    }

    return () => {
      clearInterval(timer); // Clear the timer when the component unmounts
    };
  }, [isShowOtp]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  /// initialize
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /// global state
  const { userInfo, error } = useSelector((state) => state.auth);

  // rtk query
  const [login, { isLoading }] = useLoginMutation();
  const [otpLogin, { isLoading: otpLoading }] = useOtpLoginMutation();
  const [logoutApi] = useLogoutMutation();

  //useEffect
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    if (error && !errorToastShown.current) {
      console.log('isUse');
      toast.error(error);
      dispatch(removeError());
      errorToastShown.current = true;
    }
  }, [error, dispatch, removeError]);

  /// Handlers
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const uniqueId = localStorage.getItem('unique') || null;
      const res = await login({
        email: data.get('email'),
        password: data.get('password'),
        Location,
        unique: uniqueId,
        fcmAdminToken: registrationToken,
      }).unwrap();

      if (res.data.isOtp) {
        setIsShowOtp(true);
        setUserId(res.data.adminId);
        return;
      }

      dispatch(setCredentials(res.data));
      navigate('/');
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log({
        otp: otp,
        adminId: userId,
      });

      const res = await otpLogin({
        otp: +otp,
        adminId: userId,
      }).unwrap();

      localStorage.setItem('unique', res.data.unique);

      dispatch(setCredentials(res.data));
      navigate('/');
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  useEffect(() => {
    const handleLogout = async () => {
      if (timerExpired) {
        navigate('/');
        dispatch(logout());
        await logoutApi();
      }
    };

    handleLogout(); // Call the async function
  }, [timerExpired]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: '100vh',
          display: 'grid',
          gridTemplateColumns: '60% 40%',
          // gridGap:"2rem",
          overflowY: 'hidden',
        }}
      >
        <Box
          sx={{
            // border: '2px solid',
            clipPath: 'polygon(0 1%, 100% 0%, 73% 100%, 0% 100%)',
            boxShadow:
              'rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px',
          }}
        >
          <img
            src="https://ik.imagekit.io/f68owkbg7/Screenshot%202023-10-18%20222901.png?updatedAt=1697648370507"
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              clipPath: 'polygon(0 1%, 100% 0%, 73% 100%, 0% 100%)',
              boxShadow:
                'rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px',
            }}
          />
        </Box>
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <CssBaseline />
          {isShowOtp ? (
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '.5rem',
                boxShadow:
                  'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'transparent' }}>
                <img
                  src="https://ik.imagekit.io/f68owkbg7/Company%20Logo.png?updatedAt=1697648520219"
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Avatar>
              <Typography component="h1" variant="h5" fontWeight="bold">
                Enter OTP to Login
              </Typography>
              <Box noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  value={otp}
                  onChange={(event) => {
                    setOtp(event.target.value);
                  }}
                  fullWidth
                  id="email"
                  label="Enter OTP"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />

                {timerExpired ? (
                  <p>Timer expired. Handle this case accordingly.</p>
                ) : (
                  <div>
                    <p>
                      Time remaining: {minutes}:{seconds < 10 ? '0' : ''}
                      {seconds}
                    </p>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={handleOtpSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '.5rem',
                boxShadow:
                  'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'transparent' }}>
                <img
                  src="https://ik.imagekit.io/f68owkbg7/Company%20Logo.png?updatedAt=1697648520219"
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Avatar>
              <Typography component="h1" variant="h5" fontWeight="bold">
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showPassword}
                      onChange={() => setShowPassword((prev) => !prev)}
                      value="remember"
                      color="primary"
                    />
                  }
                  label="Show password"
                />

                {isLocalServer ? (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    // disabled={ButtonDisable}
                  >
                    Sign In
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={ButtonDisable}
                  >
                    Sign In
                  </Button>
                )}

                <Grid container>
                  <Grid item xs>
                    <Link to="/forgetPassword" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}

          {isLoading ? <LinearProgress color="success" /> : ''}
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
