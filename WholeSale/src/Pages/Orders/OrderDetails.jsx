import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  styled,
  Paper,
  Grid,
  Tooltip,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CartGrid from '../../components/Common/CardGrid';
import Navbar from '../../components/Common/Navbar';
import Side_navbar from '../../components/Common/Side_navbar';
import { useSelector, useDispatch } from 'react-redux';
import { setAllCart, setOneOrder } from '../../features/slice/productSlice';
import { useGetOrdersByIdQuery } from '../../features/api/orderApiSlice';
import { useGetCartQuery } from '../../features/api/cartApiSlice';

import { useNavigate, useParams } from 'react-router-dom';
import ToggleNav from '../../components/Common/Togglenav';
import Loading from '../../components/Common/Loading';
import OrderDetailsMobile from './OrderDetailsMobile';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  display: 'flex',
  justifyContent: 'right',
}));
const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const Item_2 = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'end',
}));
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'grey' : '#eee',
  height: '100vh',
}));
const OrderDetails = ({ theme }) => {
  // show responsive component according to screen size
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1053);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1053);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleShowNav = useSelector((state) => state.ui.ShowSide_nav);

  const rowHeight = 50;
  const Height = 'auto';

  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  /// global state
  const sellerId = useSelector((state) => state.auth.userInfo?.sellerId);
  const { cart, oneOrder } = useSelector((state) => state.product);


  /// rtk query
  const { refetch, data: allCartData } = useGetCartQuery(sellerId);
  const { refetch: refetchOneOrder, data: oneOrderData } =
    useGetOrdersByIdQuery(id);

  /// useEffect
  useEffect(() => {
    if (allCartData) {
      dispatch(setAllCart(allCartData.data));
    }
  }, [allCartData]);

  useEffect(() => {
    if (oneOrderData) {
 
      const data = oneOrderData.data.orderItems.map((item, index) => {
        return {
          ...item,
          id: index,
          subTotal: item.sellerPrice * item.quantity,
        };
      });
      dispatch(setOneOrder({ ...oneOrderData.data, orderItems: data }));
    }
  }, [oneOrderData]);
  /// handlers

  /// columns
  const columns = [
    {
      field: 'product',
      headerName: 'Product',
      flex: 0.6,
      width: 300,
      // align: "center",
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: '20px' }}>
          <Box>
            <Tooltip title='IRS drone sec' placement='top'>
              <Typography
                variant='subtitle2'
                display='block'
                gutterBottom
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'wrap',
                  maxWidth: '100%',
                }}
              >
                {params.row.name}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      ),
    },
    {
      field: 'SKU',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'SKU',
      align: 'center',
      headerAlign: 'center',
      flex: 0.2,
      minWidth: 100,
    },
    {
      field: 'salesPrice',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'Unit Price',
      align: 'center',
      headerAlign: 'center',
      flex: 0.2,
      minWidth: 50,
      valueFormatter: (params) => `₹ ${Number(params.value).toFixed(0)}`,
    },

    {
      field: 'sellerPrice',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'Discounted Unit Price',
      align: 'center',
      headerAlign: 'center',
      flex: 0.3,
      minWidth: 100,
      valueFormatter: (params) => `₹ ${Number(params.value).toFixed(0)}`,
    },

    {
      field: 'quantity',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'Quantity',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
    },
    {
      field: 'subTotal',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'Sub Total',
      align: 'center',
      headerAlign: 'center',
      flex: 0.2,
      minWidth: 100,
      valueFormatter: (params) => ` ${Number(params.value).toFixed(0)}`,
    },
  ];

  return (
    <div>
      <StyledBox sx={{ display: 'flex', gap: '10px' }}>
        <ToggleNav filter_show={false} />

        <Box
          component='main'
          sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
        >
          <DrawerHeader />

          {/* put the responsive functionality */}
          {isMobileView ? (
            <OrderDetailsMobile oneOrder={oneOrder} />
          ) : (
            <Box sx={{ flexGrow: 1, mt: '20px' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Item>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography variant='h5'>
                              Shipping Address
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Box>
                              <Typography variant='h6'>
                                {oneOrder?.shipAddress?.name}
                              </Typography>
                              <Typography variant='body2'>
                                Mobile: {oneOrder?.shipAddress?.mobileNo}
                              </Typography>
                              <Typography variant='body2'>
                                {oneOrder?.shipAddress?.city},{' '}
                                {oneOrder?.shipAddress?.state}
                              </Typography>
                              <Typography variant='body2'>
                                Address: {oneOrder?.shipAddress?.addressLine1}
                              </Typography>
                              <Typography variant='body2'>
                                {oneOrder?.shipAddress?.pincode}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Item>
                </Grid>
                <Grid item xs={6}>
                  <Item>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography variant='h5'>
                              Billing Address
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Box>
                              <Typography variant='h6'>
                                {oneOrder?.billAddress?.name}
                              </Typography>
                              <Typography variant='body2'>
                                Mobile: {oneOrder?.billAddress?.mobileNo}
                              </Typography>
                              <Typography variant='body2'>
                                {oneOrder?.billAddress?.city},{' '}
                                {oneOrder?.billAddress?.state}
                              </Typography>
                              <Typography variant='body2'>
                                Address: {oneOrder?.billAddress?.addressLine1}
                              </Typography>
                              <Typography variant='body2'>
                                Address: {oneOrder?.billAddress?.pincode}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Item>
                </Grid>
              </Grid>

              <Grid item xs={12} sx={{ mt: '5px' }}>
                <Item>
                  <CartGrid
                    columns={columns}
                    rows={oneOrder?.orderItems ? oneOrder.orderItems : []}
                    rowHeight={rowHeight}
                    Height={Height}
                  />
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item_2>
                  <Box
                    display='flex'
                    alignItems='center'
                    sx={{ width: '100%', height: '50px' }}
                  >
                    <Stack
                      sx={{ width: '85%' }}
                      direction='row'
                      justifyContent='space-around'
                    >
                      <Typography>
                        <Typography variant='subtitle2'>
                          Price : ₹{' '}
                          {oneOrder?.subTotalSalesAmount
                            ? Number(oneOrder.subTotalSalesAmount).toFixed(0)
                            : 0}
                        </Typography>
                      </Typography>
                      <Typography>
                        <Typography variant='subtitle2' sx={{ color: 'green' }}>
                          Total Discount : ₹{' '}
                          {oneOrder?.subTotalSalesAmount -
                          oneOrder?.subTotalSellerAmount
                            ? Number(oneOrder?.subTotalSalesAmount -
                              oneOrder?.subTotalSellerAmount).toFixed(0)
                            : 0}
                        </Typography>
                      </Typography>
                      <Typography>
                        <Typography variant='h6'>
                          Total Amount : ₹ {Number(oneOrder?.subTotalSellerAmount).toFixed(0)}
                        </Typography>
                      </Typography>
                    </Stack>
                  </Box>
                </Item_2>
              </Grid>
            </Box>
          )}
        </Box>
      </StyledBox>
    </div>
  );
};

export default OrderDetails;
