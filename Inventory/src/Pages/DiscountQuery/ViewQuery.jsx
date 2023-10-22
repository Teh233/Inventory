import { React, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Grid,
  Box,
  Button,
  styled,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Loading from "../../components/Common/Loading";
import { useGetDiscountQueryQuery } from "../../features/api/discountQueryApiSlice";
import ViewQueryDialog from "./Components/ViewQueryDialog";
import { useLocation, useNavigate } from "react-router-dom";
import Nodata from "../../../src/assets/error.gif";
import { formatDate } from "../../commonFunctions/commonFunctions";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: "rgb(4,4,61) !important",
    color: "white !important",
  },
}));

const ViewQuery = () => {
  const [showNoData, setShowNoData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowNoData(true);
    }, 10000);
  }, []);
  // local state
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [openDial, setOpenDial] = useState(false);
  const [rowData, setRowData] = useState();
  const [showNewData, setShowNewData] = useState(true);
  const [showOldData, setShowOldData] = useState(false);

  const CustomToolbar = () => {
    return (
      <Box style={{ display: "flex", justifyContent: "end", gap: "10px" }}>
        {/* <Button
          variant="contained"
          color="success"
          onClick={handleShowOldData}
          disabled={showOldData}
        >
          Open Query
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleShowNewData}
          disabled={showNewData}
        >
          Closed Query
        </Button> */}

        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton classes={{ selected: classes.selected }} value="Open">
            Open Query
          </ToggleButton>
          <ToggleButton classes={{ selected: classes.selected }} value="Closed">
            Closed Query
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    );
  };
  // additional
  const location = useLocation();
  const isOnAdminRoute = location.pathname.includes("/admin");
  const navigate = useNavigate();

  // Handlers for toggling data

  ///toggle chnage
  const [alignment, setAlignment] = useState("Open");
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    setShowNewData(!showNewData);
  };

  // rtk query
  const { data, isLoading, refetch } = useGetDiscountQueryQuery();

  useEffect(() => {
    if (data?.status === "success") {
      // Filter rows based on the status for "New" and "Old" data
      const filteredRows = data.data.map((item, index) => {
        return {
          ...item,
          id: item.QueryId,
          Sno: index + 1,
          subtotal: (item.AfterDiscountTotalProfit
            ? item.AfterDiscountTotalProfit
            : item.subtotal
          ).toFixed(2),
          Products: item.Data.length,
          Date: formatDate(item.createdAt) , // Format createdAt as Date
          ActualPrice: item.TotalSalesPrice,
          OldPrice: item.TotalDiscountPrice,
        };
      });

      if (showNewData) {
        // For normal users, show both "pending" and "newOffer" data
        const newDataRows = isOnAdminRoute
          ? filteredRows.filter((row) => row.status === "pending")
          : filteredRows.filter(
              (row) => row.status === "pending" || row.status === "newOffer"
            );
        setRows(newDataRows);
      } else if (!showNewData) {
        // If the user is on the admin route, show only "submitted" data
        const oldDataRows = isOnAdminRoute
          ? filteredRows.filter(
              (row) => row.NewOffer === true && row.status === "newOffer"
            )
          : filteredRows.filter(
              (row) => row.status === "close" || row.status === "sold"
            );
        setRows(oldDataRows);
      }
    }
  }, [data, showNewData, showOldData, isOnAdminRoute]);

  const handleClose = () => {
    setOpenDial(false);
  };

  const handleOpen = () => {
    setOpenDial(true);
  };

  useEffect(() => {
    refetch();
  }, [data]);

  // Columns for normal user view
  const userColumns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 70,
      maxWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CustomerName",
      headerName: "Customer Name",
      flex: 0.3,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "MobileNo",
      headerName: "Mobile",
      flex: 0.5,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Products",
      headerName: "Products",
      flex: 0.3,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Date",
      headerName: "Date",
      flex: 0.3,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "subtotal",
      headerName: "Amount",
      flex: 0.3,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `₹ ${(+params.value).toFixed(0)}`,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.3,
      maxWidth: 250,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const statusValue =
          params.value === "newOffer"
            ? "New Offer"
            : params.value === "sold"
            ? "Sold"
            : "Pending";

        const cellStyle = {
          color:
            statusValue === "New Offer"
              ? "green"
              : params.value === "sold"
              ? "blue"
              : "red",
        };

        return <div style={cellStyle}>{statusValue}</div>;
      },

      // valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 0.3,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const handleViewClick = () => {
          setRowData(params.row.QueryId);
          handleOpen();
        };
        return (
          <>
            <Button
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                handleViewClick();
              }}
            >
              Details
            </Button>
          </>
        );
      },
    },
  ];

  // Columns for admin view
  const adminColumns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.1,
      minWidth: 70,
      maxWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CustomerName",
      headerName: "Customer Name",
      flex: 0.1,
      maxWidth: 450,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "MobileNo",
      headerName: "Mobile",
      flex: 0.1,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Date",
      headerName: "Date",
      flex: 0.1,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "NewOffer",
      headerName: "Status",
      flex: 0.1,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",

      renderCell: (params) => {
        const statusValue = params.value === true ? "Submited" : "Pending";

        const cellStyle = {
          color: statusValue === "Submited" ? "green" : "red",
        };

        return <div style={cellStyle}>{statusValue}</div>;
      },
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 0.1,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <>
            <Button
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                navigate(`/discountquery/${params.row.QueryId}`);
              }}
            >
              Details
            </Button>
          </>
        );
      },
    },
  ];

  // Merge columns based on isAdminRoute
  const finalColumns = isOnAdminRoute ? adminColumns : userColumns;

  return (
    <Box sx={{ width: "100%", minHeight: "93vh", overflowY: "auto" }}>
      <DrawerHeader />
      <Grid container>
        {isLoading ? (
          <Loading loading={isLoading} />
        ) : (
          <Grid item xs={12} sx={{ mt: "5px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            ></Box>
            <Box
              sx={{
                width: "100%",
                height: "85vh",
                "& .super-app-theme--header": {
                  background: "#eee",
                  color: "black",
                  textAlign: "center",
                },
                "& .vertical-lines .MuiDataGrid-cell": {
                  borderRight: "1px solid #e0e0e0",
                },
                "& .supercursor-app-theme--cell:hover": {
                  background:
                    "linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)",
                  color: "white",
                  cursor: "pointer",
                },
                "& .MuiDataGrid-columnHeaderTitleContainer": {
                  background: "#eee",
                },
              }}
            >
              <DataGrid
                columns={finalColumns}
                rows={rows}
                rowHeight={40}
                components={{
                  Toolbar: CustomToolbar,
                  NoRowsOverlay: () => (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      {showNoData && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          <img
                            style={{
                              width: "20%",
                            }}
                            src={Nodata}
                          />

                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
                          >
                            No data found !
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ),
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
      {openDial ? (
        <ViewQueryDialog
          openDial={openDial}
          handleClose={handleClose}
          rowData={rowData}
        />
      ) : (
        ""
      )}
    </Box>
  );
};

export default ViewQuery;
