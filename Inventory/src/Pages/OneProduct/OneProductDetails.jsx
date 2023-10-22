import React, { useState } from "react";
import { ImageUploadDialog } from "../../components/Common/DialogBox";
import {
  Typography,
  Grid,
  Box,
  Button,
  Paper,
  styled,
  Stack,
  TextField,
  CardMedia,
} from "@mui/material";
import { toast } from "react-toastify";
import { useUploadMainImageMutation } from "../../features/api/productApiSlice";
import {
  useGetOneProductQuery,
  useUpdateProductsColumnMutation,
  useUpdateNotationMutation,
} from "../../features/api/productApiSlice";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ToggleNav from "../../components/Common/Togglenav";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#fff",
  width: "100%",
  height: "98vh",
  overflowY: "auto",
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const StyledGrid = styled(Grid)(({ theme }) => ({}));

const OneProductDetails = () => {
  /// initialization
  const navigate = useNavigate();
  const { id } = useParams();

  /// global state
  const toggleShowNav = useSelector((state) => state.ui.ShowSide_nav);

  /// rtk query

  const { refetch: refetchOneProduct, data: oneProductData } =
    useGetOneProductQuery(id);

  const [uploadImageApi, { isLoading: uploadImageLoading }] =
    useUploadMainImageMutation();
  const [sellerPriceUpdateApi, { isLoading: priceLoading }] =
    useUpdateProductsColumnMutation();

  const [notationUpdateApi, { isLoading: NotationLoading }] =
    useUpdateNotationMutation();

  /// local state
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectTab, setSelectTap] = useState("");
  const [sellerPrice, setSellerPrice] = useState("");

  /// handlers
  const handleChange = (event) => {
    setSelectTap(event.target.value);
  };

  // handle Seller price update
  const handleSellerPrice = async () => {
    try {
      if (sellerPrice === "") {
        toast.error("please enter Price first", {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }
      const type = "SellerPrice";
      const body = {
        products: { SKU: id, value: +sellerPrice },
      };
      console.log(body);
      const res = await sellerPriceUpdateApi({ body, type }).unwrap();
      toast.success(" Price Updated Successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      refetchOneProduct();
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  // handle Notation update
  const handleNotationUpdate = async () => {
    try {
      if (selectTab === "") {
        toast.error("please Select a Notation", {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }
      const data = {
        sku: id,
        body: { data: selectTab, type: "Notation" },
      };

      console.log(data);
      const res = await notationUpdateApi(data).unwrap();
      toast.success(" Notation Updated Successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      refetchOneProduct();
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  return (
    <StyledBox>
      <ToggleNav filter_show={false} />

      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1.4rem",
        }}
      >
        <StyledGrid
          container
          justifyContent={"center"}
          columnGap={0}
          rowGap={5}
        >
          <Grid item xl={4} lg={6} md={12} sm={12} xs={12}>
            <Paper
              elevation={20}
              sx={{
                width: "500px",
                height: "500px",
                padding: ".2em",
              }}
            >
              <CardMedia
                component="img"
                height="100%"
                width="100%"
                image={oneProductData?.data?.mainImage?.highUrl}
                alt=""
                title=""
                sx={{ objectFit: "fit", objectPosition: "center" }}
              />
            </Paper>
            {/* </Box> */}
          </Grid>
          <Grid margin={"auto"} xl={6} lg={6} md={12} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  {oneProductData?.data?.Name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  Retail Price:{" "}
                  <Typography
                    color="red"
                    component="span"
                    style={{ textDecoration: "line-through" }}
                  >
                    {" "}
                    ${oneProductData?.data?.SalesPrice}
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  Seller Price:{" "}
                  <Typography
                    color="red"
                    component="span"
                    style={{ fontSize: "20px" }}
                  >
                    {" "}
                    ${oneProductData?.data?.SellerPrice}
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="grey">
                  SKU:{" "}
                  <Typography color="grey" component="span">
                    {" "}
                    {oneProductData?.data?.SKU}{" "}
                  </Typography>
                </Typography>
              </Grid>
              <Stack
                direction="row"
                sx={{ gap: "2rem", padding: "1rem", marginTop: "2rem" }}
              >
                <Grid item xs={12} display="flex" sx={{ gap: "5px" }}>
                  <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">
                      Notation
                    </InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={selectTab}
                      label="Notation"
                      onChange={handleChange}
                    >
                      <MenuItem value={"New"}>New</MenuItem>
                      <MenuItem value={"Offer"}>Offer</MenuItem>
                      <MenuItem value={"Pre Order"}>Pre Order</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    onClick={handleNotationUpdate}
                    variant="contained"
                    color="success"
                  >
                    Update
                  </Button>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </StyledGrid>
      </Box>

      {/* </Box> */}
    </StyledBox>
  );
};

export default OneProductDetails;
