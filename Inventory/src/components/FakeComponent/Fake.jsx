import React from "react";
import { makeStyles } from "@mui/styles";
import { TextField, Box, Typography } from "@mui/material";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function WeightTable({
  product,
  qty,
  volumeWeight,
  handleValueChange,
  dimensions,
  volumeWeightRatio,
  extraWeightIntoRatio,
  finalWeight,
  actualWeight,
  weightCompare,
  totalWeight,
}) {
  const classes = useStyles();

  return (
    <Box p={3} border={1} borderColor="grey" borderRadius={8}>
      <Typography variant="h4" gutterBottom>
        Final Total (Total CD + Total shipping + total otherCharge):{" "}
        {formatIndianPrice(finalTotal[product.SKU])}
      </Typography>
      <Typography variant="h4" gutterBottom>
        GST Recover: {formatIndianPrice(finalGst[product.SKU])}
      </Typography>
      <Typography variant="h4" gutterBottom>
        Final Total Excl GST :
        {formatIndianPrice(finalTotalExcludeGst[product.SKU])}
      </Typography>
      <Typography variant="h4" gutterBottom>
        Final Landing Cost Excl GST:{" "}
        {formatIndianPrice(finalLandingCostExGst[product.SKU])}
      </Typography>
      <Typography variant="h4" gutterBottom>
        Landing Cost (1 unit) Excl GST :
        {formatIndianPrice(landingCostExGst[product.SKU])}
      </Typography>
      <Typography variant="h4" gutterBottom>
        Landing Cost (1 unit) with GST :
        {formatIndianPrice(landingCost[product.SKU])}
      </Typography>
    </Box>
  );
}

export default WeightTable;
