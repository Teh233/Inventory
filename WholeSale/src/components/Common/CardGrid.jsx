import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Avatar } from "@mui/material";
import Nodata from "../../assets/empty-cart.png";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const CartGrid = ({
  columns,
  rows,
  rowHeight,
  Height,
  overlayRows,
  cellClassName,
}) => {
  const theme = useTheme();
  
  const isMobile1 = useMediaQuery(theme.breakpoints.down("xs"));
  const isMobile2 = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile3 = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = isMobile3 || isMobile1 || isMobile2;
  return (
    <Box
      sx={{
        width: "100%",
      
        height: Height,
        "& .super-app-theme--header": {
          background: "#eee",
          color: "black",
          textAlign: "center",
        },
        "& .vertical-lines .MuiDataGrid-cell": {
          borderRight: "1px solid #e0e0e0",
        },
        "& .supercursor-app-theme--cell:hover": {
          background: "linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)",
          color: "white",
          cursor: "pointer",
        },
        "& .MuiDataGrid-columnHeaderTitleContainer": {
          background: "#eee",
        },
      }}
    >
      <DataGrid
        columns={columns}
        rows={rows}
        rowHeight={rowHeight}
        disableSelectionOnClick={true}
        className={cellClassName}
        disableColumnResize={!isMobile}
        disableColumnMenu={!isMobile}
        hideFooter={!isMobile}
        density={isMobile ? "compact" : "standard"}
        components={{
          NoRowsOverlay: () => (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{
                  width: "10%",
                }}
                src={Nodata}
              />
            </Box>
          ),
        }}
      />
    </Box>
  );
};

export default CartGrid;
