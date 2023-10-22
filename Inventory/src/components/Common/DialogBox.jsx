import React, { useEffect, useState } from "react";
import {
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
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  useAddAddressMutation,
  useGetAddressQuery,
  useUpdateAddressMutation,
} from "../../features/api/SellerDetailsAndAddressSlice";
import { useSelector } from "react-redux";
import Loading from "./Loading";


export const ImageUploadDialog = ({ open, onClose, onImageUpload }) => {
  /// local state
  const [selectedImage, setSelectedImage] = useState(null);

  /// handlers
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };
  const handleImageSubmit = () => {
    onImageUpload(selectedImage);
    setSelectedImage(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload Image</DialogTitle>
      <DialogContent>
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleImageSelect}
        />
        <Button variant="contained" color="primary" onClick={handleImageSubmit}>
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export const ViewCertificate = ({
  open,
  handleDialog,
  personalDetails,
  FileType,
}) => {
  const gstFile = personalDetails?.details?.files?.gstFile?.url;
  const msmeFile = personalDetails?.details?.files?.msmeFile?.url;
  const cancelChequeFile = personalDetails?.details?.cancelCheque?.url;

  // Determine the appropriate URL based on FileType
  let certificateUrl = "";
  if (FileType === "GST") {
    certificateUrl = gstFile;
  } else if (FileType === "MSME") {
    certificateUrl = msmeFile;
  } else if (FileType === "Cheque") {
    certificateUrl = cancelChequeFile;
  }

  return (
    <Dialog open={open} onClose={() => handleDialog("")} maxWidth="xl">
      <DialogTitle>
        <Typography align="center" variant="body2">
          {FileType} Certificate
        </Typography>
      </DialogTitle>
      <DialogContent>
        <iframe
          src={certificateUrl}
          allowFullScreen=""
          frameBorder="0"
          width="900vh"
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
}) => {
  console.log(FileType);
  return (
    <Dialog open={open} onClose={() => handleDialog(FileType)} maxWidth="xl">
      <DialogTitle>
        <Typography
          align="center"
          variant="h6"
          sx={{ textDecoration: "underline" }}
        >
          Bank Details
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className={classestableCell}>
                Beneficiary Name
              </TableCell>
              <TableCell>
                {personalDetails?.details.nameOfBeneficiary}{" "}
              </TableCell>
              <TableCell className={classestableCell}>Account Number</TableCell>
              <TableCell>{personalDetails?.details.accountNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classestableCell}>Bank Name</TableCell>
              <TableCell>{personalDetails?.details.bankName} </TableCell>
              <TableCell className={classestableCell}>IFSC Code</TableCell>
              <TableCell>{personalDetails?.details.ifscCode}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classestableCell}>Branch Name</TableCell>
              <TableCell>{personalDetails?.details.bankBranch} </TableCell>
              <TableCell className={classestableCell}>Account Type</TableCell>
              <TableCell>{personalDetails?.details.accountType}</TableCell>
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
  const sellerId = useSelector((state) => state.auth.userInfo.data.sellerId);

  /// local state
  const [isEditing, setIsEditing] = useState(false);

  /// rtk query
  const [addAddress, { isLoading }] = useAddAddressMutation();
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

  const dialogTitle = isEditing ? "Edit Address" : "Add Address";

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
        setValue("name", address.name);
        setValue("mobileNo", address.mobileNo);
        setValue("city", address.city);
        setValue("pincode", address.pincode);
        setValue("state", address.state);
        setValue("country", address.country);
        setValue("addressLine1", address.addressLine1);
        setValue("addressLine2", address.addressLine2);
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
      console.error("An error occurred during DialogBox:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("name", { required: true })}
            label="Name"
            error={!!errors.name}
            helperText={errors.name ? "Name is required" : ""}
            fullWidth
            margin="normal"
          />
          <TextField
            {...register("mobileNo", {
              required: true,
              pattern: {
                value: /^\d{10}$/,
                message: "Mobile Number should be a 10-digit number",
              },
            })}
            label="Mobile Number"
            error={!!errors.mobileNo}
            helperText={errors.mobileNo ? errors.mobileNo.message : ""}
            fullWidth
            margin="normal"
          />
          <TextField
            {...register("city", { required: true })}
            label="City"
            error={!!errors.city}
            helperText={errors.city ? "City is required" : ""}
            fullWidth
            margin="normal"
          />
          <TextField
            {...register("pincode", {
              required: true,
              pattern: {
                value: /^\d{6}$/,
                message: "Pincode should be an 8-digit number",
              },
            })}
            label="Pincode"
            error={!!errors.pincode}
            helperText={errors.pincode ? errors.pincode.message : ""}
            fullWidth
            margin="normal"
          />
          <TextField
            {...register("state", { required: true })}
            label="State"
            error={!!errors.state}
            helperText={errors.state ? "State is required" : ""}
            fullWidth
            margin="normal"
          />
          <TextField
            {...register("country", { required: true })}
            label="Country"
            error={!!errors.country}
            helperText={errors.country ? "Country is required" : ""}
            fullWidth
            margin="normal"
          />
          <TextField
            {...register("addressLine1", { required: true })}
            label="Address Line 1"
            error={!!errors.addressLine1}
            helperText={errors.addressLine1 ? "Address Line 1 is required" : ""}
            fullWidth
            margin="normal"
          />
          <TextField
            {...register("addressLine2")}
            label="Address Line 2"
            fullWidth
            margin="normal"
          />
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? <Loading /> : isEditing ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressDialog;
