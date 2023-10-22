import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  styled,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setCustomerInfo } from "../../../features/slice/productSlice";
import { useGetCustomerQuery } from "../../../features/api/barcodeApiSlice";
import Autocomplete from "@mui/material/Autocomplete";
import { Link } from "react-router-dom";
import { AddCircleOutline } from "@mui/icons-material";

const StyleBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "20px",
}));

const SalesHistoryDialbox = ({ open, setOpen }) => {
  let value = useSelector((state) => state.product.customerInfo);
  // local state
  const [details, setDetails] = useState({
    CustomerName: value.CustomerName,
    MobileNo: value.MobileNo,
    InvoiceNo: "",
  });

  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  // rtk query

  const { data: getAllCustomer } = useGetCustomerQuery();

  // handler functions
  useEffect(() => {
    if (getAllCustomer) {
      setData(getAllCustomer.data);
    }
  }, [getAllCustomer]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnChange = (event, newValue) => {
    const { name, value } = event.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value || "",
    }));

    const matchingCustomer = data.find((customer) => customer.name === value);

    if (matchingCustomer) {
      setDetails((prevDetails) => ({
        ...prevDetails,
        MobileNo: matchingCustomer.mobileNo || "",
        name: matchingCustomer.name,
      }));
    } else if (name === "CustomerName" && !matchingCustomer) {
      setDetails((prevDetails) => ({
        ...prevDetails,
        MobileNo: "",
      }));
    }
  };

  const handleSubmit = () => {
    dispatch(setCustomerInfo(details));
    handleClose();
  };
  
  const handleRD = (e) => {
    const updatedDetails = {
      CustomerName: "R & D",
      MobileNo: 0,
      InvoiceNo: "N/A",
    };

    dispatch(setCustomerInfo(updatedDetails));

    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(to top, #020b5c, #000e82, #0510aa, #160cd3, #2b00fd)",
          color: "white",
          padding: 3,
        }}
      >
        <Typography> Customer Details </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            margin: "20px",
            "& input": {
              height: "5px",
            },
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <StyleBox>
            <Typography> Invoice Number </Typography>
            <TextField
              variant="outlined"
              name="InvoiceNo"
              value={details.InvoiceNo}
              onChange={handleOnChange}
              sx={{
                marginLeft: "10px",
              }}
            />
          </StyleBox>

          <StyleBox>
            <Typography> Customer Name</Typography>
            <Autocomplete
              options={data.map((item) => item.name)}
              value={details.CustomerName}
              onChange={(_, newValue) =>
                handleOnChange({
                  target: { name: "CustomerName", value: newValue },
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  name="CustomerName"
                  sx={{
                    marginLeft: "5px",
                    width: "13rem",
                  }}
                />
              )}
            />
            <Link to="/addCustomer" >
            <AddCircleOutline />
            </Link>
          </StyleBox>
          <StyleBox>
            <Typography> Mobile Number </Typography>
            <TextField
              variant="outlined"
              name="MobileNo"
              type="number"
              value={details.MobileNo}
              onChange={handleOnChange}
              sx={{
                marginLeft: "10px",
              }}
            />
          </StyleBox>
        </Box>
      </DialogContent>
      <DialogActions>
      <Button
          autoFocus
          variant="contained"
          sx={{ marginRight: "auto" }}
          onClick={handleRD}
        >
          R & D
        </Button>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SalesHistoryDialbox;
