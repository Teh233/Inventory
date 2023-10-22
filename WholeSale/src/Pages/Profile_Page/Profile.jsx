import React from "react";
import Navbar from "../../components/Common/Navbar";
import SellerProfile from "../../components/Profile/SellerProfile";
import { Box} from "@mui/material";

const Profile = () => {
  return (
    <Box component="main" sx={{ p: 0, width: "100%", overflow: "hidden" }}>
      <Navbar />
      <SellerProfile />
    </Box>
  );
};


export default Profile;
