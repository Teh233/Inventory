import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, styled } from "@mui/material";
import {
  useAddCustomerMutation,
  useGetCustomerQuery,
} from "../../../features/api/barcodeApiSlice";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCustomerInfo } from "../../../features/slice/productSlice";



const AddCustomer = () => {
  const [value, setValue] = useState({
    name: "",
    company: "",
    email: "",
    mobile: "",
  });
  const dispatch = useDispatch();
  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const { data: getAllCustomer, refetch } = useGetCustomerQuery();
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value: inputValue } = e.target;
    setValue({ ...value, [name]: inputValue });
  };

  const handleSubmit = async () => {
    try {
      if (!value.name || !value.mobile) {
        return toast.error("Please complete the form");
      }
      const result = await addCustomer(value);
      if (result.data.status === "success") {
        toast.success("Customer added successfully");
        setValue({
          name: "",
          company: "",
          email: "",
          mobile: "",
        });
        refetch();
      }
      setValue({
        name: "",
        company: "",
        email: "",
        mobile: "",
      });
    } catch (error) {
      toast.error(error.message);
      setValue({
        name: "",
        company: "",
        email: "",
        mobile: "",
      });
    }
  };
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      align: "center",
      headerAlign: "center", // Center header text
      renderCell: (params) => (
        <div style={{ textAlign: "center" }}>
          {params.row.name}
        </div>
      ),
    },
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      align: "center",
      headerAlign: "center", // Center header text
      renderCell: (params) => (
        <div style={{ textAlign: "center" }}>
          {params.row.company}
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      align: "center",
      headerAlign: "center", // Center header text
      renderCell: (params) => (
        <div style={{ textAlign: "center" }}>
          {params.row.email}
        </div>
      ),
    },
    {
      field: "mobileNo",
      headerName: "Mobile",
      flex: 1,
      align: "center",
      headerAlign: "center", // Center header text
      renderCell: (params) => (
        <div style={{ textAlign: "center" }}>
          {params.row.mobileNo}
        </div>
      ),
    },
    {
      field: "dispatch",
      headerName: "Dispatch",
      flex: 1,
      align: "center",
      headerAlign: "center", // Center header text
      renderCell: (params) => (
        <div style={{ textAlign: "center" }}>
          <i className="fa-solid fa-share-from-square"   onClick={() => {
              const result = {
                CustomerName: params.row.name,
                MobileNo: params.row.mobileNo,
              };
              handleDispatchClick(result);
            }}>

          </i>
        </div>
      ),
    },
  ];
  

  useEffect(() => {
    if (getAllCustomer?.status === "success") {
      const newRows = (getAllCustomer?.data || []).map((item, index) => ({
        id: item._id,
        ...item,
      }));
      setRows(newRows);
    }
  }, [getAllCustomer]);

  const handleDispatchClick = (result) => {
    dispatch(setCustomerInfo(result));
    navigate("/dispatch_Return");
  };

  return (
    <>
      <Box
        sx={{
          width: "90vw",
          marginX: "auto",
          display: "flex",
          justifyContent: "space-between",
          marginTop: "7rem",
          gap: "1rem",
          flexDirection: "column",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            display: "block",
            padding: ".6rem",
            fontSize: "2rem",
          }}
        >
          Customer Details
        </h2>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingRight: ".6rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "16px",
              flexBasis: "40%",
            }}
          >
            <TextField
              variant="outlined"
              label="Enter Name"
              name="name"
              value={value.name}
              onChange={handleOnChange}
            />
            <TextField
              variant="outlined"
              label="Enter Company Name"
              name="company"
              value={value.company}
              onChange={handleOnChange}
            />
            <TextField
              variant="outlined"
              label="Enter Email Address"
              name="email"
              value={value.email}
              onChange={handleOnChange}
            />
            <TextField
              variant="outlined"
              label="Enter Mobile Number"
              name="mobile"
              value={value.mobile}
              onChange={handleOnChange}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Loading.." : "Submit"}
            </Button>
          </Box>
          <Box sx={{ flexBasis: "50%", height: "70vh", overflow: "auto" }}>
            <DataGrid rows={rows} columns={columns} autoHeight />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AddCustomer;
