import React, { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useChangePasswordMutation } from "../../features/api/usersApiSlice";
import { logout, addError } from "../../features/slice/authSlice";
import CircularProgress from "@mui/material/CircularProgress";

const ChangePassword = () => {
  /// initialization
  const dispatch = useDispatch();
  const params = useParams();
  const adminId = params.id;

  /// local state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /// rtk query
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await changePassword({
        id: adminId,
        data: { oldPassword: oldPassword, newPassword: newPassword },
      }).unwrap();
      dispatch(logout());
      dispatch(
        addError("Password Changed kindly login again with new Password")
      );
    } catch (error) {
      console.error("An error occurred during ChangePassword:", error);
    }
  };
  return (
    <Container maxWidth="xs" sx={{ marginTop: "60px" }}>
      <Box>
        <form onSubmit={handleSubmit}>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          <TextField
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            margin="normal"
            required
            fullWidth
            label="Old Password"
            autoComplete="password"
            autoFocus
            type={"password"}
          />
          <TextField
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
            fullWidth
            label="New Password"
            autoComplete="password"
            autoFocus
            type={"password"}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={isLoading}
            startIcon={
              isLoading && <CircularProgress size={24} color="inherit" />
            }
          >
            {!isLoading ? "Change Password" : null}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ChangePassword;
