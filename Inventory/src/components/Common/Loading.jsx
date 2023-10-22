import React from "react";
import { Box, CircularProgress, styled } from "@mui/material";

const StyleBox = styled(Box)(({ theme }) => ({
  position:"absolute",
  left: "50%",
  bottom: "50%",
 zIndex:1000,

}));

const Loading = ({ loading }) => {
  return loading ? (
    <StyleBox>
      <CircularProgress />
    </StyleBox>
  ) : null;
};

export default Loading;
