import { React } from "react";
import {
  TextField,
  Typography,
  Grid,
  Button,
  Autocomplete,
} from "@mui/material";

export default function AddressDetails({
  errors,
  register,
  onNext,
  handleSubmit,
  setPersonaldetails,
  setValue,
  city,
  district,
  state,
  country,
  pincodeError,
  handlePincodeChange,
}) {
  const onSubmit = (data) => {
    onNext(data);
    setPersonaldetails(data);
    
  };

  const option = [
    "Private Limited Company",
    "Public Limited Company",
    "One Person Company ",
    "Limited Liability Partnership ",
    "Sole Proprietorship",
    "Partnership Firm",
    "Section 8 Company",
    "Producer Company",
  ];

  return (
    <>
      <Typography variant="h6" gutterBottom></Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              id="CompanyName"
              name="companyName"
              label="Company Name"
              fullWidth
              autoComplete="given-name"
              autoFocus
              variant="standard"
              {...register("companyName", {
                required: true,
                pattern: {
                  value: /^[A-Za-z\s]{4,}$/,
                  message:
                    "Name must be above 3 characters and only contain alphabets",
                },
              })}
              error={!!errors.firstName}
              helperText={errors.firstName ? errors.firstName.message : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              required
              {...register(
                "companyType",
                { required: "Company type required" },
                { shouldUnregister: true }
              )}
              id="companyType"
              name="companyType"
              label="Company Type"
              options={option}
              onChange={(event, value) => {
                setValue("companyType", value);
              }}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  {...params}
                  label="Company Type"
                  error={!!errors.companyType}
                  helperText={errors.companyType?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="concernPerson"
              name="concernPerson"
              {...register("concernPerson", {
                required: true,
                pattern: {
                  value: /^[A-Za-z\s]{4,}$/,
                  message:
                    "Name must be above 3 characters and only contain alphabets",
                },
              })}
              label="Contact Person "
              fullWidth
              autoComplete="family-name"
              variant="standard"
              error={!!errors.concernPerson}
              helperText={errors.concernPerson?.message}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              required
              id="mobile"
              name="mobile"
              {...register("mobile", {
                required: true,
                pattern: {
                  value: /^\d{10}$/,
                  message: "Mobile Number should be a 10-digit number",
                },
              })}
              label="Mobile"
              type="number"
              error={!!errors.mobile}
              helperText={errors.mobile ? errors.mobile.message : ""}
              fullWidth
              autoComplete="mobile address-line1"
              variant="standard"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
           
              id="mobileAlternate"
              name="mobileAlternate"
              {...register("mobileAlternate", {
                required: false,
                pattern: {
                  value: /^\d{10}$/,
                  message: "Mobile Number should be a 10-digit number",
                },
              })}
              label="Alternate Mobile No."
              type="number"
              error={!!errors.mobileAlternate}
              helperText={errors.mobileAlternate ? errors.mobileAlternate.message : ""}
              fullWidth
              autoComplete="mobile address-line1"
              variant="standard"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              required
              id="email"
              name="Email"
              label="Email"
              {...register("email", {
                required: true,
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Invalid Email Id",
                },
              })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              fullWidth
              autoComplete="email address-line1"
              variant="standard"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
          
              id="emailAlternate"
              name="emailAlternate"
              label="Alternate Email Id"
              {...register("emailAlternate", {
                required: false,
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Invalid Email Id",
                },
              })}
              error={!!errors.emailAlternate}
              helperText={errors.emailAlternate ? errors.emailAlternate.message : ""}
              fullWidth
              autoComplete="email address-line1"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="address1"
              name="address1"
              label="Address line 1"
              {...register("address1", { required: false })}
              // value={personaldetails.address1}
              // onChange={handleInput}
              fullWidth
              autoComplete="shipping address-line1"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="address2"
              name="address2"
              label="Address line 2"
              {...register("address2", { required: false })}
              fullWidth
              autoComplete="shipping address-line2"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              id="zip"
              name="pincode"
              type="number"
              label="Zip / Postal code"
              fullWidth
              {...register("pincode", {
                required: true,
                pattern: {
                  value: /^\d{6}$/,
                  message: "Invalid Pin code",
                },
              })}
              error={!!errors.pincode || !!pincodeError}
              helperText={errors.pincode ? errors.pincode.message : ""}
              autoComplete="Invalid Pin code"
              variant="standard"
              onChange={handlePincodeChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="city"
              name="city"
              label="City"
              // {...register("city", { required: false })}
              fullWidth
              autoComplete="shipping address-level2"
              variant="standard"
              value={city}
              onChange={(e)=>{
                
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="district"
              name="district"
              // {...register("district", { required: false })}
              label="District"
              fullWidth
              variant="standard"
              value={district}
             
            
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="state"
              name="state"
              // {...register("state", { required: false })}
              label="State/Province/Region"
              fullWidth
              variant="standard"
              value={state}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="country"
              name="country"
              label="Country"
              // {...register("country", { required: false })}
              fullWidth
              autoComplete="shipping country"
              variant="standard"
              value={country}
            />
          </Grid>
          <Button
            variant="contained"
            // onClick={handleNext}
            type="submit"
            sx={{ mt: 3, ml: "auto" }}
          >
            Next
          </Button>
        </Grid>
      </form>
    </>
  );
}
