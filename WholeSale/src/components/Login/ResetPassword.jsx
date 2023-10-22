import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "../../features/api/usersApiSlice";
import CircularProgress from "@mui/material/CircularProgress";

const ResetPassword = () => {
  /// initialize
  const params = useParams();
  const token = params.token;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /// rtk query
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  /// local state
  const [password, setPassword] = useState("");

  /// submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await resetPassword({
        token: token,
        data: { newPassword: password },
      }).unwrap();

      toast.info(res.message, { position: toast.POSITION.TOP_CENTER });
      setPassword("");
      navigate("/login");
    } catch (err) {
      console.error("An error occurred during ResetPassword:", error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: "60px" }}>
      <Box>
        <form onSubmit={handleSubmit}>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <TextField
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {!isLoading ? "Reset Password" : null}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetPassword;
