import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGridApiRef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { setAllProducts } from "../../../features/slice/productSlice";
import { TableCell, Grid, Button, Typography, Box } from "@mui/material";
import BarcodeHistoryDialog from "./BarcodeHistoryDialog";
import FilterBar from "../../../components/Common/FilterBar";
import { useGetAllProductQuery } from "../../../features/api/productApiSlice";
import {
  useGetBarcodesDispatchHistoryQuery,
  useGetBarcodesReturnHistoryQuery,
} from "../../../features/api/barcodeApiSlice";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));

import CartGrid from "../../../components/Common/CardGrid";
import Loading from "../../../components/Common/Loading";

const BarcodeHistory = () => {
  const dispatch = useDispatch();
  const apiRef = useGridApiRef();
  //   const roboHistoryData = useSelector(roboProductHistory);
  const [openHistory, setOpenHistory] = useState(false);
  const [serialData, setSerialData] = useState({});
  const [isChecking, setIsChecking] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundImage: "linear-gradient(0deg, #01127D, #04012F)",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const DrawerHeader = styled("div")(({ theme }) => ({
    ...theme.mixins.toolbar,
  }));

  // handlers
  const handleopenHistory = (event) => {
    setOpenHistory(!openHistory);
  };

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch: refetchAllProducts,
  } = useGetAllProductQuery("null", {
    refetchOnMountOrArgChange: true,
  });



  const [combineHistory, setcombineHistory] = useState([]);

  const {
    refetch: refetchDispath,
    data: DispatchHistory,
    isLoading: DisptachLoading,
  } = useGetBarcodesDispatchHistoryQuery();
  const {
    refetch: refetchReturn,
    data: ReturnHistory,
    isLoading: ReturnLoading,
  } = useGetBarcodesReturnHistoryQuery();

  useEffect(() => {
    if (
      DispatchHistory &&
      DispatchHistory?.data &&
      ReturnHistory?.data &&
      ReturnHistory
    ) {
      setcombineHistory([...ReturnHistory?.data, ...DispatchHistory?.data]);
    } else if (
      DispatchHistory &&
      DispatchHistory?.data &&
      !ReturnHistory?.data?.length > 0
    ) {
      setcombineHistory([...DispatchHistory?.data]);
    } else if (
      ReturnHistory &&
      ReturnHistory?.data &&
      !DispatchHistory?.data?.length > 0
    ) {
      setcombineHistory([...ReturnHistory?.data]);
    }
  }, [DispatchHistory, ReturnHistory]);

  useEffect(() => {
    dispatch(setAllProducts({ ...allProductData }));
  }, [allProductData]);

  useEffect(() => {
    refetchDispath();
    refetchReturn();
  }, []);

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
      headerName: "SKU",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) =>
        params.row.type === "Return" ? (
          <Typography color="error">Return</Typography>
        ) : (
          <Typography color="green">Dispatch</Typography>
        ),
    },
    {
      field: "Name",
      headerName: "Name",
      flex: 0.3,
      minWidth: 250,
      align: "center",
      headerAlign: "center",

      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.2,
      minWidth: 150,
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
        const handleViewClick = () => {
          setSerialData({
            SKU: params.row.SKU,
            Name: params.row.Name,
            SNo: params.row.SNo,
            Type: params.row.type,
          });

          handleopenHistory();
        };
        return (
          <>
            <Button onClick={handleViewClick}>view</Button>
            <BarcodeHistoryDialog
              open={openHistory}
              onClose={handleopenHistory}
              serialData={serialData}
            />
          </>
        );
      },
    },
  ];

  const rowss = (data) => {
    return data.map((item, index) => {
      return {
        id: item._id,
        Sno: index + 1,
        SKU: item.SKU,
        Name: item.Name,
        Brand: item.Brand,
        SNo: item.SNo,
        type: item.type ? item.type : "Dispatch",
      };
    });
  };
  // editable rows
  const [editedValues, setEditedValues] = useState([]);

  return (
    <Box
    component="main"
    sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden" }}
  >
         <DrawerHeader />
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <StyledBox>
          <FilterBar
          apiRef={apiRef}
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
        />
        <Grid item xs={12} sx={{ mt: "5px" }}>
          <Loading loading={productLoading} />
          <CartGrid
            columns={columns}
            apiRef={apiRef}
            rows={combineHistory?.length > 0 ? rowss(combineHistory) : []}
            rowHeight={40}
            Height={"82vh"}
            hiddenColumns={hiddenColumns}
            setHiddenColumns={setHiddenColumns}
          />
        </Grid>
      </StyledBox>
    </Box>
    </Box>
  );
};

export default BarcodeHistory;
