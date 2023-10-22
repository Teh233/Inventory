import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

// const Columns = ['Sno', 'SKU', 'Product'];
// const vendor = ['Hilda', 'Jinping', 'Putin'];

// const data = [
//   { sno: 1, sku: 'SKU123', product: 'Product A', hilda: 'Hilda Data' },
//   { sno: 2, sku: 'SKU456', product: 'Product B', jinping: 'Jinping Data' },
//   { sno: 3, sku: 'SKU789', product: 'Product C', putin: 'Putin Data' },

// ];


const PriceComparisionComponent = () => {

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {Columns.map((column) => (
              <TableCell key={column}>{column}</TableCell>
            ))}
            {vendor.map((v) => (
              <TableCell key={v}>{v}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.sno}>
              <TableCell>{row.sno}</TableCell>
              <TableCell>{row.sku}</TableCell>
              <TableCell>{row.product}</TableCell>
              {vendor.map((v) => (
                <TableCell key={v}>{row[v.toLowerCase()]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PriceComparisionComponent;
