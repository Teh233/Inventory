import { React, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
  Stack,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  styled,
  Popover,
  Switch,
  Badge,
  useMediaQuery,
  TextField,
  Pagination,
  AppBar,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  Paper,
  TableCell,
  tableCellClasses,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  setAllProducts,
  setAllCart,
  clearSearchTerm,
} from "../../features/slice/productSlice";
import {
  useCreateCartMutation,
  useGetCartQuery,
} from "../../features/api/cartApiSlice";
import { toggleMode } from "../../features/slice/uiSlice";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import { withStyles } from "@mui/styles";
import { useTheme } from "@emotion/react";
import logo from "../../assets/NoImage.png";
import { current } from "@reduxjs/toolkit";
import SearchBar from "./SearchBar";
import HideImageIcon from "@mui/icons-material/HideImage";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const cars = [
  {
    name: "Mercedes benz",
    image:
      "https://group.mercedes-benz.com/bilder/produkte/pkw/mercedes-benz/e-klasse/mercedes-benz-e-klasse-2023-10-visu-q2-w1920xh1080-cutout.jpg",
  },
  {
    name: "Maserati",
    image: "https://static.autox.com/uploads/2023/01/Maserati-mc20-cielo.jpg",
  },
  {
    name: "BMW",
    image:
      "https://imgd.aeplcdn.com/1200x900/cw/ec/35260/BMW-3-Series-GT-Exterior-131200.jpg?wm=0",
  },
  {
    name: "Honda city",
    image:
      "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/9710/1677914238296/front-left-side-47.jpg",
  },
];

const PaginationBox = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: 20,
  backgroundColor: "rgba(0,0,0,0.5)",
  zIndex: 100,
  "& .MuiPaginationItem-root": {
    color: "#fff",
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff " : "grey",
  marginTop: "1rem",
}));
const StyledTypography = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#fff",

  color: theme.palette.mode === "dark" ? "#fff" : "grey",
  cursor: "pointer",
  marginLeft: "1rem",
  marginBottom: "5px",

  "&:hover": {
    color:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.5)"
        : "rgba(1,1,122,1)",
  },
}));
const StyledGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "grey",
  position: "relative",
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: "none",
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    right: 15,
    top: 15,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    backgroundImage:
      "linear-gradient(to top, #d30808, #d10808, #d00909, #ce0909, #cd0909)",
  },
}))(Badge);

