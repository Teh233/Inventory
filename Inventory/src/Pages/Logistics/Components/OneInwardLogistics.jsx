import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  styled,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import CartGrid from "../../../components/Common/CardGrid";
import { useGetOneLogisticsQuery } from "../../../features/api/logisticsApiSlice";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const StyleSpan = styled("span")(({ theme }) => ({
  padding: "2px 10px",
  border: "0.5px solid black",
  background: theme.palette.mode === "dark" ? "#fff" : "grey",
  color: theme.palette.mode === "dark" ? "black" : "#fff",
  borderRadius: "5px",
}));

const OneInwardLogistics = () => {
  /// initialize

  const { id } = useParams();

  /// local state
  const [open, setOpen] = useState(false);
  const [rows, setRow] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  /// rtk query
  const { data: oneLogisticsData } = useGetOneLogisticsQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const date = new Date(oneLogisticsData?.data?.Date).toLocaleDateString(
    "en-IN",
    { imeZone: "Asia/Kolkata" }
  );
  /// useEffect

  useEffect(() => {
    if (oneLogisticsData?.status === "success") {
      const newRows = oneLogisticsData.data.NoOfBox.map((item, index) => {
        return {
          id: index,
          Sno: index + 1,
          weight: item.weight,
          dimension: `${item.length} X ${item.width} X ${item.height}`,
          Aweight: item.actWeight,
          marking: item.marking,
          description: item.description,
          url: item.photo,
        };
      });

      setRow(newRows);
    }
  }, [oneLogisticsData]);

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.1,
      minWidth: 40,
      maxWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      // cellClassName: "super-app-theme--cell",
    },
    {
      field: "weight",
      headerName: "weight",
      flex: 0.1,
      width: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      // cellClassName: "super-app-theme--cell",
    },

    {
      field: "dimension",
      headerName: "Dimensions (L x W x H)",
      flex: 0.2,
      width: 400,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      // cellClassName: "super-app-theme--cell",
    },
    {
      field: "Aweight",
      headerName: "Acutal weight",
      flex: 0.1,
      width: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      // cellClassName: "super-app-theme--cell",
    },
    {
      field: "marking",
      headerName: "Marking",
      flex: 0.2,
      width: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      // cellClassName: "super-app-theme--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 0.4,
      width: 400,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      // cellClassName: "super-app-theme--cell",
    },
    {
      field: "view",
      headerName: "View",
      flex: 0.1,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      // cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <>
            <Button
              disabled={params.row.url ? false : true}
              variant="text"
              onClick={() => {
                setOpen(true);
                setImageUrl(params.row.url);
              }}
            >
              View
            </Button>
            <Dialog
              open={open}
              onClose={() => {
                setOpen(false);
              }}
              fullWidth
              maxWidth="lg"
            >
              <DialogTitle>Box Image</DialogTitle>
              <DialogContent>
                <iframe
                  src={imageUrl}
                  style={{ width: "100%", height: "70vh", border: "none" }}
                ></iframe>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setOpen(false);
                  }}
                  color="primary"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </>
        );
      },
    },
  ];

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "10px",
        }}
      >
        <Typography variant="body2" gutterBottom sx={{fontWeight:"bold"}}>
        Date <StyleSpan>{date}</StyleSpan>
        </Typography>
        <Typography variant="body2" gutterBottom sx={{fontWeight:"bold"}}>
        HAWB no <StyleSpan>{oneLogisticsData?.data?.Hawb}</StyleSpan>
        </Typography>
        <Typography variant="body2" gutterBottom sx={{fontWeight:"bold"}}>
        PI <StyleSpan>{oneLogisticsData?.data?.Pi}</StyleSpan>
        </Typography>

        <Typography variant="body2" gutterBottom sx={{fontWeight:"bold"}}>
        LogisticId <StyleSpan>{oneLogisticsData?.data?.logisticId}</StyleSpan>
        </Typography>

        <Typography variant="body2" gutterBottom sx={{fontWeight:"bold"}}>
        Box <StyleSpan>{oneLogisticsData?.data?.Box}</StyleSpan>
        </Typography>
      </Box>
      <CartGrid rows={rows} columns={columns} Height={"84vh"} />
    </Box>
  );
};

export default OneInwardLogistics;
