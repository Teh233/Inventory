import React, { useEffect, useState } from "react";
import { Grid, Button, Box, styled, Typography } from "@mui/material";
import { useGetAllRestockQuery } from "../../../features/api/RestockOrderApiSlice";
import { useNavigate, useLocation } from "react-router-dom";
import Nodata from "../../../assets/error.gif";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../../../components/Common/Loading";
import { formatDate } from "../../../commonFunctions/commonFunctions";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  width: "100%",
  height: "90vh",
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
}));

const RestockOrderDetails = () => {
  /// initialization
  const navigate = useNavigate();
  const location = useLocation();

  /// local state
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);

  /// rtk query
  const {
    refetch,
    data: allRestockData,
    isLoading: allRestock,
  } = useGetAllRestockQuery();

  /// handlers
  const handleRowSelection = (selection) => {
    setSelectedRows(selection);
  };

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    refetch();
  }, []);

  // useEffect to handle data after fetching
  useEffect(() => {
    if (allRestockData?.status === "success") {
      const data = allRestockData?.restock?.map((item, index) => {
        return {
          id: item.restockId, // Use 'restockId' as the unique id for each row
          ...item,
          Sno: index + 1,
          date: formatDate(item.createdAt),
          restockId: item.restockId,
          totalProduct: item.totalProducts,
          generated: item.totalProductGenerated,
          inProcess: item.totalProductInProcess,
          paid: item.totalProductPaid,
          status: item.status,
          isAssigned: item.isAssigned,
        };
      });

      setRows(data);
    }
  }, [allRestockData]);

  // Define the columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.1,
      minWidth: 10,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "restockId",
      headerName: "Restock Id",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "totalProduct",
      headerName: "Total Product",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "generated",
      headerName: "Generated",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
    },
    {
      field: "inProcess",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "In-Process",
      align: "center",
      headerAlign: "center",
      minWidth: 240,
    },
    {
      field: "paid",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Paid",
      align: "center",
      headerAlign: "center",
      minWidth: 240,
    },
    {
      field: "status",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "details",
      headerName: "Details",
      sortable: false,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button
          onClick={() => {
            if (location.pathname === "/RestockOrderView") {
              navigate(`/OrderSelection/${params.row.restockId}?view`);
            } else {
              navigate(`/OrderSelection/${params.row.restockId}`);
            }
          }}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <>
      <StyledBox>
        <Loading loading={allRestock} />
        <DataGrid
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
                <Box sx={{ textAlign: "center" }}>
                  <img
                    style={{
                      width: "15%",
                    }}
                    src={Nodata}
                  />
                  <Typography variant="h6">No data found !</Typography>
                </Box>
              </Box>
            ),
          }}
          columns={columns}
          rows={rows}
          rowHeight={40}
          Height={"85vh"}
          onRowSelectionModelChange={handleRowSelection}
        />
      </StyledBox>
    </>
  );
};

export default RestockOrderDetails;
