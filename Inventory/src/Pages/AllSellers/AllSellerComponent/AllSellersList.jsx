import React, { useEffect, useState } from "react";
import { Grid, Button, Box, styled, Typography } from "@mui/material";
import CartGrid from "../../../components/Common/CardGrid";
import { useNavigate } from "react-router-dom";
import { useGetAllSellerQuery } from "../../../features/api/sellerApiSlice";
import Loading from "../../../components/Common/Loading";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));

const AllSellersList = () => {
  // show no data after some seconds

  /// initialization

  const navigate = useNavigate();

  /// global state

  /// local state
  const [row, setRow] = useState([]);

  /// rtk query

  const {
    refetch: refetchSeller,
    data: allSellerData,
    isLoading: allverifySeller,
  } = useGetAllSellerQuery("verified");

  /// useEffect

  useEffect(() => {
    if (allSellerData?.status === "success") {
      const data = allSellerData.sellers.map((item, index) => {
        return {
          ...item,
          id: index,
          name: item.document.concernPerson,
          Sno: index + 1,
          mobile: item.document.mobileNo,
          gst: item.document.gst,
        };
      });
      setRow(data);
    }
  }, [allSellerData]);

  /// columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,
      // maxWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "sellerId",
      headerName: "Seller Id",
      flex: 0.3,
      minWidth: 100,
      // maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.3,
      minWidth: 150,
      // maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "mobile",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Mobile",
      align: "center",
      headerAlign: "center",
      flex: 0.2,
      minWidth: 130,
      // maxWidth: 130,
    },
    {
      field: "email",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Email",
      align: "center",
      headerAlign: "center",
      minWidth: 260,
    },
    {
      field: "gst",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "GST",
      align: "center",
      headerAlign: "center",
      minWidth: 170,
    },

    {
      field: "Orders",
      headerName: "Action",
      sortable: false,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button
          onClick={() => {
            navigate(
              `/sellerOrders/${params.row.sellerId}?${params.row.personalQuery}`
            );
          }}
        >
          Orders
        </Button>
      ),
    },
    {
      field: "View",
      headerName: "Details",
      sortable: false,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button
          onClick={() => {
            navigate(`/myAccount/${params.row.sellerId}`);
          }}
        >
          Profile
        </Button>
      ),
    },
  ];
  return (
    <StyledBox>
      <Grid item xs={12} sx={{ mt: "5px" }}>
        <Loading loading={allverifySeller} />
        <CartGrid columns={columns} rows={row} rowHeight={40} Height={"85vh"} />
      </Grid>
    </StyledBox>
  );
};

export default AllSellersList;
