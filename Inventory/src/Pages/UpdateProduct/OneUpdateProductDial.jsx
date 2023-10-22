import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Container,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { useGetOneProductQuery } from "../../features/api/productApiSlice";
import { useUpdateOneProductMutation } from "../../features/api/productApiSlice";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { useSocket } from "../../CustomProvider/useWebSocket";

const OneUpdateProductDial = ({
  open,
  onClose,
  SKU,
  SubTitle,
  refetchAllProduct,
}) => {
  const socket = useSocket();
  const [formValues, setFormValues] = useState({});
  const [subItems, setSubItems] = useState([""]);
  const { userInfo } = useSelector((state) => state.auth);
  const { data: OneData } = useGetOneProductQuery(SKU, {
    skip: !open,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (OneData?.status === "success") {
      setFormValues({
        productName: OneData?.data?.Name,
        brand: OneData?.data?.Brand,
        category: OneData?.data?.Category,
        subcategory: OneData?.data?.SubCategory,
        weight: OneData?.data?.Weight,
        length: OneData?.data?.Dimensions && OneData?.data?.Dimensions?.length,
        width: OneData?.data?.Dimensions && OneData?.data?.Dimensions?.width,
        height: OneData?.data?.Dimensions && OneData?.data?.Dimensions?.height,
      });

      setSubItems(
        OneData.data?.subItems?.length ? OneData.data?.subItems : [""]
      );
    }
  }, [OneData]);

  useEffect(() => {
    if (OneData?.data?.subItems?.length > 0) {
      setSubItems([...OneData?.data?.subItems]);
      setShowTextField(true);
    }
  }, [OneData]);

  // const [addProducts, { isLoading }] = useUpdateOneProductMutation();

  const [errors, setErrors] = useState({
    productName: "",
  });

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
    if (!newSubItems.length) {
      setShowTextField(!setShowTextField);
      setSubItems([""]);
      return;
    }
    setSubItems(newSubItems);
  };

  // const handleSubItemChange = (index, event) => {
  //   const newSubItems = [...subItems];
  //   newSubItems[index].value = event.target.value;
  //   setSubItems(newSubItems);
  // };
  const handleSubItemChange = (index, event) => {
    const newSubItems = [...subItems];
    newSubItems[index] = event.target.value;
    setSubItems(newSubItems);
  };

  // rtk query calling
  const [updateProducts, { isLoading }] = useUpdateOneProductMutation();

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

  // handle submit button on both case
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Transform the Excel data

    // Create an array of product objects
    let data = {};

    // If manual data is entered, add it to the products array
    if (!SubTitle) {
      data = {
        sku: SKU,
        body: {
          name: formValues.productName,
          brand: formValues.brand,
          category: formValues.category,
          subCategory: formValues.subcategory,
          weight: Number(formValues.weight),
          dimensions: {
            length: Number(formValues.length),
            width: Number(formValues.width),
            height: Number(formValues.height),
          },
          subItems: subItems.filter((item) => item !== ""),
        },
      };
    } else {
      data = {
        sku: SKU,
        body: { subItems: subItems },
      };
    }
    // Create the final payload with the required structure

    try {
      const res = await updateProducts(data).unwrap();
      if (res.status === "success") {
        const liveStatusData = {
          message: `${userInfo.name} updated ${SKU} update product`,
          time: new Date().toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        };
        socket.emit("liveStatusServer", liveStatusData);
        toast.success(res.message);

        if (refetchAllProduct) {
          refetchAllProduct();
        }

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
        });
        onClose();
        setSubItems([""]);
      }
    } catch (error) {
      console.log("Error occurred while adding products", error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          backgroundColor: "darkblue",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "1rem",
          fontWeight: "bold",
          color: "white",
        }}
      >
        <Box
          sx={
            {
              // marginLeft:"10rem"
            }
          }
        >
          SKU : {SKU}{" "}
        </Box>{" "}
        <CloseIcon
          onClick={onClose}
          sx={{
            color: "#fff",
            borderRadius: "5rem",
            marginRight: "1rem",
            cursor: "pointer",
            "& :hover": {
              color: "red",
            },
          }}
        />
      </DialogTitle>
      <DialogContent>
        <Box>
          <Container sx={{ padding: "1.5rem" }}>
            <Paper elevation={3} sx={{ padding: "1rem" }}>
              <Box
                sx={{
                  "& input": {
                    height: "10px",
                  },
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {SubTitle ? "Add Sub Items" : "Update Product"}
                  </Typography>
                </Box>
                {/* text feilds */}

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "1rem",
                  }}
                >
                  <label style={{ fontWeight: "bold" }} htmlFor="">
                    Product Name
                  </label>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="productName"
                    InputProps={{
                      readOnly: SubTitle ? true : false,
                    }}
                    value={formValues.productName}
                    onChange={(e) =>
                      handleInputChange("productName", e.target.value)
                    }
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexBasis: "48%",
                    }}
                  >
                    <label style={{ fontWeight: "bold" }} htmlFor="">
                      Brand
                    </label>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="brand"
                      InputProps={{
                        readOnly: SubTitle ? true : false,
                      }}
                      value={formValues.brand}
                      onChange={(e) =>
                        handleInputChange("brand", e.target.value)
                      }
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexBasis: "48%",
                    }}
                  >
                    <label style={{ fontWeight: "bold" }} htmlFor="">
                      Category
                    </label>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="category"
                      InputProps={{
                        readOnly: SubTitle ? true : false,
                      }}
                      value={formValues.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                    />
                  </Box>
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
                    marginTop: "1.2rem",
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
                    InputProps={{
                      readOnly: SubTitle ? true : false,
                    }}
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
                    name="weight"
                    InputProps={{
                      readOnly: SubTitle ? true : false,
                    }}
                    value={formValues.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
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
                      width: "40px",
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
                      variant="outlined"
                      name="length"
                      InputProps={{
                        readOnly: SubTitle ? true : false,
                      }}
                      value={formValues.length}
                      onChange={(e) =>
                        handleInputChange("length", e.target.value)
                      }
                    />
                    <CloseIcon />
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="width"
                      InputProps={{
                        readOnly: SubTitle ? true : false,
                      }}
                      value={formValues.width}
                      onChange={(e) =>
                        handleInputChange("width", e.target.value)
                      }
                    />
                    <CloseIcon />
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="height"
                      InputProps={{
                        readOnly: SubTitle ? true : false,
                      }}
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
                  <Button onClick={handleButtonShowTexField}>
                    Add SubItem
                  </Button>
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
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <DeleteIcon
                          sx={{
                            fontSize: "20px",
                            cursor: "pointer",
                            "&:hover": {
                              color: "red",
                            },
                          }}
                          onClick={() => handleDeleteSubItem(index)}
                        />

                        {index === subItems.length - 1 && (
                          <AddIcon
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              "&:hover": {
                                color: "green",
                              },
                            }}
                            onClick={handleAddSubItem}
                          />
                        )}
                      </Box>
                    </Box>
                  ))}
              </Box>
              <Box
                sx={{
                  marginTop: "2rem",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Button variant="contained" onClick={handleSubmit}>
                  Submit
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OneUpdateProductDial;
