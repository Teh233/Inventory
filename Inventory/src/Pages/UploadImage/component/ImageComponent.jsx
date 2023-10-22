import React, { useState } from "react";
import {
  Box,
  Stack,
  styled,
  Grid,
  Paper,
  CardMedia,
  Button,
} from "@mui/material";
import ToggleNav from "../../../components/Common/Togglenav";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import {
  useGetOneProductQuery,
  useUploadMainImageMutation,
  useUploadSideImagesMutation,
  useDeleteSideImageMutation,
} from "../../../features/api/productApiSlice";
import { useParams } from "react-router-dom";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Fab from "@mui/material/Fab";
import { ImageUploadDialog } from "../../../components/Common/DialogBox";
import { toast } from "react-toastify";
import Loading from "../../../components/Common/Loading";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#eee",
  height: "100vh",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

function ImageComponent() {
  const { id } = useParams();
  const { refetch: refetchOneProduct, data: oneProductData } =
    useGetOneProductQuery(id);

  const [uploadImageApi, { isLoading: uploadImageLoading }] =
    useUploadMainImageMutation();
  const [uploadSideImageApi, { isLoading: uploadSideImageLoading }] =
    useUploadSideImagesMutation();
  const [deleteSideImageApi] = useDeleteSideImageMutation();
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);



  const handleImageUpload = async (image) => {
    try {
      const formData = new FormData();
      formData.append("Image", image);
      const body = {
        sku: id,
        image: formData,
      };
      const res = await uploadImageApi(body).unwrap();
      toast.success("Image Upload Successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      refetchOneProduct();
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files);
  };

  const handleUploadButtonClick = async () => {
    try {
      const fileSizeLimit = 500 * 1024; // 500 KB in bytes
      const formData = new FormData();

      // Check the size of each uploaded file
      uploadedFiles.forEach((file) => {
        if (file.size > fileSizeLimit) {
          toast.error(`Image size exceeds the limit of 500 KB: ${file.name}`, {
            position: toast.POSITION.TOP_CENTER,
          });
          throw new Error(
            `Image size exceeds the limit of 500 KB: ${file.name}`
          );
        }
        formData.append("Images", file);
      });

      const body = {
        sku: id,
        Images: formData,
      };



      await uploadSideImageApi(body).unwrap();

      toast.success("Images uploaded successfully", {
        position: toast.POSITION.TOP_CENTER,
      });

      refetchOneProduct();
    } catch (error) {
      console.error("Error uploading images:", error);

      // Handle the error, show a toast message, etc.
      toast.error("Error uploading images", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleDeleteSideImage = async (fileId) => {
   
    try {
      const body = {
        sku: id,
        fileId: fileId,
      };
      await deleteSideImageApi(body).unwrap();
      toast.success("Image deleted successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      refetchOneProduct();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error deleting image", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <StyledBox sx={{ display: "flex", gap: "0px" }}>
      <ToggleNav />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
      >
        <DrawerHeader />

        {uploadImageLoading || uploadSideImageLoading ? (
          <Loading />
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              height: "65vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Box>
                <Paper elevation={10} sx={{ width: "300px", height: "400px" }}>

                </Paper>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Paper elevation={10} sx={{ width: "300px", height: "310px" }}>
                  {
                    oneProductData?.data?.mainImage?.url ?
                      <CardMedia
                        component="img"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                          borderRadius: "5px",
                          cursor: "pointer",
                          marginBottom: '1rem'
                        }}
                        image={oneProductData?.data?.mainImage?.url}

                      />
                      :
                      <ImageNotSupportedIcon sx={{ width: '100%', height: '100%', color: 'gray' }} />
                  }


                </Paper>
                <ImageUploadDialog
                  open={uploadDialog}
                  onClose={() => setUploadDialog(false)}
                  onImageUpload={handleImageUpload}
                />
                <Button variant="outlined" size="small" sx={{ marginTop: '1rem' }} onClick={() => setUploadDialog(true)}>upload</Button>
              </Box>


              <Box>

                <Paper elevation={10} sx={{ width: "300px", height: "400px", display:'flex',flexWrap:"wrap",gap:'5px',justifyContent:'space-around' }}>
                {oneProductData?.data.sideImage &&
              oneProductData?.data?.sideImage.map((image, index) => (
                <Stack
                  key={index}
                  sx={{
                    position: "relative",
                    width: "120px",
                    height: "120px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                 
                  <CardMedia
                    component="img"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                      borderRadius: "5px",
                    }}
                    image={image.url}
                  />
                  <Fab
                    size="small"
                    color="red"
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      zIndex: 1,
                    }}
                    onClick={() => handleDeleteSideImage(image.fileId)}
                  >
                    <HighlightOffIcon />
                  </Fab>
                </Stack>
              ))
              
              }
                </Paper>
                <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <input
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileSelect}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button component="span">Choose Files</Button>
            </label>
            <Button onClick={handleUploadButtonClick}>Upload</Button>
          </Box>
              </Box>

            </Grid>
          </Box>
        )}

        {/* <Box>
          <Paper
            elevation={5}
            sx={{
              width: "100%",
              height: "200px",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "2px",
              justifyContent: "center",
            }}
          >
            {oneProductData?.data.sideImage &&
              oneProductData?.data?.sideImage.map((image, index) => (
                <Stack
                  key={index}
                  sx={{
                    position: "relative",
                    width: "200px",
                    height: "100%",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                      borderRadius: "5px",
                    }}
                    image={image.url}
                  />
                  <Fab
                    size="small"
                    color="red"
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      zIndex: 1,
                    }}
                    onClick={() => handleDeleteSideImage(image.fileId)}
                  >
                    <HighlightOffIcon />
                  </Fab>
                </Stack>
              ))}
          </Paper>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <input
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileSelect}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button component="span">Choose Files</Button>
            </label>
            <Button onClick={handleUploadButtonClick}>Upload</Button>
          </Box>
        </Box> */}
      </Box>
    </StyledBox>
  );
}

export default ImageComponent;
