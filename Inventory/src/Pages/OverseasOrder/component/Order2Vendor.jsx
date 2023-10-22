import React, { useEffect, useState } from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import { useGetAllVendorQuery } from "../../../features/api/RestockOrderApiSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useCreateOverseasOrderMutation } from "../../../features/api/RestockOrderApiSlice";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
const Order2Vendor = ({
  items,
  open,
  onClose,
  handleDelete,
  reStockId,
  refetch,
  setSelectedItems,
}) => {
  /// initialize
  const apiRef = useGridApiRef();
  const socket = useSocket();
  

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  /// local state
  const [orderQuantities, setOrderQuantities] = useState({});
  const [skuFilter, setSkuFilter] = useState("");
  const [prices, setPrices] = useState(items.map((item) => ""));
  const [rows, setRows] = useState([]);
  const [disable, setDisable] = useState(false);

  /// rtk query
  const { data: allVendorData } = useGetAllVendorQuery();
  const [createOverseasOrderApi, { isLoading }] =
    useCreateOverseasOrderMutation();

  const handleAsign = async (e) => {
    setDisable(true);
    if (items.length > 0) {
      const processedItems = items.map((item, index) => ({
        ...item,
        Price: parseInt(prices[index]),
      }));

      try {
        const data = {
          restockId: reStockId,
          VendorId: e,
          products: processedItems,
        };
        const res = await createOverseasOrderApi(data).unwrap();
        const liveStatusData = {
          message: `${userInfo.name} Created Overseas Order `,
          time: new Date().toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        };
        socket.emit("liveStatusServer", liveStatusData);
        toast.success("Restock order was successfully processed");
        onClose();
        refetch();
        setSelectedItems([]);
        setPrices([]);
      } catch (err) {
        console.error("Error at Creating Restock Order: " + err);
      }
      setPrices([]);
    } else {
      toast.error("Please select a product.");
    }
    setDisable(false);
  };

  useEffect(() => {
    if (allVendorData?.status === "success") {
      const data = allVendorData?.data?.map((item, index) => {
        return {
          id: item.VendorId, // Use 'restockId' as the unique id for each row
          Sno: index + 1,
          companyName: item.CompanyName,
          concernPerson: item.ConcernPerson,
          generated: item.totalProductGenerated,
          inProcess: item.totalProductInProcess,
          paid: item.totalProductPaid,
          status: item.status,
          VendorId: item.VendorId,
        };
      });

      setRows(data);
    }
  }, [allVendorData]);

  const handleFilterChange = (field, operator, value) => {
    apiRef.current.setFilterModel({
      items: [{ field: field, operator: operator, value: value }],
    });
  };

  const columns = [
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
      field: "companyName",
      headerName: "Company Name",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 390,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "concernPerson",
      headerName: "Concern Person",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "action",
      headerName: "Action",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 110,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button disabled={disable} onClick={() => handleAsign(params.row.id)}>
          Asign
        </Button>
      ),
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      sx={{ backdropFilter: "blur(5px)" }}
      fullWidth
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "3rem",
        }}
      >
        <DialogTitle
          sx={{
            flex: "1",
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Select vendor
        </DialogTitle>
        <CloseIcon
          onClick={onClose}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "5rem",
            marginRight: "1rem",
          }}
        />
      </Box>
      <DialogContent sx={{ overflow: "hidden" }}>
        <Grid container>
          <Grid item xs={6}>
            <Typography textAlign="center">Selected Product</Typography>
            <TableContainer sx={{ height: 800 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        background: "linear-gradient(0deg, #01127D, #04012F)",
                        color: "#fff",
                      }}
                    >
                      Sno
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "center",
                        background: "linear-gradient(0deg, #01127D, #04012F)",
                        color: "#fff",
                      }}
                    >
                      Name
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "center",
                        background: "linear-gradient(0deg, #01127D, #04012F)",
                        color: "#fff",
                      }}
                    >
                      Order Quantity
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "center",
                        background: "linear-gradient(0deg, #01127D, #04012F)",
                        color: "#fff",
                      }}
                    >
                      Price
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        background: "linear-gradient(0deg, #01127D, #04012F)",
                        color: "#fff",
                      }}
                    >
                      Delete
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow
                      key={item.id}
                      sx={{ fontSize: "12px", padding: "10px" }}
                    >
                      <TableCell>{index + 1}</TableCell>

                      <TableCell sx={{ textAlign: "center", fontSize: "12px" }}>
                        {item.Name}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontSize: "12px" }}>
                        {item.NewQuantity}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontSize: "12px" }}>
                        <TextField
                          id={`price-${index}`}
                          variant="outlined"
                          size="small"
                          sx={{ width: "100px", height: "40px" }}
                          value={prices[index]} // Set the value from state
                          onChange={(e) => {
                            const newPrices = [...prices];
                            newPrices[index] = e.target.value;
                            setPrices(newPrices);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontSize: "12px" }}>
                        <DeleteIcon
                          onClick={() => handleDelete(item.id)}
                          sx={{ cursor: "pointer" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={6}>
            <TextField
              value={skuFilter}
              placeholder="Enter Concern Person"
              size="small"
              color="secondary"
              onChange={(e) => {
                setSkuFilter(e.target.value);
                handleFilterChange("concernPerson", "contains", e.target.value);
              }}
              sx={{
                position: "absolute",
                right: "2rem",
                top: "3rem",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Typography textAlign="center">Asign Vendor</Typography>
            <Box
              sx={{
                height: "89%",
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
                columns={columns}
                rows={rows}
                rowHeight={40}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      Category: false,
                    },
                  },
                }}
                editMode="row"
                apiRef={apiRef}
                // checkboxSelection
                disableRowSelectionOnClick
                // onRowSelectionModelChange={handleSelectionChange}
                // rowSelectionModel={selectedItems}
                // processRowUpdate={handleRowUpdate}
                onProcessRowUpdateError={(error) => {}}
                autoPageSize
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
          gap: "1rem",
          padding: "0.5rem",
          backgroundColor: " #e6e6e6",
        }}
      >
        {/* <Button variant="outlined" onClick={handleConfirm}>
          Confirm
        </Button> */}
        <Button variant="outlined" onClick={onClose}>
          {isLoading ? (
            <CircularProgress size={24} color="inherit" /> // Show loading indicator
          ) : (
            "Cancel"
          )}
        </Button>
      </Box>
    </Dialog>
  );
};

export default Order2Vendor;
