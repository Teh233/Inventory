import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Input,
  CircularProgress,
  Box,
} from '@mui/material';
import { useUploadOverseasRecieptMutation } from '../../../features/api/RestockOrderApiSlice';

// circular progress styles

const PaymenUploadDialog = ({ open, onClose, id, refetch }) => {
  /// local state
  const [file, setFile] = useState(null);

  /// rtk query

  const [uploadRecieptApi, { isLoading }] = useUploadOverseasRecieptMutation();

  /// handlers
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    try {
      const formdata = new FormData();
      formdata.append('reciept', file);
      const params = {
        id: id,
        body: formdata,
      };
      const res = await uploadRecieptApi(params).unwrap();

      if (res.status === 'success') {
        refetch();
        onClose();
        setFile(null);
      }
    } catch (error) {
      console.error('An error occurred during Upload Reciept:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            overflow: 'hidden',
            padding: '1rem',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <div>
          {' '}
          <DialogTitle>Upload Payment Receipt</DialogTitle>
          <DialogContent>
            <Input
              type='file'
              accept='.pdf, image/*'
              fullWidth
              required
              onChange={handleFileChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={handleUpload} color='primary'>
              Upload
            </Button>
          </DialogActions>
        </div>
      )}
    </Dialog>
  );
};

export default PaymenUploadDialog;
