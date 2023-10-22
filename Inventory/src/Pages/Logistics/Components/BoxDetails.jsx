import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  InputAdornment,
  styled,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  Paper,
} from "@mui/material";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundImage: "linear-gradient(180deg, #0C9 26.71%, #008380 99.36%)",
    color: theme.palette.common.white,
    padding: 3,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
  textAlign: "center",
}));

const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
  padding: 3,
  textAlign: "center",
  "& input": {
    backgroundColor: theme.palette.mode === "dark" ? "black" : "#fff",
    height: "10px",
  },
}));
function BoxDetails({
  handleInputChange,
  index,
  boxDetails,
  imageFile,
  setImageFile,
  handleFileInputChange,
}) {
  return (

      <TableContainer component={Paper} sx={{ height: "100", bgcolor: "grey" }}>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Weight</StyledTableCell>
              <StyledTableCell>
                Length<sup>cm</sup>
              </StyledTableCell>
              <StyledTableCell>
                Width<sup>cm</sup>
              </StyledTableCell>
              <StyledTableCell>
                Height<sup>cm</sup>
              </StyledTableCell>
              <StyledTableCell>A.weight</StyledTableCell>
              <StyledTableCell>Marking</StyledTableCell>
              <StyledTableCell> Description</StyledTableCell>
              <StyledTableCell> Upload Box image</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell2 sx={{ width: "10%" }}>
                <TextField
                  type="number"
                  name="weight"
                  placeholder="Weight"
                  size="small"
                  value={boxDetails.weight || ""}
                  onChange={(event) => {
                    handleInputChange(event, index);
                  }}
                />
              </StyledTableCell2>
              <StyledTableCell2>
                <TextField
                  type="number"
                  name="length"
                  placeholder="length"
                  sx={{ width: "80%" }}
                  size="small"
                  value={boxDetails.length || ""}
                  onChange={(event) => {
                    handleInputChange(event, index);
                  }}
                />
              </StyledTableCell2>
              <StyledTableCell2>
                <TextField
                  type="number"
                  name="width"
                  placeholder="width"
                  sx={{ width: "80%" }}
                  size="small"
                  value={boxDetails.width || ""}
                  onChange={(event) => {
                    handleInputChange(event, index);
                  }}
                />
              </StyledTableCell2>

              <StyledTableCell2>
                <TextField
                  type="number"
                  name="height"
                  sx={{ width: "80%" }}
                  placeholder="height"
                  variant="outlined"
                  size="small"
                  value={boxDetails.height || ""}
                  onChange={(event) => {
                    handleInputChange(event, index);
                  }}
                />
              </StyledTableCell2>

              <StyledTableCell2 sx={{ width: "15%" }}>
                <TextField
                  type="number"
                  InputProps={{ readOnly: true }}
                  name="Aweight"
                  placeholder="actual weight"
                  size="small"
                  value={boxDetails?.actualWeight || ""}
                />
              </StyledTableCell2>
              <StyledTableCell2 sx={{ width: "15%" }}>
                <TextField
                  name="marking"
                  placeholder="marking"
                  size="small"
                  value={boxDetails.marking || ""}
                  onChange={(event) => {
                    handleInputChange(event, index);
                  }}
                />
              </StyledTableCell2>
              <StyledTableCell2 sx={{ width: "15%" }}>
                <TextField
                  name="description"
                  placeholder="description"
                  size="small"
                  value={boxDetails.description || ""}
                  onChange={(event) => {
                    handleInputChange(event, index);
                  }}
                />
              </StyledTableCell2>
              <StyledTableCell2 sx={{ width: "10%" }}>
                <input
                  style={{ display: "none" }}
                  id={`file-${index}`}
                  type="file"
                  accept=".pdf, .png, .jpg, .jpeg"
                  onChange={(event) => {
                    handleFileInputChange(event, index);
                  }}
                />
                <label htmlFor={`file-${index}`}>
                  {boxDetails && boxDetails.imageFile instanceof File ? (
                    <AddPhotoAlternateIcon
                      sx={{ color: "orange", fontSize: "2.5rem" }}
                    />
                  ) : (
                    <AddPhotoAlternateIcon
                      sx={{ color: "#fff", fontSize: "2.5rem" }}
                    />
                  )}
                </label>
              </StyledTableCell2>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

  );
}

export default BoxDetails;
