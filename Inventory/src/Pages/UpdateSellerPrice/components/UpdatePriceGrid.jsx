import { React, useEffect, useState } from 'react';
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
  GridPagination,
} from '@mui/x-data-grid';
import FilterBar from '../../../components/Common/FilterBar';
import { Grid, Box, Button, Switch } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setAllProducts } from '../../../features/slice/productSlice';
import CachedIcon from '@mui/icons-material/Cached';
import BulkUpdateSelectorDialog from './BulkUpdateSelectorDialog';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import {
  useUpdateProductsColumnMutation,
  useGetAllProductQuery,
  useUpdateNotationMutation,
} from '../../../features/api/productApiSlice';
import Loading from '../../../components/Common/Loading';
import { useNavigate } from 'react-router-dom';
import UpdateStockDialog from './UpdateStockDialog';
import productColumnData from '../../../constants/ProductColumn';
import { useSocket } from '../../../CustomProvider/useWebSocket';
import UpdateLiveCalcDialog from './updateLiveCalcDialog';
import ColumnsExplainerDialog from './ColumnsExplainerDialog';
import HideColumnsDialog from './HideColumnsDialog';
import { AdminPanelSettings } from '@mui/icons-material';
/// custom Footer
function CustomFooter(props) {
  const { status } = props;
  return (
    <GridToolbarContainer>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Button size="small" onClick={() => status()}>
          <CachedIcon />
        </Button>

        <Box display="flex" gap="20px">
          <Box display="flex" alignItems="center" gap="10px">
            <span style={{ fontWeight: 'bold' }}>Waiting Approval</span>
            <Box
              bgcolor="#FF7F50"
              sx={{
                border: '0.5px solid black',
                width: '25px',
                height: '20px',
                borderRadius: '10px',
              }}
            ></Box>
          </Box>
          <Box display="flex" alignItems="center" gap="10px">
            <span style={{ fontWeight: 'bold' }}>Update Rejected</span>
            <Box
              bgcolor="#B22222"
              sx={{
                border: '0.5px solid black',
                width: '25px',
                height: '20px',
                borderRadius: '10px',
              }}
            ></Box>
          </Box>
          <Box display="flex" alignItems="center" gap="10px">
            <span style={{ fontWeight: 'bold' }}>Sales Columns</span>
            <Box
              bgcolor="#93C54B"
              sx={{
                border: '0.5px solid black',
                width: '25px',
                height: '20px',
                borderRadius: '10px',
              }}
            ></Box>
          </Box>
          <Box display="flex" alignItems="center" gap="10px">
            <span style={{ fontWeight: 'bold' }}>Seller Columns</span>
            <Box
              bgcolor="#606CF2"
              sx={{
                border: '0.5px solid black',
                width: '25px',
                height: '20px',
                borderRadius: '10px',
              }}
            ></Box>
          </Box>
        </Box>
        <GridPagination />
      </Box>
    </GridToolbarContainer>
  );
}

