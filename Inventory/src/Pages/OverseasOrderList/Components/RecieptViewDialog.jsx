import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import { CancelRounded } from '@mui/icons-material';

const RecieptViewDialog = ({ url, open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        sx={{ backdropFilter: 'blur(5px)',  }}
        open={open}
        onClose={handleClose}
        maxWidth='xl'
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              flex: '1',
              textAlign: 'center',
            }}
          >
            Preview
          </Typography>
          <CancelRounded onClick={handleClose} sx={{ fontSize: '1.8rem' }} />
        </DialogTitle>
        <DialogContent>
          <div className='pdfContainer'>
            <iframe
              src={url}
              allowFullScreen=''
              frameBorder='0'
              width='1000px'
              height={580}
              title='PDF Preview'
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecieptViewDialog;
