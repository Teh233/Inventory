import { Container, Typography, Box, Collapse } from '@mui/material';

import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const OrderDetailsMobile = (oneOrder) => {
 
  const [shippingTab, openShippingTab] = useState(false);
  const [billingTab, openBillingTab] = useState(false);
  // calculate total quantity
  const totalQuantity = oneOrder?.oneOrder?.orderItems?.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      {/* fixed bar */}

      <Container
        sx={{
          display: 'grid',
          gridTemplateColumns: '31% 31% 31%',
          // backgroundColor: '  #333333',
          background: 'linear-gradient(180deg, #fdc50f 26.71%, #fb982f 99.36%)',
          color: '#000',
          width: '95vw',
          borderRadius: '.5rem',
          position: 'fixed',
          bottom: '1rem',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '.5rem',
          gridGap: '.6rem',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography>Total Quantity</Typography>
          <hr />
          <Typography
            variant='paragraph'
            sx={{ fontSize: '1rem', fontWeight: '800' }}
          >
            {/* <span>&#8377;</span> */}
            {totalQuantity}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography>Total Discount</Typography>
          <hr />
          <Typography
            variant='paragraph'
            sx={{ fontSize: '1rem', fontWeight: '800' }}
          >
            <span>&#8377;</span>
            {+(oneOrder?.oneOrder?.subTotalSalesAmount -
              oneOrder?.oneOrder?.subTotalSellerAmount).toFixed(0)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography>Total Amount</Typography>
          <hr />
          <Typography
            variant='paragraph'
            sx={{ fontSize: '1rem', fontWeight: '800' }}
          >
            <span>&#8377;</span> {(+oneOrder?.oneOrder?.subTotalSellerAmount).toFixed(0)}
          </Typography>
        </Box>
      </Container>

      <Container
        sx={{ display: 'flex', flexDirection: 'column', gap: '.5rem',  }}
      >
        {/* shipping address */}
        <Box
          onClick={() => openShippingTab(!shippingTab)}
          sx={{ backgroundColor: ' #f2f2f2', cursor: 'pointer' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant='h3'
              sx={{ fontSize: '1.4rem', padding: '1.2rem' }}
            >
              Shipping Address
            </Typography>
            <KeyboardArrowDownIcon
              sx={{
                transform: shippingTab ? 'rotate(-180deg)' : 'rotate(0deg)',
                transformOrigin: 'center, center',
                transition: '.5s',
              }}
            />
          </Box>

          <hr style={{ backgroundColor: '#fff' }} />
          <div>
            <Collapse in={shippingTab}>
              <Box
                sx={{
                  padding: '1.2rem',
                }}
              >
                <Typography
                  variant='h5'
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                >
                  {oneOrder?.oneOrder?.shipAddress?.name}
                </Typography>

                {/* details */}

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '.4rem',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', marginTop: '1rem', gap: '.3rem' }}
                  >
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem', fontWeight: '500' }}
                    >
                      Mobile:
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem' }}
                    >
                      {oneOrder?.oneOrder?.shipAddress?.mobileNo}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '.3rem' }}>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem', fontWeight: '500' }}
                    >
                      City:
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem' }}
                    >
                      {oneOrder?.oneOrder?.shipAddress?.city}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '.3rem' }}>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem', fontWeight: '500' }}
                    >
                      Address:
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem',overflow:"hidden" }}
                    >
                      {oneOrder?.oneOrder?.shipAddress?.addressLine1} ({' '}
                      {oneOrder?.oneOrder?.shipAddress?.state})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '.3rem' }}>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem', fontWeight: '500' }}
                    >
                      Pincode:
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem' }}
                    >
                      {oneOrder?.oneOrder?.shipAddress?.pincode}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Collapse>
          </div>
        </Box>

        {/* Billing Address */}
        <Box
          onClick={() => openBillingTab(!billingTab)}
          sx={{ backgroundColor: ' #f2f2f2', cursor: 'pointer' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant='h3'
              sx={{ fontSize: '1.4rem', padding: '1.2rem' }}
            >
              Billing Address
            </Typography>
            <KeyboardArrowDownIcon
              sx={{
                transform: billingTab ? 'rotate(-180deg)' : 'rotate(0deg)',
                /* Optional: Center the rotated icon */
                transformOrigin: 'center center',
                transition: '.5s',
              }}
            />
          </Box>
          <hr style={{ backgroundColor: '#fff' }} />
          <div>
            <Collapse in={billingTab}>
              <Box sx={{ padding: '1.2rem' }}>
                <Typography
                  variant='h5'
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                >
                  {oneOrder?.oneOrder?.billAddress?.name}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '.4rem',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', marginTop: '1rem', gap: '.3rem' }}
                  >
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem', fontWeight: '500' }}
                    >
                      Mobile:
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem' }}
                    >
                      {oneOrder?.oneOrder?.billAddress?.mobileNo}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '.3rem' }}>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem', fontWeight: '500' }}
                    >
                      City:
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem' }}
                    >
                      {oneOrder?.oneOrder?.billAddress?.city}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '.3rem' }}>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem', fontWeight: '500' }}
                    >
                      Address:
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem',  overflow:"hidden" }}
                    >
                      {oneOrder?.oneOrder?.billAddress?.addressLine1} (
                      {oneOrder?.oneOrder?.billAddress?.state})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '.3rem' }}>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem', fontWeight: '500' }}
                    >
                      Pincode:
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.777rem' }}
                    >
                      {oneOrder?.oneOrder?.billAddress?.pincode}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Collapse>
          </div>
        </Box>
      </Container>

      {/* second container */}
      <Container sx={{ marginTop: '4rem', marginBottom:"5.5rem",  }}>
        {oneOrder?.oneOrder?.orderItems?.map((items, index) => {
          const {
            name,
            SKU,
            sellerPrice,
            salesPrice,
            GST,
            quantity,
            subTotal,
          } = items;
          return (
            <Box sx={{ marginTop: '1rem' }}>
              <Typography
                variant='paragraph'
                sx={{
                  color: 'rgba(0,0,0,0.5)',
                  backgroundColor: ' #262626',
                  padding: '6px 10px 2px',
                  fontWeight: 'bold',
                  borderRadius: '7px 7px 0 0',
                  color:"#fff"
                }}
              >
                {index + 1}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '.4rem',
                  backgroundColor: ' #262626',
                  padding: '.5rem',
                  color:"#fff"
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexBasis: '15%',
                  }}
                >
                  <Typography
                    variant='h4'
                    sx={{ fontWeight: 'bold', fontSize: '.944rem' }}
                  >
                    Product
                  </Typography>
                  <Typography
                    variant='paragraph'
                    sx={{
                      fontSize: '.855rem',
                      flexBasis: '80%',
                      textAlign: 'right',
                    }}
                  >
                    {name}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant='h4'
                    sx={{ fontWeight: 'bold', fontSize: '.944rem' }}
                  >
                    SKU
                  </Typography>
                  <Typography variant='paragraph' sx={{ fontSize: '.855rem' }}>
                    {SKU}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant='h4'
                    sx={{ fontWeight: 'bold', fontSize: '.944rem' }}
                  >
                    Unit Price
                  </Typography>
                  {/* discount price */}
                  <Box>
                    <Typography
                      variant='paragraph'
                      sx={{
                        fontSize: '.855rem',
                        // color: 'rgba(0,0,0,0.5)',
                        color: 'red',
                        textDecoration: 'line-through',
                        marginRight: '5px',
                      }}
                    >
                      <span>&#8377;</span>
                      {(+salesPrice).toFixed(0)}
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.855rem', color: 'green' }}
                    >
                      <span>&#8377;</span>
                      {(+sellerPrice).toFixed(0)}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant='h4'
                    sx={{ fontWeight: 'bold', fontSize: '.944rem' }}
                  >
                    Quantity
                  </Typography>
                  <Typography variant='paragraph' sx={{ fontSize: '.855rem' }}>
                    {quantity}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant='h4'
                    sx={{ fontWeight: 'bold', fontSize: '.944rem' }}
                  >
                    Sub Total
                  </Typography>
                  <Typography variant='paragraph' sx={{ fontSize: '.855rem' }}>
                    &#8377; {+(subTotal).toFixed(0)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Container>
    </>
  );
};

export default OrderDetailsMobile;
