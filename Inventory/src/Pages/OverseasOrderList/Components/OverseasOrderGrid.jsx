import React, { useEffect, useState } from "react";
import { Grid, Button, Box, styled, Typography } from "@mui/material";
import { useGetAllOverseasOrderQuery } from "../../../features/api/RestockOrderApiSlice";
import { useNavigate } from "react-router-dom";
import CartGrid from "../../../components/Common/CardGrid";
import Nodata from "../../../assets/error.gif";
import Loading from "../../../components/Common/Loading";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));

const OverseasOrderGrid = () => {
  const navigate = useNavigate();
  const {
    refetch,
    data: allOverSeasData,
    isLoading: overSeaseOrder,
  } = useGetAllOverseasOrderQuery();
  const [rows, setRows] = useState([]);

  // useEffect to handle data after fetching
  useEffect(() => {
    if (allOverSeasData?.status === "success") {
      const data = allOverSeasData.AllOverSeasData?.map((item, index) => {
        return {
          id: item["_id"],
          overSeasOrderId: item.overSeasOrderId,
          Sno: index + 1,
          CompanyName: item.CompanyName,
          ConcernPerson: item.ConcernPerson,
          Mobile: item.Mobile,
          date: new Date(item.createdAt).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
          status: item.status,
        };
      });

      setRows(data);
      // console.log(data);
    }
  }, [allOverSeasData]);

  // Define the columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.1,
      minWidth: 10,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "overSeasOrderId",
      headerName: "order Id",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CompanyName",
      headerName: "Company Name",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "ConcernPerson",
      headerName: "ConcernPerson ",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Mobile",
      headerName: "Mobile",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "details",
      headerName: "Details",
      sortable: false,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button
          onClick={() => {
            navigate(`/OverseasOrderlist/${params.row.id}`);
          }}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <StyledBox>
      <Loading loading={overSeaseOrder} />
      <Grid item xs={12} sx={{ mt: "5px" }}>
        <CartGrid
          components={{
            NoRowsOverlay: () => (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  style={{
                    width: "10%",
                  }}
                  src={Nodata}
                />
                <Typography variant="body2">No data found !</Typography>
              </Box>
            ),
          }}
          columns={columns}
          rows={rows}
          rowHeight={40}
          Height={"85vh"}
        />
      </Grid>
    </StyledBox>
  );
};

export default OverseasOrderGrid;
