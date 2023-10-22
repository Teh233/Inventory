import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  IconButton,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import Loading from "../../../components/Common/Loading";
import { useGetOneProductQuery } from "../../../features/api/productApiSlice";
import { useEffect } from "react";

const UpdateStockDialog = ({
  SKU,
  open,
  setOpen,
  updateProductsApi,
  RefetchAll,
  loading,
  socket,
  userInfo,
}) => {
  /// local state
  const [stock, setStock] = useState(0);

  /// rtk query
  const {
    data: oneProductData,
    isLoading,
    refetch,
  } = useGetOneProductQuery(SKU, {
    skip: !open,
    refetchOnMountOrArgChange: true,
  });

  const handleStockChange = (event) => {
    setStock(Number(event.target.value));
  };

  const handleStockIncrease = () => {
    setStock((prevStock) => prevStock + 1);
  };

  const handleStockDecrease = () => {
    if (stock === 0) {
      return;
    }
    setStock((prevStock) => Math.max(prevStock - 1, 0));
  };
  const handleSellerPrice = async () => {
    try {
      if (stock === 0) {
        window.alert("Please Add New Stock Quantity");
        return;
      }
      const params = {
        type: "Quantity",
        body: { products: { SKU: SKU, value: stock } },
      };

      const res = await updateProductsApi(params).unwrap();
      const liveStatusData = {
        message: `${userInfo.name} updated Quantity of ${SKU} by ${stock} `,
        time: new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      };
      socket.emit("liveStatusServer", liveStatusData);
      setOpen(false);
      RefetchAll();

      setStock(0);
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setStock(0);
      }}
    >
      <DialogTitle>Stock Update</DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>{oneProductData?.data?.Name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>{oneProductData?.data?.Brand}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SKU Code</TableCell>
              <TableCell>{oneProductData?.data?.SKU}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box
          sx={{
            // border: '2px solid blue',
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {" "}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexBasis: "40%",
            }}
          >
            {" "}
            <Typography variant="paragraph" sx={{ fontWeight: "bold" }}>
              Current Stock
            </Typography>
            <Typography variant="paragraph">
              {oneProductData?.data?.ActualQuantity}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconButton onClick={handleStockDecrease}>
              <Remove />
            </IconButton>
            <TextField
              sx={{ width: "80px" }}
              type="number"
              value={stock === 0 ? "" : stock}
              onChange={handleStockChange}
            />
            <IconButton onClick={handleStockIncrease}>
              <Add />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
      <Box sx={{ display: "flex", justifyContent: "end", padding: ".5rem" }}>
        <Button variant="contained" onClick={handleSellerPrice}>
          {loading ? (
            <CircularProgress size={24} color="inherit" /> // Show loading indicator
          ) : (
            "update"
          )}
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            setStock(0);
            setData({});
          }}
        >
          cancel
        </Button>
      </Box>
    </Dialog>
  );
};

export default UpdateStockDialog;
