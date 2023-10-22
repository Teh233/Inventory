import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Button, Box, Stack, styled } from "@mui/material";
import { useGetSellerOrdersQuery } from "../../../features/api/orderApiSlice";
import { setAllOrder } from "../../../features/slice/productSlice";
import CartGrid from "../../../components/Common/CardGrid";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/Common/Loading";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const AllSellerOrderList = () => {
  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = useParams().id;

  /// global state
  const { orders } = useSelector((state) => state.product);

  /// rtk query
  const { refetch, data: allOrderData,isLoading:{singleSeller} } = useGetSellerOrdersQuery(id);

  /// useEffect

  useEffect(() => {
    if (allOrderData?.status === "success") {
      const data = allOrderData.data.map((item, index) => {
        return {
          ...item,
          id: index,
          Sno: index + 1,
          billAddress: item.billAddress.addressLine1,
          shipAddress: item.shipAddress.addressLine1,
        };
      });
      dispatch(setAllOrder(data));
    }
  }, [allOrderData]);

  /// columns
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
      field: "orderId",
      headerName: "Order Id",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "createdAt",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Date",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      valueFormatter: (params) => {
        const indianDate = new Date(params.value).toLocaleDateString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
        return indianDate;
      },
    },
    {
      field: "status",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "billAddress",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Billing Address",
      align: "center",
      headerAlign: "center",
      minWidth: 240,
    },
    {
      field: "shipAddress",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Shipping Address",
      align: "center",
      headerAlign: "center",
      minWidth: 240,
    },

    {
      field: "details",
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
            navigate(`/orderDetails/${params.row.orderId}`);
          }}
        >
          Details
        </Button>
      ),
    },
    {
      field: "subTotalSellerAmount",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Amount",
      align: "center",
      headerAlign: "center",
      flex: 0.2,
      minWidth: 100,
      valueFormatter: (params) => `₹ ${params.value}`,
    },
  ];
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Grid item xs={12} sx={{ mt: "5px" }}>
        <Loading loading={singleSeller}/>
        <CartGrid
          columns={columns}
          rows={orders}
          rowHeight={40}
          Height={"85.2vh"}
        />
      </Grid>
    </Box>
  );
};

export default AllSellerOrderList;
