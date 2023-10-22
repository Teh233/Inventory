import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  styled,
  Avatar,
  Paper,
  Grid,
  Tooltip,
} from "@mui/material";
import CartGrid from "../../../components/Common/CardGrid";
import img from "../../../../src/assets/drone.png";
import InputBase from "@mui/material/InputBase";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  useUpdateQtyCartMutation,
  useGetCartQuery,
  useDeleteCartItemMutation,
} from "../../../features/api/cartApiSlice";
import { setAllCart } from "../../../features/slice/productSlice";
import { useNavigate } from "react-router-dom";
import CartMobile from "../CartMobile";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  display: "flex",
  justifyContent: "right",
}));

const Item_2 = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  display: "flex",
  justifyContent: "end",
  alignItems: "end",
}));

const Qty = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
  padding: "0 10px",
  border: "1px solid rgb(168, 176, 186)",
  width: "50%",
  "&:hover": {
    border: "1px solid rgb(15, 126, 252)",
    color: "rgb(15, 126, 252)",
    cursor: "pointer",
  },
}));

const StyledQty = styled("div")(({ theme }) => ({
  display: "flex",
  // backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
  justifyContent: "center",
  width: "100%",
}));

const StyledQtyBtn = styled("div")(({ theme }) => ({
  display: "flex",
  backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
  padding: "0 10px",
  justifyContent: "center",
  border: "1px solid rgb(168, 176, 186)",
  alignItems: "center",
  width: "20%",
  "&:hover": {
    border: "1px solid rgb(15, 126, 252)",
    color: "rgb(15, 126, 252)",
    cursor: "pointer",
  },
}));

const StyledInputbase = styled(InputBase)(({ theme }) => ({
  input: {
    textAlign: "center",
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "&[type=number]": {
      MozAppearance: "textfield",
    },
    "&:hover": {
      color: "rgb(15, 126, 252)",
    },
  },
  background: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
}));

