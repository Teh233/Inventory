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
  Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useGetAllVendorQuery } from "../../../features/api/RestockOrderApiSlice";
import CloseIcon from "@mui/icons-material/Close";
import {
  useGetRestockProductDetailQuery,
  useAddVendorIdToAssignOrderMutation,
  useGetSinglePriceComparisionQuery,
  
} from "../../../features/api/RestockOrderApiSlice";


const CompareAssignDialog = ({ compareId, openDialog, handleCloseDialog }) => {
  // local states
  const [selectVendorId, setSelectVendorId] = useState([]);
  const [rows, setRows] = useState([]);
  const [skuFilter, setSkuFilter] = useState("");
  const apiRef = useGridApiRef();

  /// rtk query for api calling
  const { data: allVendorData } = useGetAllVendorQuery();
  const [assignOrder] = useAddVendorIdToAssignOrderMutation();
  const { data: restockProduct,refetch: refetchRestockProduct } = useGetSinglePriceComparisionQuery(compareId);

  // handle assign for assingnig the order to vendors

  const handleAsign = async (e) => {
    try {
      const data = {
        restockId: compareId,
        vendor: selectVendorId,
      };
      const res = await assignOrder(data).unwrap();
      if (res.status === "success") {
        toast.success("Order successfully assigned");
        setSelectVendorId([]);
        handleCloseDialog();
        refetchRestockProduct()
      }
    } catch (err) {
      console.error("Error at Creating Restock Order: " + err);
    }
  };

  // showing all the vendor details
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

  useEffect(() => {
    if (restockProduct && restockProduct.status === "success") {
      const allvendorId = restockProduct.data.assign;
      setSelectVendorId(allvendorId);
    }
  }, [restockProduct]);

  // for filter sku
  const handleFilterChange = (field, operator, value) => {
    apiRef.current.setFilterModel({
      items: [{ field: field, operator: operator, value: value }],
    });
  };
  // for checkbox selection and deselection
  const handleCheckboxChange = (id) => {
    const selectedVendorIds = rows
      .filter((row) => row.id === id)
      .map((row) => row.VendorId);
    if (selectVendorId.includes(selectedVendorIds[0])) {
      setSelectVendorId((prev) =>
        prev.filter((id) => id !== selectedVendorIds[0])
      );
    } else {
      setSelectVendorId((prev) => [...prev, ...selectedVendorIds]);
    }
  };

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
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
      maxWidth: 130,
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
      //    maxWidth: 290,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "action",
      headerName: "Actions",
      flex: 0.3,
      minWidth: 100,
      //    maxWidth: 290,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const vendorId = params.row.VendorId;

        return (
          <Checkbox
            checked={selectVendorId.includes(vendorId)}
            // disabled={selectVendorId.includes(vendorId)}
            onChange={() => {
              handleCheckboxChange(vendorId);
            }}
          />
        );
      },
    },
  ];

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
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
          Select vendor To Assign
        </DialogTitle>
        <CloseIcon
          onClick={handleCloseDialog}
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
                        background: "linear-gradient(0deg, #01127D, #04012F)",
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      SKU
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {restockProduct &&
                    restockProduct.data?.products?.map((item, index) => (
                      <TableRow
                        key={item._id}
                        sx={{ fontSize: "12px", padding: "10px" }}
                      >
                        <TableCell>{index + 1}</TableCell>

                        <TableCell
                          sx={{ textAlign: "center", fontSize: "12px" }}
                        >
                          {item.SKU}
                        </TableCell>
                        <TableCell
                          sx={{ textAlign: "center", fontSize: "12px" }}
                        >
                          {item.Name}
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
                checkboxSelection={false}
                disableRowSelectionOnClick
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
        <Button variant="contained" onClick={handleAsign}>
          Assign
        </Button>

        <Button variant="outlined" onClick={handleCloseDialog}>
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
};

export default CompareAssignDialog;
