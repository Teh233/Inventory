import React, { useState, useEffect } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  styled,
  tableCellClasses,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useGetSinglePriceHistoryQuery } from "../../../features/api/PriceHistoryApiSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "linear-gradient(0deg, #01127D, #04012F)",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const PriceHistoryDialogue = ({
  openHistory,
  handleCloseHistory,
  paramsData,
}) => {
  const { data: History, refetch } = useGetSinglePriceHistoryQuery(
    paramsData.SKU,
    {
      refetchOnMountOrArgChange: true,
      skip: !openHistory,
    }
  );

  const timeOptions = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  return (
    <Dialog
      open={openHistory}
      onClose={handleCloseHistory}
      sx={{ width: "100%", backdropFilter: "blur(5px)" }}
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
          SKU : {paramsData.SKU}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            backgroundColor: "lightgray",
            padding: ".5rem",
          }}
        >
          Product Name : {paramsData.productName}
        </Typography>
        <Button
          sx={{ position: "absolute", top: "0", right: "0" }}
          onClick={() => {
            handleCloseHistory();
          }}
        >
          <CancelIcon sx={{ fontSize: "2.3rem" }} />
        </Button>
      </DialogTitle>
      <DialogContent sx={{ minWidth: 1000, height: 500, padding: "0" }}>
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
              <StyledTableCell align="center">$ USD</StyledTableCell>
              <StyledTableCell align="center">¥ RMB</StyledTableCell>
              <StyledTableCell align="center">
                Conversion Rate 1 USD$
              </StyledTableCell>
              <StyledTableCell align="center">QTY</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {History?.status === "success" ? (
              History?.data?.PriceHistory?.map((item, index) => (
                <TableRow key={index}>
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell align="center">
                    {new Date(item.Date).toLocaleString("en-US", timeOptions)}
                  </StyledTableCell>
                  <StyledTableCell align="center">$ {item.USD}</StyledTableCell>
                  <StyledTableCell align="center">¥ {item.RMB}</StyledTableCell>
                  <StyledTableCell align="center">
                    ¥ {item.conversionRate}
                  </StyledTableCell>
                  <StyledTableCell align="center">
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

export default PriceHistoryDialogue;
