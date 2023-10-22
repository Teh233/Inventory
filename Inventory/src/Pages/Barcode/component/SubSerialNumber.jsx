import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, Avatar } from "@mui/material";
import noDataFound from "../../../assets/error.gif";
import Swal from "sweetalert2";
import noImage from "../../../assets/NoImage.jpg";
import OneUpdateProductDial from "../../UpdateProduct/OneUpdateProductDial";
import {
  useGetAllProductBySkuMutation,
  useAddSubCategoryMutation,
} from "../../../features/api/barcodeApiSlice";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Typography,
  styled,
  Button,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";

// custom styles
const useStyles = makeStyles({
  tableContainer: {
    maxWidth: "100%",
  },
});
const StyleCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#eee",

  color: theme.palette.mode === "dark" ? "black" : "black",
  textAlign: "center",
  padding: 3,
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const StyleTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",

  color: theme.palette.mode === "dark" ? "black" : "black",

  textAlign: "center",
  padding: 5,
}));
const SubSerialNumber = () => {
  /// initialization
  const classes = useStyles();

  const Errordisplay = (input) => {
    Swal.fire({
      title: "No Sub Items found for Barcode !",
      text: "Add SubItems to proceed ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, for Add SubItems!",
    }).then((result) => {
      if (result.isConfirmed) {
        onClose();
        setOpen(true);
      }
    });
  };

  /// local state
  const [row, setRows] = useState([]);
  const [productInfo, setProductInfo] = useState({});
  const [subItems, setSubItems] = useState([]);
  const [subitemData, setSubItemData] = useState({});
  const [input, setInput] = useState("");
  const [SKU_input, setSKU_input] = useState("");
  const textFieldRef = useRef(null);
  const [open, setOpen] = useState(false);

  /// rtk query
  const [getPrdouct] = useGetAllProductBySkuMutation();
  const [addSubSerialApi, { isLoading }] = useAddSubCategoryMutation();

  console.log(row);
  console.log(productInfo);
  console.log(subitemData);
  console.log(subItems);

  /// functions

  function createResultObject(arr1, arr2) {
    const result = {};
    console.log("triger");

    try {
      for (const item of arr1) {
        result[item.serialNumber] = {};

        for (const key of arr2) {
          result[item.serialNumber][key] =
            item.sub && item.sub[key] ? item.sub[key] : "";
        }
      }
    } catch (e) {
      console.log(e);
    }

    return result;
  }

  /// useEffect

  // for cursor on textfield
  useEffect(() => {
    textFieldRef.current.focus();
  }, []);

  // api calling
  useEffect(() => {
    const fetchData = async () => {
      if (input.length === 13) {
        try {
          const response = await getPrdouct({ SKU: input }).unwrap();

          if (
            response?.status === "success" &&
            response?.data?.subItems?.length
          ) {
            setProductInfo({
              name: response?.data?.name,
              sku: response?.data?.sku,
              mainImage: response?.data?.mainImage,
            });
            setRows(response?.data?.barcode || []);
            setSubItems(response?.data?.subItems || []);
            if (response?.data?.barcode?.length) {
              const result = createResultObject(
                response.data.barcode,
                response.data.subItems
              );

              setSubItemData(result);
            }
            setInput("");
          } else {
            Errordisplay();
            setSKU_input(input);
            setInput("");
          }
        } catch (error) {
          setInput("");
        }
      }
    };

    fetchData();
  }, [input]);

  /// handlers

  const onClose = () => {
    setOpen(!open);
  };

  // onchange for text field
  const handleOnChange = (e) => {
    const value = e.target.value;
    setInput(value);
  };

  const handleGlobalSubmit = async () => {
    
    try {
      if(row.length <= 0){
        toast.error("Please provide a barcode before submitting");
        return;
      }
      const body = { barcode: subitemData };
      const res = await addSubSerialApi(body);
      toast.success("Successfully added SubItems");
      setRows([]);
      setProductInfo({});
      setSubItemData({});
      setSubItems([]);
    } catch (e) {
      console.log("error at subItem barcode :" + e.message);
      toast.error(e.message);
    }
  };

  const handleSubItemOnChange = (Sno, objectKey, value) => {
    const oldSubitemData = { ...subitemData };
    oldSubitemData[Sno][objectKey] = value;

    setSubItemData(oldSubitemData);
  };
  return (
    <>
      <OneUpdateProductDial
        open={open}
        onClose={onClose}
        SKU={SKU_input}
        SubTitle={true}
      />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
      >
        <DrawerHeader />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "90.3vh",
          }}
        >
          <Box
            sx={{
              marginTop: ".3rem",
              display: "grid",
              gridTemplateColumns: "20% 60% 20%",
            }}
          >
            <Box>
              <Paper
                elevation={10}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "15rem",
                  height: "12rem",
                  marginX: "1rem",
                }}
              >
                <img
                  src={
                    productInfo?.mainImage ? productInfo?.mainImage : noImage
                  }
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
            {/* search bar */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4rem",
              }}
            >
              <TextField
                id="filled basic"
                placeholder="Enter SKU Number"
                variant="outlined"
                value={input}
                onChange={handleOnChange}
                inputRef={textFieldRef}
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

              {/* Barcode Name */}
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
                  {productInfo?.name || ""}
                </Typography>
              </Box>
              <Button
                disabled={isLoading}
                variant="contained"
                color="primary"
                onClick={() => handleGlobalSubmit()}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" /> // Show loading indicator
                ) : (
                  "Submit All"
                )}
              </Button>
            </Box>
          </Box>
          <TableContainer
            component={Paper}
            className={classes.tableContainer}
            sx={{ overflow: "auto", maxHeight: "500px", mt: "10px" }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyleCell>SNO.</StyleCell>
                  <StyleCell>Barcode Number</StyleCell>
                  <StyleCell>Sub Items</StyleCell>
                  {/* <StyleCell>Add Sub No.</StyleCell> */}
                </TableRow>
              </TableHead>

              <TableBody>
                {row.length > 0 ? (
                  row.map((row, index) => (
                    <React.Fragment key={row.serialNumber}>
                      <TableRow sx={{padding:0}}>
                        <StyleTableCell>{index + 1}</StyleTableCell>
                        <StyleTableCell>{row.serialNumber}</StyleTableCell>

                        <StyleTableCell>
                          <Box
                            sx={{
                              justifyContent: "center",
                              display: "flex",
                              flexDirection: "row",
                              flexWrap: "wrap",
                              gap:"20px"
                          

                            }}
                          >
                            {subItems.length &&
                              subItems.map((item, index) => (
                                <Box
                                  key={index} // Remember to include a unique key when mapping over components
                                  style={{
                                    display: "flex",
                                    // alignItems: "center",
                              
                                  }}
                                >
                        
                                  <TextField
                                  variant="outlined"
                                  label={item}
                                    value={
                                      subitemData?.[row.serialNumber]?.[item] ||
                                      ""
                                    }
                                    size="small"
                                    name="Key"
                                    sx={{
                                      "& input": {
                                        backgroundColor: "white",
                                      },
                                    }}
                                    onChange={(e) => {
                                      handleSubItemOnChange(
                                        row.serialNumber,
                                        item,
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Box>
                              ))}
                          </Box>
                        </StyleTableCell>
                      </TableRow>

                    </React.Fragment>
                  ))
                ) : (
                  <>
                    <Box
                      sx={{
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
                      </Box>
                    </Box>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default SubSerialNumber;
