import { React, useEffect, useState } from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import {
  Grid,
  CardMedia,
  Box,
  Popover,
  Button,
  Typography,
  DialogContent,
  Paper,
  DialogTitle,
  Stack,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useDeleteSideImageMutation,
  useGetAllProductQuery,
  useGetOneProductQuery,
  useUploadSideImagesMutation,
  useSetDefaultImageMutation,
} from '../../../features/api/productApiSlice';
import Loading from '../../../components/Common/Loading';
import FilterBar from '../../../components/Common/FilterBar';
import CloseIcon from '@mui/icons-material/Close';
import { setAllProducts } from '../../../features/slice/productSlice';
import { toast } from 'react-toastify';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Nodata from '../../../assets/error.gif';
import { useSocket } from '../../../CustomProvider/useWebSocket';
import OneUpdateProductDial from '../../UpdateProduct/OneUpdateProductDial';

const UploadImageGrid = () => {
  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const socket = useSocket();

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  /// local state

  const [anchorEl, setAnchorEl] = useState(null);
  const [filterString, setFilterString] = useState(null);
  const [skuFilter, setSkuFilter] = useState('');
  const [rows, setRows] = useState([]);
  const [imageSKU, setImageSKU] = useState('');
  const [skip, setSkip] = useState(true);
  const [preView, setPreView] = useState(false);
  const [open, setOpen] = useState(false);
  const [SKUinfo, setSKUinfo] = useState('');
  /// rtk query

  const { refetch: refetchOneProduct, data: oneProductData } =
    useGetOneProductQuery(imageSKU, {
      skip: skip,
    });
  const {
    data: allProductData,
    error,
    isLoading,
    refetch,
  } = useGetAllProductQuery(filterString);

  const [uploadSideImageApi, { isLoading: uploadSideImageLoading }] =
    useUploadSideImagesMutation();
  const [deleteSideImageApi, { isLoading: deleteImageLoading }] =
    useDeleteSideImageMutation();
  const [setImageDefaultApi, { isLoading: defaultImageLoading }] =
    useSetDefaultImageMutation();

  /// handlers

  const onClose = () => {
    setOpen(!open);
  };

  const handleDeleteSideImage = async (fileId) => {
    try {
      const body = {
        sku: imageSKU,
        fileId: fileId,
      };

      await deleteSideImageApi(body).unwrap();
      toast.success('Image deleted successfully', {
        position: toast.POSITION.TOP_CENTER,
      });
      refetchOneProduct();
      refetch();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error deleting image', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleSetDefaultImage = async (url) => {
    try {
      const data = {
        sku: imageSKU,
        body: { defaultImage: url },
      };

      await setImageDefaultApi(data).unwrap();
      toast.success('Image set as default', {
        position: toast.POSITION.TOP_CENTER,
      });
      refetchOneProduct();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error deleting image', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleFileSelect = async (event) => {
    try {
      const fileSizeLimit = 500 * 1024; // 500 KB in bytes
      const files = Array.from(event.target.files);

      const formData = new FormData();

      // Check the size of each uploaded file
      files.forEach((file) => {
        if (file.size > fileSizeLimit) {
          toast.error(`Image size exceeds the limit of 500 KB: ${file.name}`, {
            position: toast.POSITION.TOP_CENTER,
          });
          throw new Error(
            `Image size exceeds the limit of 500 KB: ${file.name}`
          );
        }
        formData.append('Images', file);
      });

      const body = {
        sku: imageSKU, // Use the value from imageSKU state
        Images: formData,
      };

      await uploadSideImageApi(body).unwrap();
      const liveStatusData = {
        message: `${userInfo.name} uploaded Image to SKU ${imageSKU}`,
        time: new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
      };
      socket.emit('liveStatusServer', liveStatusData);
      toast.success('Images uploaded successfully', {
        position: toast.POSITION.TOP_CENTER,
      });

      event.target.value = null;
      setTimeout(refetchOneProduct, 1000);
      refetch();
    } catch (error) {
      console.error('Error uploading images:', error);

      // Handle the error, show a toast message, etc.
      toast.error('Error uploading images', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleImage = (e, SKU) => {
    setImageSKU(SKU);
  };

  /// useEffect
  useEffect(() => {
    if (allProductData?.status === 'success') {
      const data = allProductData?.data?.map((item, index) => {
        return {
          id: item.SKU,
          Sno: index + 1,
          SKU: item.SKU,
          Name: item.Name,
          Brand: item.Brand,
          Weight: `${item.Weight} gm`,
          Dimension: `${item.Dimensions.length} x ${item.Dimensions.width} x ${item.Dimensions.height}`,
          Category: item.Category,
          imageCount: item.sideImage?.length,
        };
      });
      dispatch(setAllProducts(allProductData));
      setRows(data);
    }
  }, [allProductData]);

  const handleNavigate = () => {
    navigate('/addRoboProduct');
  };

  const columns = [
    {
      field: 'Sno',
      headerName: 'Sno',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 90,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'SKU',
      headerName: 'SKU',
      flex: 0.3,
      minWidth: 100,
      maxWidth: 130,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => {
        return (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onDoubleClick={() => {
              onClose();
              setSKUinfo(params.row.SKU);
            }}
          >
            {params.row.SKU}
          </div>
        );
      },
    },
    {
      field: 'Name',
      headerName: 'Product ',
      flex: 0.3,
      minWidth: 600,
      maxWidth: 800,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Weight',
      headerName: 'Weight',
      flex: 0.3,
      minWidth: 100,
      //  maxWidth: 600,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Dimension',
      headerName: 'Dimension',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      value: (params) => {
        const dimensions = params.row.Dimension;

        const formattedDimension = `${dimensions.length} x ${dimensions.width} x ${dimensions.height}`;
        return formattedDimension;
      },
    },
    {
      field: 'Brand',
      headerName: 'Brand',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Category',
      headerName: 'Category',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },

    {
      field: 'imageCount',
      headerName: 'ImageCount',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'View',
      headerName: 'Preview',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => {
        return (
          <>
            <Button
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              size='small'
              onClick={(e) => {
                setImageSKU(params.row.SKU);
                setSkip(false);
                setPreView(true);
              }}
            >
              Preview
            </Button>

            <Popover
              sx={{}}
              elevation={1}
              open={preView}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
              }}
              disableRestoreFocus
            >
              <DialogTitle
                sx={{
                  backgroundColor: '#eeee',
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px',
                }}
              >
                <Box sx={{ flex: '1', justifySelf: 'center' }}>
                  <Typography variant='h6'>
                    Product Name: {oneProductData?.data?.Name}
                  </Typography>
                  <Typography variant='h6'>Product SKU: {imageSKU}</Typography>
                </Box>

                <CloseIcon
                  onClick={() => {
                    setPreView(false);
                    // setMainImage([])
                  }}
                  sx={{
                    background: '#000',
                    color: '#fff',
                    borderRadius: '50%',
                  }}
                />
              </DialogTitle>

              <DialogContent
                sx={{
                  minWidth: 600,
                  height: 600,
                  display: 'flex',
                  justifyContent: 'space-around',
                  gap: '2rem',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5rem',
                    alignItems: 'center',
                  }}
                >
                  <Paper
                    elevation={10}
                    sx={{ width: '300px', height: '300px' }}
                  >
                    <CardMedia
                      component='img'
                      sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '5px',
                        objectFit: 'fill',
                      }}
                      image={oneProductData?.data?.mainImage?.lowUrl}
                      alt='main Image'
                    />
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      width: '150px',
                      height: '80%',
                      display: 'flex',
                      // flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      gap: '1rem',
                    }}
                  >
                    {oneProductData?.data?.sideImage &&
                      oneProductData?.data?.sideImage.map((img, index) => (
                        <Stack
                          key={index}
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                        >
                          <CardMedia
                            component='img'
                            sx={{
                              width: 80,
                              height: 80,
                              background: 'green',
                              borderRadius: '5px',
                              position: 'relative',
                              cursur: 'pointer',
                              objectFit: 'fill',
                            }}
                            image={img?.lowUrl}
                            alt='side Image'
                            onClick={(e) => handleSetDefaultImage(img)}
                          ></CardMedia>
                          <HighlightOffIcon
                            sx={{
                              position: 'absolute',
                              top: '2px',
                              backgroundColor: 'orange',
                              borderRadius: '5rem',
                            }}
                            onClick={() => handleDeleteSideImage(img.fileId)}
                          />
                        </Stack>
                      ))}
                  </Paper>
                  <Typography fontWeight='bold'>
                    Click these images to set as default image
                  </Typography>
                </Box>
              </DialogContent>
            </Popover>
          </>
        );
      },
    },
    {
      field: 'uploadImg',
      headerName: '',
      flex: 0.3,
      minWidth: 70,
      maxWidth: 70,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => (
        <Box>
          <input
            type='file'
            multiple
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            id='file-input'
          />
          <label htmlFor='file-input'>
            <AddPhotoAlternateIcon
              onClick={(event) => handleImage(event, params.row.id)}
              sx={{ color: 'green', cursor: 'pointer' }}
            />{' '}
          </label>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
      }}
    >
      {open && (
        <OneUpdateProductDial
          open={open}
          onClose={onClose}
          SKU={SKUinfo}
          refetchOneProduct={refetch}
          refetchAllProduct={refetch}
        />
      )}
      <FilterBar
        setSkuFilter={setSkuFilter}
        setFilterString={setFilterString}
        apiRef={apiRef}
        customButton={'Add Product'}
        customOnClick={handleNavigate}
      />
      <Grid container>
        {isLoading || uploadSideImageLoading || deleteImageLoading ? (
          <Loading loading={true} />
        ) : (
          <Grid item xs={12} sx={{ mt: '5px' }}>
            <Box
              sx={{
                width: '100%',
                height: '84vh',
                '& .super-app-theme--header': {
                  background: '#eee',
                  color: 'black',
                  textAlign: 'center',
                },
                '& .vertical-lines .MuiDataGrid-cell': {
                  borderRight: '1px solid #e0e0e0',
                },
                '& .supercursor-app-theme--cell:hover': {
                  background:
                    'linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)',
                  color: 'white',
                  cursor: 'pointer',
                },
                '& .MuiDataGrid-columnHeaderTitleContainer': {
                  background: '#eee',
                },
                position: 'relative',
              }}
            >
              <DataGrid
                columns={columns}
                apiRef={apiRef}
                rows={rows}
                rowHeight={40}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UploadImageGrid;