const Content = ({ setOpenHistory, setProductDetails, autoHeight }) => {
  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const socket = useSocket();

  /// global state
  const {
    isAdmin,
    productColumns,
    userInfo,
    hiddenColumns: latestHiddenColumns,
  } = useSelector((state) => state.auth);

  const { searchTerm, forceSearch } = useSelector((state) => state.product);

  /// local state
  const [rows, setRows] = useState([]);
  const [filterString, setFilterString] = useState('');
  const [editedRows, setEditedRows] = useState([]);
  const [triggerDefault, setTriggerDefault] = useState(false);
  const [open, setOpen] = useState(false);
  const [SKU, setSKU] = useState('');
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [openBulkUpdateSelector, setOpenBulkUpdateSelector] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [openCalc, setOpenCalc] = useState(false);
  const [buttonType, setButtontype] = useState('');

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetAllProductQuery(searchTerm, {
    pollingInterval: 1000 * 300,
  });

  const [updateProductsApi, { isLoading: updateProductLoading }] =
    useUpdateProductsColumnMutation();

  const [notationUpdateApi, { isLoading: NotationLoading }] =
    useUpdateNotationMutation();

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

  const handleOpenDialog = (type) => {
    setOpenCalc(true);
    setButtontype(type);
  };
  // handle Seller price update

  const handleSellerPrice = async () => {
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

      if (newEditedRows.length > 0) {
        await Promise.all(
          newEditedRows.map(async (item) => {
            const params = {
              type: item.query,
              body: { products: item.data },
            };
            const res = await updateProductsApi(params).unwrap();

            const liveStatusData = {
              message: `${userInfo.name} updated ${item.query} of ${item.data
                .map((product) => `${product.SKU} to ${product.value}`)
                .join(', ')} `,
              time: new Date().toLocaleTimeString('en-IN', {
                timeZone: 'Asia/Kolkata',
              }),
            };
            socket.emit('liveStatusServer', liveStatusData);
          })
        );
      }
      refetch();
      handleClear();
    } catch (error) {
      console.error('An error occurred Update Price Grid:');
      console.error(error);
    }
  };

  const handleRowUpdate = () => {
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

  // handle
  // handle Notation update
  const handleIsActiveyncUpdate = async (id, status, type) => {
    try {
      const data = {
        sku: id,
        body: { data: status, type: type },
      };

      const res = await notationUpdateApi(data).unwrap();
      setRows((prevRow) => {
        return prevRow.map((item) => {
          if (item.SKU === id) {
            return { ...item, [type]: status };
          } else {
            return { ...item };
          }
        });
      });
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };
  const customOnClick = () => {
    setOpenBulkUpdateSelector(true);
  };

  /// useEffect
  useEffect(() => {
    if (allProductData?.status === 'success') {
      const data = allProductData?.data.map((item, index) => {
        return {
          id: item.SKU,
          Sno: index + 1,
          SKU: item.SKU,
          Name: item.Name,
          LandingCost: item.LandingCost.toFixed(2),
          LandingCostWithGst: (
            (item.LandingCost / 100) *
            (100 + item.GST)
          ).toFixed(2),
          SalesPrice: item.SalesPrice.toFixed(2),
          MRP: item.MRP.toFixed(2),
          GST: item.GST,
          ThresholdQty: item.ThresholdQty,
          Quantity: item.ActualQuantity,
          Category: item.Category,
          SalesTax: item.SalesTax.toFixed(2) || 0,
          SellerTax: item.SellerTax.toFixed(2) || 0,
          SellerPrice: item.SellerPrice.toFixed(2) || 0,
          ProfitSeller:
            !item.SellerPrice || !item.LandingCost
              ? 0
              : (
                  ((item.SellerPrice - item.LandingCost) / item.LandingCost) *
                  100
                ).toFixed(2),
          ProfitSales:
            !item.SalesPrice || !item.LandingCost
              ? 0
              : (
                  ((item.SalesPrice - item.LandingCost) / item.LandingCost) *
                  100
                ).toFixed(2),
          Brand: item.Brand,
          isVerifiedSellerPrice: item.isVerifiedSellerPrice,
          isRejectedSellerPrice: item.isRejectedSellerPrice,
          isVerifiedQuantity: item.isVerifiedQuantity,
          isRejectedQuantity: item.isRejectedQuantity,
          isVerifiedSalesPrice: item.isVerifiedSalesPrice,
          isRejectedSalesPrice: item.isRejectedSalesPrice,
          isVerifiedLandingCost: item.isVerifiedLandingCost,
          isRejectedLandingCost: item.isRejectedLandingCost,
          isVerifiedMRP: item.isVerifiedMRP,
          isRejectedMRP: item.isRejectedMRP,
          isEcwidSync: item.isEcwidSync,
          isWholeSaleActive: item.isWholeSaleActive,
          isImageExist: item.mainImage?.fileId ? true : false,
        };
      });

      dispatch(setAllProducts({ ...allProductData }));
      setRows(data);
    }
  }, [allProductData, triggerDefault]);

  useEffect(() => {
    if (editedRows.length && rows.length) {
      const lastArrayItem = editedRows.length - 1;
      if (editedRows[lastArrayItem].field === 'SellerPrice') {
        const updatedArr1 = rows.map((item1) => {
          const matchingItem = editedRows.find(
            (item2) => item2.id === item1.id
          );

          if (matchingItem) {
            const ProfitSeller = (
              ((matchingItem.value - item1.LandingCost) / item1.LandingCost) *
              100
            ).toFixed(2);
            return {
              ...item1,
              SellerPrice: matchingItem.value,
              ProfitSeller,
            };
          }
          return item1;
        });

        setRows(updatedArr1);
      }
    }
  }, [editedRows]);

  useEffect(() => {
    const newHiddenColumns = {};

    latestHiddenColumns.forEach((column) => {
      newHiddenColumns[column] = false;
    });

    setHiddenColumns(newHiddenColumns);
  }, [latestHiddenColumns]);

  //Columns*******

  const columns = [
    {
      field: 'Sno',
      headerName: 'Sno',
      flex: 0.3,
      minWidth: 40,
      maxWidth: 60,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'SKU',
      headerName: 'SKU',
      flex: 0.3,
      minWidth: 100,
      maxWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      editable: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
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
      field: 'Name',
      headerName: 'Product ',
      flex: 0.3,
      minWidth: 450,
      // maxWidth: 290,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Brand',
      headerName: 'Brand',
      flex: 0.3,
      minWidth: 90,
      maxWidth: 110,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Category',
      headerName: 'Category',
      flex: 0.3,
      minWidth: 90,
      maxWidth: 120,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },

    {
      field: 'MRP',
      headerName: 'MRP ₹',
      flex: 0.3,
      minWidth: 90,
      maxWidth: 100,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: 'Quantity',
      headerName: 'QTY',
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => {
        // for background
        const statusColor = params.row.isRejectedQuantity
          ? '#B22222'
          : !params.row.isVerifiedQuantity
          ? '#FF7F50'
          : '';
        // for text color
        const textColor = params.row.isRejectedQuantity
          ? '#fff'
          : !params.row.isVerifiedQuantity
          ? '#fff'
          : '';
        const onClick = () => {
          if (!params.row.isVerifiedQuantity) {
            return;
          }
          const product = productColumns.find(
            (productColumn) => productColumn.name === 'Quantity'
          );

          if (!isAdmin && !product.isEdit) {
            return;
          }
          setSKU(params.row.SKU);
          setOpen(true);
        };
        return (
          <Button
            sx={{ background: statusColor, color: textColor }}
            onClick={onClick}
          >
            {params.row.Quantity}
          </Button>
        );
      },
    },
    {
      field: 'GST',
      headerName: 'GST %',
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `${params.value} %`,
    },

    {
      field: 'LandingCost',
      headerName: 'Cost ₹',
      flex: 0.3,
      minWidth: 90,
      maxWidth: 130,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },

    {
      field: 'ProfitSales',
      headerClassName: 'super-app-theme--header--Sales',
      cellClassName: 'super-app-theme--cell',
      headerName: 'SalesProfit %',
      align: 'center',
      headerAlign: 'center',
      flex: 0.2,
      minWidth: 100,
      maxWidth: 150,
      valueFormatter: (params) => `${params.value} %`,
      // maxWidth: 130,
    },

    {
      field: 'SalesPrice',
      headerClassName: 'super-app-theme--header--Sales',
      cellClassName: 'super-app-theme--cell',
      headerName: 'Sales price ₹',
      align: 'center',
      headerAlign: 'center',
      minWidth: 70,
      maxWidth: 150,
      valueFormatter: (params) => `₹ ${params.value}`,
    },

    {
      field: 'ProfitSeller',
      headerClassName: 'super-app-theme--header--Seller',
      cellClassName: 'super-app-theme--cell',
      headerName: 'WholeSale Profit%',
      align: 'center',
      headerAlign: 'center',
      flex: 0.2,
      minWidth: 100,
      maxWidth: 150,
      valueFormatter: (params) => `${params.value} %`,
      // maxWidth: 130,
    },

    {
      field: 'SellerPrice',
      headerClassName: 'super-app-theme--header--Seller',
      cellClassName: 'super-app-theme--cell',
      headerName: 'WholeSale price ₹',
      align: 'center',
      headerAlign: 'center',
      flex: 0.2,
      minWidth: 100,
      maxWidth: 150,
      editable: true,
      type: 'number',
      valueFormatter: (params) => `₹ ${params.value}`,
      // maxWidth: 130,
    },
    {
      field: 'history',
      headerClassName: 'super-app-theme--header--history',
      cellClassName: 'super-app-theme--cell',
      headerName: 'History',
      align: 'center',
      headerAlign: 'center',
      flex: 0.2,
      minWidth: 70,
      maxWidth: 90,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              setOpenHistory(true);
              setProductDetails(params.row);
            }}
          >
            View
          </Button>
        );
      },
    },

    {
      field: 'isImageExist',
      headerName: `WS Active`,
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => {
        return (
          <div>
            {params.row.isImageExist ? (
              <Switch
                checked={params.row.isWholeSaleActive}
                onChange={(e) => {
                  handleIsActiveyncUpdate(
                    params.row.SKU,
                    e.target.checked,
                    'isWholeSaleActive'
                  );
                }}
              />
            ) : (
              <ImageNotSupportedIcon />
            )}
          </div>
        );
      },
    },
  ];
  const customtext2 = (
    <Box>
      {(isAdmin ||
        productColumns.some((col) => {
          if (col.name === 'SalesPrice') {
            return col.isEdit;
          }
        })) &&
        selectedItems.length > 0 && (
          <Button onClick={handleOpenDialog.bind(null, 'Sales')}>
            Live sales
          </Button>
        )}
    </Box>
  );

  const customtext3 = (
    <Box>
      {(isAdmin || productColumns.some((col) => col.name === 'SellerPrice')) &&
        selectedItems.length > 0 && (
          <Button onClick={handleOpenDialog.bind(null, 'Seller')}>
            Live seller
          </Button>
        )}
    </Box>
  );

  const getModifiedColumns = (isAdmin, productColumns, columns) => {
    if (isAdmin) {
      return columns;
    } else if (productColumns.length === 0) {
      return columns.slice(0, 5);
    } else {
      const retainedColumns = columns.filter((column) =>
        productColumns.find(
          (productColumn) => productColumn.name === column.field
        )
      );

      const isEditRetainedColumns = retainedColumns.map((item) => {
        const product = productColumns.find(
          (productColumn) => productColumn.name === item.field
        );
        if (item.field === 'SalesPrice') {
          return item;
        }
        if (item.field === 'SellerPrice') {
          return item;
        }
        if (item.field === 'LandingCostWithGst') {
          return item;
        }

        return { ...item, editable: product?.isEdit === true ? true : false };
      });

      return columns.slice(0, 5).concat(isEditRetainedColumns);
    }
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
    setTriggerDefault(!triggerDefault);
  };

  return (
    <Box
      sx={{
        // height: "100%",
        width: '100%',
      }}
    >
      <UpdateStockDialog
        SKU={SKU}
        open={open}
        setOpen={setOpen}
        updateProductsApi={updateProductsApi}
        RefetchAll={refetch}
        loading={updateProductLoading}
        socket={socket}
        userInfo={userInfo}
      />
      <BulkUpdateSelectorDialog
        list={isAdmin ? productColumnData : productColumns}
        open={openBulkUpdateSelector}
        setOpen={setOpenBulkUpdateSelector}
      />

      <FilterBar
        customButton={'Bulk Update'}
        customOnClick={customOnClick}
        apiRef={apiRef}
        // hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
        CustomText3={customtext2}
        CustomText4={customtext3}
        CustomText5={
          <HideColumnsDialog
            columns={getModifiedColumns(isAdmin, productColumns, columns)}
          />
        }
      />

      {openCalc && (
        <UpdateLiveCalcDialog
          data={selectedItemsData}
          apiRef={apiRef}
          removeSelectedItems={removeSelectedItems}
          open={openCalc}
          setOpen={setOpenCalc}
          userInfo={userInfo}
          refetch={refetch}
          type={buttonType}
        />
      )}

      <Grid container>
        <Loading
          loading={productLoading || updateProductLoading || isFetching}
        />

        <Grid item xs={12} sx={{ mt: '5px' }}>
          {editedRows.length > 0 ? (
            <Box>
              <Button
                disabled={updateProductLoading}
                onClick={() => {
                  handleSellerPrice();
                }}
              >
                Save
              </Button>{' '}
              <Button onClick={handleClear}>Clear</Button>
            </Box>
          ) : (
            ''
          )}

          <Box
            sx={{
              width: '100%',
              height: '83vh',
              '& .super-app-theme--header': {
                background: '#eee',
                color: 'black',
                textAlign: 'center',
              },
              '& .vertical-lines .MuiDataGrid-cell': {
                borderRight: '1px solid #e0e0e0',
              },

              // "& .MuiDataGrid-columnHeaderTitleContainer": {
              //   background: "#eee",
              // },

              '& .orange': {
                backgroundColor: '#FF7F50',
                color: '#F0FFFF',
              },
              '& .red': {
                backgroundColor: '#B22222',
                color: '#F0FFFF',
              },
              ' .super-app-theme--header--Sales': {
                backgroundColor: '#93C54B',
                // color: "#F0FFFF",
              },
              ' .super-app-theme--header--Seller': {
                backgroundColor: '#606CF2',
                // color: "#F0FFFF",
              },
            }}
          >
            <DataGrid
              columns={getModifiedColumns(isAdmin, productColumns, columns)}
              rows={rows}
              rowHeight={40}
              autoHeight={autoHeight}
              apiRef={apiRef}
              editMode="cell"
              processRowUpdate={handleRowUpdate}
              isCellEditable={(params) => {
                if (params.field === 'Quantity') {
                  return params.row.isVerifiedQuantity;
                } else if (params.field === 'SellerPrice') {
                  return params.row.isVerifiedSellerPrice;
                } else if (params.field === 'SalesPrice') {
                  return params.row.isVerifiedSalesPrice;
                } else if (params.field === 'LandingCost') {
                  return params.row.isVerifiedLandingCost;
                } else if (params.field === 'MRP') {
                  return params.row.isVerifiedMRP;
                } else if (params.field === 'GST') {
                  return true;
                } else if (params.field === 'ThresholdQty') {
                  return true;
                }
              }}
              getCellClassName={(params) => {
                if (params.field === 'Quantity') {
                  return params.row.isRejectedQuantity
                    ? 'red'
                    : !params.row.isVerifiedQuantity
                    ? 'orange'
                    : '';
                } else if (params.field === 'SellerPrice') {
                  return params.row.isRejectedSellerPrice
                    ? 'red'
                    : !params.row.isVerifiedSellerPrice
                    ? 'orange'
                    : '';
                } else if (params.field === 'SalesPrice') {
                  return params.row.isRejectedSalesPrice
                    ? 'red'
                    : !params.row.isVerifiedSalesPrice
                    ? 'orange'
                    : '';
                } else if (params.field === 'LandingCost') {
                  return params.row.isRejectedLandingCost
                    ? 'red'
                    : !params.row.isVerifiedLandingCost
                    ? 'orange'
                    : '';
                } else if (params.field === 'MRP') {
                  return params.row.isRejectedMRP
                    ? 'red'
                    : !params.row.isVerifiedMRP
                    ? 'orange'
                    : '';
                }

                return '';
              }}
              components={{
                Footer: CustomFooter,
              }}
              slotProps={{
                footer: { status: refetch },
              }}
              onProcessRowUpdateError={(error) => {}}
              columnVisibilityModel={hiddenColumns}
              // onColumnVisibilityModelChange={(newModel) =>
              //   setHiddenColumns(newModel)
              // }
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={selectedItems}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Content;
