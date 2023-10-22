import { React, useEffect, useState } from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Nodata from "../../../assets/empty-cart.png";
import FilterBar from "../../../components/Common/FilterBar";
import { Grid, Box, Button,  ToggleButton,
  ToggleButtonGroup  } from "@mui/material";
import { useDispatch } from "react-redux";
import { setAllProducts } from "../../../features/slice/productSlice";
import { useGetAllProductQuery } from "../../../features/api/productApiSlice";
import Loading from "../../../components/Common/Loading";
import { useNavigate } from "react-router-dom";
import DiscountCalcDialog from "./DiscountCalcDialog";

const DiscountQueryGrid = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiRef = useGridApiRef();


  const [showNoData, setShowNoData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowNoData(true);
    }, 10000);
  }, []);
  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [open, setOpen] = useState(false);

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
  } = useGetAllProductQuery("null", {
    pollingInterval: 1000 * 300,
  });

  /// handlers

  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);
    const newSelectedRowsData = rows.filter((item) =>
      selectionModel.includes(item.id)
    );
    setSelectedItemsData(newSelectedRowsData);
  };

  const removeSelectedItems = (id) => {
    const newSelectedItems = selectedItems.filter((item) => item !== id);
    const newSelectedRowsData = selectedItemsData.filter(
      (item) => item.SKU !== id
    );
    setSelectedItemsData(newSelectedRowsData);
    setSelectedItems(newSelectedItems);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };
  /// useEffect
  useEffect(() => {
    if (allProductData?.status === "success") {
      const data = allProductData?.data.map((item, index) => {
        return {
          id: item.SKU,
          Sno: index + 1,
          SKU: item.SKU,
          Name: item.Name,
          GST: item.GST,
          MRP: item.MRP,
          Quantity: item.ActualQuantity,
          SalesPrice: item.SalesPrice,
          Brand: item.Brand,
          Category: item.Category,
        };
      });

      dispatch(setAllProducts({ ...allProductData }));
      setRows(data);
    }
  }, [allProductData]);

  //Columns*******************
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
      field: "SKU",
      headerName: "SKU",
      flex: 0.1,
      minWidth: 80,
    
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Name",
      headerName: "Product ",
      flex: 0.3,
      minWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 110,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Category",
      headerName: "Category",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 110,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST",
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => ` ${(+params.value).toFixed(0)} %`,
    },
    {
      field: "Quantity",
      headerName: "QTY",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "MRP",
      headerName: "MRP",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `₹ ${(+params.value).toFixed(0)} `,
    },
    {
      field: "SalesPrice",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Sales",
      align: "center",
      headerAlign: "center",
      minWidth: 70,
      maxWidth: 80,
      valueFormatter: (params) => `₹ ${(+params.value).toFixed(0)} `,
    },
  ];

  return (
    <Box sx={{ width: "auto", minHeight: "93vh", overflowY: "auto" }}>
      <FilterBar
        apiRef={apiRef}
        customButton={selectedItems.length ? "Create Query" : ""}
        customOnClick={handleOpenDialog}
      />
      <DiscountCalcDialog
        data={selectedItemsData}
        apiRef={apiRef}
        removeSelectedItems={removeSelectedItems}
        open={open}
        setOpen={setOpen}
      />
      <Grid container>
        {productLoading ? (
          <Loading loading={productLoading}/>
        ) : (
          <Grid item xs={12} sx={{ mt: "5px" }}>
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
                columns={columns}
                rows={rows}
                rowHeight={40}
                apiRef={apiRef}
                columnVisibilityModel={{
                  Category: false,
                }}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                rowSelectionModel={selectedItems}
                components={{
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
                         { showNoData &&
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
                            }
                  </Box>
                  ),
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DiscountQueryGrid;
