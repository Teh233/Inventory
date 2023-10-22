import React, { useEffect, useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  Button,
  Box,
  styled,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useUpdateProductsColumnMutation } from "../../../features/api/productApiSlice";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import { toast } from "react-toastify";

const StyledCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? " #0d0d0d" : "#eee",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
  // Apply violet background color to specific columns
  "&.violet-bg": {
    backgroundColor: "#93C54B",
  },
  "&.blue-bg": {
    backgroundColor: "#606CF2",
  },
}));

const UpdateLiveCalcDialog = ({
  open,
  setOpen,
  data,
  userInfo,
  refetch,
  type,
}) => {
  // Initialization
  const socket = useSocket();

  // Local state
  const [localData, setLocalData] = useState([...data]);

  // RTK query
  const [updateProductsApi, { isLoading: updateProductLoading }] =
    useUpdateProductsColumnMutation();

  // useEffect
  useEffect(() => {
    const newLocalData = data.map((item) => {
      const withoutTaxSalesProfit = (
        ((item.SalesPrice - item.LandingCost) /
          (item.LandingCost * (1 + item.SalesTax / 100))) *
        100
      ).toFixed(2);

      const withoutTaxSellerProfit = (
        ((item.SellerPrice - item.LandingCost) /
          (item.LandingCost * (1 + item.SellerTax / 100))) *
        100
      ).toFixed(2);

      return {
        ...item,
        ProfitSales: withoutTaxSalesProfit,
        ProfitSeller: withoutTaxSellerProfit,
        actualSalesProfit: item.ProfitSales,
        actualSellerProfit: item.ProfitSeller,
      };
    });

    setLocalData(newLocalData);
  }, [data]);

  // Handlers
  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    try {
      // Changed values
      const updatedSalesTax = [];
      const updatedSalesPrice = [];
      const updatedSellerTax = [];
      const updatedSellerPrice = [];

      if (type === "Sales") {
        data.forEach((item, i) => {
          const newSalesTax = +localData[i].SalesTax || 0;
          const newSalesPrice = +localData[i].SalesPrice || 0;
          if (+item.SalesTax !== newSalesTax) {
            updatedSalesTax.push({ SKU: item.SKU, value: newSalesTax });
          }
          if (+item.SalesPrice !== newSalesPrice) {
            updatedSalesPrice.push({ SKU: item.SKU, value: newSalesPrice });
          }
        });

        if (updatedSalesPrice.length) {
          const params = {
            type: "SalesPrice",
            body: { products: updatedSalesPrice },
          };

          const res = await updateProductsApi(params).unwrap();
          const liveStatusData = {
            message: `${userInfo.name} updated SalesPrice of ${updatedSalesPrice
              .map((product) => `${product.SKU} to ${product.value}`)
              .join(", ")} `,
            time: new Date().toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          };
          socket.emit("liveStatusServer", liveStatusData);
          toast.success("SalesPrice updated successfully");
        }
        if (updatedSalesTax.length) {
          const params = {
            type: "SalesTax",
            body: { products: updatedSalesTax },
          };

          const res = await updateProductsApi(params).unwrap();
          const liveStatusData = {
            message: `${userInfo.name} updated SalesTax of ${updatedSalesTax
              .map((product) => `${product.SKU} to ${product.value}`)
              .join(", ")} `,
            time: new Date().toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          };
          socket.emit("liveStatusServer", liveStatusData);
          toast.success("SalesTax updated successfully");
        }

        if (updatedSalesPrice.length || updatedSalesTax.length) {
          refetch();
        }
        setOpen(false);
      }

      if (type === "Seller") {
        data.forEach((item, i) => {
          const newSellerTax = +localData[i].SellerTax || 0;
          const newSellerPrice = +localData[i].SellerPrice || 0;
          if (+item.SellerTax !== newSellerTax) {
            updatedSellerTax.push({ SKU: item.SKU, value: newSellerTax });
          }
          if (+item.SellerPrice !== newSellerPrice) {
            updatedSellerPrice.push({ SKU: item.SKU, value: newSellerPrice });
          }
        });

        if (updatedSellerPrice.length) {
          const params = {
            type: "SellerPrice",
            body: { products: updatedSellerPrice },
          };

          const res = await updateProductsApi(params).unwrap();
          const liveStatusData = {
            message: `${
              userInfo.name
            } updated SellerPrice of ${updatedSellerPrice
              .map((product) => `${product.SKU} to ${product.value}`)
              .join(", ")} `,
            time: new Date().toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          };
          socket.emit("liveStatusServer", liveStatusData);
          toast.success("SellerPrice updated successfully");
        }
        if (updatedSellerTax.length) {
          const params = {
            type: "SellerTax",
            body: { products: updatedSellerTax },
          };

          const res = await updateProductsApi(params).unwrap();
          const liveStatusData = {
            message: `${userInfo.name} updated SalesTax of ${updatedSellerTax
              .map((product) => `${product.SKU} to ${product.value}`)
              .join(", ")} `,
            time: new Date().toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          };
          socket.emit("liveStatusServer", liveStatusData);
          toast.success("SellerTax updated successfully");
        }
      }
      if (
        updatedSalesPrice.length ||
        updatedSalesTax.length ||
        updatedSellerPrice.length ||
        updatedSellerTax.length
      ) {
        refetch();
      }
      setOpen(false);
    } catch (e) {
      console.error("An error occurred Update Price Grid:");
      console.error(e);
    }
  };

  const handleChange = (e, sku) => {
    const { value, name } = e.target;

    // Updating the values
    setLocalData((prevData) => {
      return prevData.map((data) => {
        if (sku === data.SKU) {
          // SalesTax Change
          if (name === "SalesTax") {
            const salesPriceByProfitPer =
              (+data.LandingCost || 0) * (1 + +data.ProfitSales / 100);

            const profitValue =
              (+salesPriceByProfitPer || 0) - (+data.LandingCost || 0);
            const taxProfitValue = (profitValue / 100) * (value || 0);
            const newSalesPrice = Math.round(
              taxProfitValue + salesPriceByProfitPer
            );

            const newActualSalesProfit = (
              ((newSalesPrice - +data.LandingCost) / +data.LandingCost) *
              100
            ).toFixed(2);
            return {
              ...data,
              [name]: value,
              SalesPrice: newSalesPrice,
              actualSalesProfit: newActualSalesProfit,
            };
          }
          // ProfitSales Change
          if (name === "ProfitSales") {
            const salesPriceByProfitPer =
              (+data.LandingCost || 0) * (1 + +value / 100);
            const profitValue =
              (+salesPriceByProfitPer || 0) - (+data.LandingCost || 0);
            const taxProfitValue = (profitValue / 100) * (+data.SalesTax || 0);
            const newSalesPrice = Math.round(
              taxProfitValue + salesPriceByProfitPer
            );
            const newActualSalesProfit = (
              ((newSalesPrice - +data.LandingCost) / +data.LandingCost) *
              100
            ).toFixed(2);
            return {
              ...data,
              [name]: value,
              SalesPrice: newSalesPrice,
              actualSalesProfit: newActualSalesProfit,
            };
          }

          // SalesPrice Change
          if (name === "SalesPrice") {
            const withoutTaxSalesProfit = Math.round(
              ((+value - +data.LandingCost) /
                (+data.LandingCost * (1 + +data.SalesTax / 100))) *
                100
            );
            const newActualSalesProfit = (
              ((+value - +data.LandingCost) / +data.LandingCost) *
              100
            ).toFixed(2);
            return {
              ...data,
              [name]: value,
              ProfitSales: withoutTaxSalesProfit,
              actualSalesProfit: newActualSalesProfit,
            };
          }

          // SellerTax Change
          if (name === "SellerTax") {
            const sellerPriceByProfitPer =
              (+data.LandingCost || 0) * (1 + +data.ProfitSeller / 100);

            const profitValue =
              (+sellerPriceByProfitPer || 0) - (+data.LandingCost || 0);
            const taxProfitValue = (profitValue / 100) * (value || 0);
            const newSellerPrice = Math.round(
              taxProfitValue + sellerPriceByProfitPer
            );

            const newActualSellerProfit = (
              ((newSellerPrice - +data.LandingCost) / +data.LandingCost) *
              100
            ).toFixed(2);

            return {
              ...data,
              [name]: value,
              SellerPrice: newSellerPrice,
              actualSellerProfit: newActualSellerProfit,
            };
          }

          // ProfitSeller Change
          if (name === "ProfitSeller") {
            const sellerPriceByProfitPer =
              (+data.LandingCost || 0) * (1 + +value / 100);

            const profitValue =
              (+sellerPriceByProfitPer || 0) - (+data.LandingCost || 0);
            const taxProfitValue = (profitValue / 100) * (+data.SellerTax || 0);
            const newSellerPrice = Math.round(
              taxProfitValue + sellerPriceByProfitPer
            );

            const newActualSellerProfit = (
              ((newSellerPrice - +data.LandingCost) / +data.LandingCost) *
              100
            ).toFixed(2);

            return {
              ...data,
              [name]: value,
              SellerPrice: newSellerPrice,
              actualSellerProfit: newActualSellerProfit,
            };
          }

          // SalesPrice Change
          if (name === "SellerPrice") {
            const withoutTaxSellerProfit = (
              ((+value - +data.LandingCost) /
                (+data.LandingCost * (1 + +data.SellerTax / 100))) *
              100
            ).toFixed(2);

            const newActualSellerProfit = (
              ((+value - +data.LandingCost) / +data.LandingCost) *
              100
            ).toFixed(2);
            return {
              ...data,
              [name]: value,
              ProfitSeller: withoutTaxSellerProfit,
              actualSellerProfit: newActualSellerProfit,
            };
          }
        } else {
          return data;
        }
      });
    });

    // Updating the correlated value
    if (name === "SalesTax") {
      // Handle SalesTax change if needed
    }
  };

  // Columns
  const generateColumns = () => {
    let visibleColumns = [
      { field: "Sno", headerName: "S.No" },
      { field: "SKU", headerName: "SKU" },
      { field: "Name", headerName: "Product" },
      { field: "Quantity", headerName: "Quantity" },
      { field: "LandingCost", headerName: "Landing Cost ₹", preFix: "₹" },
      { field: "GST", headerName: "GST %", preFix: "%" },
    ];

    if (type === "Sales") {
      visibleColumns = [
        ...visibleColumns,
        {
          field: "actualSalesProfit",
          headerName: "Sales Profit %",
          preFix: "%",
          className: "violet-bg",
        },
        {
          field: "ProfitSales",
          headerName: "Sales Profit with Tax %",
          input: true,
          preFix: "%",
          className: "violet-bg",
        },
        {
          field: "SalesTax",
          headerName: "Tax %",
          input: true,
          preFix: "%",
          // Apply violet background color to this column header
          className: "violet-bg",
        },
        {
          field: "SalesPrice",
          headerName: "Sales Price ₹",
          input: true,
          preFix: "₹",
          // Apply violet background color to this column header
          className: "violet-bg",
        },

        {
          field: "SalesPriceWithGst",
          headerName: "Sales Price Inclu (GST) ₹",
          preFix: "₹",
          className: "violet-bg",
        },
      ];
    } else if (type === "Seller") {
      visibleColumns = [
        ...visibleColumns,
        {
          field: "actualSellerProfit",
          headerName: "Seller Profit %",
          preFix: "%",
          className: "blue-bg",
        },
        {
          field: "ProfitSeller",
          headerName: "Seller Profit with Tax %",
          input: true,
          preFix: "%",
          className: "blue-bg",
        },
        {
          field: "SellerTax",
          headerName: "Tax %",
          input: true,
          preFix: "%",
          // Apply violet background color to this column header
          className: "blue-bg",
        },
        {
          field: "SellerPrice",
          headerName: "Seller Price ₹",
          input: true,
          preFix: "₹",
          className: "blue-bg",
          // Apply violet background color to this column header
        },
        {
          field: "SellerPriceWithGst",
          headerName: "Seller Price Inclu (GST) %",
          preFix: "₹",
          className: "blue-bg",
        },
        {
          field: "actualSalesProfit",
          headerName: "Sales Profit %",
          preFix: "%",
          className: "violet-bg",
        },
        {
          field: "ProfitSales",
          headerName: "Sales Profit with Tax %",
          preFix: "%",
          className: "violet-bg",
        },
        {
          field: "SalesTax",
          headerName: "Sales Tax  %",
          preFix: "%",
          className: "violet-bg",
        },
        {
          field: "SalesPrice",
          headerName: "Sales Price ₹",
          preFix: "₹",
          className: "violet-bg",
        },
        {
          field: "SalesPriceWithGst",
          headerName: "Sales Price Inclu (GST) %",
          preFix: "₹",
          className: "violet-bg",
        },
      ];
    }

    return visibleColumns;
  };

  const columns = generateColumns();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          color: "white",
          backgroundColor: "#4d4dff",
        }}
      >
        <DialogTitle>{`Update ${type} Live Calculation`}</DialogTitle>
      </Box>
      <DialogContent>
        <TableContainer sx={{ maxHeight: "60vh" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <StyledCell
                    sx={{
                      fontSize: ".8rem",
                      textAlign: "center",
                    }}
                    // Check for the "violet-bg" class and apply it to the header cell
                    className={column.className}
                    key={column.field}
                  >
                    {column.headerName}
                  </StyledCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {localData.map((item, index) => {
                return (
                  <TableRow key={item.SKU}>
                    <TableCell sx={{ fontSize: ".8rem", textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
                    {columns.slice(1).map((column, index) => {
                      if (column.input) {
                        return (
                          <TableCell
                            key={index}
                            sx={{
                              fontSize: ".8rem",
                              textAlign: "center",
                              minWidth: "99px",
                            }}
                          >
                            <TextField
                              type="number"
                              name={column.field}
                              sx={{
                                "& input": {
                                  width: "60px",
                                  height: "25px",
                                  padding: "4px",
                                  borderRadius: "6px",
                                },
                              }}
                              value={item[column.field]}
                              onChange={(e) => {
                                handleChange(e, item.SKU);
                              }}
                              InputProps={{
                                // endAdornment: (
                                //   <InputAdornment position="start">
                                //     {column.preFix || ""}
                                //   </InputAdornment>
                                // ),
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {column.preFix || ""}
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </TableCell>
                        );
                      } else if (column.field === "SalesPriceWithGst") {
                        return (
                          <TableCell
                            key={index}
                            sx={{ fontSize: ".8rem", textAlign: "center" }}
                          >
                            {Math.round(
                              +item.SalesPrice +
                                (item.GST / 100) * item.SalesPrice
                            )}{" "}
                            {column.preFix ? column.preFix : ""}
                          </TableCell>
                        );
                      } else if (column.field === "SellerPriceWithGst") {
                        return (
                          <TableCell
                            key={index}
                            sx={{ fontSize: ".8rem", textAlign: "center" }}
                          >
                            {Math.round(
                              +item.SellerPrice +
                                (item.GST / 100) * item.SellerPrice
                            )}
                            {" "}
                            {column.preFix ? column.preFix : ""}
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell
                          key={index}
                          sx={{ fontSize: ".8rem", textAlign: "center" }}
                        >
                          {item[column.field]}
                          {" "}
                          {column.preFix ? column.preFix : ""}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleUpdate} color="primary">
          {updateProductLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit"
          )}
        </Button>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateLiveCalcDialog;
