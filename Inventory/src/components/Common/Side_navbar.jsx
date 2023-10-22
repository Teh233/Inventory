import { React, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  styled,
  Switch,
  Stack,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CottageIcon from "@mui/icons-material/Cottage";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useDispatch } from "react-redux";
import { toggleMode } from "../../features/slice/uiSlice";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Link, NavLink } from "react-router-dom";

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
    backgroundColor: theme.palette.mode === "dark" ? "#fff" : "grey",
    color: theme.palette.mode === "dark" ? "grey" : "#fff",
    "& .MuiListItemIcon-root": {
      color: theme.palette.mode === "dark" ? "grey" : "#fff",
    },
  },
}));

const StyleBox = styled(Box)(({ theme }) => ({
  position: "fixed",
  backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fcf9f4",
  padding: "30px",
  color: theme.palette.mode === "dark" ? "#fff" : "grey",
  boxShadow:
    "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
}));

const StyleItemFilter = styled(ListItem)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#fff" : "grey",
  backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fcf9f4",

  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#fff" : "grey",
    color: theme.palette.mode === "dark" ? "grey" : "#fff",
    "& .MuiListItemIcon-root": {
      color: theme.palette.mode === "dark" ? "grey" : "#fff",
    },
  },
  "& .MuiListItemIcon-root": {
    color: theme.palette.mode === "dark" ? "#fff" : "grey",
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
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
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
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

const Side_navbar = () => {
  /// initialization
  const dispatch = useDispatch();

  /// local state
  const [selectedItems, setSelectedItems] = useState([]);
  const [isChecked, setChecked] = useState(false);

 
  /// handlers
  const handleSwitchChange = (event) => {
    setChecked(event.target.checked);
    dispatch(toggleMode());
  };

  return (
    <Stack
      display="flex"
      flexDirection="column"
      gap={{ md: 30, xs: 30, lg: 30, xl: 30, xxl: 35 }}
    >
      <Box
        p={2}
        sx={{ display: { md: "none", sm: "none", xs: "none", lg: "block" } }}
      >
        <StyleBox>
          <FormControlLabel
            control={
              <MaterialUISwitch
                sx={{ m: "auto", ml: "100%" }}
                // defaultChecked={!isChecked}
                checked={isChecked}
                onChange={handleSwitchChange}
                name="muiSwitch"
                color="primary"
              />
            }
          />
          <List
            sx={{
              padding: "10px",
              overflowY: "auto",
            }}
          >
            <StyleItemFilter disablePadding>
              <StyleNavLink
                exact="true"
                to="/"
                component={Link}
                activeclassname="active"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <CottageIcon />
                  </ListItemIcon>
                  <ListItemText primary="Homepage" />
                </ListItemButton>
              </StyleNavLink>
            </StyleItemFilter>

            <StyleItemFilter disablePadding>
              <StyleNavLink
                exact="true"
                to="/AllSellerList"
                component={Link}
                activeclassname="active"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <ListAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sellers" />
                </ListItemButton>
              </StyleNavLink>
            </StyleItemFilter>
            <StyleItemFilter disablePadding>
              <StyleNavLink
                exact="true"
                to="/orders"
                component={Link}
                activeclassname="active"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <AddShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Orders" />
                </ListItemButton>
              </StyleNavLink>
            </StyleItemFilter>
            <StyleItemFilter disablePadding>
              <StyleNavLink
                exact="true"
                to="/sellerVerify"
                component={Link}
                activeclassname="active"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Seller Req" />
                </ListItemButton>
              </StyleNavLink>
            </StyleItemFilter>
            <StyleItemFilter disablePadding>
              <StyleNavLink
                exact="true"
                to="/UpdatePrice"
                component={Link}
                activeclassname="active"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <EditNoteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Update Price" />
                </ListItemButton>
              </StyleNavLink>
            </StyleItemFilter>
          </List>
        </StyleBox>
      </Box>
    </Stack>
  );
};

export default Side_navbar;
