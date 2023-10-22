import { useEffect, useState } from "react";
import {
  Grid,
  styled,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymenUploadDialog from "./PaymenUploadDialog";
import RecieptViewDialog from "./RecieptViewDialog";
import BASEURL from "../../../constants/BaseApi";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../../components/Common/Loading";
import {
  useGetOneOverseasOrderQuery,
  useDeleteOrderItemMutation,
  useUpdateOverseaseOrderMutation,
} from "../../../features/api/RestockOrderApiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const OverSeasOrderProductGrid = () => {
  /// initialize
  const { id } = useParams();

  const apiRef = useGridApiRef();

  /// local State
  const [editedRows, setEditedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openRecieptView, setRecieptView] = useState(false);
  const [rows, setRows] = useState([]);
  const [loadingDownload, setLoadingDownload] = useState(false);

  /// rtk query

  const {
    refetch,
    data: overseasOrderData,
    isLoading: overseasOrderLoading,
  } = useGetOneOverseasOrderQuery(id);

  const [deleteOrderItemApi, { isLoading: deleteLoading }] =
    useDeleteOrderItemMutation();

  const [updateOverseaseOrder, { isLoading }] =
    useUpdateOverseaseOrderMutation();

  /// useEffect

  useEffect(() => {
    if (overseasOrderData?.status === "success") {
      const data = overseasOrderData.data?.products?.map((item, index) => {
        return {
          id: item.SKU,
          SKU: item.SKU,
          Sno: index + 1,
          Name: item.Name,
          threshold: item.ThresholdQty,
          acutalQTY: item.Quantity,
          NewQuantity: item.NewQuantity,
          Price: item.Price || 0,
          status: item.Status,
        };
      });
      setRows(data);
    }
  }, [overseasOrderData]);

  // handle

  const handleRowUpdate = (params) => {
    const ids = apiRef?.current?.state?.editRows || {};

    const outputArray = [];
    for (const [id, fields] of Object.entries(ids)) {
      for (const [field, valueObj] of Object.entries(fields)) {
        const value = Number(valueObj.value);
        outputArray.push({ id: id, field, value });
      }
    }

    setEditedRows(outputArray);
  };

  const handleDeleteItem = async (sku) => {
    try {
      const params = {
        id: id,
        body: {
          SKU: sku,
        },
      };
      const res = await deleteOrderItemApi(params).unwrap();
      refetch();
    } catch (error) {
      console.error("An error occurred during OverseasOrderList:", error);
    }
  };

  const handleUpdateQuantity = async () => {
    try {
      if (editedRows.length === 0) {
        return;
      }

      const newEditedRows = editedRows.reduce((result, item) => {
        const { id, field, value } = item;
        const existingQuery = result.find((query) => query.query === field);
        const newData = { SKU: id, value };

        if (existingQuery) {
          existingQuery.data.push(newData);
        } else {
          result.push({ query: field, data: [newData] });
        }

        return result;
      }, []);

      for (const data of newEditedRows) {
        const params = {
          id: id,
          type: data.query,
          body: { products: data.data },
        };
        const res = await updateOverseaseOrder(params).unwrap();
      }

      setEditedRows([]);
      refetch().then((data) => {
        handleClear();
      });

      toast.success("Product Updated Successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const handleDownloadPI = async () => {
    setLoadingDownload(true);
    try {
      const response = await axios.get(
        `${BASEURL}/restock/admin/PIDownload/${id}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `${overseasOrderData?.data?.overSeasOrderId}.pdf`);

      toast.success("Download Started...", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error("An error occurred during download:", error);
    }
    setLoadingDownload(false);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleClear = () => {
    if (editedRows.length > 0) {
      editedRows.forEach((row) => {
        apiRef.current.stopCellEditMode({
          id: row.id,
          field: row.field,
          ignoreModifications: true,
        });
      });
    }
    setEditedRows([]);
  };

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Name",
      headerName: "Product ",
      flex: 0.3,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "threshold",
      headerName: "Threshold",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "acutalQTY",
      headerName: "Acutal QTY",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "NewQuantity",
      headerName: "Required QTY",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      editable: true,
      type: "number",
    },
    {
      field: "Price",
      headerName: "Price",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      editable: true,
      type: "number",
    },
    {
      field: "action",
      headerName: "",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <DeleteIcon
            onClick={() => {
              handleDeleteItem(params.row.SKU);
            }}
          />
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
      <RecieptViewDialog
        open={openRecieptView}
        setOpen={setRecieptView}
        url={overseasOrderData?.data?.Reciept}
      />
      <PaymenUploadDialog
        open={open}
        onClose={onClose}
        id={id}
        refetch={refetch}
      />
      <Grid container>
        <Loading loading={overseasOrderLoading || deleteLoading || isLoading} />
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              height: "2.5rem",
            }}
          >
            <Grid item xs={4}>
              {editedRows.length > 0 ? (
                <Box sx={{}}>
                  <Button onClick={handleUpdateQuantity}>Save</Button>{" "}
                  <Button onClick={handleClear}>Clear</Button>
                </Box>
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  mt: "0.3rem",
                  width: "45rem",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "	#d9d9d9 ",
                    display: "inline-flex",
                    alignItems: "center",
                    padding: ".3rem",
                    boxShadow: "  #bfbfbf 0px 3px 8px;",
                    paddingX: "1rem",
                    cursor: "pointer",
                    marginLeft: ".7rem",
                  }}
                >
                  <Typography
                    variant="span"
                    color="black"
                    sx={{ fontWeight: "bold" }}
                  >
                    Company Name:
                    <Typography variant="span" color="red">
                      {" "}
                      {overseasOrderData?.data?.CompanyName}
                    </Typography>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "	#d9d9d9 ",
                    display: "inline-flex",
                    alignItems: "center",
                    padding: ".3rem",
                    boxShadow: "  #bfbfbf 0px 3px 8px;",
                    paddingX: "1rem",
                    cursor: "pointer",
                    marginLeft: ".7rem",
                  }}
                >
                  <Typography
                    variant="span"
                    color="black"
                    sx={{ fontWeight: "bold" }}
                  >
                    Concern Person:
                    <Typography variant="span" color="red">
                      {" "}
                      {overseasOrderData?.data?.ConcernPerson}
                    </Typography>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "	#d9d9d9 ",
                    display: "inline-flex",
                    alignItems: "center",
                    padding: ".3rem",
                    boxShadow: "  #bfbfbf 0px 3px 8px;",
                    paddingX: "1rem",
                    cursor: "pointer",
                    marginLeft: ".7rem",
                  }}
                >
                  <Typography
                    variant="span"
                    color="black"
                    sx={{ fontWeight: "bold" }}
                  >
                    Current Status:
                    <Typography variant="span" color="red">
                      {" "}
                      {overseasOrderData?.data?.status}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  display: "flex",
                }}
              ></Box>
            </Grid>
          </Box>
          <Box>
            <Button
              onClick={() => {
                if (overseasOrderData?.data?.status === "pending") {
                  setOpen(true);
                } else {
                  setRecieptView(true);
                }
              }}
            >
              {overseasOrderData?.data?.status === "pending"
                ? "Upload Reciept"
                : "view"}
            </Button>
            {overseasOrderData?.data?.status === "pending" ? (
              ""
            ) : (
              <Button onClick={handleDownloadPI}>
                {loadingDownload ? (
                  <CircularProgress size={24} color="inherit" /> // Show loading indicator
                ) : (
                  "Download PO"
                )}
              </Button>
            )}
          </Box>
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
              editMode="cell"
              apiRef={apiRef}
              processRowUpdate={handleRowUpdate}
              onProcessRowUpdateError={(error) => {}}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverSeasOrderProductGrid;
