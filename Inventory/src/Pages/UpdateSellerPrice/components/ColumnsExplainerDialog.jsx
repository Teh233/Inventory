import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";

const ColumnsExplainerDialog = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { id: "columnName", label: "Column Name" },
    { id: "aboutColumn", label: "About Column" },
  ];

  const data = [
    { id: 1, columnName: "SKU", aboutColumn: "Unique Id to identify product" },
    { id: 2, columnName: "Product", aboutColumn: "Name of the Product" },
    { id: 3, columnName: "Brand", aboutColumn: "Brand of the Product" },
    {
      id: 4,
      columnName: "Category",
      aboutColumn: "Category of Product which it belongs to ",
    },
    { id: 5, columnName: "MRP", aboutColumn: "MRP of product" },
    {
      id: 6,
      columnName: "Threshold",
      aboutColumn:
        "This denotes Minimum level of stock before the Product should be order again ",
    },
    {
      id: 7,
      columnName: "QTY",
      aboutColumn:
        "This denotes the quantity of product which are verified through our barcode system ",
    },
    { id: 8, columnName: "Cost", aboutColumn: "Landing Cost of Product " },
    {
      id: 9,
      columnName: "Cost +(gst)",
      aboutColumn: "Landing Cost Including GST",
    },
    {
      id: 10,
      columnName: "GST",
      aboutColumn: "GST percentage being levied on the product",
    },
    {
      id: 11,
      columnName: "SP %",
      aboutColumn: "Sales Profit percentage Respect to Cost",
    },
    {
      id: 12,
      columnName: "ST %",
      aboutColumn: "Income Tax Percentage levied On SalePrice",
    },
    {
      id: 13,
      columnName: "SP Tax %",
      aboutColumn:
        "Sales Profit percentage Respect to Cost and Sales IncomeTax",
    },
    { id: 14, columnName: "S price ₹", aboutColumn: "Sales Price" },
    { id: 15, columnName: "WP %", aboutColumn: "Profit on WholeSale Price" },
    {
      id: 16,
      columnName: "WT %",
      aboutColumn: "Income Tax Percentage levied On WholeSale Price ",
    },
    {
      id: 17,
      columnName: "WP Tax %",
      aboutColumn:
        "WholeSale Profit percentage Respect to Cost and WholeSales IncomeTax",
    },
    { id: 18, columnName: "W price ₹", aboutColumn: "WholeSale Price" },
    {
      id: 19,
      columnName: "History",
      aboutColumn: "To Check Update History of Product",
    },
  ];

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Column Summary
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Column Summary</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{column.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column, index) => (
                      <TableCell key={index}>{row[column.id]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
      </Dialog>
    </div>
  );
};

export default ColumnsExplainerDialog;
