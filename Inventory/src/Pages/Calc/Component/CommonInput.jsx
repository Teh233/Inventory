import React, { useState } from "react";
import {
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import { BorderAllRounded } from "@mui/icons-material";

const CommonInput = ({
  unit,
  paymentTermCommon,
  handleValueChange,
  extraWeight,
  conversionRateBOE,
  conversionRatePayment,
  frieghtCommon,
  insuranceCommon,
  landingForOtherValueCommon,
  lateFee,
  swChargeCommon,
  ShippingFee,
  gstOnShipping,
  regularBillentry,
  warehouseCharge,
  bankCharge,
  otherCharge,
  Courier,
  WeightUnit,
}) => {
  return (
    <Box sx={{ padding: "0.5rem" }}>
      <Grid
        className="weight"
        container
        spacing={1}
        display="flex"
        justifyContent="center"
      >
        <Grid item order={4}>
          <Tooltip title="Extra Weight" arrow placement="top">
            <Typography
              variant="body2"
              sx={{ fontSize: "11px" }}
              textAlign="center"
            >
              Extra Weight
            </Typography>
          </Tooltip>
          <TextField
            type="number"
            value={extraWeight}
            onChange={(e) => {
              handleValueChange("extraWeight", null, e.target.value);
            }}
            // label="Extra Weight"
            variant="outlined"
            InputProps={{
              style: {
                width: "100px",
                height: "25px",
                borderRadius: "30px",
                backgroundColor: "	 #b3d9ff",
              },
            }}
          />
        </Grid>
        <Grid item order={1}>
          <FormControl variant="outlined">
            {/* <InputLabel>Unit</InputLabel> */}
            <Typography
              variant="body2"
              sx={{ fontSize: "11px" }}
              textAlign="center"
            >
              Unit
            </Typography>
            <Select
              value={unit}
              onChange={(e) => {
                handleValueChange("unit", null, e.target.value);
              }}
              // label="Unit"
              sx={{
                borderRadius: "30px",
                width: "100px",
                height: "25px", // Apply the same border radius to the Select component
                backgroundColor: "	 #b3d9ff",
              }}
            >
              <MenuItem value="cm">cm</MenuItem>
              <MenuItem value="mm">mm</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item order={1}>
          <FormControl variant="outlined">
            {/* <InputLabel>Unit</InputLabel> */}
            <Typography
              variant="body2"
              sx={{ fontSize: "11px" }}
              textAlign="center"
            >
              Payment Terms
            </Typography>
            <Select
              value={paymentTermCommon}
              onChange={(e) => {
                handleValueChange("paymentTermCommon", null, e.target.value);
              }}
              // label="Unit"
              sx={{
                borderRadius: "30px",
                width: "100px",
                height: "25px", // Apply the same border radius to the Select component
                backgroundColor: "	 #b3d9ff",
              }}
            >
              <MenuItem value="fob">FOB</MenuItem>
              <MenuItem value="cif">CIF</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {paymentTermCommon === "fob" ? (
          <Grid item order={5}>
            <Tooltip title="Frieght %" arrow placement="top">
              <div>
                {" "}
                <Typography
                  variant="body2"
                  sx={{ fontSize: "11px" }}
                  textAlign="center"
                >
                  Frieght %
                </Typography>
                <TextField
                  // label="Frieght %"
                  value={frieghtCommon}
                  onChange={(e) => {
                    handleValueChange("frieghtCommon", null, e.target.value);
                  }}
                  variant="outlined"
                  InputProps={{
                    style: {
                      width: "100px",
                      height: "25px",
                      borderRadius: "30px",
                      backgroundColor: "	 #b3d9ff",
                    },
                  }}
                />
              </div>
            </Tooltip>
          </Grid>
        ) : (
          ""
        )}

        {paymentTermCommon === "fob" ? (
          <Grid item order={5}>
            <Tooltip title="Insurance %" arrow placement="top">
              <div>
                {" "}
                <Typography
                  variant="body2"
                  sx={{ fontSize: "11px" }}
                  textAlign="center"
                >
                  Insurance %
                </Typography>
                <TextField
                  // label="Frieght %"
                  value={insuranceCommon}
                  onChange={(e) => {
                    handleValueChange("insuranceCommon", null, e.target.value);
                  }}
                  variant="outlined"
                  InputProps={{
                    style: {
                      width: "100px",
                      height: "25px",
                      borderRadius: "30px",
                      backgroundColor: "	 #b3d9ff",
                    },
                  }}
                />
              </div>
            </Tooltip>
          </Grid>
        ) : (
          ""
        )}

        <Grid item order={6}>
          <Tooltip title="SW Charge %" arrow placement="top">
            <div>
              <Typography
                variant="body2"
                sx={{ fontSize: "11px" }}
                textAlign="center"
              >
                SW Charge %
              </Typography>

              <TextField
                type="number"
                value={swChargeCommon}
                onChange={(e) => {
                  handleValueChange("swCharge", null, e.target.value);
                }}
                variant="outlined"
                InputProps={{
                  style: {
                    width: "100px",
                    height: "25px",
                    borderRadius: "30px",
                    backgroundColor: "	 #b3d9ff",
                  },
                }}
              />
            </div>
          </Tooltip>
        </Grid>
        <Grid item order={9}>
          <Tooltip title="Conversion Rate Payment" arrow placement="top">
            <div>
              {" "}
              <Typography
                variant="body2"
                sx={{ fontSize: "11px" }}
                textAlign="center"
              >
                C Rate Payment
              </Typography>
              <TextField
                type="number"
                // label="Conversion Rate Payment"
                value={conversionRatePayment}
                onChange={(e) => {
                  handleValueChange("ratePayment", null, e.target.value);
                }}
                variant="outlined"
                InputProps={{
                  style: {
                    width: "100px",
                    height: "25px",
                    borderRadius: "30px",
                    backgroundColor: "	 #b3d9ff",
                  },
                }}
              />
            </div>
          </Tooltip>
        </Grid>
        <Grid item order={8}>
          <Tooltip title="Conversion Rate BOE" arrow placement="top">
            <div>
              {" "}
              <Typography
                variant="body2"
                sx={{ fontSize: "11px" }}
                textAlign="center"
              >
                C Rate BOE
              </Typography>
              <TextField
                type="number"
                // label="Conversion Rate BOE"
                value={conversionRateBOE}
                onChange={(e) => {
                  handleValueChange("rateBoe", null, e.target.value);
                }}
                variant="outlined"
                InputProps={{
                  style: {
                    width: "100px",
                    height: "25px",
                    borderRadius: "30px",
                    backgroundColor: "	 #b3d9ff",
                  },
                }}
              />
            </div>
          </Tooltip>
        </Grid>
        <Grid item order={7}>
          <Tooltip title="landing for other values %" arrow placement="top">
            <div>
              {" "}
              <Typography
                variant="body2"
                sx={{ fontSize: "11px" }}
                textAlign="center"
              >
                L O V %
              </Typography>
              <TextField
                type="number"
                value={landingForOtherValueCommon}
                onChange={(e) => {
                  handleValueChange(
                    "landingOtherValueCommon",
                    null,
                    e.target.value
                  );
                }}
                // label="landing for other values %"
                variant="outlined"
                InputProps={{
                  style: {
                    width: "100px",
                    height: "25px",
                    borderRadius: "30px",
                    backgroundColor: "	 #b3d9ff",
                  },
                }}
              />
            </div>
          </Tooltip>
        </Grid>
        <Grid item order={10}>
          <Tooltip title="Late Fee" arrow placement="top">
            <div>
              {" "}
              <Typography
                variant="body2"
                sx={{ fontSize: "11px" }}
                textAlign="center"
              >
                Late Fee
              </Typography>
              <TextField
                type="number"
                value={lateFee}
                onChange={(e) => {
                  handleValueChange("lateFee", null, e.target.value);
                }}
                // label="Late Fee "
                variant="outlined"
                InputProps={{
                  style: {
                    width: "100px",
                    height: "25px",
                    borderRadius: "30px",
                    backgroundColor: "	 #b3d9ff",
                  },
                }}
              />
            </div>
          </Tooltip>
        </Grid>

        <Grid item order={11}>
          <Tooltip title="ShippingFee" arrow placement="top">
            <div>
              {" "}
              <Typography
                variant="body2"
                sx={{ fontSize: "11px" }}
                textAlign="center"
              >
                Shipping Fee
              </Typography>
              <TextField
                // label="ShippingFee"
                type="number"
                value={ShippingFee}
                onChange={(e) => {
                  handleValueChange("ShippingFee", null, e.target.value);
                }}
                variant="outlined"
                InputProps={{
                  style: {
                    width: "100px",
                    height: "25px",
                    borderRadius: "30px",
                    backgroundColor: "	 #b3d9ff",
                  },
                }}
              />
            </div>
          </Tooltip>
        </Grid>
        <Grid item order={8}>
          <Tooltip title="GST On Shipping %" arrow placement="top">
            <div>
              <Typography
                variant="body2"
                sx={{ fontSize: "11px" }}
                textAlign="center"
              >
                GST O S %
              </Typography>

              <TextField
                // label="GST On Shipping %"
                type="number"
                value={gstOnShipping}
                onChange={(e) => {
                  handleValueChange("gstOnShipping", null, e.target.value);
                }}
                variant="outlined"
                InputProps={{
                  style: {
                    width: "100px",
                    height: "25px",
                    borderRadius: "30px",
                    backgroundColor: "	 #b3d9ff",
                  },
                }}
              />
            </div>
          </Tooltip>
        </Grid>

        <Grid item order={11}>
          <Tooltip title="regular Bill of Entry charge" arrow placement="top">
            <div>
              <Typography
                variant="body2"
                sx={{ fontSize: "11px" }}
                textAlign="center"
              >
                R B O E C
              </Typography>

              <TextField
                // label="regular Bill of Entry charge"
                type="number"
                value={regularBillentry}
                onChange={(e) => {
                  handleValueChange("regularBillentry", null, e.target.value);
                }}
                variant="outlined"
                InputProps={{
                  style: {
                    width: "100px",
                    height: "25px",
                    borderRadius: "30px",
                    backgroundColor: "	 #b3d9ff",
                  },
                }}
              />
            </div>
          </Tooltip>
        </Grid>
        <Grid item order={12}>
          <Tooltip title="Warehouse charge" arrow placement="top">
            <div>
              <Typography
                variant="body2"
                sx={{ fontSize: "11px" }}
                textAlign="center"
              >
                Warehouse Charge
              </Typography>

              <TextField
                // label="Warehouse charge"
                type="number"
                value={warehouseCharge}
                onChange={(e) => {
                  handleValueChange("warehouseCharge", null, e.target.value);
                }}
                variant="outlined"
                InputProps={{
                  style: {
                    width: "100px",
                    height: "25px",
                    borderRadius: "30px",
                    backgroundColor: "	 #b3d9ff",
                  },
                }}
              />
            </div>
          </Tooltip>
        </Grid>
        <Grid item order={13}>
          <Tooltip title="Bank Charge" arrow placement="top">
            <div>
              <Typography
                variant="body2"
                sx={{ fontSize: "11px" }}
                textAlign="center"
              >
                Bank Charge
              </Typography>

              <TextField
                // label="Bank Charge"
                type="number"
                value={bankCharge}
                onChange={(e) => {
                  handleValueChange("bankCharge", null, e.target.value);
                }}
                variant="outlined"
                InputProps={{
                  style: {
                    width: "100px",
                    height: "25px",
                    borderRadius: "30px",
                    backgroundColor: "	 #b3d9ff",
                  },
                }}
              />
            </div>
          </Tooltip>
        </Grid>
        <Grid item order={14}>
          <Tooltip title="other Charge if any" arrow placement="top">
            <div>
              <Typography
                variant="body2"
                sx={{ fontSize: "11px" }}
                textAlign="center"
              >
                O C A
              </Typography>

              <TextField
                // label="other Charge if any"
                type="number"
                value={otherCharge}
                onChange={(e) => {
                  handleValueChange("otherCharge", null, e.target.value);
                }}
                variant="outlined"
                InputProps={{
                  style: {
                    width: "100px",
                    height: "25px",
                    borderRadius: "30px",
                    backgroundColor: "	 #b3d9ff",
                  },
                }}
              />
            </div>
          </Tooltip>
        </Grid>
        <Grid item order={3}>
          <FormControl variant="outlined">
            {/* <InputLabel>Unit</InputLabel> */}
            <Typography
              variant="body2"
              sx={{ fontSize: "11px" }}
              textAlign="center"
            >
              Weight Unit
            </Typography>
            <Select
              value={WeightUnit}
              onChange={(e) => {
                handleValueChange("WeightUnit", null, e.target.value);
              }}
              // label="Unit"
              sx={{
                borderRadius: "30px",
                width: "100px",
                height: "25px", // Apply the same border radius to the Select component
                backgroundColor: "	 #b3d9ff",
              }}
            >
              <MenuItem value="kg">kg</MenuItem>
              <MenuItem value="gm">gm</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item order={2}>
          <FormControl variant="outlined">
            {/* <InputLabel>Unit</InputLabel> */}
            <Typography
              variant="body2"
              sx={{ fontSize: "11px" }}
              textAlign="center"
            >
              Mode
            </Typography>
            <Select
              value={Courier}
              onChange={(e) => {
                handleValueChange("Courier", null, e.target.value);
              }}
              // label="Unit"
              sx={{
                borderRadius: "30px",
                width: "100px",
                height: "25px", // Apply the same border radius to the Select component
                backgroundColor: "	 #b3d9ff",
              }}
            >
              <MenuItem value="cargo">cargo</MenuItem>
              <MenuItem value="courier">courier</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommonInput;
