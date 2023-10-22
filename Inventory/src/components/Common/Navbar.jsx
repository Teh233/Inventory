import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  styled,
  Avatar,
  InputBase,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Collapse,
  Link as MuiLink,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Fuse from 'fuse.js';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout as dispatchLogout } from '../../features/slice/authSlice';
import { useLogoutMutation } from '../../features/api/usersApiSlice';
import {
  useGetProductBySearchQuery,
  useAutoCompleteProductMutation,
} from '../../features/api/productApiSlice';
import { setSearchTerm } from '../../features/slice/productSlice';
import logo from '../../assets/irs.png';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? 'Black'
      : 'linear-gradient(0deg, #01127D, #04012F)',
  position: 'sticky',
}));

const StyledInputbase = styled(InputBase)(({ theme }) => ({
  borderRadius: '10px',
  input: {
    '&:hover': {
      color: 'rgb(15, 126, 252)',
    },
  },
  width: '100%',
  background: theme.palette.mode === 'dark' ? 'grey' : '#fff',
  color: theme.palette.mode === 'dark' ? '#fff' : 'black',
}));
const Icon = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '20px',
}));

const Navbar = () => {
  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const autoCompleteRef = useRef(null);

  /// global state
  const { profileImage } = useSelector((state) => state.auth.userInfo);

  /// local state
  const [log_open, setLog_open] = useState(false);
  const [testSearch, setTestSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  /// rtk query

  const [logout, { error, isLoading }] = useLogoutMutation();
  const [
    autoCompleteApi,
    { isLoading: autoCompleteLoading, refetch: refetchAutocomplete },
  ] = useAutoCompleteProductMutation();

  /// handlers
  const handle_log_open = () => {
    setLog_open(!log_open);
  };

  const handleLogout = async () => {
    try {
      dispatch(dispatchLogout());
      navigate('/login');
      const res = await logout().unwrap();
    } catch (error) {
      console.error('An error occurred during Navbar:', error);
    }
  };

  const autocompleteHandler = async (searchTerm) => {
    try {
      if (!testSearch) {
        dispatch(setSearchTerm(null));
      } else {
        dispatch(setSearchTerm(testSearch));
      }
    } catch (e) {
      console.log('error in AutoSearch: ', e);
    }
  };

  useEffect(() => {
    clearTimeout(autoCompleteRef.current);

    autoCompleteRef.current = setTimeout(async () => {
      autocompleteHandler(testSearch);
    }, 1000);
  }, [testSearch]);

  return (
    <StyledAppBar sx={{}}>
      <StyledToolbar>
        <Icon alignItems={'center'}>
          <Link to="/">
            <Avatar
              src="https://ik.imagekit.io/f68owkbg7/Company%20Logo.png?updatedAt=1697648520219"
              variant="square"
            />
          </Link>
        </Icon>
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
              startAdornment={
                <InputAdornment position="start">
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
            in={searchResults.length > 0 || autoCompleteLoading} // Show search results only if there are results
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
              borderRadius: '20px',
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
                          padding: '.5rem',
                          '&:hover': { backgroundColor: '#3377FF' },
                          transition: '.3s',
                        }}
                      >
                        {item.Name}
                      </Box>
                    </Link>
                  </div>
                );
              })
            ) : (
              <Box
                sx={{
                  width: '100%',

                  display: 'flex',
                  justifyContent: 'center',
                  padding: '10px',
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </Collapse>
        </Box>
        <Icon>
          <Badge badgeContent={0} color="error">
            <NotificationsNoneIcon color="#fff" />
          </Badge>

          <Avatar
            src={profileImage?.url || ''}
            sx={{
              width: '30px',
              height: '30px',
              '& .MuiAvatar-img': {
                objectFit: 'fill',
                objectPosition: 'center',
              },
            }}
            onClick={handle_log_open}
          />
        </Icon>
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
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
        style={{ marginTop: '40px' }}
      >
        <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>

        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </StyledAppBar>
  );
};

export default Navbar;
