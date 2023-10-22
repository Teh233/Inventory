import React from 'react';
import Button from '@mui/material/Button';
import { Box, Container, Typography } from '@mui/material';
import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the DeleteIcon
import AddAddressDialog from '../../../../components/Common/DialogBox';
import { useSelector } from 'react-redux';

const AddressDetailsMobile = ({
  getAddress,
  handleAddButtonClick,
  isDialogOpen,
  handleDialogClose,
  selectedAddressId,
  handleEditButtonClick,
  handleDeleteAddress,
  handleSetDefaultButtonClick,
}) => {
  const { defaultShipping, defaultBilling, address } = useSelector(
    (state) => state.sellerDetailsAndAddress
  );
  return (
    <>
      <Container>
        <Button
          onClick={handleAddButtonClick}
          variant='contained'
          sx={{
            backgroundColor: ' #f2f2f2',
            color: '#000',
            width: '100%',
            borderRadius: '0px',
            marginTop: '20px',
            marginX: 'auto',
            textAlign: 'left',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          Add
        </Button>

        <Box sx={{}}>
          {getAddress?.Address?.map((address) => (
            <div
              key={address._id}
              style={{
                marginTop: '1rem',
                backgroundColor: ' #ffff',
                padding: '.5rem',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <CancelIcon
                  onClick={() => handleDeleteAddress(address._id)}
                  style={{ cursor: 'pointer' }}
                />
              </Box>

              {/* Name */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ flexBasis: '30%' }}>
                  <Typography variant='subtitle2'>Name:</Typography>
                  <Typography variant='subtitle2'>Mobile No:</Typography>
                </Box>
                <Box sx={{ justifySelf: 'flex-start', flexBasis: '70%' }}>
                  <Box sx={{}}>
                    <Typography variant='paragraph' sx={{}}>
                      {address.name}
                    </Typography>
                    <Typography variant='body2'>{address.mobileNo}</Typography>
                  </Box>
                </Box>
              </div>

              {/* Address */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '2rem',
                }}
              >
                <Box sx={{ flexBasis: '25%' }}>
                  <Typography variant='subtitle2'>Address:</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexBasis: '80%',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{ fontSize: '.833rem', display: 'flex' }}
                    >
                      City <span>:</span>
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.877rem' }}
                    >
                      {address.city}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{
                        fontSize: '.833rem',
                        display: 'flex sx={{fontSize:"7788rem"}} ',
                      }}
                    >
                      State <span>:</span>
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.877rem' }}
                    >
                      {address.state}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{ fontSize: '.833rem', display: 'flex' }}
                    >
                      country <span>:</span>
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.877rem' }}
                    >
                      {address.country}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{ fontSize: '.833rem', display: 'flex' }}
                    >
                      pincode <span>:</span>
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.877rem' }}
                    >
                      {address.pincode}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
               
                     
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{ fontSize: '.833rem', display: 'flex' }}
                    >
                      Address Line 1<span>:</span>
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{
                        fontSize: '.877rem',
                        whiteSpace: "wrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        
                      }}
                    >
                      {address.addressLine1}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{ fontSize: '.833rem', display: 'flex' }}
                    >
                      Address Line 1<span>:</span>
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{
                        fontSize: '.877rem',
                        whiteSpace: "wrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        
                      }}
                    >
                      {address.addressLine2}
                    </Typography>
                  </Box>
                </Box>
              </div>

              {/* Actions buttons */}
              <Box
                sx={{
                  display: 'flex',

                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px',
                  marginTop: '2rem',
                }}
              >
                <Button
                  sx={{
                    textTransform: 'upperCase',
                    backgroundColor: 'gray',
                    color: '#fff',
                    fontSize: '.8rem',
                  }}
                  disabled={address._id === defaultBilling}
                  onClick={() =>
                    handleSetDefaultButtonClick(address._id, 'billing')
                  }
                >
                  Set as Billing
                </Button>
                <Button
                  sx={{
                    textTransform: 'upperCase',
                    backgroundColor: 'gray',
                    color: '#fff',
                    fontSize: '.8rem',
                  }}
                  disabled={address._id === defaultShipping}
                  onClick={() =>
                    handleSetDefaultButtonClick(address._id, 'shipment')
                  }
                >
                  Set as Shipping
                </Button>
                <Button
                  onClick={() => handleEditButtonClick(address._id)}
                  sx={{
                    textTransform: 'upperCase',
                    backgroundColor: 'gray',
                    color: '#fff',
                    fontSize: '.8rem',
                  }}
                >
                  Edit
                </Button>
              </Box>
            </div>
          ))}
        </Box>
      </Container>
      <AddAddressDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        addressId={selectedAddressId}
      />
    </>
  );
};

export default AddressDetailsMobile;
