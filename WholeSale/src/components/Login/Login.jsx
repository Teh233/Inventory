import { useEffect, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/irs.png';
import Image1 from '../../assets/Login.png';
import { useLoginMutation } from '../../features/api/usersApiSlice';
import { setCredentials, removeError } from '../../features/slice/authSlice';
import { useMediaQuery, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import Loading from '../Common/Loading';

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
        WholeSale
      </Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Login() {
  /// initialize
  const theme = createTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSmOrDown = useMediaQuery(theme.breakpoints.between('xs', 'xl'));

  /// global state
  const { userInfo, error } = useSelector((state) => state.auth);
  const isVerified =
    useSelector((state) => state?.auth?.userInfo?.personalQuery) === 'verify'
      ? true
      : false;
  const isSubmit =
    useSelector((state) => state?.auth?.userInfo?.personalQuery) === 'submit'
      ? true
      : false;

  /// local state
  const errorToastShown = useRef(false);

  /// rtk query
  const [login, { isLoading }] = useLoginMutation();

  //useEffect
  useEffect(() => {
    if (isVerified) {
      navigate('/');
    } else if (isSubmit || userInfo) {
      navigate('/myAccount');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    if (error && !errorToastShown.current) {
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
      const res = await login({
        email: data.get('email'),
        password: data.get('password'),
      }).unwrap();
      console.log(res.data);
      dispatch(setCredentials(res.data));
      navigate('/');
    } catch (error) {
      console.error('An error occurred during login:', error);
      console.log(error);
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
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
          <Box
            sx={{
              flexBasis: '50%',
              hight: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
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
                  <Avatar
                    src="https://ik.imagekit.io/f68owkbg7/Company%20Logo.png?updatedAt=1697648520219"
                    variant="square"
                    sx={{ width: 100, height: 'auto' }}
                  />

                  <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
                    WholeSale Portal
                  </Typography>
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={
                      {
                        // Use a percentage value for padding
                      }
                    }
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
                      type="password"
                      id="password"
                      autoComplete="current-password"
                    />

                    {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
                    <Box>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: 'black', mt: 3, mb: 2 }}
                      >
                        {isLoading ? (
                          <CircularProgress style={{ color: '#fcbf49' }} />
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: isSmOrDown ? 'column' : '',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Link to="/forgetPassword" variant="body2">
                          Forgot password?
                        </Link>
                      </Box>
                      <Box>
                        <Link to="/signup">Don't have an account? Sign Up</Link>
                      </Box>
                    </Box>
                  </Box>
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
          <span style={{ color: 'black' }}>WholeSale Portal </span>
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
