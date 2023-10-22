import { React } from "react";
import { Box, styled } from "@mui/material";
import ApprovalGrid from "./Components/ApprovalGrid";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Approval = () => {


  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
    >
      <DrawerHeader />
      <ApprovalGrid />
    </Box>
  );
};

export default Approval;
