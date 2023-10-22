import React, { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useForgetPasswordMutation } from "../../features/api/usersApiSlice";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [showAlert, setSowAlert] = useState(false)
  const navigate = useNavigate()
  /// initialization
  const dispatch = useDispatch();

  //? rtk query
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  /// local state
  const [email, setEmail] = useState("");

  // form submit
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await forgetPassword({ email: email }).unwrap();

      // toast.info(res.msg, { position: toast.POSITION.TOP_CENTER });
      setSowAlert(true);
      Swal.fire({
        // position: 'top-end',
        icon: 'success',
        title: 'Link  successfully send your email',
        confirmButtonText: 'OK',
        allowOutsideClick: false
        // timer: 1500
      }).then((result) => {

        if (result.isConfirmed) {
          navigate("/login")
        }
      })
      setEmail("");
    } catch (err) {
      console.log("An error occurred during ForgetPassword:", err);
    }
  };




  return (

    <Container maxWidth="xs" sx={{ marginTop: "60px" }}>
      <Box >



        {
          !showAlert ?
            (<form onSubmit={submitHandler}>
              <Typography component="h1" variant="h5">
                Forget Password
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                {!isLoading ? "Send Reset Link" : null}
              </Button>
            </form>)
            : ""
        }




      </Box>
    </Container>
  );
};

export default ForgetPassword;
