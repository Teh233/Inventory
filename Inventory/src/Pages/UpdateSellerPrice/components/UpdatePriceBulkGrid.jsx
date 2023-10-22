import React, { useState } from "react";
import {
  Button,
  Container,
  Grid,
  Paper,
  styled,
  Box,
  CircularProgress,
} from "@mui/material";
import CartGrid from "../../../components/Common/CardGrid";
import * as XLSX from "xlsx";
import { useUpdateProductsColumnMutation } from "../../../features/api/productApiSlice";
import Swal from "sweetalert2";
import BASEURL from "../../../constants/BaseApi";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import productColumnData from "../../../constants/ProductColumn";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useSocket } from "../../../CustomProvider/useWebSocket";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));

const UpdatePriceBulk = () => {
  /// initialization
  const query = useParams().query;
  const navigate = useNavigate();
  const socket = useSocket();

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  /// useEffect
  useEffect(() => {
    const queryExist = productColumnData.some((item) => item.name === query);
    if (!queryExist) {
      navigate(`/`);
    }
  }, [query]);

  /// local state
  const [excelData, setExcelData] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false);

  /// rtk query
  const [updateProductApi, { isLoading }] = useUpdateProductsColumnMutation();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Remove white spaces from the header row
      const headerRow = jsonData.shift().map((item) => item.trim());
      const processedHeaderRow = headerRow.map((item) =>
        item.startsWith("Name")
          ? item.replace(" (its not required for reference only)", "").trim()
          : item
      );
      const headerRowExist = processedHeaderRow.some(
        (item) => item.trim() === query
      );

      if (!headerRowExist) {
        toast.error("Invalid Excel Format");
        return;
      }

      const excelObjects = jsonData.map((row, index) =>
        row.reduce(
          (obj, value, columnIndex) => {
            // Remove white spaces from the cell values
            const trimmedValue =
              typeof value === "string" ? value.trim() : value;
            return {
              ...obj,
              [processedHeaderRow[columnIndex]]: trimmedValue,
            };
          },
          {
            Sno: index + 1,
            id: index + 1,
          }
        )
      );

      setExcelData(excelObjects);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    try {
      const params = {
        products: excelData.map((item) => {
          return { SKU: item.SKU, value: item[query] };
        }),
      };

      const res = await updateProductApi({
        type: query,
        body: params,
      }).unwrap();
      const liveStatusData = {
        message: `${userInfo.name} updated ${query} of ${params.products
          .map((product) => `${product.SKU} to ${product.value}`)
          .join(", ")} `,
        time: new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      };
      socket.emit("liveStatusServer", liveStatusData);
      if (res.status === "success") {
        Swal.fire({
          icon: "success",
          title: `Product ${query} Updated`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
    setExcelData([]);
  };

  const handleDownloadSample = async () => {
    try {
      setDownloadLoading(true);
      const response = await axios.get(
        `${BASEURL}/Sample/${query}Sample.xlsx`,
        {
          responseType: "blob",
        }
      );

      // Create a temporary link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${query}Sample.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadLoading(false);
    } catch (error) {
      console.error("Error downloading sample:", error);
    } finally {
    }
  };
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 80,

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Name",
      headerName: "Name",
      flex: 0.3,
      minWidth: 240,

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: `${query}`,
      headerName: `${query}`,
      flex: 0.3,
      minWidth: 80,

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
  ];
  return (
    <Container>
      <Grid container alignItems="center" justifyContent="center" spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item xs={6} style={{ textAlign: "start" }}>
                <input
                  type="file"
                  accept=".xls, .xlsx"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    disabled={query === "Quantity"}
                    variant="contained"
                    component="span"
                  >
                    Upload Excel File
                  </Button>
                </label>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "end" }}>
                <Button
                  disabled={query === "Quantity" || downloadLoading}
                  variant="contained"
                  color="primary"
                  onClick={handleDownloadSample}
                >
                  {downloadLoading ? <CircularProgress size={24} color="inherit"  /> : "Download Sample"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          {excelData.length > 0 && (
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Grid>
      </Grid>

      <StyledBox>
        <Grid item xs={12} sx={{ mt: "5px" }}>
          <CartGrid
            columns={columns}
            rows={excelData}
            rowHeight={40}
            Height={"80vh"}
          />
        </Grid>
      </StyledBox>
    </Container>
  );
};

export default UpdatePriceBulk;
