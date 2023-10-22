import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  TableContainer,
} from "@mui/material";

const BarcodeDialogbox = ({ open, onClose, serialNumbers }) => {

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          backgroundColor: "darkblue",
          display: "flex",
          justifyContent: "space-around",
          fontSize: "1rem",
          fontWeight: "bold",
          color: "white",
        }}
      >
        <Box>SKU: {serialNumbers?.products?.sku} </Box>{" "}
        <Box>Name: {serialNumbers?.products?.name}</Box>
      </DialogTitle>
      <DialogContent>
        <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                  align="center"
                >
                  Sno
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                  align="center"
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                  align="center"
                >
                  Serial Number
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                  align="center"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serialNumbers?.data?.map((serialData, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">
                    {new Date(serialData.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {serialData.serialNumber}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: serialData.isRejected ? "red" : "green" }}
                  >
                    {serialData.isRejected
                      ? "Rejected"
                      : serialData.isProcessed
                      ? "Sticked"
                      : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeDialogbox;
