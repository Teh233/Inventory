import { Box, Button, Container, Paper, Typography } from '@mui/material';
import React from 'react';
import OrderDetails from '../OrderDetails';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EmptyCart from '../../../assets/empty-cart.png';
const OrderMobile = (allOrderData) => {
  const navigate = useNavigate();

  return (
    <>
      {allOrderData && allOrderData?.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
          }}
        >
          <Box sx={{ width: '10rem', height: '10rem' }}>
            <img
              style={{ width: '100%', height: '100%' }}
              src={EmptyCart}
              alt=''
            />
          </Box>
        </Box>
      ) : (
        <Container>
          {allOrderData?.allOrderData?.map((items) => {
            const {
              Sno,
              billAddress,
              id,
              orderId,
              shipAddress,
              status,
              subTotalSellerAmount,
              createdAt,
            } = items;
            const indianDate = new Date(createdAt).toLocaleDateString('en-IN', {
              timeZone: 'Asia/Kolkata',
            });

            return (
              <Paper
                elevation='10'
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridGap: '.3rem',
                  padding: '.7rem',
                  marginTop: '.4rem',
                  backgroundColor: ' #262626',
                  borderRadius: '1rem',
                }}
              >
                {/* <Typography fontWeight='bold' color='#fff' variant='paragraph'>
                  Sno
                </Typography>
                <Typography variant='paragraph' color='#fff' textAlign='center'>
                  {Sno}
                </Typography> */}

                <Typography fontWeight='bold' color='#fff' variant='paragraph'>
                  Order Id
                </Typography>
                <Typography variant='paragraph' color='#fff' textAlign='center'>
                  {orderId}
                </Typography>

                <Typography fontWeight='bold' color='#fff' variant='paragraph'>
                  Status
                </Typography>
                <Typography variant='paragraph' color='#fff' textAlign='center'>
                  {status}
                </Typography>

                {/* <Typography fontWeight='bold' variant='paragraph' color='#fff'>
                  Billing Address
                </Typography>
                <Typography
                  variant='paragraph'
                  textAlign='center'
                  sx={{
                    width: '10rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: '#fff',
                  }}
                >
                  {billAddress}
                </Typography>

                <Typography fontWeight='bold' color='#fff' variant='paragraph'>
                  Shipping Address
                </Typography>
                <Typography
                  textAlign='center'
                  sx={{
                    width: '10rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: '#fff',
                  }}
                  variant='paragraph'
                >
                  {shipAddress}
                </Typography> */}
                {/* bottom area of the card */}
                <Box
                  sx={{
                    // border: '2px solid blue',
                    width: '100%',
                    gridColumn: 'span 2',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '.3rem',
                    marginTop: '.6rem',
                  
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      border: '1px solid #fff',
                      color: 'black',
                      borderRadius: '.5rem',
                      justifyContent: 'center',
                    }}
                  >
                    {/* <Typography
                      fontWeight='bold'
                      color='#fff'
                      variant='paragraph'
                    >
                      Date
                    </Typography> */}
                    <Typography
                      variant='paragraph'
                      color='#fff'
                      textAlign='center'
                    >
                      {indianDate}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #fff',
                      padding: '.2rem',
                      borderRadius: '.5rem',
                    }}
                  >
                    {/* <Typography
                      fontWeight='bold'
                      color='#fff'
                      variant='paragraph'
                    >
                      Price
                    </Typography> */}

                    <Typography
                      variant='paragraph'
                      color='#fff'
                      textAlign='center'
                    >
                      ₹ {+subTotalSellerAmount.toFixed(0)}
                    </Typography>
                  </Box>

                  <Button
                    onClick={() => {
                      navigate(`/orderDetails/${orderId}`);
                    }}
                    sx={{
                      // width: '5rem',
                      marginTop: '.5rem',

                      margin: '.5rem',
                      backgroundImage:
                        'linear-gradient(180deg, #fdc50f 26.71%, #fb982f 99.36%)',
                      color: '#fff',
                    }}
                    variant='contained'
                  >
                    Details
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Container>
      )}
    </>
  );
};

export default OrderMobile;
