import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Container,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";
import { useAddProductMutation } from "../../../features/api/productApiSlice";
import { toast } from "react-toastify";
import CardGrid from "../../../components/Common/CardGrid";
import axios from "axios";
import BASEURL from "../../../constants/BaseApi";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
const AddProductComponent = () => {
  /// initialize
  const navigate = useNavigate();
  const socket = useSocket();

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  /// local state
  const [excelData, setExcelData] = useState([]);
  const [formValues, setFormValues] = useState({
    productName: "",
    brand: "",
    category: "",
    subcategory: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    gst: "",
  });
  const [errors, setErrors] = useState({
    productName: "",
  });

  const [subItems, setSubItems] = useState([""]);
  const [showTextField, setShowTextField] = useState(false);

  const handleButtonShowTexField = () => {
    setShowTextField(!showTextField);
  };

  const handleAddSubItem = () => {
    const newSubItems = [...subItems, ""];
    setSubItems(newSubItems);
  };

  const handleDeleteSubItem = (index) => {
    const newSubItems = subItems.filter((_, i) => i !== index);
    setSubItems(newSubItems);
  };

  const handleSubItemChange = (index, event) => {
    const newSubItems = [...subItems];
    newSubItems[index] = event.target.value;
    setSubItems(newSubItems);
  };

  // rtk query calling
  const [addProducts, { isLoading }] = useAddProductMutation();

  // handle inpult field changes
  const handleInputChange = (fieldName, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
    // Clear errors for the field being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
  };

  // handle excel file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Remove white spaces from the header row
      const headerRow = jsonData.shift().map((item) => item.trim());
      const processedHeaderRow = headerRow.map((item) =>
        item.startsWith("Name")
          ? item.replace(" (its not required for reference only)", "").trim()
          : item
      );

      const excelObjects = jsonData.map((row, index) =>
        row.reduce(
          (obj, value, columnIndex) => {
            // Remove white spaces from the cell values
            const trimmedValue =
              typeof value === "string" ? value.trim() : value;
            return {
              ...obj,
              [processedHeaderRow[columnIndex]]: trimmedValue,
            };
          },
          {
            Sno: index + 1,
            id: index + 1,
          }
        )
      );
      setExcelData(excelObjects);
    };
    reader.readAsArrayBuffer(file);
  };

  // handle excel file sample download
  const handleDownloadSample = async () => {
    try {
      const response = await axios.get(`${BASEURL}/Sample/RoboProduct.xlsx`, {
        responseType: "blob",
      });

      // Create a temporary link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "RoboProduct.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading sample:", error);
    }
  };

  // handle submit button on both case
  const handleSubmit = async (e) => {
    // Transform the Excel data
    if (!formValues.productName && excelData.length === 0) {
      toast.error("Product Name is required");
      return;
    }

    const transformedExcelData = excelData.map((item) => ({
      name: item.Name,
      brand: item.Brand,
      category: item.Category,
      subCategory: item.SubCategory,
      weight: item.Weight,
      dimensions: {
        length: item.length,
        width: item.width,
        height: item.height,
      },
    }));

    // Create an array of product objects
    const productsArray = [...transformedExcelData];

    // If manual data is entered, add it to the products array
    if (formValues.productName) {
      const manuallyEnteredProduct = {
        name: formValues.productName,
        brand: formValues.brand,
        category: formValues.category,
        subCategory: formValues.subcategory,
        weight: Number(formValues.weight),
        gst: Number(formValues.gst),
        dimensions: {
          length: Number(formValues.length),
          width: Number(formValues.width),
          height: Number(formValues.height),
        },
        subItems: subItems.filter((item) => item !== ""),
      };
      productsArray.push(manuallyEnteredProduct);
    }
    // Create the final payload with the required structure
    const payload = {
      products: productsArray,
    };

    try {
      const res = await addProducts(payload).unwrap();
      if (res.status === "success") {
        const liveStatusData = {
          message: `${userInfo.name} Added ${productsArray.length} new product`,
          time: new Date().toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        };
        toast.success(res.message, {
          onClose: () => {
            socket.emit("liveStatusServer", liveStatusData);
          },
        });

        // Clear form values
        setFormValues({
          productName: "",
          brand: "",
          category: "",
          subcategory: "",
          weight: "",
          length: "",
          width: "",
          height: "",
          gst: "",
        });
        setExcelData([]);
        setSubItems([{ value: "" }]);
        handleButtonShowTexField();
      }
    } catch (error) {
      console.log("Error occurred while adding products", error.message);
    }
  };

  const columns = [
    {
      field: "Sno",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "Sno",
      width: 100,
    },
    {
      field: "Name",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "Name",
      width: 350,
    },
    {
      field: "Brand",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "Brand",
      width: 250,
    },
    {
      field: "Category",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "Category",
      width: 250,
    },
    {
      field: "SubCategory",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "Subcategory",
      width: 250,
    },
    {
      field: "dimensions",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "(L X W X H) (cm)",
      width: 280,
      renderCell: (params) => {
        const { length, width, height } = params.row;
        return `${length} * ${width} * ${height}`;
      },
    },
    {
      field: "Weight",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      flex: 0.3,
      headerName: "Weight (gm)",
      width: 50,
    },
  ];

  return (
    <>
      <Box>
        <Container sx={{ padding: "0.5rem" }}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} style={{ padding: "5px" }}>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-evenly",
                }}
              >
                <Box>
                  <input
                    type="file"
                    accept=".xls, .xlsx"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="contained" color="grey" component="span">
                      Upload Excel File
                    </Button>
                  </label>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    color="grey"
                    onClick={() => navigate("/uploadimage")}
                  >
                    Add image
                  </Button>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    color="grey"
                    onClick={handleDownloadSample}
                  >
                    Download Sample
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Paper elevation={3} sx={{ padding: "0.5rem" }}>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Add Product Here
              </Typography>
            </Box>
            {/* text feilds */}

            <Box
              sx={{
                // border: '2px solid blue',
                display: "flex",
                justifyContent: "space-evenly",
                gap: "0.5rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5rem",
                  marginTop: "1rem",
                  flexBasis: "30%",
                  "& input": {
                    height: "10px",
                  },
                }}
              >
                <label style={{ fontWeight: "bold" }} htmlFor="">
                  Product Name
                </label>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="productName"
                  value={formValues.productName}
                  onChange={(e) =>
                    handleInputChange("productName", e.target.value)
                  }
                  error={!!errors.productName}
                  helperText={errors.productName}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5rem",
                  marginTop: "1rem",
                  flexBasis: "30%",
                  "& input": {
                    height: "10px",
                  },
                }}
              >
                <label style={{ fontWeight: "bold" }} htmlFor="">
                  Brand
                </label>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="brand"
                  value={formValues.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5rem",
                  marginTop: "1rem",
                  flexBasis: "30%",
                  "& input": {
                    height: "10px",
                  },
                }}
              >
                <label style={{ fontWeight: "bold" }} htmlFor="">
                  Category
                </label>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="category"
                  value={formValues.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                />
              </Box>
            </Box>

            <Box
              sx={{
                // border: '2px solid blue',
                display: "flex",
                justifyContent: "space-evenly",
                gap: "1rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5rem",
                  marginTop: "1rem",
                  flexBasis: "30%",
                  "& input": {
                    height: "10px",
                  },
                }}
              >
                <label style={{ fontWeight: "bold" }} htmlFor="">
                  SubCategory
                </label>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="subcategory"
                  value={formValues.subcategory}
                  onChange={(e) =>
                    handleInputChange("subcategory", e.target.value)
                  }
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5rem",
                  marginTop: "1rem",
                  flexBasis: "30%",
                  "& input": {
                    height: "10px",
                  },
                }}
              >
                <label style={{ fontWeight: "bold" }} htmlFor="">
                  Weight<sup>(gm)</sup>
                </label>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  type="Number"
                  name="weight"
                  value={formValues.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5rem",
                  marginTop: "1rem",
                  flexBasis: "30%",
                  "& input": {
                    height: "10px",
                  },
                }}
              >
                <label style={{ fontWeight: "bold" }} htmlFor="">
                  GST<sup>(%)</sup>
                </label>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  type="Number"
                  name="weight"
                  value={formValues.gst}
                  onChange={(e) => handleInputChange("gst", e.target.value)}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5rem",
                  marginTop: "1rem",
                  flexBasis: "30%",
                  "& input": {
                    height: "10px",
                  },
                }}
              >
                <label style={{ fontWeight: "bold" }} htmlFor="">
                  Dimension<sup>(cm)</sup>
                </label>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                    // gap: '.6rem',
                    placeItems: "center",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label="L"
                    type="Number"
                    variant="outlined"
                    name="length"
                    value={formValues.length}
                    onChange={(e) =>
                      handleInputChange("length", e.target.value)
                    }
                  />
                  <CloseIcon />
                  <TextField
                    id="outlined-basic"
                    label="W"
                    type="Number"
                    variant="outlined"
                    name="width"
                    value={formValues.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                  />
                  <CloseIcon />
                  <TextField
                    id="outlined-basic"
                    label="H"
                    type="Number"
                    variant="outlined"
                    name="height"
                    value={formValues.height}
                    onChange={(e) =>
                      handleInputChange("height", e.target.value)
                    }
                  />
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                marginLeft: "18px",
                gap: ".5rem",
                marginTop: "1rem",
                flexBasis: "30%",
                "& input": {
                  height: "10px",
                },
              }}
            >
              {!showTextField && (
                <Button onClick={handleButtonShowTexField}>Add SubItem</Button>
              )}
              {showTextField &&
                subItems.map((subItem, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    marginBottom="10px"
                  >
                    <TextField
                      label={`Sub Item ${index + 1}`}
                      variant="outlined"
                      value={subItem}
                      onChange={(event) => handleSubItemChange(index, event)}
                      style={{ marginRight: "10px" }}
                    />
                    {index === subItems.length - 1 && (
                      <AddIcon onClick={handleAddSubItem} />
                    )}
                    {index !== subItems.length - 1 && (
                      <DeleteIcon onClick={() => handleDeleteSubItem(index)} />
                    )}
                  </Box>
                ))}
            </Box>
            <Box
              sx={{ marginTop: "2rem", display: "flex", justifyContent: "end" }}
            >
              <LoadingButton
                onClick={handleSubmit}
                loading={isLoading}
                variant="contained"
              >
                Submit
              </LoadingButton>
            </Box>
            {/* <Box sx={{ marginTop: "1rem" }}>
            {Object.values(errors).map((error, index) => (
              <Typography key={index} color="error">
                {error}
              </Typography>
            ))}
          </Box> */}
          </Paper>
        </Container>
      </Box>
      <Box
        sx={{
          marginX: "1rem",
        }}
      >
        <CardGrid
          sx={{ backgroundColor: "#fff" }}
          rows={excelData}
          columns={columns}
          pageSize={5}
          Height="39vh"
          checkboxSelection
        />
      </Box>
    </>
  );
};

export default AddProductComponent;
