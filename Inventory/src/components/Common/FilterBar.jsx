import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Typography,
  Box,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Popover,
  styled,
  TextField,
  Badge,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  tableCellClasses,
} from "@mui/material";
import { clearSearchTerm } from "../../features/slice/productSlice";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect } from "react";

/// style
const StyledGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "grey",
  position: "relative",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "rgba(0,0,0,.5)" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "grey",
  marginTop: ".7rem",
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

const FilterBar = ({
  customButton,
  customOnClick,
  apiRef,
  CustomText,
  CustomText2,
  hiddenColumns,
  setHiddenColumns,
  CustomText3,
  CustomText4,
  CustomText5,
}) => {
  /// initialize
  const dispatch = useDispatch();

  /// global state
  const { brands, categories, searchTerm } = useSelector(
    (state) => state.product
  );

  ///local state
  const [columnHideData, setColumnHideData] = useState([]);
  const [skuFilter, setSkuFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [checkedBrands, setCheckedBrands] = useState([]);
  const [checkedCategory, setCheckedCategory] = useState([]);
  const [Opensortdialog, setOpensortdialog] = useState({
    category: false,
    brand: false,
  });

  /// useEffect

  useEffect(() => {
    if (hiddenColumns) {
      const newHiddenArray = Object.keys(hiddenColumns);
      setColumnHideData(newHiddenArray);
    }
  }, [hiddenColumns]);

  useEffect(() => {
    setCheckedBrands([]);
    setCheckedCategory([]);
    setSkuFilter("");
    setNameFilter("");
  }, [searchTerm]);

  /// handlers

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

  // remove spcified column by click
  const removeColumnHide = (key) => {
    const oldHiddenColumns = { ...hiddenColumns };
    if (oldHiddenColumns.hasOwnProperty(key)) {
      delete oldHiddenColumns[key];
    }
    setHiddenColumns(oldHiddenColumns);
  };
  // Update checked brands and local storage on change
  const handleCheckBoxChange = (item, type, isChecked) => {
    if (type === "brand") {
      setCheckedCategory([]);
      if (isChecked) {
        const index = checkedBrands.indexOf(item);
        if (index !== -1) {
          const newChecked = [...checkedBrands];
          newChecked.splice(index, 1);
          setCheckedBrands(newChecked);
          handleFilterChange("Brand", "isAnyOf", newChecked);
        }
      } else {
        const newChecked = [...checkedBrands, item];
        setCheckedBrands(newChecked);
        handleFilterChange("Brand", "isAnyOf", newChecked);
      }
      return;
    }

    if (type === "category") {
      setCheckedBrands([]);
      if (isChecked) {
        const index = checkedCategory.indexOf(item);
        if (index !== -1) {
          const newChecked = [...checkedCategory];
          newChecked.splice(index, 1);
          setCheckedCategory(newChecked);
          handleFilterChange("Category", "isAnyOf", newChecked);
        }
      } else {
        const newChecked = [...checkedCategory, item];
        setCheckedCategory(newChecked);
        handleFilterChange("Category", "isAnyOf", newChecked);
      }
      return;
    }
  };

  const handleFilterChange = (field, operator, value) => {
    apiRef.current.setFilterModel({
      items: [{ field: field, operator: operator, value: value }],
    });
  };
  const handleClearFilters = () => {
    handleFilterChange("Brand", "isAnyOf", []);
    setCheckedBrands([]);
    setCheckedCategory([]);
    setSkuFilter("");
    setNameFilter("");
    dispatch(clearSearchTerm());
  };

  return (
    <div>
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
              <StyledButton onClick={() => handleOpenClose("brand")}>
                <Badge
                  badgeContent={checkedBrands && checkedBrands.length}
                  sx={{
                    color: "blue",
                  }}
                >
                  <Typography
                    variant="span"
                    sx={{
                      background: "transparent",
                      color: "gray",
                    }}
                  >
                    Sort By Brand
                  </Typography>
                </Badge>
              </StyledButton>
              <StyledButton onClick={() => handleOpenClose("category")}>
                <Badge
                  badgeContent={checkedCategory && checkedCategory.length}
                  sx={{ color: "blue" }}
                >
                  <Typography
                    variant="span"
                    sx={{
                      background: "transparent",
                      color: "gray",
                    }}
                  >
                    Sort By Category
                  </Typography>
                </Badge>
              </StyledButton>

              {(checkedBrands && checkedBrands.length >= 1) ||
              (checkedCategory && checkedCategory.length >= 1) ||
              skuFilter ||
              searchTerm ||
              nameFilter.length ? (
                <StyledButton
                  onClick={() => handleClearFilters()}
                  sx={{ color: "red" }}
                >
                  Clear All Filter
                </StyledButton>
              ) : (
                ""
              )}
              <Box
                sx={{
                  // border: '2px solid',
                  marginTop: ".3rem",
                  marginLeft: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "6rem",
                }}
              >
                <TextField
                  size="small"
                  placeholder="Enter Product Name"
                  sx={{ flexBasis: "60%" }}
                  value={nameFilter}
                  onChange={(e) => {
                    setSkuFilter("");
                    setNameFilter(e.target.value);

                    setCheckedBrands([]);
                    setCheckedCategory([]);
                    handleFilterChange("Name", "contains", e.target.value);
                  }}
                />
                <TextField
                  value={skuFilter}
                  placeholder="Enter a SKU"
                  size="small"
                  // color="secondary"
                  onChange={(e) => {
                    setSkuFilter(e.target.value);
                    setCheckedBrands([]);
                    setCheckedCategory([]);
                    handleFilterChange("SKU", "contains", e.target.value);
                  }}
                  sx={{
                    flexBasis: "40%",
                    // position: "absolute",
                    // marginTop: ".5rem",
                    // left: "45%",
                    // right: "45%",
                  }}
                />
              </Box>

              {customButton ? (
                <Button
                  onClick={customOnClick}
                  sx={{ position: "absolute", right: "1rem", mt: 2 }}
                >
                  {customButton}
                </Button>
              ) : (
                ""
              )}
              <Box>{CustomText}</Box>
              <Box>{CustomText2}</Box>
              <Box sx={{ position: "absolute", right: "8rem", mt: 2 }}>
                {CustomText3}
              </Box>
              <Box sx={{ position: "absolute", right: "14rem", mt: 2 }}>
                {CustomText4}
              </Box>
              <Box sx={{ position: "absolute", right: "21rem", mt: 2 }}>
                {CustomText5}
              </Box>

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
                  <TableContainer>
                    <Table aria-label="simple table" size="small">
                      <TableBody>
                        {brands?.map((item, index) => {
                          if (index % 7 === 0) {
                            const rowItems = brands.slice(index, index + 7);

                            return (
                              <TableRow key={index}>
                                {rowItems.map((rowItem, rowIndex) => {
                                  const rowItemIndex = index + rowIndex;
                                  const isChecked =
                                    checkedBrands.includes(rowItem);
                                  return (
                                    <StyledTableCell
                                      align="left"
                                      key={rowItemIndex}
                                    >
                                      <FormControlLabel
                                        control={
                                          <Checkbox checked={isChecked} />
                                        }
                                        value={rowItem}
                                        label={rowItem}
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
                                            rowItem,
                                            "brand",
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
                    <Table aria-label="simple table" size="small">
                      <TableBody>
                        {categories?.map((item, index) => {
                          if (index % 7 === 0) {
                            const rowItems = categories.slice(index, index + 7);

                            return (
                              <TableRow key={index}>
                                {rowItems.map((rowItem, rowIndex) => {
                                  const rowItemIndex = index + rowIndex;
                                  const isChecked =
                                    checkedCategory.includes(rowItem);
                                  return (
                                    <StyledTableCell
                                      align="left"
                                      key={rowItemIndex}
                                    >
                                      <FormControlLabel
                                        control={
                                          <Checkbox checked={isChecked} />
                                        }
                                        value={rowItem}
                                        label={rowItem}
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
                                            rowItem,
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "88vw",
                paddingX: "1rem",
              }}
            >
              {columnHideData?.length > 0 ? (
                <Box
                  sx={{
                    backgroundColor: "  #b3b3b3",
                    // border: '2px solid',
                    marginLeft: "4rem",
                    display: "flex",
                    alignItems: "center",
                    // marginTop: "rem",
                    padding: ".3rem",
                    gap: ".4rem",
                    borderRadius: "1rem",
                  }}
                >
                  {columnHideData.map((items, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        gap: ".3rem",
                        alignItems: "center",
                        backgroundColor: "	 #d9d9d9",
                        color: "#000",
                        borderRadius: "1rem",
                      }}
                    >
                      <Typography
                        variant="paragraph"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.8rem",

                          color: "#000",
                          padding: ".1rem",
                        }}
                      >
                        {items}
                      </Typography>
                      <CancelIcon
                        sx={{ fontSize: "1.2rem" }}
                        onClick={() => removeColumnHide(items)}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                ""
              )}
            </Box>
          </FormGroup>
        </StyledGrid>
      ) : (
        ""
      )}
    </div>
  );
};

export default FilterBar;
