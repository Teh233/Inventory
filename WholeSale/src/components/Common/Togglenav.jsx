import React, { useEffect, useState, useRef } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CssBaseline, Switch } from "@mui/material";
import { toggleShowNav } from "../../features/slice/uiSlice";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Navbar from "./Navbar";
import { Link, NavLink } from "react-router-dom";
import StoreIcon from "@mui/icons-material/Store";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ContactsIcon from "@mui/icons-material/Contacts";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { useDispatch, useSelector } from "react-redux";
import FormControlLabel from "@mui/material/FormControlLabel";
import { toggleMode } from "../../features/slice/uiSlice";
import { useMediaQuery } from "@mui/material";
import { setAllProducts } from "../../features/slice/productSlice";
import CloseIcon from "@mui/icons-material/Close";

const StyleNavLink = styled(NavLink)(({ theme }) => ({

  color: theme.palette.mode === "dark" ? "#fff" : "grey",
  width: "100%",

  "&:hover": {
    // backgroundColor: "#fff",
    color: theme.palette.mode === "dark" ? "Black" : "#fff",
    "& .MuiListItemIcon-root": {
      color: theme.palette.mode === "dark" ? "Black" : "#fff",
    },
  },
  "& .MuiListItemIcon-root": {
    color: theme.palette.mode === "dark" ? "#fff" : "grey",
  },
  "&.active": {
    // Add the active selector for activeClassName
    backgroundColor: theme.palette.mode === "dark" ? "#fff" : "black",
    color: theme.palette.mode === "dark" ? "grey" : "#fff",
    "& .MuiListItemIcon-root": {
      color: theme.palette.mode === "dark" ? "grey" : "#fff",
    },
  },
}));

const StyleItemFilter = styled(ListItem)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#fff" : "black",
  backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fcf9f4",

  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#fff" : "gray",
    color: theme.palette.mode === "dark" ? "grey" : "#fff",
    "& .MuiListItemIcon-root": {
      color: theme.palette.mode === "dark" ? "grey" : "#fff",
    },
  },
  "& .MuiListItemIcon-root": {
    color: theme.palette.mode === "dark" ? "#fff" : "gray",
  },
}));
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: theme.palette.mode === "dark" ? "black" : "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          theme.palette.mode === "dark" ? "black" : "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundImage: theme.palette.mode === "dark" ? "linear-gradient(to top, #605b5b, #746d6d, #887f7f, #9d9292, #b3a5a5)" : "linear-gradient(180deg, #fdc50f 26.71%, #fb982f 99.36%)",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "black",
    borderRadius: 20 / 2,
  },
}));

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  // outline: "2px solid rgba(145, 152, 161,0.2)",
  background:
    theme.palette.mode === "dark"
      ? "Black"
      : "linear-gradient(0deg, #01127D, #04012F)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),

  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBarWrapper = styled(AppBar)(({ theme, open }) => ({
  background:
    theme.palette.mode === "dark"
      ? "black"
      : "black",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    // zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
// linear-gradient(180deg, #fdc50f 26.71%, #fb982f 99.36%)
const DrawerWrapper = styled(Drawer)(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const ToggleNav = ({  allProductData }) => {
  const drawerRef = useRef(null);
  const Mode = useSelector((state) => state.ui.Mode);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmOrDown = useMediaQuery(theme.breakpoints.down(["sm"]));
  const [open, setOpen] = useState(() => {
    // Retrieve the value from localStorage when component mounts
    const storedValue = localStorage.getItem("open");
    // return storedValue ? JSON.parse(storedValue) : false;
  });

  const handleDrawer = () => {
    dispatch(toggleShowNav());
    setOpen((prevOpen) => !prevOpen);
  };
  const handleSwitchChange = (event) => {
    dispatch(toggleMode());
  };
  useEffect(() => {
    localStorage.setItem("open", JSON.stringify(open));
  }, [open]);

  /// useEffect
  useEffect(() => {
    if (allProductData?.status === "success") {
      dispatch(setAllProducts(allProductData));
    }
  }, [allProductData]);

  const handleDrawerClose = () => {
    setOpen((prevOpen) => false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        // Close the drawer
        handleDrawerClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <Box>
      <AppBarWrapper position="fixed" open={open}>
        <Toolbar sx={{ marginLeft: "1rem" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
              handleDrawer();
            }}
            edge="start"
            sx={{
              position: "absolute",
              top: 15,
              left: 0,

              // marginRight: 5,
            }}
          >
            <MenuIcon sx={{ ...(open && { display: "none" }) }} />
            <CloseIcon sx={{ ...(!open && { display: "none" }) }} />
          </IconButton>
          <Navbar />
        </Toolbar>
      </AppBarWrapper>
      <DrawerWrapper
        onClose={handleDrawerClose}
        variant={isSmOrDown ? "temporary" : "permanent"}
        open={open}
        ref={isSmOrDown ? drawerRef : null}
      >
        <DrawerHeader>
          {/* <IconButton 
        color='inherit'   onClick={()=>{handleDrawer("close")}}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton> */}
        </DrawerHeader>
        {/* <Divider /> */}
        <FormControlLabel
          control={
            <MaterialUISwitch
              sx={{ m: "auto", ml: "10px" }}
              checked={Mode}
              onChange={handleSwitchChange}
              name="muiSwitch"
              color="primary"
            />
          }
        />
        <List>
          <StyleItemFilter disablePadding>
            <StyleNavLink
              exact="true"
              to="/"
              component={Link}
              activeclassname="active"
            >
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton>
                  <ListItemIcon>
                    <StoreIcon />
                  </ListItemIcon>
                  <ListItemText primary="Store" />
                </ListItemButton>
              </ListItem>
            </StyleNavLink>
          </StyleItemFilter>
          <StyleItemFilter disablePadding>
            <StyleNavLink
              exact="true"
              to="/address"
              component={Link}
              activeclassname="active"
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <ContactsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Address" />
                </ListItemButton>
              </ListItem>
            </StyleNavLink>
          </StyleItemFilter>
          <StyleItemFilter disablePadding>
            <StyleNavLink
              exact="true"
              to="/Cart"
              component={Link}
              activeclassname="active"
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <AddShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cart" />
                </ListItemButton>
              </ListItem>
            </StyleNavLink>
          </StyleItemFilter>
          <StyleItemFilter disablePadding>
            <StyleNavLink
              exact="true"
              to="/orders"
              component={Link}
              activeclassname="active"
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <LocalMallIcon />
                  </ListItemIcon>
                  <ListItemText primary="Orders" />
                </ListItemButton>
              </ListItem>
            </StyleNavLink>
          </StyleItemFilter>
        </List>
      </DrawerWrapper>
    </Box>
  );
};

export default ToggleNav;
