import React from "react";
import { Avatar, Typography, Box, Button, Grid } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// UserProfile component
const SellerProfile = () => {

  const navigate = useNavigate();
  const { adminId, name, email, createdAt,profileImage } = useSelector(
    (state) => state.auth.userInfo
  );
  // console.log(name)
  // taken date format from createdAt
  const dateString = createdAt;
  const date = new Date(dateString);
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  // handling changePassword Route
  const handleChangePassword = () => {
    navigate(`/changePassword/${adminId}`);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt="30px"
      padding={"24px"}
    >
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={4}
        p={4}
        bgcolor="white"
        boxShadow={1}
        sx={{ maxWidth: "500px" }}
      >
          {profileImage?.url ? (
          <Avatar
            src={profileImage.url}
            alt={name}
            sx={{ width: 100, height: 100, mb: 2 }}
            variant="square"
          />
        ) : (
          <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
            <AccountCircleIcon sx={{ width: 100, height: 100 }} />
          </Avatar>
        )}
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Update Profile
        </Button>
        <Box mt={4} textAlign="center">
          <Typography variant="body1" gutterBottom>
            <strong>Name:</strong> {name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Email:</strong> {email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Joined:</strong> {formattedDate}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SellerProfile;
