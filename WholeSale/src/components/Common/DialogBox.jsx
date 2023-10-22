import React, { useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  styled,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  useAddAddressMutation,
  useGetAddressQuery,
  useUpdateAddressMutation,
} from '../../features/api/SellerDetailsAndAddressSlice';
import { useSelector } from 'react-redux';
import Loading from './Loading';
import { toast } from 'react-toastify';
import BASEURL from '../../constants/BaseApi';
import CancelIcon from '@mui/icons-material/Cancel';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  boxSizing: 'border-box',
  paddingY: 0,
  paddingX: 0,
}));

export const ViewCertificate = ({
  open,
  handleDialog,
  personalDetails,
  FileType,
}) => {
  return (
    <Dialog open={open} onClose={() => handleDialog('')} maxWidth='xl'>
      <DialogTitle>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant='span'
            sx={{
              textDecoration: 'underline',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {FileType === 'cheque'
              ? 'Cancel ' + FileType
              : FileType + ' Certificate'}
          </Typography>
          <Typography
            variant='span'
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => handleDialog(FileType)}
          >
            <CancelIcon />
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <iframe
          src={
            FileType === 'GST'
              ? personalDetails?.details?.files?.gstFile?.url
              : FileType === 'MSME'
              ? personalDetails?.details.files?.msmeFile?.url
              : FileType === 'cheque'
              ? personalDetails?.details?.cancelCheque?.url
              : ''
          }
          allowFullScreen=''
          frameBorder='0'
          width='900vh'
          height={820}
        ></iframe>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export const ViewbankDetails = ({
  open,
  handleDialog,
  personalDetails,
  FileType,
  classestableCell,
  isMobile,
}) => {
  return (
    <Dialog open={open} onClose={() => handleDialog(FileType)} maxWidth='xl'>
      <DialogTitle>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant='span'
            sx={{
              textDecoration: 'underline',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Bank Details
          </Typography>
          <Typography
            variant='span'
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => handleDialog(FileType)}
          >
            <CancelIcon />
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Table
          aria-label='simple table'
          size={isMobile ? 'small' : 'medium'}
          sx={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignContent: 'center',

            tableLayout: isMobile ? 'fixed' : 'auto',
          }}
        >
          <TableBody>
            <TableRow>
              <StyledTableCell
                sx={{
                  display: isMobile ? 'inline-block' : 'table-cell',
                  width: isMobile ? '100%' : 'auto',
                  textAlign: isMobile && 'center',
                }}
                className={classestableCell}
              >
                Beneficiary Name
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  display: isMobile ? 'inline-block' : 'table-cell',
                  width: isMobile ? '100%' : 'auto',
                  textAlign: isMobile && 'center',
                }}
              >
                {personalDetails?.details.nameOfBeneficiary}{' '}
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  display: isMobile ? 'inline-block' : 'table-cell',
                  width: isMobile ? '100%' : 'auto',
                  textAlign: isMobile && 'center',
                }}
                className={classestableCell}
              >
                Account Number
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  display: isMobile ? 'inline-block' : 'table-cell',
                  width: isMobile ? '100%' : 'auto',
                  textAlign: isMobile && 'center',
                }}
              >
                {personalDetails?.details.accountNumber}
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell
                sx={{
                  display: isMobile ? 'inline-block' : 'table-cell',
                  width: isMobile ? '100%' : 'auto',
                  textAlign: isMobile && 'center',
                }}
                className={classestableCell}
              >
                Bank Name
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  display: isMobile ? 'inline-block' : 'table-cell',
                  width: isMobile ? '100%' : 'auto',
                  textAlign: isMobile && 'center',
                }}
              >
                {personalDetails?.details.bankName}{' '}
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  display: isMobile ? 'inline-block' : 'table-cell',
                  width: isMobile ? '100%' : 'auto',
                  textAlign: isMobile && 'center',
                }}
                className={classestableCell}
              >
                IFSC Code
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  display: isMobile ? 'inline-block' : 'table-cell',
                  width: isMobile ? '100%' : 'auto',
                  textAlign: isMobile && 'center',
                }}
              >
                {personalDetails?.details.ifscCode}
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell
                sx={{
                  display: isMobile ? 'inline-block' : 'table-cell',
                  width: isMobile ? '100%' : 'auto',
                  textAlign: isMobile && 'center',
                }}
                className={classestableCell}
              >
                Branch Name
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  display: isMobile ? 'inline-block' : 'table-cell',
                  width: isMobile ? '100%' : 'auto',
                  textAlign: isMobile && 'center',
                }}
              >
                {personalDetails?.details.bankBranch}{' '}
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  display: isMobile ? 'inline-block' : 'table-cell',
                  width: isMobile ? '100%' : 'auto',
                  textAlign: isMobile && 'center',
                }}
                className={classestableCell}
              >
                Account Type
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  display: isMobile ? 'inline-block' : 'table-cell',
                  width: isMobile ? '100%' : 'auto',
                  textAlign: isMobile && 'center',
                }}
              >
                {personalDetails?.details.accountType}
              </StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

