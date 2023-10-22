import { useState, React, useEffect } from 'react';
import {
  TextField,
  Box,
  Toolbar,
  styled,
  Grid,
  Typography,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

export default function DocumentDetails({
  file,
  setFile,
  errorShow,
  seterrorShow,
}) {
  const Styledinput = styled('input')({
    display: 'none',
  });
  const [error, setError] = useState({
    GST_error: '',
    file_error: '',
  });
  const validation = () => {
    let error_msg = false;
    if (file.GST_no[0]) {
      if (
        !/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{1,15}$/.test(file.GST_no) &&
        file.GST_no[0]
      ) {
        setError({ ...error, GST_error: 'Invalid GST number' });
        error_msg = true;
      } else if (
        /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{1,15}$/.test(file.GST_no) ||
        file.GST_no[0] === ''
      ) {
        setError({ GST_error: '' });
        error_msg = false;
      }
    }
  };
  useEffect(() => {
    if (file.GST_file === '') {
      setFile({ ...file, required: true });
    } else {
      setFile({ ...file, required: false });
    }
  }, [file.GST_file]);

  return (
    <>
      {/* <Typography variant="h6" gutterBottom>
        Payment method
      </Typography> */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id='GSTinput'
            label='GST No'
            value={file.GST_no}
            onBlur={validation}
            fullWidth
            error={error.GST_error?.length > 0}
            helperText={error.GST_error?.length > 0 ? error.GST_error : ''}
            onChange={(e) => setFile({ ...file, GST_no: e.target.value })}
            autoComplete='cc-name'
            variant='standard'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id='msme'
            label='MSME No'
            fullWidth
            autoComplete='cc-exp'
            onChange={(e) => setFile({ ...file, MSME_no: e.target.value })}
            variant='standard'
          />
        </Grid>
        <Grid
          sx={{   }}
          item
          xs={12}
          md={6}
        >
          <Typography textAlign='center'>Upload GST Certificate</Typography>
          <Styledinput
            type='file'
            accept='.jpg , .jpeg ,.pdf'
            id='GST'
            name='GST'
            // label="Upload Certitfcate"
            onChange={(e) => {
              setFile({ ...file, GST_file: e.target.files });
            }}
          />
          <Box textAlign='center'>
            <label htmlFor='GST'>
              {file.GST_file === '' ? (
                <AddPhotoAlternateIcon
                  sx={{ color: 'blue', fontSize: '2.5rem' }}
                />
              ) : (
                <AddPhotoAlternateIcon
                  sx={{ color: 'green', fontSize: '2.5rem' }}
                />
              )}
            </label>
          </Box>
        </Grid>
        <Grid  item xs={12} md={6}>
          <Typography textAlign='center'>Upload MSME Certificate</Typography>
          <Styledinput
            type='file'
            accept='.jpg , .jpeg ,.pdf'
            id='MSME'
            name='GST'
            // label="Upload Certitfcate"
            onChange={(e) => {
              setFile({ ...file, MSME_file: e.target.files });
            }}
          />
          <Box textAlign='center'>
            <label htmlFor='MSME'>
              {file.MSME_file === '' ? (
                <AddPhotoAlternateIcon
                  sx={{ color: 'blue', fontSize: '2.5rem' }}
                />
              ) : (
                <AddPhotoAlternateIcon
                  sx={{ color: 'green', fontSize: '2.5rem' }}
                />
              )}
            </label>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography textAlign='center'>Upload Company Logo</Typography>
          <Styledinput
            type='file'
            accept='.jpg , .jpeg ,.pdf'
            id='logoFile'
            name='logoFile'
            // label="Upload Certitfcate"
            onChange={(e) => {
              setFile({ ...file, logoFile: e.target.files });
            }}
          />
          <Box textAlign='center'>
            <label htmlFor='logoFile'>
              {file.logoFile === '' ? (
                <AddPhotoAlternateIcon
                  sx={{ color: 'blue', fontSize: '2.5rem' }}
                />
              ) : (
                <AddPhotoAlternateIcon
                  sx={{ color: 'green', fontSize: '2.5rem' }}
                />
              )}
            </label>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography textAlign='center'>Upload Cancel Cheque</Typography>
          <Styledinput
            type='file'
            accept='.jpg , .jpeg ,.pdf'
            id='chequeFile'
            name='chequeFile'
            // label="Upload Certitfcate"
            onChange={(e) => {
              setFile({ ...file, chequeFile: e.target.files });
            }}
          />
          <Box textAlign='center'>
            <label htmlFor='chequeFile'>
              {file.chequeFile === '' ? (
                <AddPhotoAlternateIcon
                  sx={{ color: 'blue', fontSize: '2.5rem' }}
                />
              ) : (
                <AddPhotoAlternateIcon
                  sx={{ color: 'green', fontSize: '2.5rem' }}
                />
              )}
            </label>
          </Box>
        </Grid>
        {errorShow ? (
          <Typography variant='body2' color='red'>
            Please note that the submission of both the GST certificate and
            Cancelled cheque is mandatory. Kindly ensure that you upload both
            documents.
          </Typography>
        ) : (
          ''
        )}
      </Grid>
    </>
  );
}
