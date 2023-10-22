import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  styled,
  InputAdornment,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
import { toast } from "react-toastify";
const columns = [
  { field: "Sno", headerName: "S.No" },
  { field: "SKU", headerName: "SKU" },
  { field: "Name", headerName: "Name" },
  { field: "Brand", headerName: "Brand" },
  { field: "Stock", headerName: "Stock" },
  { field: "GST", headerName: "GST (%)" },
  { field: "SalesPrice", headerName: "Sales Price" },
  { field: "Quantity", headerName: "Quantity" },
  { field: "Discount %", headerName: "Discount %" },
  { field: "Discount Price", headerName: "Discount Price" },
  { field: "Discount Price Total", headerName: "Total Price" },
  { field: "Delete", headerName: "Remove" },
];
import { useCreateDiscountQueryMutation } from "../../../features/api/discountQueryApiSlice";
import { useSocket } from "../../../CustomProvider/useWebSocket";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#eee",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
}));

const StyleTable = styled(TableCell)(({ theme }) => ({
  fontSize: ".777rem",
  padding: "5px !important",
  textAlign: "center",
}));


import { useSelector } from "react-redux";
const StyledCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#eee",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
  textAlign:"center",
}));

const DiscountCalcDialog = ({
  data,
  removeSelectedItems,
  open,
  setOpen,
  handleOpenDialog,
}) => {
  /// initialize
  const socket = useSocket();

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  /// local state
  const [calculatedValue, setCalculatedValue] = useState({});
  const [discountPercent, setDiscountPercent] = useState({});
  const [discountedPrice, setDiscountedPrice] = useState({});
  const [quantity, setQuantity] = useState({});
  const [gstAgg, setGstAgg] = useState({});
  const [totalSalesPrice, setTotalSalesPrice] = useState("");
  const [totalDiscountPrice, setTotalDiscountPrice] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    customerName: "",
    mobileNo: "",
  });

  /// rtk query

  const [createQueryApi, { isLoading }] = useCreateDiscountQueryMutation();

  // handlers

  const handleCloseDialog = () => {
    setOpen(false);
    setFormData({
      description: "",
      customerName: "",
      mobileNo: "",
    });
  };

  const calculateValues = () => {
    const updatedValues = {};
    data.forEach((item) => {
      const value = isNaN(quantity[item.SKU])
        ? ""
        : discountedPrice[item.SKU] * quantity[item.SKU] ||
          quantity[item.SKU] * item.SalesPrice;

      updatedValues[item.SKU] = value;
    });

    setCalculatedValue(updatedValues);
  };

  useEffect(() => {
    calculateValues();
  }, [discountedPrice, quantity, data]);

  const handleDiscountPercentChange = (event, item) => {
    const newDiscountPercent = { ...discountPercent };
    newDiscountPercent[item.SKU] = +event.target.value;

    const newDiscountedPrice = { ...discountedPrice };
    newDiscountedPrice[item.SKU] = event.target.value
      ? (
          +item.SalesPrice -
          item.SalesPrice * (+event.target.value / 100)
        ).toFixed(0)
      : null;

    setDiscountPercent(newDiscountPercent);
    setDiscountedPrice(newDiscountedPrice);
  };

  const handleQuantityChange = (event, item) => {
    const oldQuantity = { ...quantity };
    oldQuantity[item.SKU] = +event.target.value;
    setQuantity(oldQuantity);
  };

  const handleGstCalulate = () => {
    const sumByGST = {};

    for (const skuCode in quantity) {
      if (data.some((item) => item.SKU === skuCode)) {
        const gstValue = data.find((item) => item.SKU === skuCode).GST;

        if (sumByGST[gstValue] > 0 && sumByGST[gstValue] !== undefined) {
          sumByGST[gstValue] += calculatedValue[skuCode];
        
        } else {
          sumByGST[gstValue] = calculatedValue[skuCode];
       
        }
      }
    }

    const result = {};

    if ("5" in sumByGST) {
      const gst5Value = (sumByGST["5"] * 0.05).toFixed(0);
      result["5"] = parseFloat(gst5Value);
    }

    if ("18" in sumByGST) {
      const gst18Value = (sumByGST["18"] * 0.18).toFixed(0);
      result["18"] = parseFloat(gst18Value);
    }

    setGstAgg(result);
  };

  // for mobile no validation checks
  const isValidMobileNumber = (mobileNo) => {
    return /^[6-9]\d{9}$/gi.test(mobileNo);
  };

  // handling send query
  const handleSubmit = async (status) => {
    let cancel = false;
    if (data.length) {
      const newProceesedData = data.map((item) => {
        if (!quantity[item.SKU]) {
          cancel = true;
        }
        return {
          ...item,
          reqQty: quantity[item.SKU],
          discountPercent: discountPercent[item.SKU]
            ? discountPercent[item.SKU]
            : 0,
        };
      });

      if (cancel) {
        toast.error("Quantity missing for some product");
        return;
      }

      if (!formData.mobileNo || !formData.customerName) {
        toast.error("please enter a customer name and mobile number");
        return;
      }
      if (!isValidMobileNumber(formData.mobileNo)) {
        toast.error("Please enter a valid mobile number");
        return;
      }
      const productsWithDiscount = newProceesedData.map((product, index) => {
        const discountPercentage = product.discountPercent;
        const salesPrice = product.SalesPrice;
        const discountAmount = (discountPercentage / 100) * salesPrice;
        const discountPrice = salesPrice - discountAmount;

        return {
          ...product,
          discountPrice: discountPrice,
          totalPrice: calculatedValue[product.SKU],
        };
      });

      try {
        const params = {
          Data: productsWithDiscount,
          CustomerName: formData.customerName,
          MobileNo: formData.mobileNo,
          Message: formData.description,
          status: status,
          GST: gstAgg,
        };

        const res = await createQueryApi(params).unwrap();
        const liveStatusData = {
          message: `${userInfo.name} Created a New DiscountQuery for Customer ${formData.customerName} `,
          time: new Date().toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        };
        socket.emit("liveStatusServer", liveStatusData);
        toast.success(res.message);
        setQuantity({});
        setDiscountedPrice({});
        setDiscountPercent({});
        setGstAgg({});
        setTotalDiscountPrice("");
        setFormData({
          description: "",
          customerName: "",
          mobileNo: "",
        });
        handleCloseDialog();
      } catch (e) {
        console.log("error at Discount Query create ", e);
      }
    }
  };

  /// useEffect
  useEffect(() => {
    handleGstCalulate();
  }, [calculatedValue]);

  useEffect(() => {
    const totalSalesPrice = data.reduce((accumulator, item) => {
      if (quantity[item.SKU]) {
        return accumulator + item.SalesPrice * quantity[item.SKU];
      } else {
        return accumulator + item.SalesPrice;
      }
    }, 0);
    setTotalSalesPrice(totalSalesPrice);
  }, [data, quantity]);

  useEffect(() => {
    const totalDiscountPrice = data.reduce((accumulator, item) => {
      if (quantity[item.SKU] && calculatedValue[item.SKU]) {
        return accumulator + calculatedValue[item.SKU];
      } else {
        return accumulator;
      }
    }, 0);
    setTotalDiscountPrice(totalDiscountPrice);
  }, [discountPercent, calculatedValue]);

  return (
    <div style={{}}>
      <Dialog open={open} maxWidth="xl" onClose={handleCloseDialog}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            paddingTop: ".5rem",
            paddingX: ".7rem",
          }}
        >
          <Typography
            sx={{
              flex: "1",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.3rem",
            }}
          >
            Product Details
          </Typography>
          <CancelIcon
            onClick={(event) => {
              setOpen(false);
            }}
          />
        </Box>

        <DialogContent>
          <TableContainer sx={{ maxHeight: "60vh" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledCell sx={{ fontSize: ".8rem" }} key={column.field}>
                      {column.headerName}
                    </StyledCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {index + 1}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {item.SKU}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "150px" }}>
                        {item.Name}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {item.Brand}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {item.Quantity}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "80px" }}>
                        {item.GST} %
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "99px" }}>
                        ₹ {item.SalesPrice}
                      </StyleTable>
                      <StyleTable>
                        <TextField
                          size="small"
                          sx={{
                            "& input": {
                              height: "10px",
                              maxWidth: "30px",
                            },
                          }}
                          value={quantity[item?.SKU] === 0 ? "" : quantity[item?.SKU]}
                          // value={
                          //   quantity[item?.SKU] === 0 ? "" : quantity[item?.SKU]
                          // }
                          type="number"
                          onChange={(event) => {
                            handleQuantityChange(event, item);
                          }}
                        />
                      </StyleTable>
                      <StyleTable>
                        <TextField
                          size="small"
                          sx={{
                            "& input": {
                              height: "10px",
                              maxWidth: "30px",
                            },
                          }}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          value={discountPercent[item?.SKU] === 0 ? "" : discountPercent[item?.SKU]}
                          // value={
                          //   discountPercent[item?.SKU] === 0
                          //     ? ""
                          //     : discountPercent[item?.SKU]
                          // }
                          type="number"
                          onChange={(event) => {
                            handleDiscountPercentChange(event, item);
                          }}
                        />
                      </StyleTable>

                      <StyleTable sx={{ fontSize: ".9rem", minWidth: "130px" }}>
                        {discountedPrice[item.SKU] ? "₹ " + discountedPrice[item.SKU] : "" }
                      </StyleTable>

                      <StyleTable>
                        {isNaN(quantity[item.SKU])
                          ? ""
                          : ((+calculatedValue[item.SKU]) && "₹ " + (+calculatedValue[item.SKU]).toFixed(0))}
                      </StyleTable>

                      <StyleTable>
                        <DeleteIcon
                          onClick={() => {
                            removeSelectedItems(item.SKU);
                          }}
                        />
                      </StyleTable>
                    </TableRow>
                  );
                })}

                <TableRow></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <StyledBox>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Price Summary
            </Typography>
            <Box
              sx={{
                marginTop: ".4rem",
                display: "flex",
                justifyContent: "space-around",
                // border: '2px solid green',
              }}
            >
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: ".9rem" }}>
                  Total Sale Price ={'\u00A0'}
                </Typography>
                <Typography sx={{ fontSize: ".9rem" }}>
                 {totalSalesPrice  ? " ₹ " +(+totalSalesPrice).toFixed(0) : "" }
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  // border: '2px solid',
                  // justifyContent: 'space-evenly',
                }}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: ".9rem" }}>
                  Grand Total Price ={'\u00A0'}
                </Typography>
                <Typography sx={{ fontSize: ".9rem" }}>
              {totalDiscountPrice > 0  ? " ₹ " + (+totalDiscountPrice).toFixed(0) : ""}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  // border: '2px solid',
                  // justifyContent: 'space-evenly',
                }}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: ".9rem" }}>
                  GST 5% ={'\u00A0'}
                </Typography>
                <Typography sx={{ fontSize: ".9rem" }}>
                {gstAgg?.["5"] > 0 ? "₹ " + gstAgg?.["5"] : ""}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  // border: '2px solid',
                  // justifyContent: 'space-evenly',
                }}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: ".9rem" }}>
                  GST 18% ={'\u00A0'}
                </Typography>
                <Typography sx={{ fontSize: ".9rem" }}>
                  {gstAgg?.["18"] > 0 ? "₹ " + gstAgg?.["18"] : ""}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* another section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: " 2rem",
              marginTop: ".2rem",
              paddingX: "2rem",
              paddingBottom: ".6rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexBasis: "50%",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "1.4rem", fontWeight: "bold" }}
              >
                Descriptions :
              </Typography>
              <textarea
                style={{ height: "3rem", resize: "none" }}
                placeholder="Kindly write your customer-related query here"
                value={formData.description}
                name="description"
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                  });
                }}
              />
            </Box>
            <Box
              sx={{
                flexBasis: "25%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "1.7rem",
                gap: ".5rem",
              }}
            >
              {" "}
              <Button
                disabled={isLoading}
                variant="contained"
                onClick={() => {
                  handleSubmit("pending");
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" /> // Show loading indicator
                ) : (
                  "Send Query"
                )}
              </Button>
              <Button
                disabled={isLoading}
                onClick={() => {
                  handleSubmit("close");
                }}
                variant="contained"
                color="primary"
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" /> // Show loading indicator
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
            <Box
              sx={{
                flexBasis: "25%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: ".5rem",
              }}
            >
              <TextField
                sx={{ backgroundColor: "#fff" }}
                placeholder="Customer name"
                size="small"
                value={formData.customerName}
                name="customerName"
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                  });
                }}
              />
              <TextField
                sx={{ backgroundColor: "#fff" }}
                placeholder="Mobile number"
                size="small"
                type="number"
                value={formData.mobileNo === 0 ? "" : formData.mobilemobileNo}
                name="mobileNo"
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [event.target.name]: +event.target.value,
                  });
                }}
              />
            </Box>
          </Box>
        </StyledBox>
      </Dialog>
    </div>
  );
};

export default DiscountCalcDialog;
