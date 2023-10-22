import React from 'react';
import { formatIndianPrice } from '../../../commonFunctions/commonFunctions';
import {
  Box,
  Typography,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from '@mui/material';

const StyleSpan = styled('span')(({ theme }) => ({
  padding: '2px',
  border: '0.5px solid black',
  background: theme.palette.mode === 'dark' ? '#fff' : '#fff',
  color: theme.palette.mode === 'dark' ? 'black' : 'black',
  borderRadius: '5px',
}));

const StyleTableCell = styled(TableCell)(({ theme }) => ({
  // background: theme.palette.mode === "dark" ? "black" : "#fff",
  color: theme.palette.mode === 'dark' ? '#fff' : '#fff',
  padding: 3,
  fontSize: '12px',
}));

function OtherCharges({
  product,
  regularBillentryValue,
  warehouseChargeValue,
  bankChargeValue,
  otherChargeValue,
  totalOtherCharge,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        border: '1px solid #fff',
      }}
    >
      {/* <Typography variant="body2" gutterBottom>
        Regular Bill Entry Charge:{" "} <StyleSpan >
        {formatIndianPrice(regularBillentryValue[product.SKU])}
        </StyleSpan>
      </Typography>
      <Typography variant="body2" gutterBottom>
        Warehouse Charge: <StyleSpan> {formatIndianPrice(warehouseChargeValue[product.SKU])}   </StyleSpan>
      </Typography>
      <Typography variant="body2" gutterBottom>
        Bank Charge : <StyleSpan>{formatIndianPrice(bankChargeValue[product.SKU])}</StyleSpan>
      </Typography>
      <Typography variant="body2" gutterBottom>
        Other Charge: <StyleSpan> {formatIndianPrice(otherChargeValue[product.SKU])} </StyleSpan>
      </Typography>
      <Typography variant="body2" gutterBottom>
        Total Other Charge : <StyleSpan>{formatIndianPrice(totalOtherCharge[product.SKU])} </StyleSpan>
      </Typography> */}

      {/* <TableContainer>
          <Table
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: 'none',
              },
            }}
          >
            <TableBody>
              <TableRow>
                <StyleTableCell>Regular Bill Entry Charge</StyleTableCell>
                <StyleTableCell>
                  <Typography variant='body2' gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(regularBillentryValue[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell>Warehouse Charge</StyleTableCell>
                <StyleTableCell>
                  <Typography variant='body2' gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(warehouseChargeValue[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell> Bank Charge</StyleTableCell>
                <StyleTableCell>
                  <Typography variant='body2' gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(bankChargeValue[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
                <StyleTableCell> Other Charge</StyleTableCell>
                <StyleTableCell>
                  <Typography variant='body2' gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(otherChargeValue[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
              </TableRow>
              <TableRow>
                <StyleTableCell> Total Other Charge</StyleTableCell>
                <StyleTableCell>
                  <Typography variant='body2' gutterBottom>
                    <StyleSpan>
                      {formatIndianPrice(totalOtherCharge[product.SKU])}
                    </StyleSpan>
                  </Typography>
                </StyleTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer> */}

      {/* this is new component for this component */}
      <Box
        sx={{
          backgroundColor: '#cce6ff',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          placeItems: 'center',
          justifyItems: 'center',
          gap: '.3rem',
          padding: '.5rem',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: '.7rem', fontWeight: '400' }}>
            Regular Bill entry
          </Typography>
          <input
            type='text'
            style={{
              border: '1px solid #9999ff',
              borderRadius: '.2rem',
              boxShadow: '0px 8px 4px -4px #00000024',
              width: '7rem',
            }}
            value={formatIndianPrice(regularBillentryValue[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '.7rem', fontWeight: '400' }}>
            Warehouse Charge
          </Typography>
          <input
            type='text'
            style={{
              border: '1px solid #9999ff',
              borderRadius: '.2rem',
              boxShadow: '0px 8px 4px -4px #00000024',
              width: '7rem',
            }}
            value={formatIndianPrice(warehouseChargeValue[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '.7rem', fontWeight: '400' }}>
            Other Charge
          </Typography>
          <input
            type='text'
            style={{
              border: '1px solid #9999ff',
              borderRadius: '.2rem',
              boxShadow: '0px 8px 4px -4px #00000024',
              width: '7rem',
            }}
            value={formatIndianPrice(otherChargeValue[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '.7rem', fontWeight: '400' }}>
            Bank Charge
          </Typography>
          <input
            type='text'
            style={{
              border: '1px solid #9999ff',
              borderRadius: '.2rem',
              boxShadow: '0px 8px 4px -4px #00000024',
              width: '7rem',
            }}
            value={formatIndianPrice(bankChargeValue[product.SKU])}
            disabled={true}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '.7rem', fontWeight: '400' }}>
            Total Other Charge
          </Typography>
          <input
            type='text'
            style={{
              border: '1px solid #9999ff',
              borderRadius: '.2rem',
              boxShadow: '0px 8px 4px -4px #00000024',
              width: '7rem',
            }}
            value={formatIndianPrice(totalOtherCharge[product.SKU])}
            disabled={true}
          />
        </Box>
        
      </Box>
    </Box>
  );
}

export default OtherCharges;
