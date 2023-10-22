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
  Typography,
  TableContainer,
  styled,
  Box,
  Button,
  Tooltip,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import CloseIcon from "@mui/icons-material/Close";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundImage: "linear-gradient(0deg, #01127D, #04012F)",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const BarcodeHistoryDialog = ({ open, onClose, serialData }) => {
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

  function objectToString(obj) {
    if (!obj) {
      return "No Subitem"
    }
    if (Object.keys(obj).length === 0) {
      return "No Subitems";
    }

    const keyValuePairs = [];

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        keyValuePairs.push(`${key} : ${obj[key]}`);
      }
    }

    return keyValuePairs.join(" , ");
  }
  console.log(serialData);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      // sx={{ backdropFilter: "blur(5px)" }}
      fullWidth
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
          SKU : {serialData?.SKU}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            backgroundColor: "lightgray",
            padding: ".5rem",
          }}
        >
          Product Name : {serialData?.Name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            padding: ".5rem",
          }}
        >
          Type :{" "}
          <span
            style={{ color: serialData?.Type === "Return" ? "red" : "green" }}
          >
            {" "}
            {serialData?.Type}{" "}
          </span>
        </Typography>

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
      <DialogContent sx={{ minWidth: 1000, height: 700, padding: "0" }}>
        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              sx={{
                position: "sticky",
                top: "0",
              }}
            >
              <TableRow>
                <StyledTableCell align="center">Sno</StyledTableCell>
                <StyledTableCell align="center">
                  {serialData?.Type === "Return"
                    ? "Return date"
                    : "Dispatch date"}
                </StyledTableCell>
                <StyledTableCell align="center">Barcode No</StyledTableCell>
                <StyledTableCell align="center">SubItem</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serialData?.SNo?.length > 0 ? (
                serialData?.SNo?.map((item, index) => (
                  <TableRow key={index}>
                    <StyledTableCell align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {new Date(
                        item.dispatchedAt || item.returedAt
                      ).toLocaleString("en-US", timeOptions)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.serialNumber}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Tooltip
                        title={objectToString(item.sub)}
                        placement="bottom"
                      >
                        <Button>View</Button>
                      </Tooltip>
                    </StyledTableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableCell align="center" colSpan={6}>
                    Not Genrated Yet !
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

export default BarcodeHistoryDialog;
