import { React, useEffect, useState } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
  GridPagination,
} from "@mui/x-data-grid";
import BASEURL from "../../../constants/BaseApi";
import { saveAs } from "file-saver";
import { PRODUCT_URL } from "../../../constants/ApiEndpoints";
import { toast } from "react-toastify";
import FilterBar from "../../../components/Common/FilterBar";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { Grid, Box, Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setAllProducts } from "../../../features/slice/productSlice";
import { useGetAllProductQuery } from "../../../features/api/productApiSlice";
import Loading from "../../../components/Common/Loading";
import { useNavigate } from "react-router-dom";
import ProductStatusDownloadDialog from "./ProductStatusDownloadDialog";
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

const ProductStatusGrid = ({ setOpenHistory, setProductDetails }) => {
  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  /// global state

  /// local state

  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [loading, setLoading] = useState(false);
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
  };

  const handleExcelDownload = async (checkedItems,handleClose) => {
    setLoading(true);
    try {
      const body = {
        data: selectedItems,
        columns: checkedItems,
      };
  
      const response = await axios.post(
        `${BASEURL}${PRODUCT_URL}/ProductStatusExcel`,
        body,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "product_status.xlsx");

      toast.success("Download Started...", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
    } catch (error) {
      console.error("An error occurred during download:", error);
    }
    setLoading(false);
    handleClose()
  };

  /// useEffect
  useEffect(() => {
    if (allProductData?.status === "success") {
      const data = allProductData?.data.map((item, index) => {
        return {
          id: item.SKU,
          Sno: index + 1,
          SKU: item.SKU,
          mainImage: item?.mainImage?.url,
          Name: item.Name,
          GST: item.GST,
          MRP: item.MRP,
          Quantity: item.ActualQuantity,
          LandingCost: item.LandingCost,
          SalesPrice: item.SalesPrice,
          SellerPrice: item.SellerPrice,
          Brand: item.Brand,
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
      renderCell: (params) => {
        return (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => {
              setOpenHistory(true);
              setProductDetails(params.row);
            }}
          >
            {params.row.Sno}
          </div>
        );
      },
    },
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => {
              navigate(`/OneProductDetails/${params.row.SKU}`);
            }}
          >
            {params.row.SKU}
          </div>
        );
      },
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
      field: "GST",
      headerName: "GST",
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const value = params.row.GST;
        const icon = value === 0 ? <CloseIcon /> : <CheckIcon />;
        const iconColor = value === 0 ? "red" : "green";

        return (
          <div
            style={{
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: iconColor,
            }}
          >
            {icon}
          </div>
        );
      },
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
      renderCell: (params) => {
        const value = params.row.Quantity;
        const icon = value === 0 ? <CloseIcon /> : <CheckIcon />;
        const iconColor = value === 0 ? "red" : "green";

        return (
          <div
            style={{
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: iconColor,
            }}
          >
            {icon}
          </div>
        );
      },
    },
    {
      field: "MRP",
      headerName: "MRP",
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const value = params.row.MRP;
        const icon = value === 0 ? <CloseIcon /> : <CheckIcon />;
        const iconColor = value === 0 ? "red" : "green";

        return (
          <div
            style={{
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: iconColor,
            }}
          >
            {icon}
          </div>
        );
      },
    },
    {
      field: "LandingCost",
      headerName: "Cost",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const value = params.row.LandingCost;
        const icon = value === 0 ? <CloseIcon /> : <CheckIcon />;
        const iconColor = value === 0 ? "red" : "green";

        return (
          <div
            style={{
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: iconColor,
            }}
          >
            {icon}
          </div>
        );
      },
    },

    {
      field: "Sales",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Sales",
      align: "center",
      headerAlign: "center",
      minWidth: 70,
      maxWidth: 80,
      renderCell: (params) => {
        const value = params.row.SalesPrice;
        const icon = value === 0 ? <CloseIcon /> : <CheckIcon />;
        const iconColor = value === 0 ? "red" : "green";

        return (
          <div
            style={{
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: iconColor,
            }}
          >
            {icon}
          </div>
        );
      },
    },

    {
      field: "SellerPrice",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Seller",
      align: "center",
      headerAlign: "center",
      flex: 0.2,
      minWidth: 70,
      maxWidth: 80,
      editable: true,
      type: "number",
      renderCell: (params) => {
        const value = params.row.SellerPrice;
        const icon = value === 0 ? <CloseIcon /> : <CheckIcon />;
        const iconColor = value === 0 ? "red" : "green";
        return (
          <div
            style={{
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: iconColor,
            }}
          >
            {icon}
          </div>
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
        customButton={"Download"}
        customOnClick={() => {
          if (selectedItems.length === 0) {
            window.alert("Please select Product First");
            return;
          }

          setOpen(true);
        }}
        apiRef={apiRef}
        hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
      />
      <ProductStatusDownloadDialog
        open={open}
        setOpen={setOpen}
        handleExcelDownload={handleExcelDownload}
        loading={loading}
      />
      <Grid container>
        {productLoading ? (
          <Loading loading={true}/>
        ) : (
          <Grid item xs={12} sx={{ mt: "5px" }}>
            <Box
              sx={{
                width: "100%",
                height: "83vh",
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
                      <Typography variant="body2">No data found !</Typography>
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

export default ProductStatusGrid;
