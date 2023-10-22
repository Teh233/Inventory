import { Container, Typography, Box, Collapse, Button } from '@mui/material';

import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';
import Loading from '../../../components/Common/Loading'

const PlaceOrderMobile = ({
  allCartData,
  shipAddress,
  billAddress,
  handleSubmitOrder,
  isLoading
}) => {
  // Calculate the total qunatity of products
  const totalQuantity = allCartData?.cartData?.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const [shippingTab, openShippingTab] = useState(false);
  const [billingTab, openBillingTab] = useState(false);
  return (
    <>
      {/* fixed bar */}

      <Container
        sx={{
          // backgroundColor: '  #333333',
          position: 'relative',
          width: '95vw',
          display: 'flex',
          flexDirection: 'column',
          gap: '.3rem',
          position: 'fixed',
          bottom: '1rem',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0',
        }}
      >
         
    
        <Box
          sx={{
            background:
              'linear-gradient(180deg, #fdc50f 26.71%, #fb982f 99.36%)',
            color: '#000',
            display: 'grid',
            gridTemplateColumns: '31% 31% 31%',
            gridGap: '.8rem',
            borderRadius: '.3rem',
            paddingX: '.3rem',
          }}
        >
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='paragraph'>Total Qunatity</Typography>
            <hr />
            <Typography
              variant='paragraph'
              sx={{ fontSize: '1rem', fontWeight: '800' }}
            >
              {/* <span>&#8377;</span> */}
              {/* {allCartData?.subTotalSalesAmount
                ? allCartData.subTotalSalesAmount
                : 0} */}
              {totalQuantity}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='paragraph'>Total Discount</Typography>
            <hr />
            <Typography
              variant='paragraph'
              sx={{ fontSize: '1rem', fontWeight: '800' }}
            >
              <span>&#8377;</span>{' '}
              {allCartData?.subTotalSalesAmount -
              allCartData?.subTotalSellerAmount
                ? +(
                    allCartData?.subTotalSalesAmount -
                    allCartData?.subTotalSellerAmount
                  ).toFixed(0)
                : 0}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='paragraph'>Total Amount</Typography>
            <hr />
            <Typography
              variant='paragraph'
              sx={{ fontSize: '1rem', fontWeight: '800' }}
            >
              <span>&#8377;</span>
              {allCartData?.subTotalSellerAmount
                ? +allCartData.subTotalSellerAmount.toFixed(0)
                : 0}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to='/cart'>
            <Button variant='contained' color='error'>
              back to cart
            </Button>
          </Link>
          <Button
            onClick={handleSubmitOrder}
            variant='contained'
            color='success'
          >
            Confirm Order
          </Button>
        </Box>
      </Container>

      <Container
        sx={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}
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
                  {shipAddress.name}
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
                      {shipAddress.mobileNo}
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
                      {shipAddress.city}, {shipAddress.state}
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
                      sx={{ fontSize: '.777rem' }}
                    >
                      {shipAddress.addressLine1}
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
                      {shipAddress.addressLine1}
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
                  {billAddress.name}
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
                      {billAddress.mobileNo}
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
                      {billAddress.city}, {billAddress.state}
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
                      sx={{ fontSize: '.777rem' }}
                    >
                      {billAddress.addressLine1}
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
                      {billAddress.pincode}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Collapse>
          </div>
        </Box>
        {isLoading && <Loading />}
      </Container>

      {/* second container */}
      <Container sx={{ marginTop: '4rem' }}>
        {allCartData &&
          allCartData?.cartData?.map((items, index) => {
            return (
              <Box sx={{ marginTop: '1rem', color: '#fff' }} key={index}>
                <Typography
                  variant='paragraph'
                  sx={{
                    backgroundColor: '  #262626',
                    padding: '6px 10px 2px',
                    fontWeight: 'bold',
                    borderRadius: '7px 7px 0 0',
                  }}
                >
                  {index + 1}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '.4rem',
                    backgroundColor: '#262626',
                    padding: '.5rem',
                  }}
                >
                   
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                   
                    <Typography
                      variant='h4'
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '.944rem',
                        flexBasis: '30%',
                      }}
                    >
                      Product
                    </Typography>
                    <Typography
                      variant='paragraph'
                      sx={{
                        fontSize: '.855rem',
                        flexBasis: '70%',
                        textAlign: 'right',
                      }}
                    >
                      {items.name}
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
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.855rem' }}
                    >
                      {items.SKU}
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
                      unit Price
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
                        {+items.salesPrice.toFixed(0)}
                      </Typography>
                      <Typography
                        variant='paragraph'
                        sx={{ fontSize: '.855rem', color: 'green' }}
                      >
                        <span>&#8377;</span>
                        {+items.sellerPrice.toFixed(0)}
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
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.855rem' }}
                    >
                      {items.quantity}
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
                    <Typography
                      variant='paragraph'
                      sx={{ fontSize: '.855rem' }}
                    >
                      &#x20B9; {+items.sellerPriceTotal.toFixed(0)}
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

export default PlaceOrderMobile;
