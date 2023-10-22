import { React, useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Avatar,
  useAutocomplete,
  useMediaQuery,
  Divider,
  Collapse,
  InputAdornment,
  ListItemIcon,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import ContactsIcon from '@mui/icons-material/Contacts';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import logo from '../../assets/irs.png';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout as dispatchLogout } from '../../features/slice/authSlice';
import { useLogoutMutation } from '../../features/api/usersApiSlice';
import {
  useGetProductBySearchQuery,
  useAutoCompleteProductMutation,
} from '../../features/api/productApiSlice';
import { useGetCartQuery } from '../../features/api/cartApiSlice';
import { setAllCart, setSearchTerm } from '../../features/slice/productSlice';

import Logout from '@mui/icons-material/Logout';
import { useGetSellerDetailsQuery } from '../../features/api/SellerDetailsAndAddressSlice';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Popover from '@mui/material/Popover';
import NoImage from '../../assets/NoImage.png';
const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});
const StyledAvatar = styled(Avatar)({
  '& img': {
    width: '40px',
    objectFit: 'center',
    objectPosition: 'center',
  },
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? 'gray'
      : 'linear-gradient(180deg, #fdc50f 26.71%, #fb982f 99.36%)',
  position: 'relative',

  border: 'none',
}));

const StyledInputbase = styled(InputBase)(({ theme }) => ({
  input: {
    '&:hover': {
      color: 'rgb(15, 126, 252)',
    },
    marginLeft: '10px',
  },
  width: '100%',
  background: theme.palette.mode === 'dark' ? '#eeee' : '#fff',
  color: theme.palette.mode === 'dark' ? '#fff' : 'black',
}));

const Icon = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
}));

