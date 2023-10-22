import React, { useState, useEffect } from "react";
import userRolesData from "../../../constants/UserRolesItems";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  styled,
  LinearProgress,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUserRoleUpdateMutation } from "../../../features/api/usersApiSlice";
import UserRoleDailogBoxSubmenu from "./UserRoleDailogBoxSubmenu";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    minWidth: "400px",
  },
}));

const DeleteConfirmDialogue = ({
  open,
  handleClose,
  setconfirmUser,
  confirmUser,
  handleDelete,
  values,
  loading,
}) => {
  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>
          Are you sure You want to delete this User{" "}
          <span style={{ color: "red" }}>{values.userInfo}</span> <br /> User's
          id "{values.userId}"
        </DialogTitle>
        <DialogContent>
          To delete this User Enter its User id
          <TextField
            autoFocus
            margin="dense"
            // id="name"
            value={confirmUser}
            onChange={(e) => {
              setconfirmUser(e.target.value);
            }}
            name="userName"
            label="User ID"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>

          <LoadingButton
            loading={loading}
            variant="outlined"
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteConfirmDialogue;
