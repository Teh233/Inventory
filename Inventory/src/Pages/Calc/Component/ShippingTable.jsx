import React from "react";
import {
  Box,
  Typography,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  tableCellClasses,
  TableRow,
} from "@mui/material";
import { formatIndianPrice } from "../../../commonFunctions/commonFunctions";

const StyleSpan = styled("span")(({ theme }) => ({
  padding: "2px",
  border: "0.5px solid black",
  background: theme.palette.mode === "dark" ? "#fff" : "#fff",
  color: theme.palette.mode === "dark" ? "black" : "black",
  borderRadius: "5px",
}));

const StyleTableCell = styled(TableCell)(({ theme }) => ({
  // background: theme.palette.mode === "dark" ? "black" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "#fff",
  padding: 3,

  fontSize: "12x",
}));

function ShippingTable({
  product,
  shippingValue,
  shippingGstValue,
  totalShipping,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        border: "1px solid #fff",
      }}
    >
      {/* <Box
        display="flex"
        order={1}
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          padding: "0.5rem",
        }}
      >
        <TableContainer>
          <Table
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
              },
            }}
          >
            <TableBody>
              <TableRow>
                <StyleTableCell>Shipping Value</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {" "}
                      {formatIndianPrice(shippingValue[product.SKU])}{" "}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell> Shipping GST Value</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {" "}
                      {formatIndianPrice(shippingGstValue[product.SKU])}{" "}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>Total Shipping</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {" "}
                      {formatIndianPrice(totalShipping[product.SKU])}{" "}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box> */}

      {/* this is new shiping component */}
      <Box
        sx={{
          backgroundColor: "#cce6ff",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          placeItems: "center",
          justifyItems: "center",
          gap: ".3rem",
          padding: ".5rem",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: ".7rem", fontWeight: "600" }}>
            Shipping Value
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(shippingValue[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem", fontWeight: "600" }}>
            shipping GST Value
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(shippingGstValue[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem", fontWeight: "600" }}>
            Total Shipping
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(totalShipping[product.SKU])}
            disabled={true}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ShippingTable;
