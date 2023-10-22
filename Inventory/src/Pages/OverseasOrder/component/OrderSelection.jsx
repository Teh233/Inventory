import { useEffect, useState } from "react";
import { Grid, styled, Box, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useGetRestockProductDetailQuery } from "../../../features/api/RestockOrderApiSlice";
import Loading from "../../../components/Common/Loading";
import Order2Vendor from "./Order2Vendor";
import { useLocation } from "react-router-dom";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const OrderSelection = () => {
  /// initialize
  const { search } = useLocation();
  const apiRef = useGridApiRef();
  const { id } = useParams();

  /// local state
  const [rows, setRows] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [editedRows, setEditedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openRestockItem, setOpenRestockItem] = useState(false);

  /// rtk query
  const {
    refetch,
    data: RestockProduct,
    isLoading: RestockLoading,
  } = useGetRestockProductDetailQuery(id);

  /// useEffect
  useEffect(() => {
    if (RestockProduct?.status === "success") {
      const data = RestockProduct?.product?.products?.map((item, index) => {
        return {
          id: item.SKU,
          Sno: index + 1,
          Name: item.Name,
          Quantity: item.Quantity,
          Status: item.Status,
          Brand: item.Brand,
          Category: item.Category,
          GST: item.GST || 0,
          NewQuantity: item.NewQuantity,
          SKU: item.SKU,
          ThresholdQty: item.ThresholdQty,
        };
      });
      setRows(data);
    }
  }, [RestockProduct]);

  /// handlers
  const handleRemoveRestockItem = (id) => {
    const newSelectedItems = selectedItems.filter((item) => item !== id);

    setSelectedItems(newSelectedItems);
    const newSelectedRow = selectedRows.filter((item) => item.id !== id);
    setSelectedRows(newSelectedRow);
  };

  const handleOpenRestockItem = () => {
    setOpenRestockItem(!openRestockItem);
  };

  const handleSelectionChange = (ids) => {
    setSelectedItems(ids);

    const selectedRowsData = ids.map((id) => {
      return rows.find((row) => row.id === id);
    });

    setSelectedRows(selectedRowsData);
  };

  const handleRowUpdate = (params) => {
    const existingIndex = editedRows.findIndex((row) => row.SKU === params.SKU);

    if (existingIndex !== -1) {
      const updatedRows = [...editedRows];
      updatedRows[existingIndex] = {
        SKU: params.SKU,
        ThresholdQty: params.ThresholdQty,
        id: params.id,
      };
      setEditedRows(updatedRows);
    } else {
      setEditedRows((prevEditedRows) => [
        ...prevEditedRows,
        { SKU: params.SKU, ThresholdQty: params.ThresholdQty, id: params.id },
      ]);
    }
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
      //  maxWidth: 600,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST ",
      flex: 0.3,
      minWidth: 200,
      //  maxWidth: 600,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: "Status",
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
      field: "ThresholdQty",
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
      field: "Quantity",
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
      editable: search === "?view" ? false : true,
      type: "number",
    },
  ];

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Grid container>
        <Loading loading={RestockLoading} />

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
                  <Button
                    onClick={() => {
                      handleSellerPrice();
                    }}
                  >
                    Save
                  </Button>{" "}
                  <Button
                    onClick={() => {
                      // apiRef.current.state.

                      // Update the state of the DataGrid using setState method
                      const ids = { ...apiRef?.current?.state?.editRows };

                      const key = Object.keys(ids);
                      if (key.length > 0) {
                        key.map((id) => {
                          apiRef.current.stopRowEditMode({
                            id: id,
                            ignoreModifications: true, // will also discard the changes made
                          });
                        });
                      }
                      setEditedRows([]);
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  mt: "0.3rem",
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

                    // border:"1.3px solid #4da6ff"
                  }}
                >
                  <Typography
                    variant="span"
                    color="black"
                    sx={{ fontWeight: "bold" }}
                  >
                    Current Status:
                    <Typography
                      variant="span"
                      color={
                        RestockProduct?.product?.status === "pending"
                          ? "red"
                          : RestockProduct?.product?.status === "fulfilled"
                          ? "green"
                          : ""
                      }
                    >
                      {" "}
                      {RestockProduct?.product?.status}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              {selectedRows.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Button sx={{ ml: "auto" }} onClick={handleOpenRestockItem}>
                    Click to Order{" "}
                    {selectedRows.length > 0 ? selectedRows.length : ""}
                  </Button>
                </Box>
              ) : (
                ""
              )}
            </Grid>
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
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    Category: false,
                  },
                },
              }}
              columnVisibilityModel={hiddenColumns}
              onColumnVisibilityModelChange={(newModel) =>
                setHiddenColumns(newModel)
              }
              editMode="row"
              apiRef={apiRef}
              checkboxSelection={search === "?view" ? false : true}
              disableRowSelectionOnClick
              isRowSelectable={(params) => params.row.Status === "generated"}
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={selectedItems}
              onRowEditStop={handleRowUpdate}
              onRowEditStopCancel={() => setEditedRows([])}
            />
            <Order2Vendor
              items={selectedRows}
              reStockId={RestockProduct?.product?.restockId}
              open={openRestockItem}
              refetch={refetch}
              onClose={handleOpenRestockItem}
              handleDelete={handleRemoveRestockItem}
              setSelectedItems={setSelectedItems}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderSelection;
