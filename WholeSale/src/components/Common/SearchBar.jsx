import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Collapse,
  InputAdornment,
  IconButton,
  styled,
  InputBase,
} from "@mui/material";
import { useAutoCompleteProductMutation } from "../../features/api/productApiSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { setSearchTerm } from "../../features/slice/productSlice";

const Search = styled("div")(({ theme }) => ({
  background: theme.palette.mode === "dark" ? "grey" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
  padding: "0 10px ",
  borderRadius: theme.shape.borderRadius,
  width: "auto ",
}));

const Listbox = styled("ul")(({ theme }) => ({
  width: "auto",
  margin: 0,
  padding: "0 10px ",
  zIndex: 1,
  position: "absolute",
  listStyle: "none",
  zIndex: 999,
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#000",
  overflow: "auto",
  maxHeight: 200,
  border: "1px solid rgba(0,0,0,.25)",
  "& li.Mui-focused": {
    backgroundColor: "#4a8df6",
    color: "white",
    cursor: "pointer",
  },
  "& li:active": {
    backgroundColor: "#2977f5",
    color: "white",
  },
}));

const StyledInputbase = styled(InputBase)(({ theme }) => ({
  input: {
    "&:hover": {
      color: "rgb(15, 126, 252)",
    },
    marginLeft: "10px",
  },
  width: "100%",
  background: theme.palette.mode === "dark" ? "#eeee" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
}));

const SearchBar = () => {
  /// initialize
  const dispatch = useDispatch();
  const collapseRef = useRef(null);
  const autoCompleteRef = useRef(null);

  /// local state
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [testSearch, setTestSearch] = useState("");

  /// rtk query
  const [
    autoCompleteApi,
    { isLoading: autoCompleteLoading, refetch: refetchAutocomplete },
  ] = useAutoCompleteProductMutation();

  /// handler
  const handleToggle = () => {
    setOpen(!open);
  };
  const handleClickOutside = (e) => {
    if (collapseRef.current && !collapseRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const autocompleteHandler = async (searchTerm) => {
    try {
      const res = await autoCompleteApi(searchTerm).unwrap();

      setSearchResults(res.data);
      handleToggle();
    } catch (e) {
      console.log("error in AutoSearch: ", e);
    }
  };

  /// useEffects

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    clearTimeout(autoCompleteRef.current);
    if (testSearch.length) {
      autoCompleteRef.current = setTimeout(async () => {
        autocompleteHandler(testSearch);
      }, 1000);
    }
  }, [testSearch]);

  return (
    <Search disabled>
      <StyledInputbase
        placeholder="Search"
        value={testSearch}
        onChange={(e) => {
          setTestSearch(e.target.value);
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() => {
                setSearchResults([]);
                if (testSearch.length) {
                  dispatch(setSearchTerm(testSearch));
                }
              }}
            >
              <SearchOutlinedIcon sx={{ color: "black" }} />
            </IconButton>
          </InputAdornment>
        }
      />
      <Collapse
        in={open}
        ref={collapseRef}
        sx={{
          position: "absolute",
          backgroundColor: "#eeee",
          color: "#000",
          top: "",
          right: 2,
          marginTop: 0.5,
          width: " 98%",
          paddingX: "0.5rem",
          paddingTop: "0.5rem",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          maxHeight: "25rem",
          overflow: "auto",
          zIndex: 50,
        }}
      >
        {searchResults.length > 0 ? (
          searchResults.map((item, index) => {
            return (
              <div key={index}>
                <Link
                  onClick={() => setOpenSearchBox(false)}
                  to={`/OneProductDetails/${item.SKU}`}
                  style={{
                    color: "black",
                    listStyle: "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: ".5rem",
                      "&:hover": { backgroundColor: "black", color: "#ffff" },
                      transition: ".3s",
                    }}
                  >
                    <Box> {item.Name} </Box>
                  </Box>
                </Link>
              </div>
            );
          })
        ) : (
          <div>
            <li style={{ listStyle: "none", padding: ".5rem" }}>
              Item not found
            </li>
          </div>
        )}
      </Collapse>
    </Search>
  );
};

export default SearchBar;
