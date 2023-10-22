import { React, useEffect, useState } from 'react';
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
  GridPagination,
} from '@mui/x-data-grid';
import FilterBar from '../../../components/Common/FilterBar';
import { Grid, Box, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllProductQuery } from '../../../features/api/productApiSlice';
import Loading from '../../../components/Common/Loading';
import { useNavigate } from 'react-router-dom';
import { setAllProducts } from '../../../features/slice/productSlice';
import Nodata from '../../../assets/error.gif';
import CachedIcon from '@mui/icons-material/Cached';

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

const Content = ({ autoHeight, text }) => {
  /// initialization
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const dispatch = useDispatch();

  /// global state
  const { isAdmin, productColumns } = useSelector((state) => state.auth);

  /// local state
  const [rows, setRows] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [showNoData, setShowNoData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowNoData(true);
    }, 10000);
  }, []);
  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
  } = useGetAllProductQuery('null', {
    pollingInterval: 1000 * 300,
  });

  /// handlers

  /// useEffect
  useEffect(() => {
    if (allProductData?.status === 'success') {
      const data = allProductData?.data.map((item, index) => {
        return {
          id: index,
          Sno: index + 1,
          SKU: item.SKU,
          Name: item.Name,
          LandingCost: item.LandingCost.toFixed(2),
          SalesPrice: item.SalesPrice.toFixed(2),
          MRP: item.MRP.toFixed(2),
          GST: item.GST.toFixed(2),
          SellerPrice: item.SellerPrice.toFixed(2),
          Brand: item.Brand,
          Quantity: item.ActualQuantity,
          Category: item.Category,
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
        };
      });
      dispatch(setAllProducts({ ...allProductData }));
      setRows(data);
    }
  }, [allProductData]);

  //Columns*******************
  const columns = [
    {
      field: 'Sno',
      headerName: 'Sno',
      flex: 0.3,
      minWidth: 70,
      maxWidth: 70,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
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
          >
            {params.row.Sno}
          </div>
        );
      },
    },
    {
      field: 'SKU',
      headerName: 'SKU',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
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
      headerName: 'Product',
      flex: 0.3,
      minWidth: 200,

      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Brand',
      headerName: 'Brand',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 120,
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
      field: 'Quantity',
      headerName: 'QTY',
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'GST',
      headerName: 'GST',
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: 'LandingCost',
      headerName: 'Cost ₹',
      flex: 0.3,
      minWidth: 70,
      maxWidth: 120,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: 'MRP',
      headerName: 'MRP ₹',
      flex: 0.3,
      minWidth: 70,
      maxWidth: 120,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },

    {
      field: 'SalesPrice',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'SalesPrice ₹',
      align: 'center',
      headerAlign: 'center',
      minWidth: 80,
      maxWidth: 120,
      valueFormatter: (params) => `₹ ${params.value}`,
    },

    {
      field: 'SellerPrice',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'WholeSale ₹',
      align: 'center',
      headerAlign: 'center',
      flex: 0.2,
      minWidth: 80,
      maxWidth: 120,
      type: 'number',
      valueFormatter: (params) => `₹ ${params.value}`,
      // maxWidth: 130,
    },
  ];

  const getModifiedColumns = (isAdmin, productColumns, columns) => {
    if (isAdmin) {
      return columns;
    } else if (productColumns?.length === 0) {
      return columns.slice(0, 5);
    } else {
      const retainedColumns = columns.filter((column) =>
        productColumns?.find(
          (productColumn) => productColumn.name === column.field
        )
      );
      return columns.slice(0, 5).concat(retainedColumns);
    }
  };

  return (
    <Box sx={{ height: '100%', wdth: '100%', overflow: 'hidden' }}>
      <FilterBar
        apiRef={apiRef}
        hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
      />

      <Grid container>
        <Loading loading={productLoading} />

        <Grid item xs={12} sx={{ mt: '5px' }}>
          <Box
            sx={{
              width: '100%',
              height: '82vh',
              '& .super-app-theme--header': {
                background: '#eee',
                color: 'black',
                textAlign: 'center',
              },
              '& .vertical-lines .MuiDataGrid-cell': {
                borderRight: '1px solid #e0e0e0',
              },
              '& .supercursor-app-theme--cell:hover': {
                background:
                  'linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)',
                color: 'white',
                cursor: 'pointer',
              },
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                background: '#eee',
              },
              position: 'relative',
            }}
          >
            <DataGrid
              columns={getModifiedColumns(isAdmin, productColumns, columns)}
              rows={rows}
              rowHeight={40}
              autoHeight={autoHeight}
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

                // Return an empty string if the field doesn't match any condition
                return '';
              }}
              apiRef={apiRef}
              columnVisibilityModel={hiddenColumns}
              onColumnVisibilityModelChange={(newModel) =>
                setHiddenColumns(newModel)
              }
              components={{
                Footer: CustomFooter,
                NoRowsOverlay: () => (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {showNoData && (
                      <Box
                        sx={{
                          // border: '2px solid blue',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          width: '200px',
                          height: '200px',
                        }}
                      >
                        <img
                          src={Nodata}
                          alt=""
                          style={{ width: '100px', height: '100px' }}
                        />

                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                        >
                          No data found !
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ),
              }}
              slotProps={{
                footer: { status: refetch },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Content;
