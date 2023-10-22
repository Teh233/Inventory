import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Grid, Button, Box } from "@mui/material";
import FilterBar from "../../../components/Common/FilterBar";
import CartGrid from "../../../components/Common/CardGrid";
import { useGridApiRef } from "@mui/x-data-grid";
import { useGetAllSalesHistoryQuery } from "../../../features/api/barcodeApiSlice";
import SalesBarcodeDialog from "./SalesBarcodeDialog";
import Loading from "../../../components/Common/Loading";
import { formatDate } from "../../../commonFunctions/commonFunctions";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const SellerDetailsGrid = () => {
  // local states
  const [openHistory, setOpenHistory] = useState(false);
  const [serialData, setSerialData] = useState(""); // Change to string
  const apiRef = useGridApiRef();

  //date formatting in dd-MM-yyyy
 

  // rtk query data calling api
  const {
    data: salesData,
    refetch,
    isLoading: salesDetailLoading,
  } = useGetAllSalesHistoryQuery();

  // function to handle dialog and sending id
  const handleopenHistory = () => {
    setOpenHistory(!openHistory);
  };

  const handleViewClick = (id) => {
    setSerialData(id);
    handleopenHistory();
  };

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.2,
      minWidth: 40,
      maxWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CustomerName",
      headerName: "Customer Name",
      flex: 0.2,
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "MobileNo",
      headerName: "Mobile No",
      flex: 0.2,
      width: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Date",
      headerName: "Purchase Date",
      flex: 0.3,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "InvoiceNo",
      headerName: "Invoice No",
      flex: 0.2,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "view",
      headerName: "Barcode no",
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleViewClick(params.id)}>view</Button>
          </>
        );
      },
    },
  ];

  const rowss = salesData?.data?.map((item, index) => ({
    id: item._id,
    Sno: index + 1,
    CustomerName: item.CustomerName,
    MobileNo: item.MobileNo === 0 ? "N/A" : item.MobileNo,
    Date: formatDate(item.Date), // Remove curly braces {}
    InvoiceNo: item.InvoiceNo,
  }));

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <StyledBox>
        <Grid item xs={12} sx={{ mt: "5px" }}>
          {salesDetailLoading ? (
            <Loading loading={salesDetailLoading}/>
          ) : (
            <CartGrid
              columns={columns}
              rows={rowss || []}
              rowHeight={40}
              Height={"90vh"}
            />
          )}
        </Grid>
      </StyledBox>

      {openHistory && (
        <SalesBarcodeDialog
          open={openHistory}
          onClose={handleopenHistory}
          serialData={serialData}
          rows={rowss}
          formatDate={formatDate}
        />
      )}
    </Box>
  );
};

export default SellerDetailsGrid;
