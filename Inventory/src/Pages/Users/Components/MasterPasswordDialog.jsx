import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  useRegisterMutation,
  useMasterPasswordMutation,
} from "../../../features/api/usersApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MasterPassword = ({ open, setOpen }) => {
  /// rtk query
  const [register, { isLoading }] = useRegisterMutation();
  const [changeMasterPasswordApi, { isLoading: loadingMasterPassword }] =
    useMasterPasswordMutation();

  /// local state
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    // Make the API call
    changeMasterPasswordApi({password: password})
      .unwrap()
      .then((response) => {
        toast.success(response.message);

        handleClose();
      })
      .catch((error) => {
        toast.error(error.response.data.message);

        handleClose();
      })
      .finally(() => {});
  };

  const handleClose = () => {
    setOpen(false);
    setPassword("");
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter new Master Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="password"
            label="Password"
            fullWidth
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" /> // Show loading indicator
            ) : (
              "Submit"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer /> {/* Add ToastContainer at the top level */}
    </div>
  );
};

export default MasterPassword;
