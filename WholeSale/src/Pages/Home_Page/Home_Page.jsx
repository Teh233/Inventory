import { React, useState,useEffect } from "react";
import "./Home_Page.css";
import { Box, styled } from "@mui/material";
import Content from "../../components/Common/Content";
import { useGetAllProductQuery } from "../../features/api/productApiSlice";
import ToggleNav from "../../components/Common/Togglenav";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#eee",
  height: "100vh",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const Home_Page = () => {
  const [filterString, setFilterString] = useState("page=0");

  const handleInfiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.scrollHeight
    ) {
      console.log("hiiiii"); // Fetch more data when the user reaches the bottom
    }
  };
  
  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
  
    return () => {
      window.removeEventListener("scroll", handleInfiniteScroll);
    };
  }, []);


  const {
    data: allProductData,
    error,
    isLoading,
    isFetching,
    isSuccess,
  } = useGetAllProductQuery(filterString);

  return (
    <StyledBox sx={{ display: "flex", gap: "10px" }}>
      <ToggleNav filterString={filterString} allProductData={allProductData} />

      <Box component="main" sx={{ p: 0, width: "100%", overflow:"hidden" }}>
        <DrawerHeader />
        <Content
          allProductData={allProductData}
          productLoading={isLoading}
          setFilterString={setFilterString}
          filterString={filterString}
          isFetching={isFetching}
        />
      </Box>
    </StyledBox>
  );
};

export default Home_Page;
