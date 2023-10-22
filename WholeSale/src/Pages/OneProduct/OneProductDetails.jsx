import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Common/Navbar';
import Side_navbar from '../../components/Common/Side_navbar';
import {
  Typography,
  Grid,
  Box,
  Button,
  Paper,
  styled,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import SaveIcon from '@mui/icons-material/Save';
import {
  useCreateCartMutation,
  useGetCartQuery,
} from '../../features/api/cartApiSlice';
import { useTheme } from '@emotion/react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { setAllCart, setOneOrder } from '../../features/slice/productSlice';
import { Card, CardMedia } from '@mui/material';
import { useGetOneProductQuery } from '../../features/api/productApiSlice';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  setAllProducts,
  setOneProducts,
} from '../../features/slice/productSlice';
import ToggleNav from '../../components/Common/Togglenav';
import Loading from '../../components/Common/Loading';
import ReactImageMagnify from 'react-image-magnify';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'grey' : '#eee',

}));
const StyledGrid = styled(Grid)(({ theme }) => ({
  // display: 'flex',
  // width: '100%',
  // height: '100%',
  // justifyItem: 'center',
  // alignItems: 'center',
  background:"black"
}));
const StyledPaper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'grey' : '#fff',
  width: '100%',
  height: '100%',
  // marginTop: "20px",
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

}));
const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const OneProductDetails = () => {
  // image change at hove functionality
  const [hoverImage, setHoveredImage] = useState(null);

  const handleImageHover = (imageSrc) => {
    setHoveredImage(imageSrc);
  };

  // image magnifier functionality


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const sellerId = useSelector((state) => state.auth?.userInfo?.sellerId);
  const {
    refetch: cartRefetch,
    data: oneProductData,
    error: cartError,
    isLoading: cartLoading,
  } = useGetOneProductQuery(id);

  const [createCart, { isLoading: loadingCart, error: errorCart }] =
    useCreateCartMutation();
  const toggleShowNav = useSelector((state) => state.ui.ShowSide_nav);
  const { allProduct, brands, categories, cart } = useSelector(
    (state) => state.product
  );
  useEffect(() => {
    if (oneProductData?.status === 'success') {
      dispatch(setOneProducts(oneProductData.data));
    }
  }, [oneProductData]);

  const { refetch, data: allCartData } = useGetCartQuery(sellerId);
  useEffect(() => {
    if (allCartData) {
      dispatch(setAllCart(allCartData.data));
    }
  }, [allCartData]);

  console.log(  oneProductData?.data)

  const add_to_cart = async (item, Now) => {
    try {
      const existingItem = cart?.cartData?.filter((i) => i.SKU === item.SKU);

      if (existingItem && existingItem.length > 0) {
        
        // SKU already exists, update the quantity for that SKU
        const updatedCart = cart.cartData.map((data) => {
          if (data.SKU === item.SKU) {
            return {
              ...data,
              quantity: data.quantity + 1,
            };
          } else {
            return data;
          }
        });
        const res = await createCart({
          sellerId: sellerId,
          cartProducts: updatedCart,
        }).unwrap();
   
        if (res?.status === 'success') {
          if (Now === 'Now') {
            dispatch(setAllCart(res.data));
            navigate('/Cart');
          } else {
            dispatch(setAllCart(res.data));
            toast.success(res.message, {
              position: toast.POSITION.TOP_CENTER,
              toastStyle: {
                marginTop: '30px',
              },
              autoClose: 1000,
            });
          }
        }
      } else if (cart && cart?.cartData?.length > 0) {
        // SKU doesn't exist, add a new item to the state
     
        const res = await createCart({
          sellerId: sellerId,
          cartProducts: [
            ...cart.cartData,
            {
              SKU: item.SKU,
              quantity: 1,
              salesPrice: item.SalesPrice,
              sellerPrice: item.SellerPrice,
              name: item.Name,
            },
          ],
        }).unwrap();

        if (res?.status === 'success') {
          if (Now === 'Now') {
            dispatch(setAllCart(res.data));
            navigate('/Cart');
          } else {
            dispatch(setAllCart(res.data));
            toast.success(res.message, {
              position: toast.POSITION.TOP_CENTER,
              toastStyle: {
                marginTop: '30px',
              },
              autoClose: 1000,
            });
          }
        }
      } else {
        // brand new Stock entry

        const res = await createCart({
          sellerId: sellerId,
          cartProducts: [
            {
              SKU: item.SKU,
              quantity: 1,
              salesPrice: item.SalesPrice,
              sellerPrice: item.SellerPrice,
              name: item.Name,
            },
          ],
        }).unwrap();

        if (res?.status === 'success') {
          if (Now === 'Now') {
            dispatch(setAllCart(res.data));
            navigate('/Cart');
          } else {
            dispatch(setAllCart(res.data));
            toast.success(res.message, {
              position: toast.POSITION.TOP_CENTER,
              toastStyle: {
                marginTop: '30px',
              },
              autoClose: 1000,
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.between('xs', 'md'));

  const thumbnails = [];

  oneProductData?.data?.sideImage?.map((items) => {
    if (items.highUrl) {
      thumbnails.push(items.highUrl);
    }else if(items.midUrl){
      thumbnails.push(items.midUrl)
    }else if(items.lowUrl){
      thumbnails.push(items.lowUrl)
    }
  });

  const maninImage = hoverImage || oneProductData?.data?.mainImage?.highUrl;

  return (
    <StyledBox sx={{ display: 'flex', height: '80vh'}}>
      <ToggleNav />

      <Box component='main' sx={{ flexGrow: 1, p: 0 }}>
        <DrawerHeader />

        {cartLoading ? (
          <Loading />
        ) : (
          <StyledPaper>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'center',
                gap:"0.9rem",
     
              }}
            >
    
                    <Box sx={{ display: 'flex', flexDirection:isMobile ? 'column' : "", gap: '0.9rem',height:"100%",width:"100%",alignItems:"center",justifyContent:"center", }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: isMobile ?  'row' : 'column' ,
                          gap: '.5rem',
                          order: isMobile ? 1 : ""
                      
                        }}
                      >
                        {thumbnails.map((items, index) => (
                          <Box key={index} sx={{ width: '4rem', height: '4rem' }}>
                            <img
                              style={{
                                width: '100%',
                                height: '100%',
                               
                              }}
                              src={items}
                              alt={`items ${index + 1}`}
                              onMouseOver={() => handleImageHover(items)}
                            />
                          </Box>
                        ))}
                      </Box>

                      <Box
                        sx={{
                          // width: '60rem',
                          // height: '30rem',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          mt:isMobile && '10rem',
                 
                      
                        }}
                      >
                         <ReactImageMagnify
  {...{
    style: { width: 40, height: 60,  },
    imageStyle:{objectFit:"contain"},
    smallImage: {
      alt: '',
      width: isMobile ? 300 : 400,
      height: isMobile ? 300 : 400,
      src: maninImage || 'placeholder.jpg',

   // Add the objectFit property here
    },
    largeImage: {
      src: maninImage || 'placeholder.jpg',
      width: 1129,
      height: 750,
      zIndex: 100,
      alt: '',
 
    
    },
    enlargedImageContainerStyle: {
      zIndex: '1500',
      objectFit: 'contain', 
   
    },
    enlargedImageContainerDimensions: {
      width: '100%',
      height: '100%',

    },
    isHintEnabled: true,
  }}
/>

                      </Box>
                    </Box>
                  {/* </Grid>
                </Grid> */}
<Box sx={{height:"100%",display:"flex",alignItems:"center",p:"2rem"}}>
      
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant='h5'>
                        {oneProductData?.data?.Name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='body2'>
                        Retail Price:{' '}
                        <Typography
                          color='grey'
                          component='span'
                          style={{ textDecoration: 'line-through' }}
                        >
                          ₹{Number(oneProductData?.data?.SalesPrice).toFixed(2)}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='body2'>
                        Your Price:{' '}
                        <Typography
                          color='red'
                          component='span'
                          style={{ fontSize: '20px' }}
                        >
                          ₹{Number(oneProductData?.data?.SellerPrice).toFixed(2)}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='body2' color='grey'>
                        SKU:{' '}
                        <Typography color='grey' component='span'>
                          {oneProductData?.data?.SKU}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      {/* <Typography variant='body2' color='grey'>
                        Sold in: X{' '}
                        <Typography color='grey' component='span'>
                          10
                        </Typography>
                      </Typography> */}
                    </Grid>
                    <Grid item xs={12}>
                      {/* {oneProductData?.data?.Quantity > 0 ? (
                        <Typography variant='body2' color='#000'>
                          In stock
                        </Typography>
                      ) : (
                        <Typography variant='body2' color='red'>
                          Sold out
                        </Typography>
                      )} */}
                    </Grid>
                    <Box
                      sx={{
                        width: '100%',
                        mt: 5,
                        display: 'flex',
                        justifyContent: 'start',
                        gap:"2rem",
                        flexDirection: isMobile ? 'column' : 'row',
                   alignItems: 'center',
              
                        // gap: '1rem',
 
                       
                      }}
                    >
                      <Button
                        variant='outlined'
                        sx={{
                          color: '#fff',
                          width: '10rem',
                     
                          backgroundImage:
                            'linear-gradient(to bottom, #574df7, #4538cc, #3225a3, #1e127c, #070257);',
                          border: 'none',
                          '&:hover': { opacity: '0.8', border: 'none' },
                        }}
                        disabled={
                          oneProductData?.data?.SellerPrice > 0 ? false : true
                        }
                        startIcon={<FlashOnIcon />}
                        onClick={() => add_to_cart(oneProductData?.data, 'Now')}
                      >
                        Order Now
                      </Button>

                      <Button
                        variant='outlined'
                        sx={{
                          width: '10rem',
                      
                          color: '#fff',
                          backgroundImage:
                            'linear-gradient(to bottom, #ffaf00, #fc9b00, #f88600, #f27108, #eb5b12);',
                          border: 'none',
                          '&:hover': { opacity: '0.8', border: 'none' },
                        }}
                        disabled={
                          oneProductData?.data?.SellerPrice > 0 ? false : true
                        }
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => add_to_cart(oneProductData?.data)}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Grid>
        
                </Box>
         
            </Box>
          
          </StyledPaper>
        )}
      </Box>
    </StyledBox>
  );
};

export default OneProductDetails;