const Navbar = ({ allProductData }) => {
  /// initialize
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSmOrDown = useMediaQuery(theme.breakpoints.down(['sm']));
  /// global state

  const ClipPathBox = styled(Box)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? 'black' : 'black',
    position: 'absolute',
    width: isSmOrDown ? '100px' : '200px', // Adjust the width and height as needed
    width: isSmOrDown ? '100px' : '200px', // Adjust the width and height as needed
    height: isSmOrDown ? '3.5rem' : '64px',
    left: -1,
    // clipPath: 'polygon(0 0, 0 100%, 100% 100%)', // Your clip-path value
    clipPath: 'polygon(50% 0, 100% 100%, 0 100%, 0 0)',
  }));

  const ClipPathBox2 = styled(Box)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? 'black' : 'black',
    position: 'absolute',
    width: isSmOrDown ? '7rem' : '250px', // Adjust the width and height as needed
    height: isSmOrDown ? '3.5rem' : '64px',
    right: -1,
    clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 0 100%)', // Your clip-path value
  }));

  const userInfo = useSelector((state) => state?.auth?.userInfo);
  const sellerId = userInfo?.sellerId;
  const personalQuery = userInfo?.personalQuery;
  const { cart } = useSelector((state) => state.product);

  /// Styling

  /// local state
  const [log_open, setLog_open] = useState(false);
  const [prof_open, setProf_open] = useState(false);
  const [fuse, setFuse] = useState(null);
  const [skip, setSkip] = useState(true);
  const [skipAuto, setSkipAuto] = useState(true);
  const [testSearch, setTestSearch] = useState('');
  const autoCompleteRef = useRef(null);

  /// rtk query
  const { data: personalDetails } = useGetSellerDetailsQuery(sellerId, {
    skip: skip,
  });
  const [logout, { error }] = useLogoutMutation();

  const [
    autoCompleteApi,
    { isLoading: autoCompleteLoading, refetch: refetchAutocomplete },
  ] = useAutoCompleteProductMutation();

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);
  const collapseRef = useRef(null);

  const [optionData, setOptionData] = useState([
    {
      Name: '',
      SKU: '',
    },
  ]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClickOutside = (e) => {
    if (collapseRef.current && !collapseRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handle_prof_open = () => {
    setProf_open(!prof_open);
  };

  const handle_log_open = () => {
    setLog_open(!log_open);
  };

  // logout start here
  const handleLogout = async () => {
    try {
      const res = await logout().unwrap();
      navigate('/login');
      dispatch(dispatchLogout());
    } catch (error) {
      console.error('An error occurred during Navbar:', error);
    }
  };

  /// useEffect

  useEffect(() => {
    if (personalQuery === 'not_submit') {
      return;
    } else {
      setSkip(false);
    }
  }, [personalQuery]);

  /// functions

  const autocompleteHandler = async (searchTerm) => {
    try {
      const res = await autoCompleteApi(searchTerm).unwrap();

      setSearchResults(res.data);
      handleToggle();
    } catch (e) {
      console.log('error in AutoSearch: ', e);
    }
  };

  useEffect(() => {
    clearTimeout(autoCompleteRef.current);
    if (testSearch.length) {
      autoCompleteRef.current = setTimeout(async () => {
        autocompleteHandler(testSearch);
      }, 1000);
    }
  }, [testSearch]);

  return (
    <StyledAppBar>
      <StyledToolbar>
        <ClipPathBox></ClipPathBox>
        <ClipPathBox2></ClipPathBox2>
        <Icon>
          <Link to="/">
            <StyledAvatar
              src="https://ik.imagekit.io/f68owkbg7/Company%20Logo.png?updatedAt=1697648520219"
              variant="square"
            />
          </Link>
        </Icon>
        {!isSmOrDown && (
          <Box
            sx={{
              width: '40rem',
              position: 'relative',
            }}
          >
            <StyledAppBar>
              <StyledInputbase
                placeholder="Search"
                value={testSearch}
                onChange={(e) => {
                  setTestSearch(e.target.value);
                }}
                inputProps={{
                  readOnly: personalQuery === 'verify' ? false : true,
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setSearchResults([]);
                        if (testSearch.length) {
                          dispatch(setSearchTerm(testSearch));
                        }
                      }}
                    >
                      <SearchOutlinedIcon sx={{ color: 'black' }} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </StyledAppBar>
            <Collapse
              in={open}
              ref={collapseRef} // Show search results only if there are results
              sx={{
                position: 'absolute',
                backgroundColor: '#eeee',
                color: '#000',
                top: '',
                width: ' 100%',
                paddingX: '1rem',
                paddingTop: '.5rem',
                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                maxHeight: '25rem',
                overflow: 'auto',
              }}
            >
              {searchResults.length > 0 ? (
                searchResults.map((item, index) => {
                  return (
                    <div key={index}>
                      <Link
                        onClick={() => setOpenSearchBox(false)}
                        to={`/OneProductDetails/${item.SKU}`}
                        style={{
                          color: 'black',
                          listStyle: 'none',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '.5rem',
                            '&:hover': {
                              backgroundColor: 'black',
                              color: '#ffff',
                            },
                            transition: '.3s',
                          }}
                        >
                          <Box>
                            {' '}
                            <img
                              style={{ width: '50px' }}
                              src={item?.mainImage?.lowUrl || NoImage}
                            />{' '}
                          </Box>{' '}
                          <Box> {item.Name} </Box>
                        </Box>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div>
                  <li style={{ listStyle: 'none', padding: '.5rem' }}>
                    Item not found
                  </li>
                </div>
              )}
            </Collapse>
          </Box>
        )}

        {isSmOrDown ? (
          //for Media query code*****************************************************
          <>
            <Box sx={{ display: 'flex' }}>
              <MenuItem>
                <Badge
                  badgeContent={cart?.cartData?.length}
                  color="error"
                  onClick={() => navigate('/Cart')}
                  sx={{ cursor: 'pointer', color: '#fff' }}
                >
                  <AddShoppingCartIcon />
                </Badge>
              </MenuItem>
              <IconButton
                onClick={handle_prof_open}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={prof_open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={prof_open ? 'true' : undefined}
              >
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src={personalDetails?.details?.companyLogo?.url}
                />
              </IconButton>
              <Menu
                anchorEl={anchorE2}
                id="account-menu"
                open={prof_open}
                onClose={handle_prof_open}
                style={{ marginTop: '25px' }}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 26,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <MenuItem onClick={() => navigate('/profile')}>
                  <ListItemIcon>
                    <ContactsIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => navigate('/myAccount')}>
                  <ListItemIcon>
                    <PersonSearchIcon />
                  </ListItemIcon>
                  My account
                </MenuItem>
                {/* <MenuItem>
                  <ListItemIcon>
                    <Badge badgeContent={0} color="error">
                      <NotificationsNoneIcon color="#fff" />
                    </Badge>
                  </ListItemIcon>
                  Notification
                </MenuItem> */}

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          //for full screen code

          <Icon>
            {/* <Badge badgeContent={0} color="error">
              <NotificationsNoneIcon color="#fff" />
            </Badge> */}
            <Badge
              badgeContent={cart?.cartData?.length}
              color="error"
              onClick={() => navigate('/Cart')}
              sx={{ cursor: 'pointer' }}
            >
              <AddShoppingCartIcon />
            </Badge>
            {/* {personalDetails?.details?.companyLogo?.url ? ( */}
            <Avatar
              sx={{ width: '30px', height: '30px' }}
              onClick={handle_log_open}
              src={personalDetails?.details?.companyLogo?.url}
            />
          </Icon>
        )}
      </StyledToolbar>
      {/* <Popover

  open={true}
  anchorEl={anchorEl}
  // onClose={handleClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
>
  <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
</Popover> */}
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={log_open}
        onClose={handle_log_open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        style={{ marginTop: '40px' }} // Add this line to apply margin
      >
        <MenuItem onClick={() => navigate('/profile')}>
          {' '}
          <ListItemIcon>
            <ContactsIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        {personalDetails?.details && (
          <MenuItem onClick={() => navigate('/myAccount')}>
            {' '}
            <ListItemIcon>
              <PersonSearchIcon />
            </ListItemIcon>
            My Account
          </MenuItem>
        )}

        <MenuItem onClick={handleLogout}>
          {' '}
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* for Media Quary */}
    </StyledAppBar>
  );
};

export default Navbar;
