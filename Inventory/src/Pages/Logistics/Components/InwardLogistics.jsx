import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Autocomplete,
  TextField,
  tableCellClasses,
  styled,
  Button,
  Box,
  CircularProgress,

} from "@mui/material";
import { toast } from "react-toastify";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  useAddLogisticsMutation,
  useGetAllLogisticsQuery,
} from "../../../features/api/logisticsApiSlice";
import Loading from "../../../components/Common/Loading";

import { retry } from "@reduxjs/toolkit/dist/query";
import { formatDate } from "../../../commonFunctions/commonFunctions";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    backgroundImage: "linear-gradient(180deg, #0C97FA 26.71%, #008380 99.36%)",
    padding: 3,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 20,
  },
}));

const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
  padding: 3,
  "& input": {
    height: "10px",
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const InwardLogistics = () => {
  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /// local state
  const [formfield, setFromfield] = useState({
    HAWB: "",
    PI: "",
    CI: "",
    Box: "",
    CourierType: "",
  });
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const[dateLogs,setDatelogs] = useState("");


console.log(dateLogs)
  /// rtk query

  const [addLogisticApi, { isLoading }] = useAddLogisticsMutation();
  const {
    data: allLogisticsData,
    refetch,
    isLoading: allLogisticeLoading,
  } = useGetAllLogisticsQuery();
  /// handlers

  const handleSubmit = async () => {
    try {
      let isExist = [];

      for (const key in formfield) {
        if (!formfield[key]) {
          isExist.push(key);
          break;
        }
      }

      if (isExist.length) {
        toast.error(`${isExist.join("")} is required`);
        return;
      }

      const params = {
        HAWB: formfield.HAWB,
        PI: formfield.PI,
        CI: formfield.CI,
        Box: +formfield.Box,
        CourierType: formfield.CourierType,
        LogisticDate:dateLogs,
      };

      const res = await addLogisticApi(params).unwrap();
      toast.success(res.message);
      setFromfield({
        HAWB: "",
        PI: "",
        CI: "",
        Box: "",
        CourierType: formfield.CourierType,
      });
      setDatelogs("")
      refetch();
    } catch (e) {
      console.log("error at Add Logistics", e);
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;

    setFromfield({ ...formfield, [name]: value });
  };

  /// useEffects
  useEffect(() => {
    if (allLogisticsData?.status === "success") {
      const newRows = allLogisticsData.data.map((item, index) => {
        return {
          id: index,
          logisticId: item.logisticId,
          Sno: index + 1,
          date: formatDate(item.Date),
          HAWB: item.Hawb,
          PI: item.Pi,
          CI: item.Ci,
          Boxes: item.Box,
          LogisticDate: formatDate(item.LogisticDate) ? formatDate(item.LogisticDate) : "N/A" ,
          Courier: item.CourierType,
          Note: item.Note,
        };
      });
      setRows(newRows);
    }
  }, [allLogisticsData]);

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.2,
      minWidth: 20,
      maxWidth: 50,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "date",
      headerName: "Current Date",
      flex: 0.2,
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "LogisticDate",
      headerName: "Logistic Date",
      flex: 0.2,
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "HAWB",
      headerName: "HAWB/MAWB",
      flex: 0.2,
      width: 400,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "PI",
      headerName: "PI",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CI",
      headerName: "CI",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Boxes",
      headerName: "No of Boxes",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Courier",
      headerName: "Courier Type",
      flex: 0.2,
      width: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.2,
      width: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <p>{params.row.Note === "inOffice" ? "Pending" : "Submitted"}</p>
        );
      },
    },
    {
      field: "Details",
      headerName: "Details",
      flex: 0.2,
      width: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div>
            <Button
              disabled={params.row.Note === "inOffice" ? true : false}
              onClick={() => {
                navigate(`/OneinwardLogistic/${params.row.logisticId}`);
              }}
            >
              Details
            </Button>
          </div>
        );
      },
    },
  ];
  const options = ["courier", "Cargo"];

  return (
    <>
      <TableContainer component={Paper} sx={{ height: 100 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow sx={{ bgcolor: "blue" }}>
            <StyledTableCell align="center">Logistics Date</StyledTableCell>
              <StyledTableCell align="center">HAWB/MAWB</StyledTableCell>
              <StyledTableCell align="center">PI</StyledTableCell>
              <StyledTableCell align="center">CI</StyledTableCell>
              <StyledTableCell align="center">Box</StyledTableCell>
              <StyledTableCell align="center">COURIER TYPE</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          {allLogisticeLoading ? (
            <Loading loading={allLogisticeLoading}/>
          ) : (
            <TableBody>
              <StyledTableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                 <StyledTableCell2 align="center">
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
             
                value={dateLogs}
                inputFormat="DD/MM/YYYY"
                onChange={(e) => {
                  setDatelogs(e);
                }}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    size="small"
                    sx={{ background: "white", mb: "24px" }}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
 
                </StyledTableCell2>
                <StyledTableCell2 align="center">
                  <TextField
                    placeholder="HAWB/MAWB"
                    name="HAWB"
                    value={formfield.HAWB}
                    onChange={handleOnChange}
                  />
                </StyledTableCell2>
                <StyledTableCell2>
                  <TextField
                    placeholder="Enter PI number"
                    name="PI"
                    value={formfield.PI}
                    onChange={handleOnChange}
                  />
                </StyledTableCell2>
                <StyledTableCell2>
                  <TextField
                    placeholder="Enter CI Number"
                    name="CI"
                    value={formfield.CI}
                    onChange={handleOnChange}
                  />
                </StyledTableCell2>

                <StyledTableCell2>
                  <TextField
                    placeholder="Enter No of Boxes"
                    name="Box"
                    value={formfield.Box}
                    onChange={handleOnChange}
                  />
                </StyledTableCell2>

                <StyledTableCell2>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={options}
                    onChange={(event) => {
                      setFromfield({
                        ...formfield,
                        CourierType: event.target.textContent,
                      });
                    }}
                    name="CourierType"
                    sx={{
                      width: 200,
                      "& .MuiInputBase-root": {
                        paddingBottom: 1,
                        marginTop: 1,
                      },
                      "& input": {
                        background: "transparent",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Courier Type"
                        sx={{ marginBottom: "10px" }}
                      />
                    )}
                  />
                </StyledTableCell2>

                <StyledTableCell2>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </StyledTableCell2>
              </StyledTableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <Box
        sx={{
          width: "100%",
          height: "78.3vh",
          "& .super-app-theme--header": {
            background: "#eee",
            color: "black",
            textAlign: "center",
          },
          "& .vertical-lines .MuiDataGrid-cell": {
            borderRight: "1px solid #e0e0e0",
          },
          "& .supercursor-app-theme--cell:hover": {
            background:
              "linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)",
            color: "white",
            cursor: "pointer",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            background: "#eee",
          },
          position: "relative",
        }}
      >
        <DataGrid
          Height={"69vh"}
          rowHeight={40}
          rows={rows}
          columns={columns}
        />
      </Box>
    </>
  );
};

export default InwardLogistics;
