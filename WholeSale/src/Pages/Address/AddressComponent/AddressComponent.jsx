import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  styled,
  Tooltip,
  Container,
  Collapse,
} from '@mui/material';
import CartGrid from '../../../components/Common/CardGrid';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useGetAddressQuery,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from '../../../features/api/SellerDetailsAndAddressSlice';
import AddAddressDialog from '../../../components/Common/DialogBox';
import { setAllAddress } from '../../../features/slice/sellerDtatailsAndAddrssSlice';
import Loading from '../../../components/Common/Loading';
import AddressDetailsMobile from '../../MyAccount/MyAccountComponent/Form/AddressDetailsMobile';
// import OrderDetailsMobile from '../../Orders/OrderDetailsMobile';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'grey' : '#fff',

  height: 'auto',
  width: '100%',
  marginTop: '20px',
}));

const AddressComponent = () => {
  // set component according to window size
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
  // responsive process over here

  /// initialize
  const dispatch = useDispatch();

  /// global state
  const sellerId = useSelector((state) => state.auth?.userInfo?.sellerId);
  const { defaultShipping, defaultBilling, address } = useSelector(
    (state) => state.sellerDetailsAndAddress
  );

  /// rtk query
  const { data, isLoading, isError, refetch } = useGetAddressQuery(sellerId);
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  /// local state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  /// useEffect

  // get all address
  useEffect(() => {
    if (data && data.Address && data.Address.length > 0) {
      dispatch(setAllAddress(data));
    }
  }, [data]);

  // handling save address
  const handleAddButtonClick = () => {
    setIsDialogOpen(true);
    setSelectedAddressId(null);
  };
  // for dialog box close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  // editing address
  const handleEditButtonClick = (addressId) => {
    setSelectedAddressId(addressId);
    setIsDialogOpen(true);
  };
  // deleting address
  const handleDeleteButtonClick = async (addressId) => {
    console.log(sellerId, addressId);
    try {
      const res = await deleteAddress({ addressId, sellerId });
      toast.success('Address deleted successfully');
      refetch();
    } catch (error) {
      console.error('An error occurred during AddressComponent:', error);
    }
  };

  // set Default address
  const handleSetDefaultButtonClick = async (addressId, type) => {
    try {
      const res = await setDefaultAddress({
        data: { type, id: addressId },
        sellerId,
      });
      toast.success(`Address successfully set as Default ${type}`);
      refetch();
    } catch (error) {
      console.error('An error occurred during AddressComponent:', error);
    }
  };

  const rowHeight = 250;
  const cellClassName = 'vertical-lines';

  /// columns
  const columns = [
    {
      field: 'Name',
      headerName: 'Name',
      flex: 0.2,
      width: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: '20px' }}>
          <Box>
            <Tooltip title={params.row.name} placement='top'>
              <Typography
                variant='subtitle2'
                display='block'
                gutterBottom
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                }}
              >
                {params.row.name}
              </Typography>
            </Tooltip>
            <Typography variant='body2' sx={{ color: 'grey' }}>
              {params.row.mobileNo}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'Address',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerName: 'Address',
      align: 'center',
      headerAlign: 'center',
      flex: 0.3,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <>
            <div
              style={{
                whiteSpace: 'wrap',
                maxWidth: '100%',
                overflowY: 'auto',
                maxHeight: '100%',
              }}
            >
              <div>City: {params.row.city}</div>
              <div>State: {params.row.state}</div>
              <div>Country:{params.row.country}</div>
              <div>Pincode: {params.row.pincode}</div>
              <div
                style={{
                  whiteSpace: 'wrap',
                  maxWidth: '100%',
                }}
              >
                <div>Address Line 1: {params.row.addressLine1}</div>
                <div>Address Line 2: {params.row.addressLine2}</div>
              </div>
            </div>
          </>
        );
      },
    },

    {
      field: 'Action',
      headerName: 'Action',
      sortable: false,
      minWidth: 130,
      flex: 0.2,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => (
        <Box display='flex' flexDirection='column'>
          <Button
            disabled={params.row.addressId === defaultBilling}
            onClick={() =>
              handleSetDefaultButtonClick(params.row.addressId, 'billing')
            }
          >
            Set as Default Billing
          </Button>
          <Button
            disabled={params.row.addressId === defaultShipping}
            onClick={() =>
              handleSetDefaultButtonClick(params.row.addressId, 'shipment')
            }
          >
            Set as Default Shipping
          </Button>
          <Button onClick={() => handleEditButtonClick(params.row.addressId)}>
            Edit
          </Button>
          <Button onClick={() => handleDeleteButtonClick(params.row.addressId)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // console.log(data);
  const rows = address.map((address, index) => ({
    id: index + 1,
    addressId: address._id,
    name: address.name,
    mobileNo: address.mobileNo,
    city: address.city,
    country: address.country,
    state: address.state,
    pincode: address.pincode,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
  }));
  return (
    <>
      {isMobileView ? (
        <>
          <AddressDetailsMobile
            getAddress={data}
            deleteAddress={deleteAddress}
            setDefaultAddress={setDefaultAddress}
            handleAddButtonClick={handleAddButtonClick}
            handleDeleteAddress={handleDeleteButtonClick}
            isDialogOpen={isDialogOpen}
            handleDialogClose={handleDialogClose}
            selectedAddressId={selectedAddressId}
            handleEditButtonClick={handleEditButtonClick}
            handleSetDefaultButtonClick={handleSetDefaultButtonClick}
          />
        </>
      ) : (
        <StyledBox>
          <Button onClick={handleAddButtonClick}>Add</Button>
          {isLoading && <Loading />}
          {isError && <div>Error occurred while fetching address data</div>}
          {!isLoading && !isError && address.length === 0 && (
            <div>No address data found</div>
          )}
          {!isLoading && !isError && address.length > 0 && (
            <CartGrid
              columns={columns}
              rows={rows}
              rowHeight={rowHeight}
              cellClassName={cellClassName}
              Height={'90vh'}
            />
          )}
          <AddAddressDialog
            open={isDialogOpen}
            onClose={handleDialogClose}
            addressId={selectedAddressId}
          />
        </StyledBox>
      )}
    </>
  );
};

export default AddressComponent;
