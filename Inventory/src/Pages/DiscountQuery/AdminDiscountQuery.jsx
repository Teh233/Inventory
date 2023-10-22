import React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Typography,
  TextField,
  TableContainer,
  styled,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetDiscountQueryAdminQuery,
  useUpdateDiscountQueryMutation,
  useGetDiscountQueryQuery,
} from "../../features/api/discountQueryApiSlice";

const StyleTable = styled(TableCell)(({ theme }) => ({
  fontSize: ".777rem",
  padding: "5px !important",
  textAlign: "center",
}));

const StyleTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: ".777rem",
  fontWeight: "bold",
  backgroundColor: "#eeee",
  whiteSpace: "nowrap",
  textAlign: "center",
}));
const Styleadmin = styled(TableCell)(({ theme }) => ({
  fontSize: ".777rem",
  fontWeight: "bold",
  backgroundColor: "#666666",
  color: "#fff",
  whiteSpace: "nowrap",
  textAlign: "center",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const AdminDiscountQuery = () => {
  const [newData, setNewData] = useState([]);
  const [newFinalDiscountPrice, setNewFinalDiscountPrice] = useState(0);
  const [newFinalDiscountPer, setNewFinalDiscountPer] = useState(0);
  const [newTotalDiscount, setNewTotalDiscount] = useState(0);
  const [afterDiscount, setAfterDiscount] = useState(0);
  const [updateQueryApi, isLoading] = useUpdateDiscountQueryMutation();

  const { id } = useParams();
  const { data: query, refetch } = useGetDiscountQueryAdminQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const { data, isLoading2 } = useGetDiscountQueryQuery();
  console.log(query);
  const navigate = useNavigate();

  useEffect(() => {
    const result = query?.data?.discountQueryWithLandingCosts.map(
      (item, index) => {
        return {
          ProfitPer: "",
          newDiscountPrice: "",
        };
      }
    );
    if (query?.data?.discountQueryWithLandingCosts) {
      setNewData([...result]);
    }
  }, [query]);

  //For Total Discount

  useEffect(() => {
    if (newFinalDiscountPrice) {
      setNewTotalDiscount(query?.data?.TotalSalesPrice - newFinalDiscountPrice);
    } else if (query?.data?.AfterDiscountTotalProfit) {
      setNewTotalDiscount(
        query?.data?.TotalSalesPrice - query?.data?.AfterDiscountTotalProfit
      );
    } else {
      setNewTotalDiscount(query?.data?.OldDiscount);
    }
  }, [newFinalDiscountPrice, setNewFinalDiscountPrice, query?.data]);

  //After Discount

  useEffect(() => {
    if (newFinalDiscountPrice && !query?.data?.AfterDiscountTotalProfit) {
      setAfterDiscount(newFinalDiscountPrice);
    } else if (
      query?.data?.PreviousTotal &&
      !query?.data?.AfterDiscountTotalProfit
    ) {
      setAfterDiscount(query?.data?.PreviousTotal);
    } else {
      setAfterDiscount(query?.data?.AfterDiscountTotalProfit);
    }
  }, [query?.data, newFinalDiscountPrice, setNewFinalDiscountPrice]);

  const handleChange = (e, index) => {
    const { value, name } = e.target;
    const LandingCost =
      +query?.data?.discountQueryWithLandingCosts[index].landingCost;
    const QTY = +query?.data?.discountQueryWithLandingCosts[index].reqQty;
    const SKU = query?.data?.discountQueryWithLandingCosts[index].SKU;
    const isProfitPer = name === "ProfitPer";
    const newDiscountPrice = isProfitPer
      ? LandingCost + (+value / 100) * LandingCost
      : +value;
    const TotalCost = newDiscountPrice * QTY;
    const ProfitPer = isProfitPer
      ? value
      : ((+value - LandingCost) / LandingCost) * 100;

    setNewData((prevData) =>
      prevData.map((row, i) =>
        index === i
          ? {
              ...row,
              ProfitPer: ProfitPer,
              newDiscountPrice: newDiscountPrice,
              TotalCost: TotalCost, // Corrected the TotalCost calculation
              Quantity: +QTY,
              SKU: SKU,
            }
          : row
      )
    );
  };

  useEffect(() => {
    const sum = newData.reduce((accumulator, currentValue) => {
      const totalCost = parseFloat(currentValue.TotalCost);
      return isNaN(totalCost) ? accumulator : accumulator + totalCost;
    }, 0);

    const newFinalPercentage =
      ((+sum - +query?.data?.TotalLandingCost) /
        +query?.data?.TotalLandingCost) *
      100;

    setNewFinalDiscountPer(newFinalPercentage.toFixed(0));
    setNewFinalDiscountPrice(sum);
    // console.log(sum);
  }, [newData, setNewData]);

  const handleSubmit = async () => {
    try {
      const data = {
        type: "admin",
        id: id,
        item: {
          // TotalDiscount : newFinalDiscountPrice ? query?.data?.TotalSalesPrice - newFinalDiscountPrice : query?.data?.OldDiscount,
          NewOfferData: newData,
          CurentTotalProfit: newFinalDiscountPer,
          AfterDiscountTotalProfit: newFinalDiscountPrice,
        },
      };

      const res = await updateQueryApi(data).unwrap();
      if (res.status === "success") {
        toast.success("Query Send Successfully !");
        navigate("/viewQuery/admin");
      } else if (res.status === "error") {
        toast.error("Query Send Error !");
      }
    } catch (e) {
      console.log("error at Discount Query create ", e);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <DrawerHeader />
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ flexBasis: "20.8%", textAlign: "start" }}>
            {" "}
            <Typography variant="subtitle2">
              Date: {query?.data?.date.slice(0, 10)}{" "}
            </Typography>
          </Box>
          <Box sx={{ flexBasis: "67.8%", textAlign: "center" }}>
            <Typography fontWeight="bold">Sales Discount</Typography>
          </Box>
          <Box sx={{ flexBasis: "32.8%", textAlign: "center" }}>
            <Typography fontWeight="bold" sx={{}}>
              Authorized Discounted Price
            </Typography>
          </Box>
        </Box>
        <TableContainer
          sx={{ minHeight: "53vh", maxHeight: "53vh", overflowX: "auto" }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyleTableCell>Sno</StyleTableCell>
                <StyleTableCell>SKU</StyleTableCell>
                <StyleTableCell>Product Name</StyleTableCell>
                <StyleTableCell>GST</StyleTableCell>
                <StyleTableCell>
                  <Tooltip title="Sale Tax">
                    <span>Tax</span>
                  </Tooltip>
                </StyleTableCell>
                <StyleTableCell>
                  <Tooltip title="  Sales Price">
                    <span>SP</span>
                  </Tooltip>
                </StyleTableCell>
                <StyleTableCell>Discount</StyleTableCell>
                <StyleTableCell>
                  <Tooltip title="Discounted Price">
                    <span>DP</span>
                  </Tooltip>
                </StyleTableCell>
             
                <StyleTableCell>
                  <Tooltip title="Quantity">
                    <span>Qty</span>
                  </Tooltip>
                </StyleTableCell>
                <StyleTableCell>
                  <Tooltip title="Total Discount Price">
                    <span>Total DP</span>
                  </Tooltip>
                </StyleTableCell>
                {/* second scenario */}
                <Styleadmin>
                  <Tooltip title="Landing Cost">
                    <span>Landing C</span>
                  </Tooltip>
                </Styleadmin>

                <Styleadmin>
                  <Tooltip title="Prev Profit %">
                    <span>Prev Pft %</span>
                  </Tooltip>
                </Styleadmin>

                <Styleadmin>Profit %</Styleadmin>
                <Styleadmin>
                  <Tooltip title="New Discount Price">
                    <span>New DP</span>
                  </Tooltip>
                </Styleadmin>
              </TableRow>
            </TableHead>
            <TableBody>
              {query &&
                query?.data?.discountQueryWithLandingCosts?.map(
                  (sales, index) => (
                    <TableRow key={index}>
                      <StyleTable>{index + 1}</StyleTable>
                      <StyleTable
                        sx={{ fontSize: ".777rem", textAlign: "center" }}
                      >
                        {sales.SKU}
                      </StyleTable>
                      <StyleTable
                        sx={{ fontSize: ".777rem", textAlign: "center" }}
                      >
                        {sales.Name}
                      </StyleTable>
                      <StyleTable
                        sx={{ fontSize: ".777rem", textAlign: "center" }}
                      >
                        {sales.GST} %
                      </StyleTable>
                      <StyleTable
                        sx={{ fontSize: ".777rem", textAlign: "center" }}
                      >
                        {sales.SalesTax} %
                      </StyleTable> 
                      <StyleTable
                        sx={{ fontSize: ".777rem", textAlign: "center" }}
                      >
                        ₹ {sales.SalesPrice}
                      </StyleTable>
                      <StyleTable
                        sx={{ fontSize: ".777rem", textAlign: "center" }}
                      >
                        {sales.discountPercent} %
                      </StyleTable>
                    
                      <StyleTable
                        sx={{ fontSize: ".777rem", textAlign: "center" }}
                      >
                        ₹ {(+sales.discountPrice).toFixed(0)}
                      </StyleTable>
                
                      <StyleTable
                        sx={{ fontSize: ".777rem", textAlign: "center" }}
                      >
                        {sales.reqQty}
                      </StyleTable>
                      <StyleTable
                        sx={{ fontSize: ".777rem", textAlign: "center" }}
                      >
                        ₹ {(+sales.discountPrice * sales.reqQty).toFixed(0)}
                      </StyleTable>
                      <StyleTable
                        sx={{ fontSize: ".777rem", textAlign: "center" }}
                      >
                        ₹ {sales.landingCost}
                      </StyleTable>
                      <StyleTable
                        sx={{ fontSize: ".777rem", textAlign: "center" }}
                      >
                        {(+sales.prevProfit).toFixed(2)}%
                      </StyleTable>
                      <StyleTable sx={{ textAlign: "center" }}>
                        {query?.data?.NewOfferData.length > 0 ? (
                          (+query?.data?.NewOfferData[index].ProfitPer).toFixed(
                            2
                          ) + "%"
                        ) : (
                          <TextField
                            name="ProfitPer"
                            size="small"
                            sx={{
                              "& input": {
                                height: "10px",
                                maxWidth: "50px",
                              },
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  %
                                </InputAdornment>
                              ),
                            }}
                            value={
                              newData[index]?.ProfitPer
                                ? newData[index].ProfitPer
                                : ""
                            }
                            type="number"
                            onChange={(event) => {
                              handleChange(event, index);
                            }}
                          />
                        )}
                      </StyleTable>
                      <StyleTable sx={{ textAlign: "center" }}>
                        {query?.data?.NewOfferData.length > 0 ? (
                          "₹" +
                          " " +
                          (+query?.data?.NewOfferData[index]
                            .newDiscountPrice).toFixed(0)
                        ) : (
                          <TextField
                            size="small"
                            name="newDiscountPrice"
                            sx={{
                              "& input": {
                                height: "10px",
                                maxWidth: "100px",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  ₹
                                </InputAdornment>
                              ),
                            }}
                            value={
                              newData[index]?.newDiscountPrice
                                ? (+newData[index].newDiscountPrice).toFixed(0)
                                : ""
                            }
                            type="number"
                            onChange={(event) => {
                              handleChange(event, index);
                            }}
                          />
                        )}
                      </StyleTable>
                      {/* another scenario */}
                      {/* {query &&
                      query?.data?.NewOfferData?.map(
                        (authorized, newIndex) => {
                          if (sales.SKU === authorized.SKU) {
                            return (
                              <React.Fragment key={newIndex}>
                                <TableCell sx={{ fontSize: ".777rem" }}>
                                  {authorized.newDiscountedPrice}
                                </TableCell>
                                <TableCell sx={{ fontSize: ".777rem" }}>
                                  {authorized.oneDiscountPrice}
                                </TableCell>
                                <TableCell sx={{ fontSize: ".777rem" }}>
                                  {authorized.totalDiscountPrice}
                                </TableCell>
                              </React.Fragment>
                            );
                          }
                        }
                      )} */}
                    </TableRow>
                  )
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/*  */}
      <Box sx={{ border: "1px solid", marginTop: ".7rem" }}>
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ backgroundColor: "#eee" }}
        >
          Price Sumarry
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "1rem",
          }}
        >
          <Box
            sx={{
              backgroundColor: "	#d9d9d9 ",
              display: "inline-flex",
              textAlign: "center",
              flexDirection: "column",
              padding: ".3rem",
              paddingX: "1rem",
              cursor: "pointer",
              // boxShadow: '  #bfbfbf 0px 3px 8px;',
              // marginLeft: '.7rem',
            }}
          >
            <Typography fontWeight="bold">Total Sale Price</Typography>
            <hr />
            <Typography>₹{query?.data?.TotalSalesPrice}</Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "	#d9d9d9 ",
              display: "inline-flex",
              textAlign: "center",
              flexDirection: "column",
              padding: ".3rem",
              paddingX: "1rem",
              cursor: "pointer",
            }}
          >
            <Typography fontWeight="bold">Total discount </Typography>
            <hr />

            <Typography>₹ {(+newTotalDiscount).toFixed(0)}</Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "	#d9d9d9 ",
              display: "inline-flex",
              textAlign: "center",
              flexDirection: "column",
              padding: ".3rem",
              paddingX: "1rem",
              cursor: "pointer",
            }}
          >
            <Typography fontWeight="bold">Total Landing Cost </Typography>
            <hr />

            <Typography>
              ₹ {(+query?.data?.TotalLandingCost).toFixed(0)}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "	#d9d9d9 ",
              display: "inline-flex",
              textAlign: "center",
              flexDirection: "column",
              padding: ".3rem",
              paddingX: "1rem",
              cursor: "pointer",
            }}
          >
            <Typography fontWeight="bold">Previous Total Profit </Typography>
            <hr />

            <Typography>{query?.data?.TotalPrevProfit} %</Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "	#d9d9d9 ",
              display: "inline-flex",
              textAlign: "center",
              flexDirection: "column",
              padding: ".3rem",
              paddingX: "1rem",
              cursor: "pointer",
            }}
          >
            <Typography fontWeight="bold">Current Total Profit </Typography>
            <hr />

            <Typography>
              {query?.data?.CurentTotalProfit
                ? +query?.data?.CurentTotalProfit
                : newFinalDiscountPer}{" "}
              %
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "	#d9d9d9 ",
              display: "inline-flex",
              textAlign: "center",
              flexDirection: "column",
              padding: ".3rem",
              paddingX: "1rem",
              cursor: "pointer",
            }}
          >
            <Typography fontWeight="bold">
              After Discount Total Price{" "}
            </Typography>
            <hr />

            <Typography>
              {afterDiscount ? "₹ " + (+afterDiscount).toFixed(0) : ""}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/*  */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",

          marginTop: ".5rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",

            justifyContent: "space-around",

            height: "5rem",
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

        <Box
          sx={{
            // flexBasis: '20%',
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <Button
              disabled={query?.data?.NewOfferData.length > 0 ? true : false}
              variant="contained"
              color="success"
              onClick={handleSubmit}
            >
              Send
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            // flexBasis: '40%',
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <TextField
            label="Customer Name"
            variant="standard"
            value={query?.data?.CustomerName || ""}
            inputProps={{ readOnly: true }}
          />
          <TextField
            label="Mobile No"
            variant="standard"
            value={query?.data?.MobileNo || ""}
            inputProps={{ readOnly: true }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDiscountQuery;
