import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Button, Box, styled } from "@mui/material";
import CartGrid from "../../../components/Common/CardGrid";
import { useNavigate } from "react-router-dom";
import { useGetAllSellerQuery } from "../../../features/api/sellerApiSlice";
import Loading from "../../../components/Common/Loading";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));
const SellerVerificationList = () => {
  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /// global state

  /// local state
  const [row, setRow] = useState([]);

  /// rtk query

  const { refetch: refetchSeller, data: allSellerData ,isLoading:SellerList} =
    useGetAllSellerQuery("both");



  /// useEffect

  useEffect(() => {
    if (allSellerData?.status === "success") {
      const data = allSellerData.sellers.map((item, index) => {
        return {
          ...item,
          id: index,
          status:
            item.personalQuery === "not_submit"
              ? "Pending"
              : item.personalQuery,
          Sno: index + 1,
        };
      });
      setRow(data);
    }
  }, [allSellerData]);
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,

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

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 0.3,
      minWidth: 150,

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "mobileNo",
      headerName: "Mobile No",
      flex: 0.3,
      minWidth: 150,

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
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
      field: "status",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      minWidth: 170,
    },

    {
      field: "View",
      headerName: "Action",
      sortable: false,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button
          disabled={params.row.document === null ? true : false}
          onClick={() => {
            navigate(`/myAccount/${params.row.sellerId}?${params.row.personalQuery}`);
          }}
        >
          View
        </Button>
      ),
    },
  ];
  return (
    <StyledBox>
      <Grid item xs={12} sx={{ mt: "5px" }}>
        <Loading loading={SellerList}/>
        <CartGrid
          columns={columns}
          rows={row}
          rowHeight={40}
          Height={"82vh"}
        />
      </Grid>
    </StyledBox>
  );
};

export default SellerVerificationList;
