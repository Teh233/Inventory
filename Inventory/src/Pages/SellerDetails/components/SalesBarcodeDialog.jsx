import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TableContainer,
  styled,
  Box,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import CloseIcon from "@mui/icons-material/Close";
import { useGetSingleSalesHistoryMutation } from "../../../features/api/barcodeApiSlice";
import { toast } from "react-toastify";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundImage: "linear-gradient(0deg, #01127D, #04012F)",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  padding:5
}));

const SalesBarcodeDialog = ({ open, onClose, serialData,formatDate }) => {
    // local state
  const [data, setData] = useState(null);

  /// rtk query call
  const [getSingleSales] = useGetSingleSalesHistoryMutation();

  useEffect(() => {
    if (serialData) {
      const fetchData = async () => {
        const response = await getSingleSales(serialData);
        if (response.data.status === "success") {
          setData(response.data.data);
        }
      };
      fetchData();
    }
  }, [serialData]);

  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle textAlign="center" sx={{ display: "flex", gap: "1rem" }}>
        <Box    
        sx={{
             display: "flex",
         width: "100%",
         backgroundColor:"#eee",
         justifyContent: "space-evenly",
         alignItems: "center",
            fontSize: "1rem",
            fontWeight: "bold",
             }}>
       
        <Box>
        <Typography
          variant="body2"
      
        >
          <span style={{fontWeight:"bold"}}> Customer Name </span>- {data?.result?.CustomerName}
        </Typography>
        </Box>
   
        </Box>
        <Box
          sx={{
            marginLeft: "auto",
          }}
        >
          <CloseIcon
            onClick={onClose}
            sx={{
              cursor: "pointer",
              background: "linear-gradient(0deg, #01127D, #04012F)",
              color: "#fff",
              borderRadius: "5rem",
              padding: ".1rem",
              marginLeft: "auto",
            }}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
      <Box display="flex" justifyContent="space-between">
        <Box>
   
        <Typography
          variant="body2"
      
        >
          <span style={{fontWeight:"bold"}}>Invoice No</span>- {data?.result?.InvoiceNo}
        </Typography>
        </Box>
        <Box>
        <Typography
          variant="body2"
      
        >
           <span style={{fontWeight:"bold"}}> Purchase Date </span>- {formatDate(data?.result?.Date)}
        </Typography>
        </Box>
        </Box>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead
          
            >
              <TableRow>
                <StyledTableCell align="center">Sno</StyledTableCell>
                <StyledTableCell align="center">Product Name</StyledTableCell>
                <StyledTableCell align="center">Barcode No</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.barcodeDetails?.length > 0 ? (
                data?.barcodeDetails?.map((item, index) => (
                  <TableRow key={index}>
                    <StyledTableCell align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">{item.name}</StyledTableCell>
                    <StyledTableCell align="center">{item.barcode}</StyledTableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableCell align="center" colSpan={2}>
                    No Barcode Data Available!
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default SalesBarcodeDialog;
