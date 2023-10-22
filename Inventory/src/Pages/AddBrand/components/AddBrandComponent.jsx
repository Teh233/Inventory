import React, { useState, useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  useAddBrandMutation,
  useDeleteBrandMutation,
  useGetAllBrandQuery,
  useUpdateBrandMutation,
} from '../../../features/api/productApiSlice';
import { toast } from 'react-toastify';

const AddBrandComponent = () => {
  // scroll top when user click the update button
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  // local state
  const [selectedFile, setSelectedFile] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [updateMode, setUpdateMode] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allBrand, setAllBrand] = useState();

  // rtk query
  const [addBrand] = useAddBrandMutation();
  const { data: getAllBrand, refetch } = useGetAllBrandQuery();
  const [deleteBrand] = useDeleteBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();

  // function for handle changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleBrandNameChange = (e) => {
    const name = e.target.value;
    setBrandName(name);
  };

  // handle submit
  const handleFormSubmit = async (e) => {
    if (!selectedFile || !brandName) {
      alert('Please select a file and enter a brand name.');
      return;
    }
    const formData = new FormData();
    formData.append('Images', selectedFile);
    formData.append('brandName', brandName);
    try {
      setIsLoading(true); // Set loading state to true
      const result = await addBrand(formData);
      toast.success('Brand With Logo Added Successfully');
      setAllBrand(result);
      setSelectedFile(null);
      setBrandName('');
      setIsLoading(false); // Set loading state to false
    } catch (error) {
      console.log(error.message);
      setIsLoading(false); // Set loading state to false in case of an error
    }
  };

  // handle delete button click fucntion
  const handleDeleteBrand = async (id) => {
    try {
      setIsLoading(true); // Set loading state to true
      const result = await deleteBrand(id);
      toast.success('Brand deleted successfully');
      setAllBrand(result);
      setIsLoading(false); // Set loading state to false
    } catch (error) {
      console.log(error.message);
      setIsLoading(false); // Set loading state to false in case of an error
    }
  };

  // handle update brand button fucntion
  const handleUpdateBrand = async () => {
    if (!selectedBrandId) {
      alert(
        'Please select a file, enter a brand name, and select a brand to update.'
      );
      return;
    }
    const formData = new FormData();
    formData.append('id', selectedBrandId);
    formData.append('Images', selectedFile);
    formData.append('brandName', brandName);
    try {
      setIsLoading(true);
      const result = await updateBrand(formData);
      toast.success('Brand Updated Successfully');
      setAllBrand(result);
      setSelectedFile(null);
      setBrandName('');
      setUpdateMode(false);
      setSelectedBrandId(null);
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };

  // recall everything immediately
  useEffect(() => {
    refetch();
  }, [allBrand, setAllBrand]);

  return (
    <Box sx={{}}>
      <h2
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '2rem',
          marginTop: '5px',
        }}
      >
        Add Brands
      </h2>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          margin: '20px',
        }}
      >
        <Box
          component='img'
          sx={{
            height: 233,
            width: 350,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
            backgroundColor: 'yellow',
          }}
          alt='Brand Logo'
          src={
            selectedFile
              ? URL.createObjectURL(selectedFile)
              : 'https://semantic-ui.com/images/wireframe/image.png'
          }
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '20px',
          }}
        >
          <input
            accept='image/*'
            type='file'
            id='file-upload-input'
            onChange={handleFileChange}
            style={{
              backgroundColor: '#3377FF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '.6rem',
            }}
          />
          <TextField
            placeholder={brandName || 'Enter brand name'}
            variant='outlined'
            value={brandName}
            onChange={handleBrandNameChange}
            style={{ marginTop: '10px', width: '100%' }}
          />
          {updateMode ? (
            <p style={{ color: 'green', fontWeight: 'bold', padding: '.2rem' }}>
              please update the brand
            </p>
          ) : (
            ''
          )}
          <Button
            sx={{ backgroundColor: updateMode ? 'green' : 'blue' }}
            type='submit'
            variant='contained'
            component='span'
            startIcon={<CloudUploadIcon />}
            style={{ marginTop: '10px' }}
            onClick={() => {
              if (!updateMode) {
                handleFormSubmit();
              } else {
                handleUpdateBrand();
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : updateMode ? 'Update' : 'Submit'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ marginTop: '5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem' }}>
          Uploaded Brands
        </h2>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {getAllBrand?.brand.map((brand) => (
            <Box
              key={brand._id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <Box
                style={{
                  marginTop: '2rem',
                  border: '1px solid #ccc',
                  padding: '10px',
                  marginRight: '10px',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(26, 100, 242, 0.53)',
                    top: '0',
                    left: '0',
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    opacity: '0',
                    '&:hover': {
                      opacity: '1',
                    },
                  }}
                >
                  <Button
                    onClick={() => handleDeleteBrand(brand.BrandId)}
                    sx={{
                      border: '1px solid #ccc',
                      '&:hover': {
                        backgroundColor: '#3377FF',
                        color: '#fff',
                      },
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    sx={{
                      border: '1px solid #ccc',
                      '&:hover': {
                        backgroundColor: '#3377FF',
                        color: '#fff',
                      },
                    }}
                    onClick={() => {
                      setSelectedBrandId(brand.BrandId);
                      setBrandName(brand.BrandName);
                      setUpdateMode(true); // Set the current brand name in the input field
                      scrollToTop();
                    }}
                  >
                    Update
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ width: '10rem', height: '7rem' }}>
                    <img
                      src={brand?.BrandImage?.url}
                      alt={brand.BrandName}
                      style={{
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <h3>{brand.BrandName}</h3>
                </Box>
              </Box>
              <span>{brand.name}</span>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AddBrandComponent;
