import { React, useEffect, useState } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
  GridPagination,
} from "@mui/x-data-grid";
// import Nodata from "../../../assets/empty-cart.png";
import { Grid, Box, Button, CircularProgress, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setAllProducts } from "../../../features/slice/productSlice";
import { useGetAllProductQuery } from "../../../features/api/productApiSlice";

import {
  useGenerateBarcodeMutation,
  useGetAllBarcodesSkusQuery,
  useGetBarcodeMutation,
} from "../../../features/api/barcodeApiSlice";
import Loading from "../../../components/Common/Loading";
import FilterBar from "../../../components/Common/FilterBar";
import BASEURL from "../../../constants/BaseApi";
import { BARCODE_URL } from "../../../constants/ApiEndpoints";
import axios from "axios";
import { saveAs } from "file-saver"; // Import this to use the saveAs function
import { toast } from "react-toastify"; // Import this to show toast messages
import BarcodeDialogbox from "./BarcodeDialogbox";
import Nodata from "../../../assets/error.gif";
import CachedIcon from "@mui/icons-material/Cached";

// for refresh data
function CustomFooter(props) {
  const { status } = props;
  return (
    <GridToolbarContainer>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Button size="small" onClick={() => status()}>
          <CachedIcon />
        </Button>
        <GridPagination />
      </Box>
    </GridToolbarContainer>
  );
}

const BarcodeGenerateGrid = () => {
  /// initialize
  const dispatch = useDispatch();
  const apiRef = useGridApiRef();

  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectingRows, setIsSelectingRows] = useState(false);
  const [isGeneratingBarcode, setIsGeneratingBarcode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState({});

  // Rtk query
  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
  } = useGetAllProductQuery("null", {
    refetchOnMountOrArgChange: true,
  });

  const [generateBarcodeMutation, { isLoading: isGenerating }] =
    useGenerateBarcodeMutation();

  const [getBarcode, { isLoading, isError }] = useGetBarcodeMutation();
  const { data: barcodes, refetch: getAllBarcoderefetch } =
    useGetAllBarcodesSkusQuery();

  // seleciton change for button
  const handleSelectionChange = (selectionModel) => {
    if (selectionModel.length > 0) {
      setIsSelectingRows(true);
    } else {
      setIsSelectingRows(false);
    }
    setSelectedItems(selectionModel);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // Function to close the dialog box
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleGenerateClick = async () => {
    try {
      if (selectedItems.length === 0) {
        window.alert("Please select Product First");
        return;
      }
      const selectedSKUs = selectedItems;
      setIsGeneratingBarcode(true);
      const { data } = await generateBarcodeMutation({ SKUs: selectedSKUs });
      if (data) {
        toast.success("Barcode Generated Successfully");
      }
      setIsGeneratingBarcode(false);
    } catch (error) {
      setIsGeneratingBarcode(false);
      toast.error("Error occurred while generating barcode");
    }
  };

  const handleDownloadClick = async () => {
    try {
      if (selectedItems.length === 0) {
        window.alert("Please select Product First");
        return;
      }

      const body = {
        SKUs: selectedItems,
      };

      const response = await axios.post(
        `${BASEURL}${BARCODE_URL}/getBarcode`,
        body,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "barcodes.xlsx");

      setSelectedItems([]);

      toast.success("Download Started...", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error("An error occurred during download:", error);
    }
  };

  const handleViewBarcode = async (sku) => {
    try {
      const { data } = await getBarcode(sku);
      if (data) {
        setData(data);
        openDialog();
      }
    } catch (error) {
      console.error("An error occurred while getting the barcode:", error);
    }
  };

  useEffect(() => {
    if (allProductData?.status === "success") {
      const data = allProductData?.data.map((item, index) => {
        return {
          id: item.SKU,
          SKU: item.SKU,
          mainImage: item?.mainImage?.url,
          Name: item.Name,
          Quantity: item.ActualQuantity,
          genQuantity: item.Quantity,
          Brand: item.Brand,
        };
      });

      dispatch(setAllProducts({ ...allProductData }));
      setRows(data);
    }
  }, [allProductData]);

  useEffect(() => {
    getAllBarcoderefetch();
  }, [allProductData]);

  const isRowSelectable = (params) => {
    const quantity = params.row.genQuantity;
    return quantity > 0 || isChecking;
  };

  const BarCodeButton = (
    <Box
      sx={{
        position: "absolute",
        right: 0,
      }}
    >
      {isSelectingRows && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            m: "10px 10px 0px 10px",
          }}
        >
          <Button
            sx={{ mr: "12px" }}
            variant="contained"
            onClick={handleGenerateClick}
            // disabled={isChecking}
            startIcon={isGeneratingBarcode && <CircularProgress size={20} />}
          >
            {isGeneratingBarcode ? "Generating..." : "Generate"}
          </Button>
          <Button
            variant="contained"
            onClick={handleDownloadClick}
            disabled={isGeneratingBarcode}
          >
            Download
          </Button>
        </Box>
      )}
    </Box>
  );

  const columns = [
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 130,
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
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
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
      field: "View",
      headerName: "Barcode",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const { SKU } = params.row;
        const check = barcodes?.data?.includes(SKU);
        // setIsChecking(check);
        const allSno = barcodes?.allData?.filter((item) => item.SKU === SKU);
        const checkVerify =
          allSno && allSno[0]?.SNo
            ? allSno[0]?.SNo?.filter((item) => item.isProcessed === true)
                .length || 0
            : "";
        const checkLength =
          allSno && allSno[0]?.SNo ? allSno[0]?.SNo.length || 0 : "";
        const StickValue = Math.round((checkVerify / checkLength) * 100);

        let color;

        if (StickValue >= 0 && StickValue <= 49) {
          color = "red";
        } else if (StickValue >= 50 && StickValue <= 99) {
          color = "orange";
        } else if (StickValue >= 100) {
          color = "green";
        }
        const handleonViewClick = () => {
          handleViewBarcode(SKU);
        };

        return (
          <>
            <Button
              disabled={!check}
              variant="contained"
              sx={{
                backgroundColor: color,
                color: "#fff",
              }}
              onClick={handleonViewClick}
            >
              View
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <FilterBar
        apiRef={apiRef}
        CustomText={BarCodeButton}
        hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
      />
      <BarcodeDialogbox
        open={isDialogOpen}
        onClose={closeDialog}
        serialNumbers={data}
      />
      <Grid container>
        {productLoading ? (
          <Loading loading={productLoading} />
        ) : (
          <Grid item xs={12} sx={{ mt: "5px" }}>
            <Box
              sx={{
                width: "100%",
                height: "84vh",
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
                position: "relative",
              }}
            >
              <DataGrid
                columns={columns}
                rows={rows}
                rowHeight={40}
                apiRef={apiRef}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                rowSelectionModel={selectedItems}
                columnVisibilityModel={hiddenColumns}
                onColumnVisibilityModelChange={(newModel) =>
                  setHiddenColumns(newModel)
                }
                isRowSelectable={isRowSelectable} // Call the function to disable rows with Quantity 0
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
                    </Box>
                  ),
                  Footer: CustomFooter,
                }}
                slotProps={{
                  footer: { status: refetch },
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BarcodeGenerateGrid;
