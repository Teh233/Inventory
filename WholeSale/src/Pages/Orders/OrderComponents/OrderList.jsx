import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Button, Box, styled } from '@mui/material';
import { useGetSellerOrdersQuery } from '../../../features/api/orderApiSlice';
import { setAllOrder } from '../../../features/slice/productSlice';
import CartGrid from '../../../components/Common/CardGrid';
import { useNavigate } from 'react-router-dom';
import OrderDetailsMobile from '../OrderDetailsMobile';
import OrderMobile from './OrderMobile';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  height: 'auto',
  width: '100%',
  marginTop: '20px',
}));
const OrderList = () => {
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
  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /// global state
  const { orders } = useSelector((state) => state.product);
  console.log(orders);
  const sellerId = useSelector((state) => state.auth?.userInfo?.sellerId);
  /// rtk query
  const { refetch, data: allOrderData } = useGetSellerOrdersQuery(sellerId);

  /// useEffect

  useEffect(() => {
    if (allOrderData?.status === 'success') {
      const data = allOrderData.data.map((item, index) => {
        return {
          ...item,
          id: index,
          Sno: index + 1,
          billAddress: item.billAddress.addressLine1,
          shipAddress: item.shipAddress.addressLine1,
        };
      });
      dispatch(setAllOrder(data));
    }
  }, [allOrderData]);

  useEffect(() => {
    refetch();
  }, []);
  /// columns
  const columns = [
    {
      field: 'Sno',
      headerName: 'Sno',
      minWidth: 20,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'orderId',
      headerName: 'Order Id',
      minWidth: 50,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },

    {
      field: 'subTotalSellerAmount',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'Price',
      align: 'center',
      headerAlign: 'center',
      flex: 0.1,
      minWidth: 50,
      valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: 'createdAt',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'Date',
      align: 'center',
      headerAlign: 'center',
      minWidth: 120,
      valueFormatter: (params) => {
        const indianDate = new Date(params.value).toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata',
        });
        return indianDate;
      },
    },
    {
      field: 'status',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'Status',
      align: 'center',
      headerAlign: 'center',
      minWidth: 100,
    },
    {
      field: 'billAddress',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'Billing Address',
      align: 'center',
      flex: 0.3,
      headerAlign: 'center',
      minWidth: 240,
    },
    {
      field: 'shipAddress',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'Shipping Address',
      align: 'center',
      headerAlign: 'center',
      flex: 0.3,
      minWidth: 240,
    },

    {
      field: 'details',
      headerName: 'Details',
      sortable: false,
      minWidth: 130,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => (
        <Button
          onClick={() => {
            navigate(`/orderDetails/${params.row.orderId}`);
          }}
        >
          Details
        </Button>
      ),
    },
  ];
  return (
    <StyledBox>
      {isMobileView ? (
        <OrderMobile allOrderData={orders}/>
      ) : (
        <CartGrid
          columns={columns}
          rows={orders}
          rowHeight={40}
          Height={'85vh'}
        />
      )}
    </StyledBox>
  );
};

export default OrderList;
