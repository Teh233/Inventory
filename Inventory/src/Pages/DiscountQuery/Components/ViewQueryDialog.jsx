import React from "react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
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
  Paper,
  Tooltip,
  styled,
  CircularProgress,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  useGetDiscountQueryByIdQuery,
  useUpdateDiscountQueryMutation,
} from "../../../features/api/discountQueryApiSlice";
import { toast } from "react-toastify";
import { BorderRight } from "@mui/icons-material";
import { formatDate } from "../../../commonFunctions/commonFunctions";

// table styles
const StyleTable = styled(TableCell)(({ theme }) => ({
  fontSize: ".777rem",
  padding: "5px !important",
  textAlign: "center",
}));

const ViewQueryDialog = ({ openDial, handleClose, rowData }) => {
  // rtk query
  const { data: query, refetch } = useGetDiscountQueryByIdQuery(rowData, {
    refetchOnMountOrArgChange: true,
  });
  const [updateQuery, { isLoading }] = useUpdateDiscountQueryMutation();

  // handle new query accept
  const handleAcceptQuery = async () => {
    try {
      const data = { type: "sold", id: rowData };
      const res = await updateQuery(data).unwrap();
      if (res.status === "success") {
        handleClose();
        toast.success(res.message);
      } else {
        handleClose();
        toast.error(res.message);
      }
    } catch (error) {
      console.log("error at Discount Query update ", error);
    }
  };

  // handle new query reject
  const handleRejectQuery = async () => {
    try {
      const data = { type: "close", id: rowData };
      const res = await updateQuery(data).unwrap();
      if (res.status === "success") {
        handleClose();
        toast.success(res.message);
      } else {
        handleClose();
        toast.error(res.message);
      }
    } catch (error) {
      console.log("error at Discount Query update ", error);
    }
  };

  return (
    <div>
      <Dialog
        open={openDial}
        onClose={handleClose}
        maxWidth="xl"
        sx={{ backdropFilter: "blur(5px)" }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#9999",
              paddingX: ".4rem",
              borderRadius: ".4rem",
              gap: ".3rem",
            }}
          >
            <Typography
              sx={{
                textAlign: "center",
                fontSize: ".9rem",
                fontWeight: "bold",
              }}
            >
              Date
            </Typography>

            <Typography sx={{ textAlign: "center", fontSize: ".9rem" }}>
              {/* {query?.data?.date.slice(0, 10) || "Not available"} */}
              {formatDate(query?.data?.date)}
            </Typography>
          </Box>
          <Typography
            fontWeight="bold"
            // variant='h5'
            sx={{ flex: "1", textAlign: "center", fontSize: "1.4rem" }}
          >
            Calculate Discounted Price in Bulk Order
          </Typography>
          <CancelIcon onClick={handleClose} sx={{ display: "inline-flex" }} />
        </DialogTitle>

        <DialogContent>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ flexBasis: "67.8%", textAlign: "center" }}>
                <Typography fontWeight="bold">Sales Discount</Typography>
              </Box>
              <Box sx={{ flexBasis: "32.8%", textAlign: "center" }}>
                <Typography fontWeight="bold" sx={{}}>
                  Authorized Discounted Price
                </Typography>
              </Box>
            </Box>
            {/* // main table  */}
            <TableContainer sx={{ maxHeight: 360, overflowX: "auto" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: ".777rem",
                        fontWeight: "bold",
                        backgroundColor: "#eeee",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      Sno
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".777rem",
                        fontWeight: "bold",
                        backgroundColor: "#eeee",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      SKU
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".777rem",
                        fontWeight: "bold",
                        backgroundColor: "#eeee",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      Product Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".777rem",
                        fontWeight: "bold",
                        backgroundColor: "#eeee",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      GST
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".777rem",
                        fontWeight: "bold",
                        backgroundColor: "#eeee",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      Sales Price
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".777rem",
                        fontWeight: "bold",
                        backgroundColor: "#eeee",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Discount
                    </TableCell>
                    <Tooltip title="Discount Price">
                      <TableCell
                        sx={{
                          fontSize: ".777rem",
                          fontWeight: "bold",
                          backgroundColor: "#eeee",
                          whiteSpace: "nowrap",
                        }}
                      >
                        D P
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="Quantity">
                      <TableCell
                        sx={{
                          fontSize: ".777rem",
                          fontWeight: "bold",
                          backgroundColor: "#eeee",
                          whiteSpace: "nowrap",
                        }}
                      >
                        QTY
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="Total Discount Price">
                      <TableCell
                        sx={{
                          fontSize: ".777rem",
                          fontWeight: "bold",
                          backgroundColor: "#eeee",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Total
                      </TableCell>
                      {/* second scenario */}
                    </Tooltip>
                    <Tooltip title="New discount Price">
                      <TableCell
                        sx={{
                          fontSize: ".777rem",
                          fontWeight: "bold",
                          backgroundColor: "#666666",
                          color: "#fff",
                          whiteSpace: "nowrap",
                        }}
                      >
                        New D P
                      </TableCell>
                    </Tooltip>

                    <TableCell
                      sx={{
                        fontSize: ".777rem",
                        fontWeight: "bold",
                        backgroundColor: "#666666",
                        color: "#fff",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Discount
                    </TableCell>

                    <Tooltip title="Total Discount Price">
                      <TableCell
                        sx={{
                          fontSize: ".777rem",
                          fontWeight: "bold",
                          backgroundColor: "#666666",
                          color: "#fff",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Total D P
                      </TableCell>
                    </Tooltip>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {query?.data?.discontsQueries?.map((sales, index) => {
                    const salesPrice = sales.SalesPrice;
                    const newDiscountedPrice =
                      query?.data?.NewOfferData.length > 0
                        ? query?.data?.NewOfferData[index].newDiscountPrice
                        : "";
                    const calculatedDiscount =
                      query?.data?.NewOfferData.length > 0
                        ? +(
                            ((salesPrice - newDiscountedPrice) * 100) /
                            newDiscountedPrice
                          ).toFixed(2) + "%"
                        : "";

                    return (
                      <TableRow key={index}>
                        <StyleTable>{index + 1}</StyleTable>
                        <StyleTable>{sales.SKU}</StyleTable>
                        <StyleTable>{sales.Name}</StyleTable>
                        <StyleTable>{sales.GST} %</StyleTable>
                        <StyleTable>₹ {sales.SalesPrice}</StyleTable>
                        <StyleTable>{sales.discountPercent} %</StyleTable>
                        <StyleTable>
                          ₹ {(+sales.discountPrice).toFixed(0)}
                        </StyleTable>
                        <StyleTable>{sales.reqQty}</StyleTable>
                        <StyleTable>
                          ₹ {(+sales.discountPrice * sales.reqQty).toFixed(0)}
                        </StyleTable>

                        {/* another scenario */}
                        <React.Fragment>
                          <StyleTable sx={{ fontSize: ".777rem" }}>
                            {newDiscountedPrice && "₹" + newDiscountedPrice}
                          </StyleTable>

                          <StyleTable sx={{ fontSize: ".777rem" }}>
                            {calculatedDiscount && calculatedDiscount}
                          </StyleTable>

                          <StyleTable sx={{ fontSize: ".777rem" }}>
                            {query?.data?.NewOfferData.length > 0
                              ? "₹" +
                                (+query?.data?.NewOfferData[index]
                                  .TotalCost).toFixed(0)
                              : ""}
                          </StyleTable>
                        </React.Fragment>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* price summary section */}
          {/* <Box
            sx={{
              border: '1px solid',
            }}
          >
            <Typography
              variant='h6'
              textAlign='center'
              sx={{ backgroundColor: '#eee' }}
            >
              Price Sumary
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: '.4rem',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#9999',
                  paddingX: '.4rem',
                  borderRadius: '.4rem',
                }}
              >
                <Typography variant='paragraph' sx={{ fontSize: '.9rem' }}>
                  Total Sale Price
                </Typography>
                <hr />
                <Typography
                  variant='paragraph'
                  sx={{ textAlign: 'center', fontSize: '.9rem' }}
                >
                  {query?.data?.TotalSalesPrice}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#9999',
                  paddingX: '.4rem',
                  borderRadius: '.4rem',
                }}
              >
                <Typography variant='paragraph' sx={{ fontSize: '.9rem' }}>
                  {' '}
                  Previous Total Price{' '}
                </Typography>
                <hr />
                <Typography
                  variant='paragraph'
                  sx={{ textAlign: 'center', fontSize: '.9rem' }}
                >
                  {query?.data && (+query?.data?.PreviousTotal).toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#9999',
                  paddingX: '.4rem',
                  borderRadius: '.4rem',
                }}
              >
                <Typography variant='paragraph' sx={{ fontSize: '.9rem' }}>
                  Old discount
                </Typography>
                <hr />
                <Typography
                  variant='paragraph'
                  sx={{ textAlign: 'center', fontSize: '.9rem' }}
                >
                  {query?.data && (+query?.data?.OldDiscount).toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#9999',
                  paddingX: '.4rem',
                  borderRadius: '.4rem',
                }}
              >
                <Typography variant='paragraph' sx={{ fontSize: '.9rem' }}>
                  current Total
                </Typography>
                <hr />
                <Typography
                  variant='paragraph'
                  sx={{ textAlign: 'center', fontSize: '.9rem' }}
                >
                  {query?.data?.AfterDiscountTotalProfit || 'Not available'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#9999',
                  paddingX: '.4rem',
                  borderRadius: '.4rem',
                }}
              >
                <Typography sx={{ textAlign: 'center', fontSize: '.9rem' }}>
                  Date
                </Typography>
                <hr />
                <Typography sx={{ textAlign: 'center', fontSize: '.9rem' }}>
                  {query?.data?.date.slice(0, 10) || 'Not available'}
                </Typography>
              </Box>
            </Box>
          </Box> */}

          {/* identify section */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridGap: "1rem",

              // border:"2px solid blue"
            }}
          >
            {/* message box */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                height: "4rem",
              }}
            >
              <Box>
                <Typography fontWeight="bold">Message</Typography>
              </Box>

              <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                style={{ resize: "none" }}
                readOnly
                value={query?.data?.Message}
              ></textarea>
            </Box>

            {/* Customer mobile and name section */}
            <Box
              sx={{
                display: "flex",

                justifyContent: "space-around",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".4rem",
                }}
              >
                <Typography fontWeight="bold">Name:</Typography>
                <TextField
                  placeholder="Customer Name"
                  variant="standard"
                  inputProps={{ readOnly: true }}
                  value={query?.data?.CustomerName}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".4rem",
                }}
              >
                <Tooltip title="Mobile Number">
                  <Typography fontWeight="bold">M.no:</Typography>
                </Tooltip>
                <TextField
                  placeholder="Mobile No"
                  variant="standard"
                  inputProps={{ readOnly: true }}
                  value={query?.data?.MobileNo}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: "#eee",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: ".4rem",
              flexBasis: "75%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#9999",
                paddingX: ".4rem",
                borderRadius: ".4rem",
              }}
            >
              <Typography
                variant="paragraph"
                sx={{ fontSize: ".9rem", fontWeight: "bold" }}
              >
                Total Sales Price
              </Typography>
              <hr />
              <Typography
                variant="paragraph"
                sx={{ textAlign: "center", fontSize: ".9rem" }}
              >
                {query?.data?.TotalSalesPrice &&
                  "₹ " + (+query?.data?.TotalSalesPrice).toFixed(0)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#9999",
                paddingX: ".4rem",
                borderRadius: ".4rem",
              }}
            >
              <Typography
                variant="paragraph"
                sx={{ fontSize: ".9rem", fontWeight: "bold" }}
              >
                {" "}
                Previous Total Price{" "}
              </Typography>
              <hr />
              <Typography
                variant="paragraph"
                sx={{ textAlign: "center", fontSize: ".9rem" }}
              >
                {query?.data && "₹ " + (+query?.data?.PreviousTotal).toFixed(0)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#9999",
                paddingX: ".4rem",
                borderRadius: ".4rem",
              }}
            >
              <Typography
                variant="paragraph"
                sx={{ fontSize: ".9rem", fontWeight: "bold" }}
              >
                Old discount
              </Typography>
              <hr />
              <Typography
                variant="paragraph"
                sx={{ textAlign: "center", fontSize: ".9rem" }}
              >
                {query?.data && "₹ " + (+query?.data?.OldDiscount).toFixed(0)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#9999",
                paddingX: ".4rem",
                borderRadius: ".4rem",
              }}
            >
              <Typography
                variant="paragraph"
                sx={{ fontSize: ".9rem", fontWeight: "bold" }}
              >
                Current Total
              </Typography>
              <hr />
              <Typography
                variant="paragraph"
                sx={{ textAlign: "center", fontSize: ".9rem" }}
              >
                {(query?.data?.AfterDiscountTotalProfit &&
                  "₹ " + (+query?.data?.AfterDiscountTotalProfit).toFixed(0)) ||
                  "Not available"}
              </Typography>
            </Box>
          </Box>
          {/* control button accept and reject */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleAcceptQuery}
              disabled={
                query?.data?.status === "sold" ||
                query?.data?.status === "close" ||
                isLoading
              }
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" /> // Show loading indicator
              ) : (
                "Accept"
              )}
            </Button>
            <Button
              variant="contained"
              disabled={
                query?.data?.status === "sold" ||
                query?.data?.status === "close" ||
                isLoading
              }
              color="error"
              onClick={handleRejectQuery}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" /> // Show loading indicator
              ) : (
                "Reject"
              )}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewQueryDialog;
