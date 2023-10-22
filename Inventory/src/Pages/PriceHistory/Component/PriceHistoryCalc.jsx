import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material';
import { useAddPriceHistoryMutation } from '../../../features/api/PriceHistoryApiSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

function PriceHistoryCalc({
  data,
  successdisplay,
  open,
  setOpen,
  handleSelectionChange,
  selectedItems,
}) {
  /// local state

  const [usdCommon, setUSDcommon] = useState('');
  const [qty, setQty] = useState({});
  const [usdValue, setUSDValue] = useState({});
  const [rmbValue, setRMBValue] = useState({});

  /// rtk query
  const [addpriceHistory, { isLoading: addpriceHistoryLoading }] =
    useAddPriceHistoryMutation();

  /// handlers

  const handleChange = (SKU, value, name) => {
    if (name === 'usdCommon') {
      setUSDcommon(value);
      let newRMBValue = {};

      data.forEach((row, index) => {
        newRMBValue[row.SKU] =
          (usdValue[row.SKU] || 0) * (qty[row.SKU] || 0) * value;
      });

      setRMBValue(newRMBValue);
    }

    if (name === 'qty') {
      setQty((prev) => {
        return { ...prev, [SKU]: value };
      });
    }
    if (name === 'rmbValue') {
      setRMBValue((prev) => {
        return { ...prev, [SKU]: value };
      });

      let newUSDValue = {};

      data.forEach((row, index) => {
        if (row.SKU === SKU) {
          newUSDValue[row.SKU] = ((value || 0) / (usdCommon || 0)).toFixed(2);
        } else {
          newUSDValue[row.SKU] = usdValue[row.SKU];
        }
      });

      setUSDValue(newUSDValue);
    }
    if (name === 'usdValue') {
      setUSDValue((prev) => {
        return { ...prev, [SKU]: value };
      });

      let newRMBValue = {};

      data.forEach((row, index) => {
        if (row.SKU === SKU) {
          newRMBValue[row.SKU] = ((value || 0) * (usdCommon || 0)).toFixed(2);
        } else {
          newRMBValue[row.SKU] = rmbValue[row.SKU];
        }
      });

      setRMBValue(newRMBValue);
    }
  };

  const handleDelete = (id) => {
    const newSelectedItems = selectedItems.filter((row) => row !== id);
    handleSelectionChange(newSelectedItems);
    if (!newSelectedItems.length) {
      setOpen(false);
    }
    console.log(newSelectedItems);
  };

  const handleHistoryUpdate = async () => {
    try {
      if (!usdCommon) {
        toast.error('please add Conversion Rate');
        return;
      }
      const apiData = data
        .map((item) => {
          if (!rmbValue[item.SKU] || !usdValue[item.SKU]) {
            return null;
          }
          return {
            SKU: item.SKU,
            priceHistory: [
              {
                conversionRate: usdCommon,
                Quantity: +qty[item.SKU],
                RMB: +rmbValue[item.SKU],
                USD: +usdValue[item.SKU],
              },
            ],
          };
        })
        .filter((item) => item);

      const res = await addpriceHistory(apiData).unwrap();

      successdisplay();
      handleSelectionChange([]);
      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ backgroundColor: 'green' }}>
      <Dialog sx={{}} open={open} onClose={handleClose} maxWidth='xl'>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem',
          }}
        >
          <h2 style={{flex: "1", textAlign:"center",}}>Enter conversion rate</h2>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'right',
              paddingX: '1rem',
              gap: '.5rem',
            }}
          >
            <span>1 USD$ = </span>
            {/* <TextField
            type='number'
            value={usdCommon}
            onChange={(e) => {
              handleChange(null, e.target.value, 'usdCommon');
            }}
          /> */}
            <input
              style={{ padding: '.2rem', fontSize: '1rem', width: '4rem' }}
              type='number'
              value={usdCommon}
              onChange={(e) => {
                handleChange(null, e.target.value, 'usdCommon');
              }}
            />
          </Box>
        </Box>

        <DialogContent>
          <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead sx={{ backgroundColor: '#03084E' }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff', backgroundColor: '#03084E' }}>
                    Sno
                  </TableCell>
                  <TableCell sx={{ color: '#fff', backgroundColor: '#03084E' }}>
                    SKU
                  </TableCell>
                  <TableCell sx={{ color: '#fff', backgroundColor: '#03084E' }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: '#fff', backgroundColor: '#03084E' }}>
                    Quantity
                  </TableCell>
                  <TableCell sx={{ color: '#fff', backgroundColor: '#03084E' }}>
                    GST
                  </TableCell>
                  <TableCell sx={{ color: '#fff', backgroundColor: '#03084E' }}>
                    Qty
                  </TableCell>
                  <TableCell sx={{ color: '#fff', backgroundColor: '#03084E' }}>
                    RMB
                  </TableCell>
                  <TableCell sx={{ color: '#fff', backgroundColor: '#03084E' }}>
                    USD
                  </TableCell>
                  <TableCell sx={{ color: '#fff', backgroundColor: '#03084E' }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ padding: '.5rem' }}>{index + 1}</TableCell>
                    <TableCell sx={{ padding: '.5rem' }}>{row.SKU}</TableCell>
                    <TableCell sx={{ padding: '.5rem' }}>{row.Name}</TableCell>
                    <TableCell sx={{ padding: '.5rem' }}>{row.Brand}</TableCell>
                    <TableCell sx={{ padding: '.5rem' }}>{row.gst}</TableCell>
                    <TableCell sx={{ padding: '.5rem' }}>
                      <input
                        style={{
                          width: '4rem',
                          height: '2rem',
                          padding: '.6rem',
                        }}
                        name='qty'
                        type='number'
                        value={qty[row.SKU] || ''}
                        onChange={(e) => {
                          handleChange(row.SKU, e.target.value, 'qty');
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: '.5rem' }}>
                      <input
                        style={{
                          width: '4rem',
                          height: '2rem',
                          padding: '.6rem',
                        }}
                        name='rmb'
                        type='number'
                        value={rmbValue[row.SKU] || ''}
                        onChange={(e) => {
                          handleChange(row.SKU, e.target.value, 'rmbValue');
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: '.5rem' }}>
                      <input
                        style={{
                          width: '4rem',
                          height: '2rem',
                          padding: '.6rem',
                        }}
                        type='number'
                        name='usd'
                        value={usdValue[row.SKU] || ''}
                        onChange={(e) => {
                          handleChange(row.SKU, e.target.value, 'usdValue');
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: '.5rem' }}>
                      <Button
                        onClick={() => {
                          handleDelete(row.id);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'right',
            padding: '.6rem',
            gap: '1rem',
          }}
        >
          <Button variant='contained' onClick={handleHistoryUpdate}>
            {addpriceHistoryLoading ? <CircularProgress /> : 'Save'}
          </Button>
          <Button variant='outlined' onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Dialog>
    </div>
  );
}

export default PriceHistoryCalc;
