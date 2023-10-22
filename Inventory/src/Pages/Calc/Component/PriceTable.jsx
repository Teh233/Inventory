import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { TextField, Box, Typography, styled, TableCell } from "@mui/material";
import {
  formatIndianPrice,
  formatUSDPrice,
} from "../../../commonFunctions/commonFunctions";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const StyleSpan = styled("span")(({ theme }) => ({
  padding: "2px",
  border: "0.5px solid black",
  background: theme.palette.mode === "dark" ? "#fff" : "#fff",
  color: theme.palette.mode === "dark" ? "black" : "black",
  borderRadius: "5px",
}));

const StyleTextfeild = styled(TextField)(({ theme }) => ({
  background: theme.palette.mode === "dark" ? "black" : "#fff",
  color: theme.palette.mode === "dark" ? "black" : "black",
}));

const StyleTableCell = styled(TableCell)(({ theme }) => ({
  // background: theme.palette.mode === "dark" ? "black" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "#fff",
  padding: 3,
  fontSize: "12px",
}));

function PriceTable({
  product,
  handleValueChange,
  usdPrice,
  totalUsdPrice,
  usdPriceRatio,
  indianRateBoe,
  indianRatePayment,
  frieght,
  insurance,
  landingForOtherValue,
  assesableValue,
  basicDutyPer,
  basicDutyValue,
  swCharge,
  gstPer,
  gstRate,
  lateFeeValue,
  cdTotal,
  setGstPer,
}) {
  useEffect(() => {
    if (gstPer) {
      return;
    }
    setGstPer({ ...gstPer, [product.SKU]: product.GST });
  }, [product]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",

        border: "1px solid #fff",
      }}
    >
      {/* <Box
        order={1}
        sx={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "10px",
        }}
      >
        <Box>
          <Typography variant="body2" gutterBottom textAlign="center">
            Usd Price
          </Typography>
          <StyleTextfeild
            type="number"
            variant="outlined"
            size="small"
            sx={{
              "& input": {
                width: "50px",
                height: "10px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            value={usdPrice[product.SKU] ? usdPrice[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("usdPrice", product.SKU, +e.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography variant="body2" gutterBottom textAlign="center">
            Basic Duty
          </Typography>
          <StyleTextfeild
            type="number"
            variant="outlined"
            size="small"
            sx={{
              "& input": {
                width: "100px",
                height: "10px",
              },
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            value={basicDutyPer[product.SKU] ? basicDutyPer[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("basicDutyPer", product.SKU, +e.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography variant="body2" gutterBottom textAlign="center">
            GST
          </Typography>
          <StyleTextfeild
            type="number"
            variant="outlined"
            size="small"
            sx={{
              "& input": {
                width: "50px",
                height: "10px",
              },
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            value={gstPer[product.SKU] ? gstPer[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("gstPer", product.SKU, +e.target.value);
            }}
          />
        </Box>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        padding="0.5rem"
        order={2}
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
                <StyleTableCell>Total USD</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatUSDPrice(totalUsdPrice[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>Price Ratio</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {usdPriceRatio[product.SKU]?.toFixed(2) || 0}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>Boe Price</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(indianRateBoe[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>Payment Price</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(indianRatePayment[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
              </TableRow>
              <TableRow>
                <StyleTableCell>Frieght</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(frieght[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>Insurance</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(insurance[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>Landing for Other Value</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(landingForOtherValue[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>Assesable Value</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(assesableValue[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
              </TableRow>

              <TableRow>
                <StyleTableCell>Basic Duty Value</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(basicDutyValue[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>SW Charge</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(swCharge[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>GST Value</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(gstRate[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>Late Fee</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(lateFeeValue[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
              </TableRow>

              <TableRow>
                <StyleTableCell>CD Total</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(cdTotal[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box> */}

      {/* This is ujjus code */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: ".3rem",
          backgroundColor: "#cce6ff",
          padding: ".5rem",
          placeItems: "center",
          justifyItems: "center",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: "bold", fontSize: ".7rem" }}>
            USD Price
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={usdPrice[product.SKU] ? usdPrice[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("usdPrice", product.SKU, +e.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold", fontSize: ".7rem" }}>
            Basic Duty
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={basicDutyPer[product.SKU] ? basicDutyPer[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("basicDutyPer", product.SKU, +e.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold", fontSize: ".7rem" }}>
            GST
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={gstPer[product.SKU] ? gstPer[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("gstPer", product.SKU, +e.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Total USD</Typography>
          <input
            type="text"
            disabled={true}
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatUSDPrice(totalUsdPrice[product.SKU])}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Price ratio</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={usdPriceRatio[product.SKU]?.toFixed(2) || 0}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Boe Price</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(indianRateBoe[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Payment Price</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(indianRatePayment[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Freight</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(frieght[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>insurance</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(insurance[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>
            Landing for other value
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(landingForOtherValue[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Assessable Value</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(assesableValue[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Basic duty value</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(basicDutyValue[product.SKU])}
            disabled={true}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>SW charge</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(swCharge[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>GST value</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(gstRate[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>Late fee</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(lateFeeValue[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".7rem" }}>CD Total</Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={formatIndianPrice(cdTotal[product.SKU])}
            disabled={true}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default PriceTable;
