import React, { useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import { CircularProgress } from "@mui/material";
const ProductStatusDownloadDialog = ({
  open,
  setOpen,
  handleExcelDownload,
  loading,
}) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkboxItems, setChecBoxItems] = useState([
    "Quantity",
    "GST",
    "MRP",
    "LandingCost",
    "SalesPrice",
    "SellerPrice",
  ]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setCheckedItems((prevCheckedItems) => [...prevCheckedItems, value]);
    } else {
      setCheckedItems((prevCheckedItems) =>
        prevCheckedItems.filter((item) => item !== value)
      );
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Select Columns to download or Leave Blank to Download All
        </DialogTitle>
        <DialogContent>
          {checkboxItems.map((item, index) => {
            return (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={checkedItems.includes(item)}
                    onChange={handleCheckboxChange}
                    value={item}
                  />
                }
                label={item}
              />
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
          disabled={loading}
            onClick={() => {
              handleExcelDownload(checkedItems, handleClose);
              setCheckedItems([]);
            }}
            color="primary"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" /> // Show loading indicator
            ) : (
              "Download"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductStatusDownloadDialog;
