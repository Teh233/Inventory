import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setHiddemColumns } from "../../../features/slice/authSlice";
const HideColumnsDialog = ({ columns }) => {
  /// intialize
  const dispatch = useDispatch();

  /// Global state

  const hiddenColumns = useSelector((state) => state.auth.hiddenColumns);

  /// Local state
  const [open, setOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  /// Function to handle checkbox change
  const handleCheckboxChange = (event) => {
    event.preventDefault();
    const { name, checked } = event.target;

    if (checked) {
      const newHiddenColumns = [...hiddenColumns];
      newHiddenColumns.push(name);
      dispatch(setHiddemColumns(newHiddenColumns));
    } else {
      const newHiddenColumns = hiddenColumns.filter(
        (column) => column !== name
      );
      dispatch(setHiddemColumns(newHiddenColumns));
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Hidden Columns
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Hide Columns Dialog</DialogTitle>
        <DialogContent>
          <form>
            {columns.map((item, index) => (
              <div key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={item.field}
                      checked={hiddenColumns.includes(item.field)}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={item.headerName}
                />
              </div>
            ))}
          </form>
        </DialogContent>
        <Button onClick={handleClose}>Close</Button>
      </Dialog>
    </div>
  );
};

export default HideColumnsDialog;
