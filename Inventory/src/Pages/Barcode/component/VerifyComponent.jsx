import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, Avatar } from "@mui/material";
import noDataFound from "../../../assets/error.gif";
import noImage from "../../../assets/NoImage.jpg";
import {
  useScanBarcodeForVerifyMutation,

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
} from "@mui/material";

import { useSocket } from "../../../CustomProvider/useWebSocket";
import { useSelector } from "react-redux";
import Loading from "../../../components/Common/Loading";
// custom styles
const useStyles = makeStyles({
  tableContainer: {
    maxWidth: "100%",
  },
});
const StyleCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#eee",
padding:3,
  color: theme.palette.mode === "dark" ? "black" : "black",
  textAlign: "center",
}));

const StyleTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",

  color: theme.palette.mode === "dark" ? "black" : "black",
padding:4,
  textAlign: "center",
}));
const VerifyComponent = () => {
  /// initialize
  const classes = useStyles();
  const socket = useSocket();

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  /// local state
  const [input, setInput] = useState("");
  const [apiResponse, setApiResponse] = useState([]);
  const textFieldRef = useRef(null);



  // using rtk query call
  const [scanBarcode,{isLoading:verifyBarcodeLoading}] = useScanBarcodeForVerifyMutation();


  // onchange for text field
  const handleOnChange = (e) => {
    const value = e.target.value;
    setInput(value);
  };

  // for cursor on textfield
  useEffect(() => {
    textFieldRef.current.focus();
  }, []);

  // api calling
  useEffect(() => {
    const fetchData = async () => {
      if (input.length === 16) {
        try {
          const response = await scanBarcode({ Sno: input });
          if (response?.data?.status === "success") {
            const liveStatusData = {
              message: `${userInfo.name} Sticked barcode ${input} `,
              time: new Date().toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
              }),
            };
            socket.emit("liveStatusServer", liveStatusData);
            setApiResponse((prevResults) => [...prevResults, response.data]);
            setInput("");
          } else {
            setInput("");
          }
        } catch (error) {
          console.error("Error while calling API:", error);
          setApiResponse([]);
          setInput("");
        }
      }
    };

    fetchData();
  }, [input]);
  

  const rows = apiResponse
    .flatMap((apiData, index) => {
      if (apiData?.data) {
        const image = apiData.data?.product?.mainImage?.lowUrl;
        return {
          sno: index + 1,
          sku: apiData.data?.product?.SKU,
          createdDate: apiData.data?.barcode?.createdAt,
          barcodeNumber: apiData.data?.barcode?.serialNumber,
          name: apiData.data?.product?.Name,
          brand: apiData.data?.product?.Brand,
          weight: `${apiData.data?.product?.Weight} gm`,
          rest: apiData?.data?.restBarcode,
          mainImage: image,
        };
      } else {
        return null;
      }
    })
    .filter(Boolean);

  // Reverse the rows array to display the latest data on top
  const reversedRows = [...rows].reverse();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "91.3vh",
        }}
      >
        <Box
          sx={{
            marginTop: ".5rem",
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
                  reversedRows[0]?.mainImage
                    ? reversedRows[0]?.mainImage
                    : noImage
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
              placeholder="Enter barcode. NO"
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
                {reversedRows.length > 0 ? reversedRows[0].name : ""}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            {/* verified quantity */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  // fontWeight: 'bold',
                  fontSize: "1rem",
                  padding: ".5rem",
                  color: "#fff",
                  backgroundColor: "#000",
                  width: "12rem",
                }}
              >
                Verified-Quantity: {apiResponse.length}
              </Typography>
            </Box>
            {/* Non Stick */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  // fontWeight: 'bold',
                  fontSize: "1rem",
                  padding: ".5rem",
                  color: "#fff",
                  backgroundColor: "	 #808080",
                  width: "12rem",
                }}
              >
                None-Sticked:{" "}
                {reversedRows.length > 0 ? reversedRows[0].rest : ""}
              </Typography>
            </Box>
            {/* Total Stick */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  // fontWeight: 'bold',
                  fontSize: "1rem",
                  padding: ".5rem",
                  color: "#fff",
                  backgroundColor: "	 #808080",
                  width: "12rem",
                }}
              >
                Total Sticked: {apiResponse.length}
              </Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer
          // component={Paper}
          className={classes.tableContainer}
          sx={{ overflow: "auto", maxHeight: "500px", mt: "25px" }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyleCell>SNO.</StyleCell>
                <StyleCell>SKU</StyleCell>
                <StyleCell>Created Date</StyleCell>
                <StyleCell>Barcode Number</StyleCell>
                <StyleCell>Name</StyleCell>
                <StyleCell>Brand</StyleCell>
                <StyleCell>Weight</StyleCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {verifyBarcodeLoading ? (
              <Loading loading={verifyBarcodeLoading} />
            ) : null}
              {reversedRows?.length > 0 ? (
                reversedRows.map((row) => (
                  <TableRow key={row.sno}>
                    <StyleTableCell>{row.sno}</StyleTableCell>
                    <StyleTableCell>{row.sku}</StyleTableCell>
                    <StyleTableCell>
                      {new Date(row.createdDate).toLocaleDateString()}
                    </StyleTableCell>
                    <StyleTableCell>{row.barcodeNumber}</StyleTableCell>
                    <StyleTableCell>{row.name}</StyleTableCell>
                    <StyleTableCell>{row.brand}</StyleTableCell>
                    <StyleTableCell>{row.weight}</StyleTableCell>
              
                  </TableRow>
                ))
              ) : (
                <>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '70%',
                      left: '55%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '200px',
                        height: '200px',
                      }}
                    >
                      <img
                        src={noDataFound}
                        alt=''
                        style={{ width: '100px', height: '100px' }}
                      />
                      <Typography
                        variant='body2'
                        sx={{ fontWeight: 'bold', fontSize: '1rem' }}
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
    </>
  );
};

export default VerifyComponent;
