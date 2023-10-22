import React from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import EmptyCart from "../../assets/empty-cart.png";
import { useNavigate } from "react-router-dom";

const CartMobile = ({
  allCartData,
  handleDelete,
  isLoading,
  handleChangeQty,
}) => {
  // local state
  const [count, setCount] = useState(1);
  const [qtychange, setQtychange] = useState([]);
  const navigate = useNavigate();
  // quantity increment
  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  // quantity decrement
  const handleDecrement = () => {
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  return (
    <React.Fragment>
      {allCartData && allCartData?.cartData?.length > 0 && (
        <Container
          sx={{
            display: "grid",
            gridTemplateColumns: "32% 32% 29%",
            // backgroundColor: '  #333333',
            background:
              "linear-gradient(180deg, #fdc50f 26.71%, #fb982f 99.36%)",
            color: "black",
            width: "95vw",
            borderRadius: ".5rem",
            position: "fixed",
            bottom: "1rem",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            left: "50%",
            transform: "translateX(-50%)",
            padding: ".5rem",
            gridGap: ".8rem",
            zIndex: "10",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography>Total Discount</Typography>
            <hr />
            <Typography
              variant="paragraph"
              sx={{ fontSize: ".8rem", fontWeight: "600" }}
            >
              <span>&#8377;</span>{" "}
              {allCartData?.subTotalSalesAmount -
              allCartData?.subTotalSellerAmount
                ? +(
                    allCartData?.subTotalSalesAmount -
                    allCartData?.subTotalSellerAmount
                  ).toFixed(0)
                : 0}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography>Total Amount</Typography>
            <hr />
            <Typography
              variant="paragraph"
              sx={{ fontSize: ".8rem", fontWeight: "600" }}
            >
              <span>&#8377;</span>
              {+(allCartData?.subTotalSellerAmount)?.toFixed(0)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              disabled={allCartData?.cartData?.length > 0 ? false : true}
              onClick={() => navigate("/placeOrder")}
              sx={{
                fontSize: ".7rem",
                paddingY: ".9rem",
                backgroundColor: "black",
              }}
            >
              Place Order
            </Button>
          </Box>
        </Container>
      )}
      <Container sx={{ position: "relative", marginBottom: "5.5rem" }}>
        {allCartData && allCartData?.cartData?.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <Box sx={{ width: "10rem", height: "10rem" }}>
              <img
                style={{ width: "100%", height: "100%" }}
                src={EmptyCart}
                alt=""
              />
            </Box>
          </Box>
        ) : (
          allCartData?.cartData?.map((cart, index) => (
            <Box key={cart?._id} sx={{ marginTop: "1rem" }}>
              <Box
                sx={{
                  backgroundColor: " #fff",
                  padding: ".5rem",
                  position: "relative",
                }}
              >
                {isLoading && cart?.isUpdating && (
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "rgba(0,0,0,0.2)",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  </Box>
                )}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <CancelIcon
                    onClick={() => handleDelete(cart.SKU)}
                    style={{ cursor: "pointer" }}
                  />
                </Box>
                {/* cart item */}
                <Box sx={{ display: "flex", marginTop: "1rem" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexBasis: "42%",
                    }}
                  >
                    <Box>
                      <Avatar
                        src={cart?.mainImage || ""}
                        alt=""
                        sx={{ width: "90px", height: "90px" }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        marginTop: "0.5rem",
                      }}
                    >
                      <Button
                        onClick={(e) => {
                          let newQty =
                            cart?.quantity > 1 ? cart?.quantity - 1 : 1;
                          if (cart?.quantity === 1) {
                            return;
                          }
                          handleChangeQty(cart.SKU, newQty);
                        }}
                      >
                        <RemoveIcon />
                      </Button>
                      <input
                        style={{ width: "45px", textAlign: "center" }}
                        value={cart?.quantity}
                        onChange={(e) =>
                          handleChangeQty(cart.SKU, e.target.value)
                        }
                        type="number"
                      />

                      <Button
                        onClick={(e) => {
                          let newQty = cart?.quantity + 1;
                          handleChangeQty(cart?.SKU, newQty);
                        }}
                      >
                        <AddIcon />
                      </Button>
                    </Box>
                  </Box>
                  {/* second */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: ".8rem",
                      flexBasis: "58%",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: ".999rem",
                        fontWeight: "bold",
                        overflow: "ellipse",
                      }}
                    >
                      {cart?.name}
                    </Typography>
                    <Typography
                      variant="paragraph"
                      sx={{ fontSize: ".777rem" }}
                    >
                      SKU: {cart.SKU}
                    </Typography>
                    <Box sx={{ display: "flex", gap: ".7rem" }}>
                      <Typography variant="h6" sx={{ fontSize: ".999rem" }}>
                        {cart?.discountPercent} <span>%</span>off
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: ".999rem" }}>
                        <span>&#8377;</span>
                        {+cart?.salesPrice?.toFixed(0)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* third */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                    backgroundColor: " gray",
                    padding: ".4rem",
                    borderRadius: ".2rem",
                    color: "#fff",
                  }}
                >
                  <Typography variant="h6" sx={{ fontSize: ".9rem" }}>
                    Subtotal
                  </Typography>
                  <Typography>
                    <span>&#8377; </span>
                    {+cart?.salesPriceTotal?.toFixed(0)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Container>
    </React.Fragment>
  );
};

export default CartMobile;
