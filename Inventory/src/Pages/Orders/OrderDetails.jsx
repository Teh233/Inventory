import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  styled,
  Paper,
  Grid,
  Tooltip,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { toast } from "react-toastify";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CartGrid from "../../components/Common/CardGrid";
import { useSelector, useDispatch } from "react-redux";
import { setOneOrder } from "../../features/slice/productSlice";
import {
  useGetOrdersByIdQuery,
  useUpdateOrderMutation,
  useRemoveOrderItemMutation,
} from "../../features/api/orderApiSlice";

import { useNavigate, useParams } from "react-router-dom";
import ToggleNav from "../../components/Common/Togglenav";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  display: "flex",
  justifyContent: "right",
}));
const StyledButton = styled(Button)(({ theme }) => ({
  // backgroundColor: theme.palette.mode === "dark" ? "" : "#fff",
  // color: theme.palette.mode === "dark" ? "error" : "secondary",
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Item_2 = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  display: "flex",
  justifyContent: "end",
  alignItems: "end",
}));
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#eee",
  height: "100vh",
}));
const OrderDetails = ({ theme }) => {
  const rowHeight = 50;
  const Height = "60vh";
  const [showIcon, setShowIcon] = useState(false);

  //toggleshow

  const toggleShowNav = useSelector((state) => state.ui.ShowSide_nav);

  /// initialization
  const dispatch = useDispatch();
  const { id } = useParams();

  /// global state

  const { oneOrder } = useSelector((state) => state.product);

  /// local state

  const [hideColumn, setHideColumn] = useState(true);
  const [newQuantity, setNewQuantity] = useState([]);
  const [newSellerPrice, setNewSellerPrice] = useState([]);

  // console.log(oneOrder);
  /// rtk query
  console.log(newSellerPrice);
  const { refetch: refetchOneOrder, data: oneOrderData } =
    useGetOrdersByIdQuery(id);

  const [updateOrderApi] = useUpdateOrderMutation();
  const [removeOrderItemApi] = useRemoveOrderItemMutation();

  /// useEffect

  useEffect(() => {
    if (oneOrderData && oneOrderData.data) {
      const data = oneOrderData.data.orderItems.map((item, index) => {
        return {
          ...item,
          id: index,
          subTotal: item.sellerPrice * item.quantity,
        };
      });
      dispatch(setOneOrder({ ...oneOrderData.data, orderItems: data }));
    }
  }, [oneOrderData]);

  /// handlers

  const handleEditQuantity = () => {
    setHideColumn(!hideColumn);
    setShowIcon(!showIcon);
  };

  const handleQuantityUpdate = async () => {
    try {
      const newFilteredQuantity = newQuantity.filter(
        (element) => element !== ""
      );
      const newFilteredSellerPrice = newSellerPrice.filter(
        (element) => element !== ""
      );
      const data = {
        id: id,
        body: {
          orderItems: newFilteredQuantity,
          updatedPrice: newFilteredSellerPrice,
        },
      };
      console.log(data);
      const res = await updateOrderApi(data).unwrap();
      refetchOneOrder();
      toast.success("Quantity Updated Successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      handleDiscardChange();
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const handleDiscardChange = () => {
    setHideColumn(true);
    setShowIcon(false);
    setNewQuantity([]);
  };

  const handleRemoveItem = async (sku) => {
    try {
      const data = {
        id: id,
        body: { skus: [sku] },
      };
      console.log(data);
      const res = await removeOrderItemApi(data).unwrap();
      refetchOneOrder();
      toast.success("item removed from order Successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      handleDiscardChange();
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };
  /// columns
  const columns = [
    {
      field: "product",
      headerName: "Product",
      flex: 0.6,
      width: 300,
      // align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: "20px" }}>
          <Box>
            <Tooltip title="IRS drone sec" placement="top">
              <Typography
                variant="subtitle2"
                display="block"
                gutterBottom
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "wrap",
                  maxWidth: "100%",
                }}
              >
                {params.row.name}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      ),
    },
    {
      field: "SKU",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "SKU",
      align: "center",
      headerAlign: "center",
      flex: 0.2,
      minWidth: 100,
    },
    {
      field: "GST",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "GST %",
      align: "center",
      headerAlign: "center",
      flex: 0.2,
      minWidth: 50,
      valueFormatter: (params) => `${Number(params.value).toFixed(2)} %`,
    },
    {
      field: "salesPrice",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Sales Price",
      align: "center",
      headerAlign: "center",
      flex: 0.2,
      minWidth: 50,
      valueFormatter: (params) => `₹ ${Number(params.value).toFixed(2)}`,
    },

    {
      field: "sellerPrice",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Seller Price",
      align: "center",
      headerAlign: "center",
      flex: 0.3,
      minWidth: 100,
      valueFormatter: (params) => `₹ ${Number(params.value).toFixed(2)}`,
    },
    {
      field: "sellerPriceUpdate",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "New Seller Price",
      align: "center",
      headerAlign: "center",
      flex: 0.3,
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: "20px" }}>
          <TextField
            type="number"
            value={
              newSellerPrice[params.row.id]?.newSellerPrice
                ? newSellerPrice[params.row.id]?.newSellerPrice
                : ""
            }
            onChange={(event) => {
              const { value } = event.target;
              const updateNewSellerPrice = [...newSellerPrice];
              
              // Get the current date and time
              const currentDate = new Date();
              const formattedDate = `${currentDate.getDate()}-${
                currentDate.getMonth() + 1
              }-${currentDate.getFullYear()}`;
              const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
              const dateTime = `${formattedTime}, ${formattedDate}`;

              updateNewSellerPrice[params.row.id] = {
                sku: params.row.SKU,
                newSellerPrice: +value,
                date: dateTime,
              };
              setNewSellerPrice(updateNewSellerPrice);
            }}
          />
        </Box>
      ),
    },
    {
      field: "Stock",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Stock",
      align: "center",
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "quantity",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Quantity",
      align: "center",
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "quantityUpdate",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "New Quantity",
      align: "center",
      headerAlign: "center",
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: "20px" }}>
          <TextField
            type="number"
            value={
              newQuantity[params.row.id]?.qty
                ? newQuantity[params.row.id]?.qty
                : ""
            }
            onChange={(event) => {
              const { value } = event.target;
              const updateNewQuantity = [...newQuantity];

              // Get the current date and time
              const currentDate = new Date();
              const formattedDate = `${currentDate.getDate()}-${
                currentDate.getMonth() + 1
              }-${currentDate.getFullYear()}`;
              const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
              const dateTime = `${formattedTime}, ${formattedDate}`;

              updateNewQuantity[params.row.id] = {
                sku: params.row.SKU,
                qty: +value,
                date: dateTime,
              };
              setNewQuantity(updateNewQuantity);
            }}
          />
        </Box>
      ),
    },

    {
      field: "subTotal",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Sub Total",
      align: "center",
      headerAlign: "center",
      flex: 0.2,
      minWidth: 100,
      valueFormatter: (params) => `₹ ${Number(params.value).toFixed(2)}`,
    },
    {
      field: "deleteItem",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Remove",
      align: "center",
      headerAlign: "center",
      flex: 0.2,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              handleRemoveItem(params.row.SKU);
            }}
          >
            <DeleteIcon />
          </Button>
        );
      },
    },
  ];
  const updatedColumns = hideColumn
    ? columns.filter(
        (column) =>
          column.field !== "quantityUpdate" &&
          column.field !== "deleteItem" &&
          column.field !== "sellerPriceUpdate"
      )
    : columns;
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 0,
        width: "100%",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <DrawerHeader />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Item>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h5">Shipping Address</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box>
                        <Typography variant="h6">
                          {oneOrder?.shipAddress?.name}
                        </Typography>
                        <Typography variant="body2">
                          Mobile: {oneOrder?.shipAddress?.mobileNo}
                        </Typography>
                        <Typography variant="body2">
                          {oneOrder?.shipAddress?.city},{" "}
                          {oneOrder?.shipAddress?.state}
                        </Typography>
                        <Typography variant="body2">
                          Address: {oneOrder?.shipAddress?.addressLine1}
                        </Typography>
                        <Typography variant="body2">
                          {oneOrder?.shipAddress?.pincode}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h5">Billing Address</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box>
                        <Typography variant="h6">
                          {oneOrder?.billAddress?.name}
                        </Typography>
                        <Typography variant="body2">
                          Mobile: {oneOrder?.billAddress?.mobileNo}
                        </Typography>
                        <Typography variant="body2">
                          {oneOrder?.billAddress?.city},{" "}
                          {oneOrder?.billAddress?.state}
                        </Typography>
                        <Typography variant="body2">
                          Address: {oneOrder?.billAddress?.addressLine1}
                        </Typography>
                        <Typography variant="body2">
                          Address: {oneOrder?.billAddress?.pincode}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Item>
          </Grid>
        </Grid>

        <Grid item xs={12} sx={{ mt: "5px" }}>
          <Item>
            <CartGrid
              columns={updatedColumns}
              rows={oneOrder?.orderItems ? oneOrder.orderItems : []}
              rowHeight={rowHeight}
              Height={Height}
            />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item_2>
            <Box sx={{ width: "100%" }}>
              <Stack direction="row" justifyContent="space-around">
                <Typography variant="h6">
                  Price : ₹{" "}
                  {oneOrder?.subTotalSalesAmount
                    ? Number(oneOrder.subTotalSalesAmount).toFixed(2)
                    : 0}
                </Typography>

                <Typography variant="h6">
                  Total Discount : ₹{" "}
                  {oneOrder?.subTotalSalesAmount -
                  oneOrder?.subTotalSellerAmount
                    ? Number(
                        oneOrder?.subTotalSalesAmount -
                          oneOrder?.subTotalSellerAmount
                      ).toFixed(2)
                    : 0}
                </Typography>

                <Typography variant="h6">
                  Total Amount : ₹{" "}
                  {Number(oneOrder?.subTotalSellerAmount).toFixed(2)}
                </Typography>
              </Stack>
            </Box>
          </Item_2>
        </Grid>
      </Box>
      <Grid
        sx={{
          display: "flex",
          alignItems: "end",
          justifyContent: "end",
          marginTop: "1.5rem",
        }}
      >
        <Box sx={{ width: "100%", padding: "0.5rem 1.5rem" }}>
          <Stack direction="row" justifyContent="space-between">
            <StyledButton
              color="error"
              variant="contained"
              size="small"
              onClick={handleEditQuantity}
            >
              edit...
              {/* <EditIcon sx={{fontSize:'1.3rem'}}/> */}
            </StyledButton>

            <Box sx={{ width: "20%", display: "flex", gap: "2rem" }}>
              {showIcon && (
                <>
                  {" "}
                  <StyledButton
                    color="secondary"
                    variant="contained"
                    size="small"
                    onClick={handleQuantityUpdate}
                  >
                    save
                  </StyledButton>
                  <StyledButton
                    onClick={handleDiscardChange}
                    color="success"
                    variant="contained"
                    size="small"
                  >
                    Discard
                  </StyledButton>
                </>
              )}
            </Box>
          </Stack>
        </Box>
      </Grid>
    </Box>
  );
};

export default OrderDetails;
