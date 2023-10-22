import InputAdornment from "@mui/material/InputAdornment";
import React, { useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import noDataFound from "../../../assets/error.gif";
import {
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  styled,
  Select,
  InputLabel,
  MenuItem,
  Button,
  FormControl,
  Typography,
  Collapse,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import {
  useVerifyBarcodeForDispatchMutation,
  useDispatchBarcodeInBulkMutation,
  useVerifyBarcodeForReturnMutation,
  useReturnBarcodeInBulkMutation,
  useBarcodeForRejectionMutation,
} from "../../../features/api/barcodeApiSlice";
import { useState } from "react";
import noImage from "../../../assets/NoImage.jpg";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import { useSelector, useDispatch } from "react-redux";
import SalesHistoryDialbox from "./SalesHistoryDialbox";
import { setCustomerInfo } from "../../../features/slice/productSlice";
import InfoIcon from "@mui/icons-material/Info";
import Loading from "../../../components/Common/Loading";

// custom styles
const useStyles = makeStyles({
  tableContainer: {
    maxWidth: "100%",
  },
});

const StyleCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  padding: 10,
}));
//DataStyle
const StyleCellData = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  fontSize: "12px",
}));
const Dispatch_Return_Grid = () => {
  /// initialize
  const socket = useSocket();
  const classes = useStyles();
  const textFieldRef = useRef(null);

  let value = useSelector((state) => state.product.customerInfo);

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  /// local state
  const [selectedOptionColor, setSelectedOptionColor] = useState({
    color: "",
    text: "Return",
    text2: "Returned",
  });

  const [rows, setRows] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [image, setImage] = useState("");
  const [selectedOption, setSelectedOption] = useState("Dispatch");
  const [expandedSubCells, setExpandedSubCells] = useState({});
  const [openStates, setOpenStates] = useState(rows.map(() => false));
  const [openDial, setOpenDial] = useState(false);

  /// rtk query
  const [verifyBarcodeApi, { isLoading: verifyDispatchLoading }] =
    useVerifyBarcodeForDispatchMutation();
  const [dispatchBarcodeApi, { isLoading: dispatchLoading }] =
    useDispatchBarcodeInBulkMutation();

  const [verifyReturnApi, { isLoading: verifyReturnLoading }] =
    useVerifyBarcodeForReturnMutation();

  const [returnBarcodeApi, { isLoading: returnLoading }] =
    useReturnBarcodeInBulkMutation();

  const [barcodeRejectApi, { isLoading: barcodeRejectLoading }] =
    useBarcodeForRejectionMutation();

  /// handlers
  const handleRowRemove = (indexToRemove) => {
    setRows((prevRows) =>
      prevRows.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleOpenDialog = () => {
    setOpenDial(true);
  };

  const dispatch = useDispatch();

  // Helper function to check if an object with the same SKU exists in the rows array
  const isBarcodeAlreadyExists = (rows, serialNumber) => {
    return rows.some((row) => row.serialNumber === serialNumber);
  };

  function groupBySKU(products) {
    const skuMap = {};

    products.forEach((product) => {
      const { SKU, serialNumber } = product;

      if (skuMap[SKU]) {
        skuMap[SKU].Sno.push(serialNumber);
      } else {
        skuMap[SKU] = { SKU, Sno: [serialNumber] };
      }
    });

    return Object.values(skuMap);
  }
  const handleChangeBarcode = async (e) => {
    setBarcode(e.target.value);

    if (e.target.value.length === 16) {
      try {
        const params = { Sno: e.target.value };
        const isExist = rows.some((item) => item.serialNumber === params.Sno);

        if (isExist) {
          toast.error("Product already exists");
          setBarcode("");
          return;
        }

        if (selectedOption === "Dispatch") {
          const res = await verifyBarcodeApi(params).unwrap();

          if (res.status === "success") {
            const { barcode, product } = res.data;
            setImage(product.mainImage?.lowUrl);
            const newRow = { ...barcode, ...product };
            setBarcode("");

            if (!isBarcodeAlreadyExists(rows, newRow.serialNumber)) {
              setRows((prevRows) => [...prevRows, newRow]);
              setBarcode("");
            }
          }
        } else if (selectedOption === "Return") {
          const res = await verifyReturnApi(params).unwrap();

          if (res.status === "success") {
            const { barcode, product } = res.data;

            setImage(product?.mainImage?.lowUrl);
            const newRow = { ...barcode, ...product };
            setBarcode("");
            if (!isBarcodeAlreadyExists(rows, newRow.serialNumber)) {
              setRows((prevRows) => [...prevRows, newRow]);
              setBarcode("");
            }
          }
        } else if (selectedOption === "Reject") {
          const res = await barcodeRejectApi(params).unwrap();

          if (res.status === "success") {
            const { barcode, product } = res.data;

            setImage(product?.mainImage?.lowUrl);
            const newRow = { ...barcode, ...product };
            setBarcode("");
            if (!isBarcodeAlreadyExists(rows, newRow.serialNumber)) {
              setRows((prevRows) => [...prevRows, newRow]);
              setBarcode("");
            }
          }
        }
      } catch (error) {
        console.error("An error occur #248f24 Dispatch return:", error);
        setBarcode("");
        Swal.fire({
          icon: "error",
          title: "Barcode Product Not Found",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          timer: 700,
        });
      }
    }
  };

  useEffect(() => {
    if (selectedOption === "Dispatch") {
      handleOpenDialog(true);
      // dispatch(setCustomerInfo({}));
    }
  }, [setSelectedOption, selectedOption]);

  const handleRowClick = (index) => {
    const updatedOpenStates = [...openStates];
    updatedOpenStates[index] = !updatedOpenStates[index];
    setOpenStates(updatedOpenStates);
  };

  // New function to handle expanding/collapsing of sub-cells
  const handleSubCellExpand = (rowId, subIndex) => {
    setExpandedSubCells((prevExpandedSubCells) => ({
      ...prevExpandedSubCells,
      [rowId]: {
        ...prevExpandedSubCells[rowId],
        [subIndex]: !prevExpandedSubCells[rowId]?.[subIndex],
      },
    }));
  };

  // handel submit function
  const handleSubmit = async () => {
    if (selectedOption === "Dispatch") {
      if (Object.keys(value).length === 0) {
        handleOpenDialog();
        return;
      }

      if (rows.length <= 0) {
        toast.error("Please provide a barcode before submitting");
        return;
      }

      try {
        const data = groupBySKU(rows);
        const params = {
          CustomerName: value.CustomerName,
          MobileNo: +value.MobileNo,
          InvoiceNo: value.InvoiceNo,
          barcodes: data,
        };

        const res = await dispatchBarcodeApi(params).unwrap();

        const resultMessages = params.barcodes.map((barcode) => {
          const sku = barcode.SKU;
          const numProducts = barcode.Sno?.length || 0;
          const productsText = numProducts > 1 ? "Products" : "Product";
          return `Dispatched ${numProducts} ${productsText} of ${sku}`;
        });

        const liveStatusData = {
          message: `${userInfo.name} ${resultMessages.join(", ")}`,
          time: new Date().toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        };
        socket.emit("liveStatusServer", liveStatusData);

        setRows([]);
        setImage("");
        setBarcode("");
        dispatch(setCustomerInfo({}));

        Swal.fire({
          icon: "success",
          title: "Product Dispatched Successfully",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          timer: 700,
        });
      } catch (error) {
        console.error("An error occurred during dispatch:", error);
        Swal.fire({
          icon: "error",
          title: "Barcode Product Not Found",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          timer: 700,
        });

        setRows([]);
        setImage("");
        setBarcode("");
        value = {}; // This line might not be necessary
      }
    }
    if (selectedOption === "Return") {
      try {
        if (rows.length <= 0) {
          toast.error("Please provide a barcode before submitting");
          return;
        }
        const data = groupBySKU(rows);

        const params = { barcodes: data };

        const res = await returnBarcodeApi(params).unwrap();
        const result = params.barcodes
          .map((barcode) => {
            const sku = barcode.SKU;
            const numProducts = barcode?.Sno?.length;
            const productsText = numProducts > 1 ? "Products" : "Product";
            return `Returned ${numProducts} ${productsText} of ${sku}`;
          })
          .join(", ");
        const liveStatusData = {
          message: `${userInfo.name}   ${result} `,
          time: new Date().toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        };
        socket.emit("liveStatusServer", liveStatusData);
        setRows([]);
        setImage("");
        setBarcode("");
        Swal.fire({
          icon: "success",
          title: "Product Returned Successfully",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          timer: 700,
        });
      } catch (error) {
        console.error("An error occur #248f24 Dispatch return:", error);
        Swal.fire({
          icon: "error",
          title: "Barcode Product Not Found",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          timer: 700,
        });
        setRows([]);
        setImage("");
      }
    }
  };

  // for loadin on submit buttton
  const isLoading = dispatchLoading || returnLoading || barcodeRejectLoading;

  const handleSelectChange = (event) => {
    if (event.target.value === "Reject") {
      window.alert(
        "Once Barcode is rejected it will never be able to  sticked again"
      );
    }
    setRows([]);
    setImage("");
    setSelectedOption(event.target.value);
    // console.log(event.target.value);
    const color = event.target.value === "Dispatch" ? " #248f24" : " #990000";
    const text = event.target.value === "Dispatch" ? "Return" : " Dispatch ";
    const text2 =
      event.target.value === "Dispatch" ? "Returned" : " Dispatched ";
    setSelectedOptionColor({ color: color, text: text, text2: text2 });
  };

  const timeOptions = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    // second: "numeric",
  };
  // console.log(rows?.data?.barcode?.sub);
  useEffect(() => {
    textFieldRef.current.focus();
  }, [handleSelectChange]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "91.3vh",
      }}
    >
      {openDial && (
        <SalesHistoryDialbox open={openDial} setOpen={setOpenDial} />
      )}

      <Box
        spacing={3}
        sx={{
          display: "grid",
          gridTemplateColumns: "20% 58% 10%",
          margin: ".9rem",
        }}
      >
        <Box>
          <FormControl>
            <Box sx={{ textAlign: "center" }}>
              <InputLabel htmlFor="select-input">Select </InputLabel>
              <Select
                labelId="select-input"
                id="select-input"
                label="Select"
                value={selectedOption}
                onChange={handleSelectChange}
                sx={{ width: "20rem", mb: 2 }}
              >
                <MenuItem value="Dispatch">Dispatch</MenuItem>
                <MenuItem value="Return">Return</MenuItem>
                <MenuItem value="Reject">Reject</MenuItem>
              </Select>
            </Box>
          </FormControl>
          <Box>
            {/* <Box
              sx={{
                backgroundColor: ' #66666666',
                color: ' #fff',
                padding: '1rem',
                boxShadow: ' 0 3px 10px rgb(0,0,0,0.2)',
              }}
            >
              <Typography variant='span' color='black' fontWeight='bold'>
                {' '}
                Note :
              </Typography>
              <Typography fontWeight='600' sx={{ color: '#737373' }}>
                {' '}
                {`Please Select ${selectedOptionColor.text} Status from the Dropdown for ${selectedOptionColor.text2} Products`}
              </Typography>
            </Box> */}
            <Typography color="red" sx={{ fontSize: "18px" }} variant="span">
              Note:{" "}
              <Typography
                color="black"
                sx={{ fontSize: "15px" }}
                variant="span"
              >
                {" "}
                {`Please Select ${selectedOptionColor.text} Status from the Dropdown for ${selectedOptionColor.text2} Products`}
              </Typography>{" "}
            </Typography>
          </Box>
        </Box>

        {/* search bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <TextField
            id="filled basic"
            placeholder="Enter barcode. NO"
            disabled={selectedOption ? false : true}
            inputRef={textFieldRef}
            variant="outlined"
            value={barcode}
            onChange={handleChangeBarcode}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{}} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "60%",
              justifySelf: "center",
              "& input": { height: "15px" },
            }}
          />
          <Box sx={{ width: "80%" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bolder",
                fontSize: "1.2rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "wrap",
                maxWidth: "100%",
                textAlign: "center",
              }}
            >
              {rows?.length > 0 ? rows[rows?.length - 1].Name : ""}
            </Typography>
          </Box>

          {selectedOption === "Reject" ? (
            ""
          ) : (
            // <Button
            //   sx={{}}
            //   disabled={rows.length ? false : true}
            //   onClick={handleSubmit}
            //   variant="contained"
            // >
            //   Submit
            // </Button>
            <Button
              sx={{}}
              disabled={
                isLoading || (selectedOption === "Reject" && !rows?.length)
              }
              onClick={handleSubmit}
              variant="contained"
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          )}
        </Box>
        {/* dropdown */}
        <Box>
          <Paper
            elevation={10}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "15rem",
              height: "12rem",
            }}
          >
            <img
              src={image ? image : noImage}
              alt="No image available"
              style={{
                objectFit: "fill",
                objectPosition: "center",
                width: "100%",
                height: "100%",
              }}
            />
          </Paper>
        </Box>
      </Box>
      {Object.keys(value)?.length > 0 && selectedOption === "Dispatch" && (
        <Box
          sx={{
            marginTop: "10px",
            backgroundColor: " #6666",

            padding: 1,
            boxShadow: " 0 3px 10px rgb(0,0,0,0.2)",
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexBasis: "30%",
            }}
          >
            <Typography variant="span" color="black" fontWeight="bold">
              Invoice No:{" "}
            </Typography>
            <Typography sx={{ color: " #4d4d4d" }}>
              {value.InvoiceNo}{" "}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexBasis: "30%",
            }}
          >
            <Typography variant="span" color="black" fontWeight="bold">
              Name:
            </Typography>
            <Typography sx={{ color: " #4d4d4d" }}>
              {" "}
              {value.CustomerName}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexBasis: "30%",
            }}
          >
            <Typography variant="span" color="black" fontWeight="bold">
              Mobile No:{" "}
            </Typography>
            <Typography sx={{ color: " #4d4d4d" }}>
              {" "}
              {value.MobileNo === 0 ? "N/A" : value.MobileNo}
            </Typography>
          </Box>
        </Box>
      )}
      <TableContainer
        component={Paper}
        className={classes.tableContainer}
        sx={{ overflowY: "auto", maxHeight: "500px" }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyleCell
                sx={{
                  backgroundColor:
                    selectedOption === "Dispatch"
                      ? " #248f24"
                      : selectedOptionColor.color === " #990000" &&
                        selectedOption === "Return"
                      ? " #990000"
                      : selectedOption === "Reject"
                      ? "#000000"
                      : "transparent",
                  color: "#fff",
                }}
              >
                SNO.
              </StyleCell>
              <StyleCell
                sx={{
                  backgroundColor:
                    selectedOption === "Dispatch"
                      ? " #248f24"
                      : selectedOptionColor.color === " #990000" &&
                        selectedOption === "Return"
                      ? " #990000"
                      : selectedOption === "Reject"
                      ? "#000000"
                      : "transparent",
                  color: "#fff",
                }}
              >
                SKU
              </StyleCell>
              <StyleCell
                sx={{
                  backgroundColor:
                    selectedOption === "Dispatch"
                      ? " #248f24"
                      : selectedOptionColor.color === " #990000" &&
                        selectedOption === "Return"
                      ? " #990000"
                      : selectedOption === "Reject"
                      ? "#000000"
                      : "transparent",
                  color: "#fff",
                }}
              >
                {selectedOption === "Dispatch"
                  ? "Created Date"
                  : "Dispatched Date"}
              </StyleCell>
              <StyleCell
                sx={{
                  backgroundColor:
                    selectedOption === "Dispatch"
                      ? " #248f24"
                      : selectedOptionColor.color === " #990000" &&
                        selectedOption === "Return"
                      ? " #990000"
                      : selectedOption === "Reject"
                      ? "#000000"
                      : "transparent",
                  color: "#fff",
                }}
              >
                Barcode Number
              </StyleCell>
              <StyleCell
                sx={{
                  backgroundColor:
                    selectedOption === "Dispatch"
                      ? " #248f24"
                      : selectedOptionColor.color === " #990000" &&
                        selectedOption === "Return"
                      ? " #990000"
                      : selectedOption === "Reject"
                      ? "#000000"
                      : "transparent",
                  color: "#fff",
                }}
              >
                Name
              </StyleCell>
              <StyleCell
                sx={{
                  backgroundColor:
                    selectedOption === "Dispatch"
                      ? " #248f24"
                      : selectedOptionColor.color === " #990000" &&
                        selectedOption === "Return"
                      ? " #990000"
                      : selectedOption === "Reject"
                      ? "#000000"
                      : "transparent",
                  color: "#fff",
                }}
              >
                Brand
              </StyleCell>
              <StyleCell
                sx={{
                  backgroundColor:
                    selectedOption === "Dispatch"
                      ? " #248f24"
                      : selectedOptionColor.color === " #990000" &&
                        selectedOption === "Return"
                      ? " #990000"
                      : selectedOption === "Reject"
                      ? "#000000"
                      : "transparent",
                  color: "#fff",
                }}
              >
                Weight
              </StyleCell>
              <StyleCell
                sx={{
                  backgroundColor:
                    selectedOption === "Dispatch"
                      ? " #248f24"
                      : selectedOptionColor.color === " #990000" &&
                        selectedOption === "Return"
                      ? " #990000"
                      : selectedOption === "Reject"
                      ? "#000000"
                      : "transparent",
                  color: "#fff",
                }}
              >
                Serial No
              </StyleCell>
              <StyleCell
                sx={{
                  backgroundColor:
                    selectedOption === "Dispatch"
                      ? " #248f24"
                      : selectedOptionColor.color === " #990000" &&
                        selectedOption === "Return"
                      ? " #990000"
                      : selectedOption === "Reject"
                      ? "#000000"
                      : "transparent",
                  color: "#fff",
                }}
              >
                Remove
              </StyleCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {verifyDispatchLoading || verifyReturnLoading ? (
              <Loading loading={true} />
            ) : null}
            {rows?.length > 0 ? (
              rows.map((row, index) => (
                <>
                  <TableRow key={index}>
                    <StyleCellData>
                      <Box
                        sx={{
                          display: "flex",
                          justifyItems: "center",
                          alignItems: "center",
                        }}
                      >
                        {index + 1}
                        {(selectedOption === "Return" ||
                          (selectedOption === "Dispatch" &&
                            row?.sub &&
                            Object.keys(row?.sub)?.length > 0)) && (
                          <Tooltip
                            title="Click for more details"
                            placement="top"
                          >
                            <InfoIcon
                              sx={{
                                cursor: "pointer",
                                fontSize: "20px",
                                marginLeft: "10px",
                                "& :hover": { color: "blue" },
                              }}
                              onClick={() => handleRowClick(index)}
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </StyleCellData>
                    <StyleCellData>{row.SKU}</StyleCellData>
                    <StyleCellData>
                      {new Date(
                        row?.createdAt || row?.dispatchedAt
                      ).toLocaleString("en-US", timeOptions)}
                    </StyleCellData>
                    <StyleCellData>{row.serialNumber}</StyleCellData>
                    <StyleCellData>{row.Name}</StyleCellData>
                    <StyleCellData>{row.Brand}</StyleCellData>
                    <StyleCellData>{row.Weight}</StyleCellData>
                    <StyleCellData>{row.serialNumber.slice(-3)}</StyleCellData>
                    <StyleCellData>
                      <DeleteIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRowRemove(index)}
                      />

                      {/* {row.sub && row.sub.length > 0 && (
                        <IconButton
                          style={{
                            cursor: "pointer",
                            marginLeft: "20px",
                            marginBottom: "10px",
                            padding: "5px",
                          }}
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleRowClick(index)}
                        >
                          {openStates[index] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      )} */}
                    </StyleCellData>
                  </TableRow>
                  {openStates[index] && (
                    <TableRow>
                      <StyleCellData
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={12}
                      >
                        <Collapse
                          in={openStates[index]}
                          timeout="auto"
                          unmountOnExit
                        >
                          {/* Render sub-data here */}
                          <Box
                            sx={{ paddingY: "5px", backgroundColor: "#eee" }}
                          >
                            {selectedOption === "Return" && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  borderBottom: "1px dashed black",
                                  marginBottom: "5px",
                                }}
                              >
                                {" "}
                                <Typography>
                                  <span style={{ fontWeight: "bold" }}>
                                    {" "}
                                    Invoice No:{" "}
                                  </span>{" "}
                                  {rows[index]?.Invoice}
                                </Typography>{" "}
                                <Typography>
                                  <span style={{ fontWeight: "bold" }}>
                                    {" "}
                                    Customer Name:{" "}
                                  </span>{" "}
                                  {rows[index]?.CustomerName}
                                </Typography>{" "}
                                <Typography>
                                  <span style={{ fontWeight: "bold" }}>
                                    {" "}
                                    Mobile No:{" "}
                                  </span>
                                  {rows[index]?.MobileNo === 0
                                    ? "N/A"
                                    : rows[index]?.MobileNo}{" "}
                                </Typography>{" "}
                              </Box>
                            )}
                            {row?.sub && Object.keys(row?.sub)?.length > 0 && (
                              <Box
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {Object.entries(row?.sub).map(
                                  ([key, value]) => (
                                    <Box
                                      key={key}
                                      style={{ marginRight: "20px" }}
                                    >
                                      <span style={{ fontWeight: "bold" }}>
                                        {key}:
                                      </span>{" "}
                                      {value}{" "}
                                    </Box>
                                  )
                                )}
                              </Box>
                            )}
                          </Box>
                        </Collapse>
                      </StyleCellData>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <>
                <Box
                  sx={{
                    // border: '2px solid blue',

                    position: "absolute",
                    top: "70%",
                    left: "55%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      width: "200px",
                      height: "200px",
                    }}
                  >
                    <img
                      src={noDataFound}
                      alt=""
                      style={{ width: "100px", height: "100px" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    >
                      No data found !
                    </Typography>
                    {/* </Box> */}
                  </Box>
                </Box>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dispatch_Return_Grid;
