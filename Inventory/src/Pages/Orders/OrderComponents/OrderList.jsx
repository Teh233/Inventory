import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Button, Box, styled } from "@mui/material";
import { useGetAllOrdersQuery } from "../../../features/api/orderApiSlice";
import { setAllOrder } from "../../../features/slice/productSlice";
import CartGrid from "../../../components/Common/CardGrid";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Common/Loading";
import { formatDate } from "../../../commonFunctions/commonFunctions";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));
const OrderList = () => {
  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /// global state
  const { orders } = useSelector((state) => state.product);

  /// rtk query
  const { refetch, data: allOrderData ,isLoading:orderLoading} = useGetAllOrdersQuery();

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

  useEffect(() => {
    refetch();
  }, []);
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
      field: "concernPerson",
      headerName: "Name",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "mobileNo",
      headerName: "Mobile",
      flex: 0.3,
      minWidth: 100,
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
        const indianDate = formatDate(params.value)
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
    // {
    //   field: "billAddress",
    //   headerClassName: "super-app-theme--header",
    //   cellClassName: "super-app-theme--cell",
    //   headerName: "Billing Address",
    //   align: "center",
    //   headerAlign: "center",
    //   minWidth: 240,
    // },
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
      valueFormatter: (params) => `₹ ${params.value}`
    },
  ];
  return (
    <StyledBox>
      <Grid item xs={12} sx={{ mt: "5px" }}>
        <Loading loading={orderLoading}/>
        <CartGrid
          columns={columns}
          rows={orders}
          rowHeight={40}
          Height={"85vh"}
        />
      </Grid>
    </StyledBox>
  );
};

export default OrderList;
