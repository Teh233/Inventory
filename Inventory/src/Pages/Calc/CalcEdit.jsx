import React, { useState } from "react";
import { Box, styled, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetCalcQuery } from "../../features/api/productApiSlice";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const CalcEdit = () => {
  /// initialization
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  /// rtk query
  const { data, isLoading, refetch } = useGetCalcQuery();

  /// local state

  const [row, setRow] = useState([]);

  useEffect(() => {
    if (data?.success) {
      let newRows = data.data.map((item, index) => {
        return {
          ...item,
          id: index,
          createdAt: new Date(item.createdAt),
          Sno: index + 1,
          NoOfProducts: item.Product.length,
        };
      });

      setRow(newRows);
    }
  }, [data]);

  const columns = [
    { field: "Sno", headerName: "Sno", minWidth: 70 },
    { field: "CalcId", headerName: "ID", minWidth: 120 },
    { field: "description", headerName: "Description", minWidth: 200 },
    { field: "NoOfProducts", headerName: "No of Products", minWidth: 150 },
    { field: "createdAt", headerName: "Date", type: "date", minWidth: 150 },
    {
      field: "action",
      headerName: "Action",
      minWidth: 90,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              navigate(`/calc/${params.row["_id"]}`);
            }}
          >
            View
          </Button>
        );
      },
    },
  ];
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Box>
        <DataGrid rows={row} columns={columns} pageSize={5} />
      </Box>
    </Box>
  );
};

export default CalcEdit;
