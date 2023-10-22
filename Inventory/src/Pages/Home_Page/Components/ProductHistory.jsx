import React, { useState, useEffect } from "react";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import CancelIcon from "@mui/icons-material/Cancel";
import { useGetProductHistoryQuery } from "../../../features/api/productApiSlice";
import { formatDate } from "../../../commonFunctions/commonFunctions";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const ProductHistory = ({
  openHistory,
  setOpenHistory,
  handleCloseHistory,
  productDetails,
}) => {
  /// local state

  const [productHistory, setProductHistory] = useState([]);
  //  rtk query

  const {
    data: productHistoryData,
    isLoading: productHistories,
    refetch,
  } = useGetProductHistoryQuery(productDetails.SKU, {
    skip: !openHistory,
    refetchOnMountOrArgChange: true,
  });

  /// useEffect
  useEffect(() => {
    if (productHistoryData?.status === "success") {
      setProductHistory(productHistoryData.data);
    }
  }, [productHistoryData]);

  /// time options
  const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
  return (
    <Dialog
      open={openHistory}
      onClose={handleCloseHistory}
      sx={{ width: "100%" }}
      maxWidth="xl"
    >
      <DialogTitle textAlign="center" sx={{ display: "flex", gap: "1rem" }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            backgroundColor: "lightgray",
            padding: ".5rem",
          }}
        >
          SKU : {productDetails.SKU}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            backgroundColor: "lightgray",
            padding: ".5rem",
          }}
        >
          Product Name : {productDetails.Name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            backgroundColor: "lightgray",
            padding: ".5rem",
          }}
        >
          GST : {productDetails.GST} %
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            backgroundColor: "lightgray",
            padding: ".5rem",
          }}
        >
          SalesTax : {productDetails.SalesTax} %
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            backgroundColor: "lightgray",
            padding: ".5rem",
          }}
        >
          SellerTax : {productDetails.SellerTax} %
        </Typography>
        <Button
          sx={{ position: "absolute", top: "0", right: "0" }}
          onClick={() => {
            setOpenHistory(false);
          }}
        >
          <CancelIcon sx={{ fontSize: "2.3rem" }} />
        </Button>
      </DialogTitle>
      <DialogContent sx={{ minWidth: 1000, height: "100%", padding: "0" }}>
        <Table sx={{ width: "100%" }}>
          <TableHead
            sx={{
              position: "sticky",
              top: "0",
            }}
          >
            <TableRow>
              <StyledTableCell align="center">Sno</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">MRP</StyledTableCell>
              <StyledTableCell align="center">Landing Cost</StyledTableCell>
              <StyledTableCell align="center">Profit Sales %</StyledTableCell>
              <StyledTableCell align="center">Sale Price</StyledTableCell>
              <StyledTableCell align="center">Profit Seller %</StyledTableCell>
              <StyledTableCell align="center">Seller Price</StyledTableCell>
              <StyledTableCell align="center">Quantity</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productHistory.length > 0 ? (
              productHistory.map((item, index) => (
                <TableRow key={index}>
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell>
                    {formatDate(item.Date)},{" "}
                    {new Date(item.Date).toLocaleString("en-US", timeOptions)}
                  </StyledTableCell>

                  <StyledTableCell
                    style={{
                      color: item.Type === "mrp" ? "red" : "black",
                    }}
                  >
                    ₹ {item.MRP}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      color: item.Type === "landingCost" ? "red" : "black",
                    }}
                  >
                    ₹ {item.LandingCost}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      color: item.Type === "landingCost" ? "red" : "black",
                    }}
                  >
                    {item.SalesPrice === 0 || item.LandingCost === 0
                      ? null
                      : (
                          ((item.SalesPrice - item.LandingCost) /
                            item.LandingCost) *
                          100
                        ).toFixed(2) + " %"}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      color: item.Type === "salesPrice" ? "red" : "black",
                    }}
                  >
                    ₹ {item.SalesPrice.toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      color: item.Type === "landingCost" ? "red" : "black",
                    }}
                  >
                    {item?.SellerPrice === 0 || item?.LandingCost === 0
                      ? null
                      : (
                          ((item.SellerPrice - item.LandingCost) /
                            item.LandingCost) *
                          100
                        ).toFixed(2) + " %"}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      color: item.Type === "sellerPrice" ? "red" : "black",
                    }}
                  >
                    ₹ {item.SellerPrice.toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      color: item.Type === "quantity" ? "red" : "black",
                    }}
                  >
                    {item.Quantity}
                  </StyledTableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <StyledTableCell align="center" colSpan={6}>
                  No history available
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ProductHistory;
