import { React } from "react";
import { Box, styled } from "@mui/material";
import UploadImageGrid from "./component/UploadImageGrid";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const UploadImageCom = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%",overflow: "hidden" }}
    >
      <DrawerHeader />
      <UploadImageGrid />
    </Box>
  );
};

export default UploadImageCom;
