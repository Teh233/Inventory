import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  TextField,
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
  index,
  setDimensions,
  setActualWeight,
  WeightUnit,
  unit,
  id,
  isInitialCheck,
}) {
  const classes = useStyles();

  useEffect(() => {
    if (!id || isInitialCheck.current) {
      const dimensionsToUpdate = {
        L: product?.Dimensions?.length,
        W: product?.Dimensions?.width,
        H: product?.Dimensions?.height,
      };

      setDimensions({ ...dimensions, [product.SKU]: dimensionsToUpdate });
      const newActualWeight =
        WeightUnit === "kg"
          ? Math.ceil(product.Weight || 0) / 1000
          : Math.ceil(product.Weight || 0);
      setActualWeight({
        ...actualWeight,
        [product.SKU]: newActualWeight,
      });
    }
  }, [product]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid #fff",
      }}
    >
      {/* <Box
        display="flex"
        order={1}
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
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
                <StyleTableCell>
                  Volume weight<sup>({WeightUnit})</sup>
                </StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {volumeWeight[product.SKU]?.toFixed(3) || null}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>
                  Weight compare<sup>({WeightUnit})</sup>
                </StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {weightCompare[product.SKU]?.toFixed(3) || null}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>
                  {" "}
                  Total Weight<sup>({WeightUnit})</sup>
                </StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {totalWeight[product.SKU]?.toFixed(3) || null}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>
                  {" "}
                  ExtraWeight<sup>({WeightUnit})</sup>
                </StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {WeightUnit === "gm"
                        ? (
                            (extraWeightIntoRatio[product.SKU] || 0) / 1000
                          ).toFixed(3)
                        : extraWeightIntoRatio[product.SKU]?.toFixed(3) ||
                          null}{" "}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
              </TableRow>
              <TableRow>
                <StyleTableCell>
                  {" "}
                  Final weight<sup>({WeightUnit})</sup>
                </StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {finalWeight[product.SKU]?.toFixed(3) || null}{" "}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell> Weight ratio</StyleTableCell>
                <StyleTableCell>
                  <Typography variant="body2" gutterBottom>
                    <StyleSpan>
                      {volumeWeightRatio[product.SKU]?.toFixed(3)}%{" "}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "20px",
        }}
      >
        <Box>
          <Typography variant="body2" gutterBottom textAlign="center">
            Quantity
          </Typography>
          <StyleTextfeild
            type="number"
            variant="outlined"
            // label="QTY"
            size="small"
            sx={{
              "& input": {
                width: "50px",
                height: "10px",
              },
            }}
            value={qty[product.SKU] ? qty[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("qty", product.SKU, +e.target.value);
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
          }}
        >
          <Box>
            <Typography variant="body2" gutterBottom textAlign="center">
              Length<sup>{unit}</sup>
            </Typography>
            <StyleTextfeild
              // label="Length"
              type="number"
              value={
                dimensions[product.SKU] ? dimensions[product.SKU]["L"] : ""
              }
              onChange={(e) => {
                handleValueChange(
                  "dimensions",
                  product.SKU,
                  e.target.value,
                  "L"
                );
              }}
              variant="outlined"
              size="small"
              sx={{
                "& input": {
                  width: "50px",
                  height: "10px",
                },
              }}
            />
          </Box>
          <Box>
            <Typography variant="body2" gutterBottom textAlign="center">
              Width<sup>{unit}</sup>
            </Typography>
            <StyleTextfeild
              // label="Width"
              type="number"
              value={
                dimensions[product.SKU] ? dimensions[product.SKU]["W"] : ""
              }
              onChange={(e) => {
                handleValueChange(
                  "dimensions",
                  product.SKU,
                  e.target.value,
                  "W"
                );
              }}
              variant="outlined"
              size="small"
              sx={{
                "& input": {
                  width: "50px",
                  height: "10px",
                },
              }}
            />
          </Box>

          <Box>
            <Typography variant="body2" gutterBottom textAlign="center">
              Height<sup>{unit}</sup>
            </Typography>
            <StyleTextfeild
              // label="Height"
              type="number"
              value={
                dimensions[product.SKU] && dimensions[product.SKU]["H"]
                  ? dimensions[product.SKU]["H"]
                  : ""
              }
              onChange={(e) => {
                handleValueChange(
                  "dimensions",
                  product.SKU,
                  e.target.value,
                  "H"
                );
              }}
              variant="outlined"
              size="small"
              sx={{
                "& input": {
                  width: "50px",
                  height: "10px",
                },
              }}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" gutterBottom textAlign="center">
            Actual Weight <sup>({WeightUnit})</sup>
          </Typography>
          <StyleTextfeild
            type="number"
            variant="outlined"
            // label="actual Weight"
            size="small"
            sx={{
              "& input": {
                width: "110px",
                height: "10px",
              },
            }}
            value={actualWeight[product.SKU] ? actualWeight[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("actualWeight", product.SKU, e.target.value);
            }}
          />
        </Box>
      </Box> */}

      {/* this is ujjwal's code start from here */}
      <Box sx={{ backgroundColor: "#b3d9ff", padding: ".6rem" }}>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Quantity
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={qty[product.SKU] ? qty[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("qty", product.SKU, +e.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Length <sup>{unit}</sup>
          </Typography>
          <input
            type="number"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={dimensions[product.SKU] ? dimensions[product.SKU]["L"] : ""}
            onChange={(e) => {
              handleValueChange("dimensions", product.SKU, e.target.value, "L");
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Width <sup>{unit}</sup>
          </Typography>
          <input
            type="number"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={dimensions[product.SKU] ? dimensions[product.SKU]["W"] : ""}
            onChange={(e) => {
              handleValueChange("dimensions", product.SKU, e.target.value, "W");
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Height <sup>{unit}</sup>
          </Typography>
          <input
            type="number"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={
              dimensions[product.SKU] && dimensions[product.SKU]["H"]
                ? dimensions[product.SKU]["H"]
                : ""
            }
            onChange={(e) => {
              handleValueChange("dimensions", product.SKU, e.target.value, "H");
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Volume Weight <sup>({WeightUnit})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={volumeWeight[product.SKU]?.toFixed(3) || null}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Actual Weight <sup>({WeightUnit})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={actualWeight[product.SKU] ? actualWeight[product.SKU] : ""}
            onChange={(e) => {
              handleValueChange("actualWeight", product.SKU, e.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Weight compare <sup>({WeightUnit})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={weightCompare[product.SKU]?.toFixed(3) || null}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Total Weight <sup>({WeightUnit})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={totalWeight[product.SKU]?.toFixed(3) || null}
            disabled={true}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Weight ratio <sup>({"%"})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={volumeWeightRatio[product.SKU]?.toFixed(3)}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Extra weight <sup>({WeightUnit})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={extraWeightIntoRatio[product.SKU]?.toFixed(3)}
            disabled={true}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: ".6rem", fontWeight: "600" }}>
            Final Weight <sup>({WeightUnit})</sup>
          </Typography>
          <input
            type="text"
            style={{
              border: "1px solid #9999ff",
              borderRadius: ".2rem",
              boxShadow: "0px 8px 4px -4px #00000024",
              width: "7rem",
            }}
            value={finalWeight[product.SKU]?.toFixed(3) || null}
            disabled={true}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default WeightTable;