const Content = ({
  allProductData,
  productLoading,
  setFilterString,
  filterString,
  isFetching,
}) => {
  //Home slider function
  // const [index, setIndex] = useState(0);

  // useEffect(() => {
  //   const lastIndex = cars.length - 1;
  //   if (index < 0) {
  //     setIndex(lastIndex);
  //   }
  //   if (index > lastIndex) {
  //     setIndex(0);
  //   }
  // }, [index, cars]);

  // // automatic slide functionality
  // useEffect(() => {
  //   let slider = setInterval(() => {
  //     setIndex(index + 1);
  //   }, 3000);
  //   return () => {
  //     clearInterval(slider);
  //   };
  // }, [index]);

  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /// global state
  const sellerId = useSelector((state) => state.auth?.userInfo?.sellerId);
  const toggleShowNav = useSelector((state) => state.ui.ShowSide_nav);
  const { allProduct, brands, categories, cart, searchTerm, forceSearch } =
    useSelector((state) => state.product);

  /// rtk query

  const [createCart, { isLoading: loadingCart, error: errorCart }] =
    useCreateCartMutation();
  const theme = useTheme();

  const {
    refetch: cartRefetch,
    data: allCartData,
    error: cartError,
  } = useGetCartQuery(sellerId);

  /// local state
  console.log(searchTerm)

  const [checkedCategory, setCheckedCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [selectCart, setSelectedcart] = useState([]);
  const [checkedBrands, setCheckedBrands] = useState([]);
  const [Opensortdialog, setOpensortdialog] = useState({
    category: false,
    brand: false,
  });
  const isSmOrDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmOrDown3 = useMediaQuery(theme.breakpoints.between("xs", "xl"));

  const [showItems, setShowItems] = useState(false);
  const [concatenatedData, setConcatenatedData] = useState([]);
  /// handlers

  const handleSort = (e) => {
    if (e === "category") {
      setOpensortdialog({
        ...Opensortdialog,
        category: !Opensortdialog.category,
      });
    } else if (e === "brand") {
      setOpensortdialog({
        ...Opensortdialog,
        brand: !Opensortdialog.brand,
      });
    }
  };

  //for showing product
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const open = (() => {
    // Retrieve the value from localStorage when component mounts
    const storedValue = localStorage.getItem("open");
    // return storedValue ? JSON.parse(storedValue) : false;
  })();

  useEffect(() => {
    setProducts(allProduct);
    setVisibleProducts(allProduct.slice(0, 10));
  }, []);

  ///code for sroll data

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !productLoading
    ) {
      const currentIndex = visibleProducts?.length;
      const nextIndex = currentIndex + 10;

      const nextVisibleProducts = products.slice(currentIndex, nextIndex);

      setVisibleProducts((prevVisibleProducts) => [
        ...prevVisibleProducts,
        ...nextVisibleProducts,
      ]);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //end scroll

  // Load checked brands from local storage on component mount
  useEffect(() => {
    const storedBrands = localStorage.getItem("checkedBrands");
    if (storedBrands) {
      setCheckedBrands(JSON.parse(storedBrands));
    }

    const storedCategories = localStorage.getItem("checkedCategory");
    if (storedCategories) {
      setCheckedCategory(JSON.parse(storedCategories));
    }
  }, []);

  /// handlers

  // filter string generate for brand and category
  useEffect(() => {
    const queryParams = [];

    if (checkedBrands?.length > 0) {
      const brandsQueryParam = checkedBrands
        .map((brand) => `brand=${encodeURIComponent(brand)}`)
        .join("&");
      queryParams.push(brandsQueryParam);
    }

    if (checkedCategory?.length > 0) {
      const categoryQueryParam = checkedCategory
        .map((category) => `category=${encodeURIComponent(category)}`)
        .join("&");
      queryParams.push(categoryQueryParam);
    }
    queryParams.push("page=0");
    const filterString =
      queryParams?.length > 0 ? queryParams.join("&") : "page=0";
    setFilterString(filterString);
    setCurrentPage(1);
    dispatch(clearSearchTerm());
  }, [checkedBrands, checkedCategory]);

  // filter string generate for Pagination
  useEffect(() => {
    if (!filterString) {
      const newFilterString = `page=${currentPage - 1}`;
      setFilterString(newFilterString);
    } else {
      const searchParams = new URLSearchParams(filterString);

      // Remove the "page" term
      searchParams.delete("page");

      // Add new "page" query
      searchParams.set("page", currentPage - 1);

      // Reconstruct the updated filter string
      const updatedFilterString = searchParams.toString();
      setFilterString(updatedFilterString);
    }
  }, [currentPage]);

  // filter string generate for Pagination
  useEffect(() => {
    if (!searchTerm.length) {
      return;
    }
    // Split the existing query string into an array of key-value pairs
    let defaultFilterString = "page=0";
    const queryArray = defaultFilterString.split("&");

    // Check if the searchTerm is not empty
    if (searchTerm.trim() !== "") {
      // Create a new key-value pair for searchTerm=value
      const searchTermPair = `searchTerm=${encodeURIComponent(searchTerm)}`;

      // Add the searchTerm pair to the beginning of the query array
      queryArray.unshift(searchTermPair);
    }

    // Join the query array back into a string using '&' as the separator
    const newQueryString = queryArray.join("&");

    // Update the queryString state with the new value

    setFilterString(newQueryString);
    setCurrentPage(1);
  }, [forceSearch]);

  /// useEffect
  useEffect(() => {
    if (allProductData?.status === "success") {
      dispatch(setAllProducts(allProductData));
      setCount(allProductData.totalPages);
    }
  }, [allProductData]);

  useEffect(() => {
    if (allCartData?.status === "success") {
      dispatch(setAllCart(allCartData.data));
    }
  }, [allCartData]);

  // handle add to cart
  const add_to_cart = async (item) => {
    try {
      const existingItem = cart?.cartData?.filter((i) => i.SKU === item.SKU);
      if (existingItem && existingItem?.length > 0) {
        // SKU already exists, update the quantity for that SKU
        const updatedCart = cart.cartData.map((data) => {
          if (data.SKU === item.SKU) {
            re;
            return {
              ...data,
              quantity: data.quantity + 1,
            };
          } else {
            return data;
          }
        });

        const res = await createCart({
          sellerId: sellerId,
          cartProducts: updatedCart,
        }).unwrap();

        if (res?.status === "success") {
          cartRefetch();
        }
      } else if (cart && cart?.cartData?.length > 0) {
        // SKU doesn't exist, add a new item to the state
        const updatedCart = {
          cartData: [
            ...cart.cartData,
            {
              SKU: item.SKU,
              quantity: 1,
              salesPrice: item.SalesPrice,
              sellerPrice: item.SellerPrice,
              name: item.Name,
              mainImage: item?.mainImage?.highUrl,
            },
          ],
        };
        dispatch(setAllCart(updatedCart));

        const res = await createCart({
          sellerId: sellerId,
          cartProducts: [
            ...cart.cartData,
            {
              SKU: item.SKU,
              quantity: 1,
              salesPrice: item.SalesPrice,
              sellerPrice: item.SellerPrice,
              name: item.Name,
              mainImage: item.mainImage,
            },
          ],
        }).unwrap();

        if (res?.status === "success") {
          cartRefetch();
        }
      } else {
        // brand new Stock entry
        const updatedCart = {
          cartData: [
            {
              SKU: item.SKU,
              quantity: 1,
              salesPrice: item.SalesPrice,
              sellerPrice: item.SellerPrice,
              name: item.Name,
              mainImage: item.mainImage,
            },
          ],
        };

        dispatch(setAllCart(updatedCart));

        const res = await createCart({
          sellerId: sellerId,
          cartProducts: [
            {
              SKU: item.SKU,
              quantity: 1,
              salesPrice: item.SalesPrice,
              sellerPrice: item.SellerPrice,
              name: item.Name,
              mainImage: item.mainImage,
            },
          ],
        }).unwrap();

        if (res?.status === "success") {
          cartRefetch();
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (cart?.cartData) {
      const updatedSelectCart = cart.cartData.map((item) => item.SKU);

      setSelectedcart(updatedSelectCart);

      // Update the concatenated data by merging cart data and remaining products
      const filteredProduct = allProduct.filter(
        (item) => !updatedSelectCart.includes(item.SKU)
      );
      const unfilteredProduct = allProduct.filter((item) =>
        updatedSelectCart.includes(item.SKU)
      );

      const combinedData = [...unfilteredProduct, ...filteredProduct];
      setConcatenatedData(combinedData);
    }
  }, [cart, allProduct]);

  const isMobile1 = useMediaQuery(theme.breakpoints.down("xs"));
  const isMobile2 = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile3 = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = isMobile3 || isMobile1 || isMobile2;

  const handleCheckBoxChange = (item, type, isChecked) => {
    if (type === "brand") {
      if (isChecked) {
        const index = checkedBrands.indexOf(item);
        if (index !== -1) {
          const newChecked = [...checkedBrands];
          newChecked.splice(index, 1);
          setCheckedBrands(newChecked);
          localStorage.setItem("checkedBrands", JSON.stringify(newChecked));
        }
      } else {
        const newChecked = [...checkedBrands, item];
        setCheckedBrands(newChecked);
        localStorage.setItem("checkedBrands", JSON.stringify(newChecked));
      }
      return;
    }

    if (type === "category") {
      if (isChecked) {
        const index = checkedCategory.indexOf(item);
        if (index !== -1) {
          const newChecked = [...checkedCategory];
          newChecked.splice(index, 1);
          setCheckedCategory(newChecked);
          localStorage.setItem("checkedCategory", JSON.stringify(newChecked));
        }
      } else {
        const newChecked = [...checkedCategory, item];
        setCheckedCategory(newChecked);
        localStorage.setItem("checkedCategory", JSON.stringify(newChecked));
      }
      return;
    }
  };

  // handle open close filter pop up
  const handleOpenClose = (type) => {
    if (type === "brand") {
      setOpensortdialog({ ...Opensortdialog, brand: !Opensortdialog.brand });
      return;
    }

    if (type === "category") {
      setOpensortdialog({
        ...Opensortdialog,
        category: !Opensortdialog.category,
      });
      return;
    }
  };

  // handle clear filter
  const handleClearFilters = () => {
    setCheckedBrands([]);
    setCheckedCategory([]);

    localStorage.removeItem("checkedBrands");
    localStorage.removeItem("checkedCategory");

    dispatch(clearSearchTerm());
  };

  return (
    <Box
      sx={{
        width: "auto",
        height: "93vh",
        position: "relative",
      }}
    >
      <>
        {brands?.length > 0 ? (
          <StyledGrid container xl={12}>
            <FormGroup>
              <Box
                sx={{
                  display: "flex",
                  overflow: "hidden",
                  flexWrap: "wrap",
                  maxWidth: "100%",
                  gap: "10px",
                  paddingLeft: "10px",
                  alignItems: "start",
                }}
              >
                <StyledBox>
                  <Badge
                    badgeContent={checkedBrands && checkedBrands?.length}
                    sx={{ color: "blue" }}
                  >
                    <StyledTypography onClick={() => handleOpenClose("brand")}>
                      Sort By Brand
                    </StyledTypography>
                  </Badge>
                </StyledBox>
                <StyledBox>
                  <Badge
                    badgeContent={checkedCategory && checkedCategory?.length}
                    sx={{ color: "blue" }}
                  >
                    <StyledTypography
                      onClick={() => handleOpenClose("category")}
                    >
                      Sort By Category
                    </StyledTypography>
                  </Badge>
                </StyledBox>
                {(checkedBrands && checkedBrands?.length >= 1) ||
                (checkedCategory && checkedCategory?.length >= 1) ||
                searchTerm.length ? (
                  <StyledTypography
                    onClick={() => handleClearFilters()}
                    sx={{ color: "red", marginTop: "20px" }}
                  >
                    Clear All Filter
                  </StyledTypography>
                ) : (
                  ""
                )}

                <Popover
                  open={Opensortdialog.brand}
                  sx={{ p: 2, width: "80vw" }}
                  onClose={() => handleOpenClose("brand")}
                  anchorReference="anchorPosition"
                  anchorPosition={{ top: 100, left: 280 }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Box sx={{ width: "80vw", height: "50vh" }}>
                    <Typography
                      component="span"
                      sx={{
                        textDecoration: "underline",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      Sort By Brand{" "}
                    </Typography>

                    <main>
                      <Box
                        sx={{
                          display: "flex",
                          width: "96%",
                          height: "100%",
                          alignItems: "center",
                          // border: "2px solid green",
                          //  margin:"auto"

                          // tableLayout: isMobile ? 'fixed' : 'auto',
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "1rem",
                            // justifyContent: isMobile ? 'center' : '',
                          }}
                        >
                          {brands?.map((item, index) => {
                            const isChecked = checkedBrands.includes(
                              item.BrandName
                            );
                            return (
                              <Box key={index}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={isChecked}
                                      sx={{
                                        "& .MuiSvgIcon-root": {
                                          // border: "2px solid orange",
                                          // fontSize: 30,
                                          position: "absolute",
                                          top: 0,
                                          right: 0,
                                          zIndex: 20,
                                          // bottom: 65,
                                          // left: 0,
                                          color: "#fcbf49",
                                          display: !isChecked
                                            ? "none"
                                            : "block", // Hide the check mark
                                        },
                                      }}
                                    />
                                  }
                                  // value={item.Brand}
                                  label={
                                    <Box
                                      sx={{
                                        // width: isMobile ? "90px" : "180px",
                                        // height: isMobile ? "90px" : "180px",
                                        // border:"2px solid yellow",
                                        paddingX: "1rem",
                                        border: isChecked
                                          ? "2px solid orange"
                                          : "",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        objectFit: "fill",
                                        objectPosition: "center",
                                        gap: ".6rem",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          width: "100%",
                                          height: "100%",
                                          overflow: "hidden",
                                        }}
                                      >
                                        <img
                                          src={item?.BrandImage?.url}
                                          style={{
                                            width: "4rem",
                                            height: "4rem",
                                            objectFit: "cover",
                                          }}
                                        />
                                      </Box>
                                      <Box
                                        sx={{
                                          color: "black",
                                          mt: "3px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {item.BrandName}
                                        {/* Bmw */}
                                      </Box>
                                    </Box>
                                  }
                                  sx={{
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 15,
                                    },
                                    "& .MuiFormControlLabel-label": {
                                      fontSize: "14px",
                                    },
                                    paddingLeft: "10px",
                                    border: "2px solid slate",
                                    position: "relative",
                                    display: "flex",
                                    flexDirection: "column",
                                    marginX: isMobile ? "1rem" : "0.5rem",
                                  }}
                                  onChange={(event) =>
                                    handleCheckBoxChange(
                                      item.BrandName,
                                      "brand",
                                      isChecked
                                    )
                                  }
                                />
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    </main>
                  </Box>
                </Popover>
                <Popover
                  open={Opensortdialog.category}
                  sx={{ p: 2, width: "80vw" }}
                  onClose={() => handleOpenClose("category")}
                  anchorReference="anchorPosition"
                  anchorPosition={{ top: 100, left: 280 }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Box sx={{ width: "80vw", height: "50vh" }}>
                    <Typography
                      component="span"
                      sx={{
                        textDecoration: "underline",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      Sort By Category{" "}
                    </Typography>

                    <TableContainer>
                      <Table
                        aria-label="simple table"
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "center",
                          tableLayout: isMobile ? "fixed" : "auto",
                        }}
                      >
                        <TableBody>
                          {categories?.map((item, index) => {
                            if (index % 7 === 0) {
                              const items = categories.slice(index, index + 7);

                              return (
                                <TableRow key={index}>
                                  {items.map((item, rowIndex) => {
                                    const itemIndex = index + rowIndex;
                                    const isChecked =
                                      checkedCategory.includes(item);
                                    return (
                                      <StyledTableCell
                                        align="left"
                                        key={itemIndex}
                                        sx={{
                                          display: isMobile
                                            ? "inline-block"
                                            : "table-cell",
                                          width: isMobile ? "50%" : "auto",
                                          boxSizing: "border-box",
                                          paddingY: "8px",
                                          paddingX: "2rem", // Add left padding for column gap
                                        }}
                                      >
                                        <FormControlLabel
                                          control={
                                            <Checkbox checked={isChecked} />
                                          }
                                          value={item}
                                          label={item}
                                          sx={{
                                            "& .MuiSvgIcon-root": {
                                              fontSize: 15,
                                            },
                                            "& .MuiFormControlLabel-label": {
                                              fontSize: "14px",
                                            },
                                            paddingLeft: "10px",
                                          }}
                                          onChange={(event) =>
                                            handleCheckBoxChange(
                                              item,
                                              "category",
                                              isChecked
                                            )
                                          }
                                        />
                                      </StyledTableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            }
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Popover>
              </Box>
            </FormGroup>
            {!isSmOrDown ? (
              <Button sx={{ position: "absolute", right: "1rem" }}>
                All Items
                <Switch
                  onClick={() => setShowItems(!showItems)}
                  color="secondary"
                />
                Selected Items
              </Button>
            ) : (
              " "
            )}
          </StyledGrid>
        ) : (
          ""
        )}
        {isSmOrDown ? (
          <Box style={{ padding: "5px" }}>
            <SearchBar />
          </Box>
        ) : (
          ""
        )}

        {/* carrousel code start*/}

        {/* <Box
          sx={{
            height: '30vh',
            width: '100%',
            display: 'flex',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {cars.map((items, carIndex) => {
            const { image } = items;

            let position = 'nextSlide';
            if (carIndex === index) {
              position = 'activeSlide';
            }
            if (
              carIndex === index - 1 ||
              (index === 0 && carIndex === cars.length - 1)
            ) {
              position = 'lastSlide';
            }
            return (
              <article className={position}>
                <img
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  src={image}
                  alt=''
                />
              </article>
            );
          })}
          <Box
            sx={{
              position: 'absolute',
              bottom: '0',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              padding: '2px',
            }}
          >
            {cars.map((_, i) => {
              return (
                <Box
                  sx={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    padding: index === i ? '6px' : '',
                    backgroundColor: index === i ? '#ffcc00' : 'white',
                    transition: '1s',
                  }}
                ></Box>
              );
            })}
          </Box>
          <div>
            <Button
              sx={{ position: 'absolute', left: '0', top: '50%' }}
              onClick={() => setIndex(index - 1)}
              className=''
            >
              <Typography sx={{ color: '#ffcc00' }}>
                <ArrowBackIosIcon />
              </Typography>
            </Button>
            <Button
              sx={{ position: 'absolute', top: '50%', right: '0' }}
              onClick={() => setIndex(index + 1)}
              className=''
            >
              <Typography sx={{ color: '#ffcc00' }}>
                <ArrowForwardIosIcon />
              </Typography>
            </Button>
          </div>
        </Box> */}

        {/* Carousel code end */}
        <Grid
          container
          sx={{
            marginTop: "0.2rem",
            paddingRight: "5px",
            display: "flex",
            justifyContent: "center",
            height: "85vh",
            overflowY: "auto",
          }}
        >
          {productLoading || isFetching ? (
            <Loading />
          ) : (
            (showItems ? concatenatedData : allProduct).map((item, index) => {
              return (
                <Grid key={item.SKU} item>
                  <StyledBadge
                    badgeContent={item?.Notation}
                    backcolor={
                      item?.Notation === "New"
                        ? "red"
                        : item?.Notation === "Offer"
                        ? "orange"
                        : "Green"
                    }
                  >
                    <Card
                      sx={{
                        width: isMobile1 ? 185 : isSmOrDown3 ? 180 : 210,
                        position: "relative",
                        m: "5px",
                        "&:hover": {
                          cursor: "pointer",
                          outline: "2px solid rgba(145, 152, 161,0.2)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Box>
                          {item?.mainImage ? (
                            <CardMedia
                              component="img"
                              alt="green iguana"
                              image={
                                item?.mainImage
                                  ? item?.mainImage?.mediumUrl
                                  : logo
                              }
                              sx={{
                                width: "160px",
                                height: "160px",
                                objectFit: "fill",
                                marginTop: "10px",
                                borderRadius: "5px",
                                "&:hover": {
                                  cursor: "pointer",
                                },
                              }}
                              onClick={() => {
                                navigate(`/OneProductDetails/${item.SKU}`);
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                backgroundColor: "#eeee",
                                width: "160px",
                                height: "160px",
                                objectFit: "fill",
                                marginTop: "10px",
                                borderRadius: "5px",
                                "&:hover": {
                                  cursor: "pointer",
                                },
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                              onClick={() => {
                                navigate(`/OneProductDetails/${item.SKU}`);
                              }}
                            >
                              <HideImageIcon sx={{}} />

                              <Typography>No Image Found</Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <CardContent sx={{ height: "115px" }}>
                        <Stack display="flex" flexDirection="column">
                          <Tooltip title={item.Name} placement="top">
                            <Box sx={{ height: "80px", overflow: "hidden" }}>
                              <Typography
                                textAlign="center"
                                display="block"
                                gutterBottom
                                sx={{
                                  textOverflow: "ellipsis",
                                  whiteSpace: "wrap",
                                  maxWidth: "100%",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                }}
                              >
                                {item?.Name}
                              </Typography>
                            </Box>
                          </Tooltip>
                          <Stack
                            display="flex"
                            direction="row"
                            justifyContent="space-evenly"
                          >
                            <Typography
                              color="grey"
                              sx={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                textDecoration: "line-through",
                              }}
                            >
                              ₹ {Number(Math.round(item?.SalesPrice))}
                            </Typography>
                            <Typography
                              color="red"
                              sx={{
                                fontSize: "15px",
                                fontWeight: "bold",
                              }}
                            >
                              ₹ {Number(Math.round(item?.SellerPrice))}
                            </Typography>

                            {item.SalesPrice > item.SellerPrice && (
                              <Badge
                                badgeContent={`save ${(
                                  ((item.SalesPrice - item.SellerPrice) /
                                    item.SalesPrice) *
                                  100
                                ).toFixed(0)}%`}
                                color="secondary"
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                                sx={{
                                  width: "100px",
                                  position: "absolute",
                                  right: -60,
                                  bottom: "22%",
                                }}
                              />
                            )}
                          </Stack>
                        </Stack>
                      </CardContent>
                      <CardActions
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Box
                          // onClick={(e) => concatenateArrays(item)}
                          sx={{
                            display: "flex",
                            width: "80%",
                            justifyContent: "center",
                            borderRadius: "10px",
                          }}
                        >
                          <Button
                            variant="outlined"
                            sx={{
                              width: "100%",
                              color: "#fff",
                              backgroundImage: selectCart.includes(item.SKU)
                                ? "linear-gradient(to bottom, #ffaf00, #fc9b00, #f88600, #f27108, #eb5b12)"
                                : !item?.SellerPrice
                                ? "linear-gradient(to bottom, #cacfd6, #95989d, #636467, #353536, #070707)"
                                : "linear-gradient(to top, #0f0e0e, #0c0b0b, #080707, #040404, #000000)",

                              border: "none",
                              "&:hover": { opacity: "0.8", border: "none" },
                            }}
                            disabled={!item?.SellerPrice && true}
                            startIcon={<ShoppingCartIcon />}
                            size="small"
                            onClick={(e) => add_to_cart(item)}
                          >
                            Add to cart
                          </Button>
                        </Box>
                      </CardActions>
                    </Card>
                  </StyledBadge>
                </Grid>
              );
            })
          )}
          <PaginationBox
            sx={{
              position: "fixed",
              bottom: 20,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 100,
            }}
          >
            <Pagination
              page={currentPage}
              count={count}
              onChange={(event, page) => {
                setCurrentPage(page);
              }}
              color="colorNew"
            />
          </PaginationBox>
        </Grid>
      </>
    </Box>
  );
};

export default Content;
