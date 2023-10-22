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
  TableRow,
  tableCellClasses,
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
  fontSize: "12px",
}));

function FinalCalcTable({
  product,
  finalTotal,
  finalTotalExcludeGst,
  finalGst,
  landingCost,
  finalLandingCostExGst,
  landingCostExGst,
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
      > */}
      {/* <Typography variant="body2" gutterBottom>
        Final Total (Total CD + Total shipping + total otherCharge):{" "} <StyleSpan >
        {formatIndianPrice(finalTotal[product.SKU])}
        </StyleSpan>
      </Typography>
      <Typography variant="body2" gutterBottom>
        GST Recover: <StyleSpan > {formatIndianPrice(finalGst[product.SKU])} </StyleSpan>
      </Typography>
      <Typography variant="body2" gutterBottom>
        Final Total Excl GST : <StyleSpan >
        {formatIndianPrice(finalTotalExcludeGst[product.SKU])}
        </StyleSpan>
      </Typography>
      <Typography variant="body2" gutterBottom>
        Final Landing Cost Excl GST:{" "} <StyleSpan >
        {formatIndianPrice(finalLandingCostExGst[product.SKU])}
        </StyleSpan>
      </Typography>
      <Typography variant="body2" gutterBottom>
        Landing Cost (1 unit) Excl GST : <StyleSpan >
        {formatIndianPrice(landingCostExGst[product.SKU])}
        </StyleSpan>
      </Typography>
      <Typography variant="body2" gutterBottom>
        Landing Cost (1 unit) with GST : <StyleSpan >
        {formatIndianPrice(landingCost[product.SKU])}
        </StyleSpan>
      </Typography> */}

      {/* <TableContainer>
          <Table
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
              },
            }}
          >
            <TableBody>
              <TableRow>
                <StyleTableCell>
                  Final Total (Total CD + Total shipping + total otherCharge)
                </StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(finalTotal[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell> GST Recover</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(finalGst[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell> Final Total Excl GST</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(finalTotalExcludeGst[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
              </TableRow>
              <TableRow>
                <StyleTableCell>Final Landing Cost Excl GST: </StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(finalTotalExcludeGst[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>Landing Cost (1 unit) Excl GST </StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(landingCostExGst[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>Landing Cost (1 unit) with GST </StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(landingCost[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box> */}

      {/* the new component of this component */}
      <Box
        sx={{
          backgroundColor: "#cce6ff",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          placeItems: "center",
          justifyItems: "start",
          gap: ".3rem",
          padding: ".5rem",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: ".555rem", fontWeight: "600" }}>
            Final Total (Total CD + Total Shipping + Total other Charge)
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(finalTotal[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".555rem", fontWeight: "600" }}>
            GST Recover
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(finalGst[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".555rem", fontWeight: "600" }}>
            Final Total Excel GST
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(finalTotalExcludeGst[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".555rem", fontWeight: "600" }}>
            Final Landing Cost Excel GST:
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(finalLandingCostExGst[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".555rem", fontWeight: "600" }}>
            Landing cost (1 unit) Excel GST:
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(landingCostExGst[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".555rem", fontWeight: "600" }}>
            Landing Cost (1 unit with GST)
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(landingCost[product.SKU])}
            disabled={true}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default FinalCalcTable;
