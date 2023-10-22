import React, { useEffect, useState } from "react";
import { Grid, Button, Box, styled, Typography } from "@mui/material";
import { useGetPriceComparisionQuery } from "../../../features/api/RestockOrderApiSlice";
import { useNavigate } from "react-router-dom";
import Nodata from "../../../assets/error.gif";
import { DataGrid } from "@mui/x-data-grid";
import CompareAssignDialog from "../../OverseasOrder/component/CompareAssignDialog";
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
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const PriceComparisonOrder = () => {
  // show button when we click on checkbox
  const [selectedRows, setSelectedRows] = useState([]);
  const [compareId, setCompareId] = useState("");

  const handleRowSelection = (selection) => {
    setSelectedRows(selection);
  };

  // handle show compareAssingDialog
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (compareId) => {
    setOpenDialog(true);
    setCompareId(compareId);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const navigate = useNavigate();

  // const [hiddenColumns, setHiddenColumns] = useState({});
  const {data:allComparisionData,refetch,isLoading:comparisionData} = useGetPriceComparisionQuery()
  const [rows, setRows] = useState([]);

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    refetch();
  }, []);

  // useEffect to handle data after fetching

  useEffect(() => {
    if (allComparisionData?.status === "success") {
      const data = allComparisionData?.data?.map((item, index) => {
        return {
          Sno: index + 1,
          id: item.compareId,
          compareId: item.compareId,
          date: formatDate(item.createdAt),
          totalProduct: item.products.length,
          status: item.status,
          isAssigned: item.isAssigned,
          // ... other fields you want to display
        };
      });

      setRows(data);
    }
  }, [allComparisionData]);

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
      field: "compareId",
      headerName: "Compare Id",
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
      field: "status",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "compare",
      headerName: "Compare",
      sortable: false,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button
          disabled={!params.row.isAssigned}
          onClick={() => {
            navigate(`/compare/${params.row.compareId}`);
          }}
        >
          prices
        </Button>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button
          onClick={() => handleOpenDialog(params.row.compareId)}
          variant="contained"
        >
          Assign
        </Button>
      ),
    },
  ];

  return (
    <>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
      >
        <DrawerHeader />

        {openDialog ? (
          <CompareAssignDialog
            openDialog={openDialog}
            handleCloseDialog={handleCloseDialog}
            compareId={compareId} // Pass the selected restockId if available
          />
        ) : (
          ""
        )}

        <StyledBox sx={{}}>
          <Loading loading={comparisionData}/>
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
                 <Box
                  sx={{
                    // border: '2px solid blue',
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "200px",
                    height: "200px",
                  }}
                >
                  <img
                    src={Nodata}
                    alt=""
                    style={{ width: "100px", height: "100px" }}
                  />

                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    No data found !
                  </Typography>
                </Box>
                </Box>
              ),
            }}
            columns={columns}
            rows={rows}
            onRowSelectionModelChange={handleRowSelection}
          />
        </StyledBox>
      </Box>
    </>
  );
};

export default PriceComparisonOrder;