const AddAddressDialog = ({ open, onClose, addressId }) => {
  /// global state
  const sellerId = useSelector((state) => state.auth?.userInfo?.sellerId);

  /// local state
  const [isEditing, setIsEditing] = useState(false);

  /// rtk query
  const [addAddress, { isLoading: isLoading }] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const { data: addressData, refetch } = useGetAddressQuery(sellerId);

  /// useForm
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const dialogTitle = isEditing ? 'Edit Address' : 'Add Address';

  /// useEffect
  useEffect(() => {
    setIsEditing(!!addressId);
    reset();
  }, [addressId, reset]);

  useEffect(() => {
    if (isEditing && addressData) {
      const address = addressData.Address.find(
        (item) => item._id === addressId
      );
      if (address) {
        // Pre-fill the input fields with the existing address data
        setValue('name', address.name);
        setValue('mobileNo', address.mobileNo);
        setValue('city', address.city);
        setValue('pincode', address.pincode);
        setValue('state', address.state);
        setValue('country', address.country);
        setValue('addressLine1', address.addressLine1);
        setValue('addressLine2', address.addressLine2);
      }
    }
  }, [isEditing, addressData, addressId, setValue]);

  /// handlers
  const onSubmit = async (data) => {
    const requestData = {
      ...data,
      sellerId: sellerId,
    };
    try {
      if (isEditing) {
        // Call the updateAddress mutation with the form data and addressId
        await updateAddress({ addressId, sellerId, data }).unwrap();
      } else {
        // Call the addAddress mutation with the form data
        await addAddress(requestData).unwrap();
      }
      reset();
      onClose();
      refetch();
    } catch (error) {
      console.error('An error occurred during DialogBox:', error);
    }
  };

  return (
    <Box>
      {isLoading ? (
        <Loading />
      ) : (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant='span'
                sx={{
                  textDecoration: 'underline',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {dialogTitle}
              </Typography>
              <Typography
                variant='span'
                sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={onClose}
              >
                <CancelIcon />
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('name', { required: true })}
                label='Name'
                error={!!errors.name}
                helperText={errors.name ? 'Name is required' : ''}
                fullWidth
                margin='normal'
              />
              <TextField
                {...register('mobileNo', {
                  required: true,
                  pattern: {
                    value: /^\d{10}$/,
                    message: 'Mobile Number should be a 10-digit number',
                  },
                })}
                label='Mobile Number'
                error={!!errors.mobileNo}
                helperText={errors.mobileNo ? errors.mobileNo.message : ''}
                fullWidth
                margin='normal'
              />
              <TextField
                {...register('city', { required: true })}
                label='City'
                error={!!errors.city}
                helperText={errors.city ? 'City is required' : ''}
                fullWidth
                margin='normal'
              />
              <TextField
                {...register('pincode', {
                  required: true,
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'Pincode should be an 6-digit number',
                  },
                })}
                label='Pincode'
                error={!!errors.pincode}
                helperText={errors.pincode ? errors.pincode.message : ''}
                fullWidth
                margin='normal'
              />
              <TextField
                {...register('state', { required: true })}
                label='State'
                error={!!errors.state}
                helperText={errors.state ? 'State is required' : ''}
                fullWidth
                margin='normal'
              />
              <TextField
                {...register('country', { required: true })}
                label='Country'
                error={!!errors.country}
                helperText={errors.country ? 'Country is required' : ''}
                fullWidth
                margin='normal'
              />
              <TextField
                {...register('addressLine1', { required: true })}
                label='Address Line 1'
                error={!!errors.addressLine1}
                helperText={
                  errors.addressLine1 ? 'Address Line 1 is required' : ''
                }
                fullWidth
                margin='normal'
              />
              <TextField
                {...register('addressLine2')}
                label='Address Line 2'
                fullWidth
                margin='normal'
              />
              <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  disabled={isLoading}
                >
                  {isLoading ? <Loading /> : isEditing ? 'Update' : 'Save'}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default AddAddressDialog;
