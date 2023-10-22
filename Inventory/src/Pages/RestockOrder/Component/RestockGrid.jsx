import { React, useEffect, useState } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
  GridPagination,
} from "@mui/x-data-grid";
import FilterBar from "../../../components/Common/FilterBar";
import { Grid, Box, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { setAllProducts } from "../../../features/slice/productSlice";
import { useGetAllProductQuery } from "../../../features/api/productApiSlice";
import Loading from "../../../components/Common/Loading";
import RestockItemDialog from "./RestockItemDialog";
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

const RestockGrid = ({ setOpenHistory, setProductDetails }) => {
  /// initialization
  const dispatch = useDispatch();
  const apiRef = useGridApiRef();
  /// global state

  /// local state

  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openRestockItem, setOpenRestockItem] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState({});

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
  } = useGetAllProductQuery("null");

  /// handlers

  const handleSelectionChange = (ids) => {
    setSelectedItems(ids);

    const selectedRowsData = ids.map((id) => {
      return rows.find((row) => row.id === id);
    });

    setSelectedRows(selectedRowsData);
  };

  const handleOpenRestockItem = () => {
    setOpenRestockItem(true);
  };
  const handleCloseRestockItem = () => {
    setOpenRestockItem(false);
  };

  const handleRemoveRestockItem = (id) => {
    const newSelectedItems = selectedItems.filter((item) => item !== id);

    setSelectedItems(newSelectedItems);
    const newSelectedRow = selectedRows.filter((item) => item.id !== id);
    setSelectedRows(newSelectedRow);
  };
  /// useEffect
  useEffect(() => {
    if (allProductData?.status === "success") {
      const data = allProductData?.data.map((item, index) => {
        return {
          id: index + 1,
          Sno: index + 1,
          SKU: item.SKU,
          Name: item.Name,
          Quantity: item.ActualQuantity,
          ThresholdQty: item.ThresholdQty,
          Brand: item.Brand,
          Category: item.Category,
          GST: item.GST,
        };
      });

      dispatch(setAllProducts({ ...allProductData }));
      setRows(data);
    }
  }, [allProductData]);

  /// Columns
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
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 100,
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
      minWidth: 100,
      //    maxWidth: 290,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.3,
      minWidth: 120,
      maxWidth: 170,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Category",
      headerName: "Category",
      flex: 0.3,
      minWidth: 120,
      maxWidth: 170,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      hide: true,
    },
    {
      field: "GST",
      headerName: "GST",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: "ThresholdQty",
      headerName: "Threshold",
      flex: 0.3,
      minWidth: 120,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",

      type: "number",
    },
    {
      field: "Quantity",
      headerName: "Quantity",
      flex: 0.3,
      minWidth: 120,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
  ];

  return (
    <>
      <Box sx={{ width: "100%", height: "100%" }}>
        <FilterBar
          apiRef={apiRef}
          customButton={
            selectedRows.length
              ? `Restock Items ${selectedRows.length}`
              : undefined
          }
          customOnClick={handleOpenRestockItem}
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
        />
        <Grid container>
          {productLoading ? (
            <Loading loading={productLoading} />
          ) : (
            <Grid item xs={12} sx={{ mt: "5px" }}>
              <Box
                sx={{
                  width: "100%",
                  height: "82vh",
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
                  components={{
                    Footer: CustomFooter,
                  }}
                  slotProps={{
                    footer: { status: refetch },
                  }}
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
                  checkboxSelection
                  columnVisibilityModel={hiddenColumns}
                  onColumnVisibilityModelChange={(newModel) =>
                    setHiddenColumns(newModel)
                  }
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={handleSelectionChange}
                  rowSelectionModel={selectedItems}
                  onProcessRowUpdateError={(error) => {}}
                />
              </Box>
            </Grid>
          )}
        </Grid>
        <RestockItemDialog
          items={selectedRows}
          open={openRestockItem}
          onClose={handleCloseRestockItem}
          handleDelete={handleRemoveRestockItem}
          setSelectedItems={setSelectedItems}
        />
      </Box>
    </>
  );
};

export default RestockGrid;
