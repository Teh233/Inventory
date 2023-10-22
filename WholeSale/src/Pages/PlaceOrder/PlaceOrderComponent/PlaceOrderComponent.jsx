import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  styled,
  Avatar,
  Paper,
  Grid,
  Tooltip,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CartGrid from '../../../components/Common/CardGrid';
import Swal from 'sweetalert2';
import { useGetAddressQuery } from '../../../features/api/SellerDetailsAndAddressSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setAllCart } from '../../../features/slice/productSlice';
import { toast } from 'react-toastify';
import {
  useDeleteCartItemMutation,
  useGetCartQuery,
} from '../../../features/api/cartApiSlice';
import { useCreateOrderMutation } from '../../../features/api/orderApiSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { setAllAddress } from '../../../features/slice/sellerDtatailsAndAddrssSlice';
import Loading from '../../../components/Common/Loading';
import PlaceOrderMobile from './PlaceOrderMobile';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  display: 'flex',
  justifyContent: 'right',
}));

const Item_2 = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'end',
}));

const PlaceOrderComponent = ({ theme }) => {
  // set component according to screen
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
  const rowHeight = 60;
  const Height = 'auto';

  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /// global state
  const { cart } = useSelector((state) => state.product);
  const sellerId = useSelector((state) => state.auth.userInfo?.sellerId);
  /// rtk query
  const { refetch, data: allCartData } = useGetCartQuery(sellerId);
  const { data: allAdressData } = useGetAddressQuery(sellerId);
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  /// local state
  const [billAddress, setBillAddress] = useState({
    name: '',
    country: '',
    pincode: '',
    state: '',
    city: '',
    mobileNo: '',
    addressLine1: '',
    addressLine2: '',
  });
  const [shipAddress, setShipAddress] = useState({
    name: '',
    country: '',
    pincode: '',
    state: '',
    city: '',
    mobileNo: '',
    addressLine1: '',
    addressLine2: '',
  });

  /// useEffect
  useEffect(() => {
    if (allCartData) {
      dispatch(setAllCart(allCartData.data));
    }
  }, [allCartData]);

  // get all address
  useEffect(() => {
    if (
      allAdressData &&
      allAdressData.Address &&
      allAdressData.Address.length > 0
    ) {
      allAdressData.Address.forEach((item) => {
        if (item._id === allAdressData.defaultBilling) {
          setBillAddress(item);
        }
        if (item._id === allAdressData.defaultShipping) {
          setShipAddress(item);
        }
      });
    }
  }, [allAdressData]);

  /// handlers
  const hanldeDelete = async (SKU) => {
    try {
      const data = {
        id: sellerId,
        query: SKU,
      };
      const res = await deleteCartItem(data).unwrap();
      refetch();

      console.log(res);
    } catch (err) {
      console.error('An error occurred during PlaceOrder:', err);
    }
  };

  const handleSubmitOrder = async (SKU) => {
    try {
      const data = {
        sellerId: sellerId,
        subTotalSellerAmount: cart.subTotalSellerAmount,
        subTotalSalesAmount: cart.subTotalSalesAmount,
        orderItems: cart.cartData,
        shipAddress: shipAddress,
        billAddress: billAddress,
      };

      const res = await createOrder(data).unwrap();
      if (res?.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Order Successfully Placed',
          text: res.message,
          showConfirmButton: false,
          timer: 2000,
        });
        refetch();
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      }
      console.log(res);
    } catch (err) {
      console.log(err);
      if (err?.data?.message && Array.isArray(err.data.message)) {
        err.data.message.forEach((item) => {
          toast.error(item);
        });
      } else {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  /// columns
  const columns = [
    {
      field: 'product',
      headerName: 'Product',
      flex: 0.3,
      width: 400,
      align: 'center',
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
      field: 'salesPrice',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'Unit Price',
      align: 'center',
      headerAlign: 'center',
      flex: 0.06,
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
      flex: 0.2,
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
      field: 'sellerPriceTotal',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'Sub Total',
      align: 'center',
      headerAlign: 'center',
      flex: 0.1,
      minWidth: 50,
      valueFormatter: (params) => `₹ ${Number(params.value).toFixed(0)}`,
    },
    {
      field: 'delete',
      headerName: 'Command',
      sortable: false,
      minWidth: 130,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => (
        <Button
          onClick={() => {
            hanldeDelete(params.row.SKU);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  // calculate total quantity
  const totalQuantity = cart?.cartData?.reduce(
    (total, item) => total + item.quantity,
    0
  );
  console.log(totalQuantity);

  return (
    <>
      {isMobileView ? (
        <PlaceOrderMobile
          allCartData={cart}
          shipAddress={shipAddress}
          billAddress={billAddress}
          handleSubmitOrder={handleSubmitOrder}
          isLoading={isLoading}
        />
      ) : (
        <Box sx={{ flexGrow: 1 }}>
     
          {isLoading && <Loading /> }
    
            <>
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
                                {shipAddress.name}
                              </Typography>
                              <Typography variant='body2'>
                                Mobile: {shipAddress.mobileNo}
                              </Typography>

                              <Typography variant='body2'>
                                {shipAddress.city}, {shipAddress.state}
                              </Typography>
                              <Typography variant='body2'>
                                Address: {shipAddress.addressLine1}
                              </Typography>
                              <Typography variant='body2'>
                                {shipAddress.pincode}
                              </Typography>
                              <Button
                                onClick={() => {
                                  navigate('/address');
                                }}
                              >
                                Manage address
                              </Button>
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
                                {billAddress.name}
                              </Typography>
                              <Typography variant='body2'>
                                Mobile: {billAddress.mobileNo}
                              </Typography>

                              <Typography variant='body2'>
                                {billAddress.city}, {billAddress.state}
                              </Typography>
                              <Typography variant='body2'>
                                Address: {billAddress.addressLine1}
                              </Typography>
                              <Typography variant='body2'>
                                {billAddress.pincode}
                              </Typography>
                              <Button
                                onClick={() => {
                                  navigate('/address');
                                }}
                              >
                                Manage address
                              </Button>
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
                    rows={cart?.cartData ? cart.cartData : []}
                    rowHeight={rowHeight}
                    Height={Height}
                  />
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item_2 direction='column'>
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='space-around'
                    sx={{ width: '100%', height: '100px' }}
                  >
                    <Stack
                      sx={{ width: '85%' }}
                      direction='row'
                      justifyContent='space-around'
                    >
                      <Typography>
                        <Typography variant='subtitle2'>
                          Total Quantity :{' '}
                          {/* {cart?.subTotalSalesAmount
                            ? cart.subTotalSalesAmount
                            : 0} */}
                          {totalQuantity}
                        </Typography>
                      </Typography>
                      <Typography>
                        <Typography variant='subtitle2' sx={{ color: 'green' }}>
                          Total Discount : ₹{' '}
                          {cart?.subTotalSalesAmount -
                          cart?.subTotalSellerAmount
                            ? +(cart?.subTotalSalesAmount -
                              cart?.subTotalSellerAmount).toFixed(0)
                            : 0}
                        </Typography>
                      </Typography>
                      <Typography>
                        <Typography variant='subtitle2'>
                          {/* Total Amount : ₹ {cart?.subTotalSellerAmount} */}
                          Total Amount : ₹{' '}
                          {cart?.subTotalSalesAmount
                            ? +(cart.subTotalSalesAmount).toFixed(0)
                            : 0}
                        </Typography>
                      </Typography>
                    </Stack>

                    <Box ml='auto' mr='auto'>
                      <Stack
                        display='flex'
                        flexDirection='row'
                        gap='80px'
                        pb={1}
                      >
                        <Button
                          variant='contained'
                          onClick={handleSubmitOrder}
                          color='secondary'
                        >
                          Confirm order{' '}
                        </Button>
                        <Link to='/cart'>
                          <Button variant='contained' color='error'>
                            back to cart
                          </Button>
                        </Link>
                      </Stack>
                    </Box>
                  </Box>
                </Item_2>
              </Grid>
            </>
         
        </Box>
      )}
    </>
  );
};

export default PlaceOrderComponent;
