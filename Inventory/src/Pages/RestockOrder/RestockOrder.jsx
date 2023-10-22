import { React } from "react";
import { Box, styled } from "@mui/material";
import RestockGrid from "./Component/RestockGrid";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const RestockOrder = () => {
  return (
    <Box
    component='main'
    sx={{
      flexGrow: 1,
      p: 0,
      width: '100%',

      // overflowY: 'auto',

    }}
  >
      <DrawerHeader />
      <RestockGrid />
    </Box>
  );
};

export default RestockOrder;
