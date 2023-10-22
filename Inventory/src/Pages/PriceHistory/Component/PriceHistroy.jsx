import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import {
  styled,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import FilterBar from "../../../components/Common/FilterBar";
import { useGridApiRef } from "@mui/x-data-grid";
import CartGrid from "../../../components/Common/CardGrid";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllProductQuery } from "../../../features/api/productApiSlice";
import PriceHistoryCalc from "./PriceHistoryCalc";
import {
  useAddPriceHistoryMutation,
  useGetAllPriceHistoryQuery,
} from "../../../features/api/PriceHistoryApiSlice";
import { setAllProducts } from "../../../features/slice/productSlice";
import PriceHistoryDialogue from "./PriceHistoryDialogue";
import Loading from "../../../components/Common/Loading";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));

const PriceHistroy = ({ autoHeight }) => {
  /// initialize
  const apiRef = useGridApiRef();
  const dispatch = useDispatch();

  /// functions
  const successdisplay = () => {
    Swal.fire({
      title: "History Genrate!",
      text: "The Purchase history has been successfully submitted.",
      icon: "success",
      showConfirmButton: false,
    });
    const close = () => {
      setTimeout(function () {
        Swal.close();
      }, 2000);
    };
    close();
  };

  /// rtk query
  const { data: allProductData, isLoading: productLoading } =
    useGetAllProductQuery("null");
  const {
    data: AllPriceHistory,
    isLoading: priceHistoryLoading,
    refetch: priceHistoryRefetch,
  } = useGetAllPriceHistoryQuery();
  const [addpriceHistory, { isLoading: addpriceHistoryLoading }] =
    useAddPriceHistoryMutation();

  /// Local state
  const [editedValues, setEditedValues] = useState([]);
  const [clear, setClear] = useState(false);
  const [paramsData, setParamsData] = useState({
    brand: "",
    productName: "",
  });
  const [openHistory, setOpenHistory] = useState(false);
  const [openPriceHistoryCalc, setOpenPriceHistoryCalc] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [rows, setRows] = useState([]);

  /// useEffects
  useEffect(() => {
    if (allProductData?.status === "success" && AllPriceHistory?.data) {
      const data = allProductData.data.map((item, index) => {
        const matchingPriceHistory = AllPriceHistory.data.find(
          (priceItem) => priceItem.SKU === item.SKU
        );
        const lastIndex = matchingPriceHistory?.PriceHistory?.length - 1;

        return {
          Sno: index + 1,
          id: item["_id"],
          SKU: item.SKU,
          Name: item.Name,
          Brand: item.Brand,
          Category: item.Category,
          gst: `${item.GST}%`,
          prevRMB: matchingPriceHistory
            ? matchingPriceHistory.PriceHistory?.[lastIndex]?.RMB ?? ""
            : "",
          prevUSD: matchingPriceHistory
            ? matchingPriceHistory.PriceHistory?.[lastIndex]?.USD ?? ""
            : "",
          USD: "",
          RMB: "",
          QTY: "",
          Conversion: "",
          index: index,
        };
      });

      dispatch(setAllProducts({ ...allProductData }));
      setRows(data);
    }
  }, [allProductData, AllPriceHistory]);
  const handleCloseHistory = () => {
    setOpenHistory(false);
  };

  /// handlers
  const HandleOpen = (sku) => {
    setOpenHistory(true);
  };

  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);
    const newSelectedRowsData = rows.filter((item) =>
      selectionModel.includes(item.id)
    );
    setSelectedItemsData(newSelectedRowsData);
  };

  /// Custom Button for Filter
  const CustomText2 = (
    <Box
      onClick={() => {
        setOpenPriceHistoryCalc(true);
      }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "12px",
      }}
    >
      {selectedItemsData.length > 0 ? (
        <Box>
          <Button>Price History</Button>
        </Box>
      ) : (
        <Box></Box>
      )}
    </Box>
  );

  /// Columns
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
      field: "SKU",
      headerName: "SKU Code",
      flex: 0.2,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const onClick = () => {
          setParamsData({
            brand: params.row.brand,
            productName: params.row.Name,
            SKU: params.row.SKU,
          });
          HandleOpen(params.row.SKU);
        };
        return (
          <Typography
            style={{
              cursor: "pointer",
            }}
            onClick={onClick}
          >
            {" "}
            {params.row.SKU}
          </Typography>
        );
      },
    },
    {
      field: "Name",
      headerName: "Name",
      flex: 0.2,
      minWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.2,
      minWidth: 100,
      maxWidth: 140,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Category",
      headerName: "Category",
      flex: 0.3,
      minWidth: 90,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "gst",
      headerName: "Gst",
      flex: 0.2,
      minWidth: 30,
      maxWidth: 60,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "prevRMB",
      headerName: "Prev RMB",
      flex: 0.2,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: ({ value }) => (value !== "" ? `¥ ${value} ` : ""),
    },
    {
      field: "prevUSD",
      headerName: "Prev USD",
      flex: 0.2,
      minWidth: 100,
      maxWidth: 140,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: ({ value }) => (value !== "" ? `$ ${value} ` : ""),
    },
  ];

  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <StyledBox>
          <FilterBar
            apiRef={apiRef}
            // CustomText={CustomButton}
            CustomText2={CustomText2}
            hiddenColumns={hiddenColumns}
            setHiddenColumns={setHiddenColumns}
          />
          <PriceHistoryCalc
            data={selectedItemsData}
            successdisplay={successdisplay}
            open={openPriceHistoryCalc}
            setOpen={setOpenPriceHistoryCalc}
            handleSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
          />
          <Grid item xs={12} sx={{ mt: "5px" }}>
            <Loading loading={productLoading} />

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
                Height={"84vh"}
                apiRef={apiRef}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                rowSelectionModel={selectedItems}
              />
            </Box>
          </Grid>
        </StyledBox>
        <PriceHistoryDialogue
          openHistory={openHistory}
          handleCloseHistory={handleCloseHistory}
          paramsData={paramsData}
          HandleOpen={HandleOpen}
        />
      </Box>
    </>
  );
};
export default PriceHistroy;
