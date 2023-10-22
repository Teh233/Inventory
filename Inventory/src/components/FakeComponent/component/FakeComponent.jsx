import React from 'react';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Typography,
  TextField,
  TableContainer,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const FakeComponent = () => {
  const data = [
    {
      sno: 1,
      sku: 'SKU002',
      productName: 'Product 1',
      gst: 18,
      salesPrice: 100,
      discount: 10,
      discountedPrice: 90,
      quantity: 5,
      totalDiscountPrice: 450,
    },

    {
      sno: 2,
      sku: 'SKU002',
      productName: 'Product 1',
      gst: 18,
      salesPrice: 100,
      discount: 10,
      discountedPrice: 90,
      quantity: 5,
      totalDiscountPrice: 450,
    },
    {
      sno: 2,
      sku: 'SKU002',
      productName: 'Product 1',
      gst: 18,
      salesPrice: 100,
      discount: 10,
      discountedPrice: 90,
      quantity: 5,
      totalDiscountPrice: 450,
    },
    {
      sno: 2,
      sku: 'SKU002',
      productName: 'Product 1',
      gst: 18,
      salesPrice: 100,
      discount: 10,
      discountedPrice: 90,
      quantity: 5,
      totalDiscountPrice: 450,
    },
    {
      sno: 2,
      sku: 'SKU002',
      productName: 'Product 1',
      gst: 18,
      salesPrice: 100,
      discount: 10,
      discountedPrice: 90,
      quantity: 5,
      totalDiscountPrice: 450,
    },
    {
      sno: 2,
      sku: 'SKU002',
      productName: 'Product 1',
      gst: 18,
      salesPrice: 100,
      discount: 10,
      discountedPrice: 90,
      quantity: 5,
      totalDiscountPrice: 450,
    },
    {
      sno: 2,
      sku: 'SKU002',
      productName: 'Product 1',
      gst: 18,
      salesPrice: 100,
      discount: 10,
      discountedPrice: 90,
      quantity: 5,
      totalDiscountPrice: 450,
    },
    {
      sno: 2,
      sku: 'SKU002',
      productName: 'Product 1',
      gst: 18,
      salesPrice: 100,
      discount: 10,
      discountedPrice: 90,
      quantity: 5,
      totalDiscountPrice: 450,
    },
    {
      sno: 2,
      sku: 'SKU002',
      productName: 'Product 1',
      gst: 18,
      salesPrice: 100,
      discount: 10,
      discountedPrice: 90,
      quantity: 5,
      totalDiscountPrice: 450,
    },

    // Add more data objects for each row in the table
  ];

  const data2 = [
    {
      sku: 'SKU002',
      newDiscountedPrice: '3700',
      discount: '22%',
      totalDiscountPrice: '5544',
    },
  ];

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant='contained' color='primary' onClick={handleOpen}>
        Open Dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='xl'
        sx={{ backdropFilter: 'blur(5px)' }}
      >
        <DialogTitle
          sx={{
            display: 'inline-flex',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            fontWeight='bold'
            // variant='h5'
            sx={{ flex: '1', textAlign: 'center', fontSize: '1.4rem' }}
          >
            Calculate Discounted Price in Bulk Order
          </Typography>
          <CancelIcon onClick={handleClose} sx={{ display: 'inline-flex' }} />
        </DialogTitle>

        <DialogContent>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ flexBasis: '67.8%', textAlign:"center" }}>
                <Typography fontWeight='bold'>Sales Discount</Typography>
              </Box>
              <Box sx={{ flexBasis: '32.8%', textAlign:"center" }}>
                <Typography fontWeight='bold' sx={{}}>
                  Authorized Discounted Price
                </Typography>
              </Box>
            </Box>
            <TableContainer sx={{ maxHeight: 270, overflowX: 'auto' }}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: '.777rem',
                        fontWeight: 'bold',
                        backgroundColor: '#eeee',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Sno
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '.777rem',
                        fontWeight: 'bold',
                        backgroundColor: '#eeee',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Sku
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '.777rem',
                        fontWeight: 'bold',
                        backgroundColor: '#eeee',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Product Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '.777rem',
                        fontWeight: 'bold',
                        backgroundColor: '#eeee',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      GST
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '.777rem',
                        fontWeight: 'bold',
                        backgroundColor: '#eeee',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Sales Price
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '.777rem',
                        fontWeight: 'bold',
                        backgroundColor: '#eeee',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Discount
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '.777rem',
                        fontWeight: 'bold',
                        backgroundColor: '#eeee',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Discounted Price
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '.777rem',
                        fontWeight: 'bold',
                        backgroundColor: '#eeee',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Quality
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '.777rem',
                        fontWeight: 'bold',
                        backgroundColor: '#eeee',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Total Discount Price
                    </TableCell>
                    {/* second scenario */}
                    <TableCell
                      sx={{
                        fontSize: '.777rem',
                        fontWeight: 'bold',
                        backgroundColor: '#666666',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      New Discounted Price
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: '.777rem',
                        fontWeight: 'bold',
                        backgroundColor: '#666666',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Discount
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: '.777rem',
                        fontWeight: 'bold',
                        backgroundColor: '#666666',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Total Discount Price
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((sales) => (
                    <TableRow key={sales.sno}>
                      <TableCell sx={{ fontSize: '.777rem' }}>
                        {sales.sno}
                      </TableCell>
                      <TableCell sx={{ fontSize: '.777rem' }}>
                        {sales.sku}
                      </TableCell>
                      <TableCell sx={{ fontSize: '.777rem' }}>
                        {sales.productName}
                      </TableCell>
                      <TableCell sx={{ fontSize: '.777rem' }}>
                        {sales.gst}
                      </TableCell>
                      <TableCell sx={{ fontSize: '.777rem' }}>
                        {sales.salesPrice}
                      </TableCell>
                      <TableCell sx={{ fontSize: '.777rem' }}>
                        {sales.discount}
                      </TableCell>
                      <TableCell sx={{ fontSize: '.777rem' }}>
                        {sales.discountedPrice}
                      </TableCell>
                      <TableCell sx={{ fontSize: '.777rem' }}>
                        {sales.quantity}
                      </TableCell>
                      <TableCell sx={{ fontSize: '.777rem' }}>
                        {sales.totalDiscountPrice}
                      </TableCell>

                      {/* another scenario */}
                      {data2.map((authorized, newIndex) => {
                        if (sales.sku === authorized.sku) {
                          return (
                            <React.Fragment key={newIndex}>
                              <TableCell sx={{ fontSize: '.777rem' }}>
                                {authorized.newDiscountedPrice}
                              </TableCell>
                              <TableCell sx={{ fontSize: '.777rem' }}>
                                {authorized.discount}
                              </TableCell>
                              <TableCell sx={{ fontSize: '.777rem' }}>
                                {authorized.totalDiscountPrice}
                              </TableCell>
                            </React.Fragment>
                          );
                        }
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
   

            </TableContainer>
          </Box>

          {/*  */}
          <Box sx={{ border: '1px solid', marginTop: '.7rem' }}>
            <Typography
              variant='h6'
              textAlign='center'
              sx={{ backgroundColor: '#eee' }}
            >
              Price Sumarry
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
              }}
            >
              <Box
                sx={{
                  backgroundColor: '	#d9d9d9 ',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '.3rem',
                  cursor: 'pointer',
                  // boxShadow: '  #bfbfbf 0px 3px 8px;',
                  // marginLeft: '.7rem',
                }}
              >
                <Typography fontWeight='bold'>Total Sale Price =</Typography>
                <Typography>0</Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: '	#d9d9d9 ',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '.3rem',
                  cursor: 'pointer',
                }}
              >
                <Typography fontWeight='bold'>
                  Previous Total Price =
                </Typography>
                <Typography>0</Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: '	#d9d9d9 ',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '.3rem',
                  cursor: 'pointer',
                }}
              >
                <Typography fontWeight='bold'>Old discount =</Typography>
                <Typography>0</Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: '	#d9d9d9 ',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '.3rem',
                  cursor: 'pointer',
                }}
              >
                <Typography fontWeight='bold'>Current Total =</Typography>
                <Typography>0</Typography>
              </Box>
            </Box>
          </Box>

          {/*  */}

          <Box
            sx={{
              // display: 'flex',
              // justifyContent: 'space-between',
              // border: '2px solid',
              display:"grid",
              gridTemplateColumns:"1fr 1fr 1fr",
              marginTop: '.5rem',
            }}
          >
            <Box
              sx={{
                // flexBasis: '35%',
                display: 'flex',
                flexDirection: 'column',
                // padding: '1rem',
                justifyContent: 'space-around',
                // border: '1px solid ',
                height: '10rem',
                
              }}
            >
              <Box>
                <Typography fontWeight='bold'>Message</Typography>
              </Box>

              <textarea
                name=''
                id=''
                cols='30'
                rows='10'
                style={{ resize: 'none' }}
                readOnly
              ></textarea>
            </Box>

            <Box
              sx={{
                // flexBasis: '20%',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <Button variant='contained' color='success'>
                Accept
              </Button>
              <Button variant='contained' color='error'>
                Reject
              </Button>
            </Box>

            <Box
              sx={{
                // flexBasis: '40%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}
            >
              <TextField
                placeholder='Customer Name'
                variant='standard'
                inputProps={{ readOnly: true }}
              />
              <TextField
                placeholder='Mobile No'
                variant='standard'
                inputProps={{ readOnly: true }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose} color='primary'>
            Close
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FakeComponent;