const CartList = ({ theme }) => {
  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  /// global state
  const { cart } = useSelector((state) => state.product);
  const sellerId = useSelector((state) => state.auth?.userInfo?.sellerId);

  /// local state
  const [qtyOnChange, setQtyOnChange] = useState({
    SKU: "",
    value: "",
  });
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1053);

  /// rtk query
  const {
    refetch,
    data: allCartData,
    isLoading,
    error,
  } = useGetCartQuery(sellerId, {
    refetchOnMountOrArgChange: true,
  });
  const [updateQty, { isLoading: loadingCart }] = useUpdateQtyCartMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  /// useEffect
  useEffect(() => {
    if (allCartData?.status === "success") {
      dispatch(setAllCart(allCartData.data));
    }
  }, [allCartData]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1053);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /// handler

  const handleDelete = async (SKU) => {
    try {
      const newCartData = cart.cartData.filter((item) => {
        if (item.SKU === SKU) {
          return;
        } else {
          return item;
        }
      });

      dispatch(
        setAllCart({
          ...cart,
          cartData: newCartData,
        })
      );
      const data = {
        id: sellerId,
        query: SKU,
      };
      clearTimeout(timeoutRef.refetch);
      const res = await deleteCartItem(data).unwrap();

      timeoutRef.refetch = setTimeout(async () => {
        refetch();
      }, 1000);
    } catch (err) {
      console.log("error in deleting item in Cart: ", err);
    }
  };

  const handleChangeQty = async (SKU, value) => {
    let TotalAmount = cart.subTotalSellerAmount;
    let newValue = value === "" ? 0 : value;
    const newCartData = cart.cartData.map((item) => {
      if (item.SKU === SKU) {
        let differenceAmount =
          item.sellerPrice * newValue - item.sellerPrice * item.quantity;
        TotalAmount += differenceAmount;
        return {
          ...item,
          quantity: value,
          sellerPriceTotal: item.sellerPrice * newValue,
          isUpdating: true, // Set isUpdating to true while updating quantity
        };
      } else {
        return item;
      }
    });

    dispatch(
      setAllCart({
        ...cart,
        cartData: newCartData,
        subTotalSellerAmount: TotalAmount,
      })
    );
    clearTimeout(timeoutRef.current);
    if (value === "") {
      return;
    }

    // Cancel the previous timeout

    timeoutRef.current = setTimeout(async () => {
      try {
        const data = {
          id: sellerId,
          data: {
            SKU: SKU,
            value: value === "" ? 1 : value,
          },
        };
        const res = await updateQty(data).unwrap();
        refetch();
      } catch (err) {
        console.log("Error in Cart: ", err);
      }
    }, 1000);
  };

  const columns = [
    {
      field: "product",
      headerName: "Product",
      flex: 0.2,
      minWidth: 300,
      // align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            justifyContent: "",
          }}
        >
          <Box>
            <Avatar
              variant="square"
              sx={{ width: 50, height: 40 }}
              src={params?.row?.mainImage}
            />
          </Box>
          <Box>
            <Tooltip title="IRS drone sec" placement="top">
              <Typography
                variant="subtitle2"
                display="block"
                gutterBottom
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "wrap",
                  maxWidth: "100%",
                }}
              >
                {params.row.name}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      ),
    },
    {
      field: "salesPrice",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Unit Price",
      align: "center",
      headerAlign: "center",
      flex: 0.06,
      minWidth: 50,
      valueFormatter: (params) => `₹ ${Math.round(params.value)}`,
    },
    {
      field: "sellerPrice",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Discouted Price",
      align: "center",
      headerAlign: "center",
      flex: 0.09,
      minWidth: 80,
      valueFormatter: (params) => `₹ ${Math.round(params.value)}`,
    },
    {
      field: "discountPercent",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Discouted %",
      align: "center",
      headerAlign: "center",
      flex: 0.09,
      minWidth: 80,
      valueFormatter: (params) => `${Math.round(params.value)} %`,
    },

    {
      field: "quantity",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Quantity",
      align: "center",
      flex: 0.1,
      headerAlign: "center",
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: "20px" }}>
          <Stack sx={{ display: "flex" }}>
            <StyledQty>
              <StyledQtyBtn
                onClick={(e) => {
                  let newQty =
                    params.row.quantity > 1 ? params.row.quantity - 1 : 1;
                  if (params.row.quantity === 1) {
                    return;
                  }
                  handleChangeQty(params.row.SKU, newQty);
                }}
              >
                <RemoveIcon />
              </StyledQtyBtn>
              <Qty>
                <StyledInputbase
                  value={params.row.quantity}
                  onChange={(e) => {
                    handleChangeQty(params.row.SKU, e.target.value);
                  }}
                  type="number"
                />
              </Qty>

              <StyledQtyBtn
                onClick={(e) => {
                  let newQty = params.row.quantity + 1;
                  handleChangeQty(params.row.SKU, newQty);
                }}
              >
                <AddIcon />
              </StyledQtyBtn>
            </StyledQty>
          </Stack>
        </Box>
      ),
    },
    {
      field: "sellerPriceTotal",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Sub Total",
      align: "center",
      headerAlign: "center",
      flex: 0.06,
      minWidth: 80,
      valueFormatter: (params) => `₹ ${Math.round(params.value)}`,
    },
    {
      field: "delete",
      headerName: "Command",
      sortable: false,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button
          onClick={() => {
            handleDelete(params.row.SKU);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      {isMobileView ? (
        <CartMobile
          allCartData={cart}
          handleDelete={handleDelete}
          handleChangeQty={handleChangeQty}
          isLoading={loadingCart}
        />
      ) : (
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Item>
                <CartGrid
                  columns={columns}
                  rows={cart?.cartData ? cart.cartData : []}
                  rowHeight={60}
                  // overlayRows={overlayRows}
                  Height={"73vh"}
                />
              </Item>
            </Grid>

            <Grid item xs={12}>
              <Item_2>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{ width: "100%", height: "50px" }}
                >
                  <Stack
                    sx={{ width: "85%" }}
                    direction="row"
                    justifyContent="space-around"
                  >
                    <Typography>
                      <Typography variant="subtitle2">
                        Price : ₹{" "}
                        {cart?.subTotalSalesAmount
                          ? Math.round(cart.subTotalSalesAmount)
                          : 0}
                      </Typography>
                    </Typography>
                    <Typography>
                      <Typography variant="subtitle2">
                        Total Discount : ₹{" "}
                        {cart?.subTotalSalesAmount - cart?.subTotalSellerAmount
                          ? Math.round(
                              cart?.subTotalSalesAmount -
                                cart?.subTotalSellerAmount
                            )
                          : 0}
                      </Typography>
                    </Typography>
                    <Typography>
                      <Typography variant="subtitle2">
                        Total Amount : ₹{" "}
                        {Math.round(cart?.subTotalSellerAmount)}
                      </Typography>
                    </Typography>
                  </Stack>

                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={cart?.cartData?.length > 0 ? false : true}
                      onClick={() => navigate("/placeOrder")}
                    >
                      Place Order
                    </Button>
                  </Box>
                </Box>
              </Item_2>
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  );
};

export default CartList;
