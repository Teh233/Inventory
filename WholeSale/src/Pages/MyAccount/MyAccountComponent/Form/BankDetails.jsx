import { React, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FormControl,
  TextField,
  Typography,
  Grid,
  FormControlLabel,
  Button,
  Autocomplete
} from "@mui/material";

import Checkbox from "@mui/material/Checkbox";

export default function BankDetails({
  errors,
  register,
  onNext,
  handleSubmit,
  bankDetails,
  setbankDetails,
  setValue 
}) {
  
  const onSubmit = (data) => {
    onNext(data);
    setbankDetails(data);
    console.log(data)
  };

  const  option = [
    "Savings Account"
   ,
   
    "Current Account"
  ,
   
   ]
  

  return (
    <>
      <Typography variant="h6" gutterBottom></Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} >
            <TextField
                 required
              id="beneficiaryName"
              name="beneficiaryName"
              label="Beneficiary Name"
             {...register("beneficiaryName", {
                required: true,
                pattern: {
                  value: /^[A-Za-z\s]{3,}$/,
                  message:
                    "Name must be above 3 characters and only contain alphabets",
                },
              })}
              error={!!errors.beneficiaryName}
              helperText={errors.beneficiaryName ? errors.beneficiaryName.message : ""}
              fullWidth
              autoComplete="shipping address-line1"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
                  required
              id="accountNumber"
              name="accountNumber"
              {...register('accountNumber', { required: "Account number required"}, { shouldUnregister: true })}
              label="Account Number"
               fullWidth
              autoComplete="family-name"
              variant="standard"
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="bankName"
              name="bankName"
              label="Bank Name"
              fullWidth
              autoComplete="given-name"
              autoFocus
              variant="standard"
              {...register('bankName', { required: "Bank Name required"})}

              error={!!errors.bankName}
              helperText={errors.bankName ? errors.bankName.message : ""}
            />
          </Grid>
         
          <Grid item xs={12} sm={6}>
          <Autocomplete
           required
           {...register('accountType', { required: "Account type required"}, { shouldUnregister: true })}
        id="accountType"
        name="accountType"
        label="Account Type"
        options={option}
        onChange={(event, value) => {
          setValue('accountType', value); // Set the value using setValue

        }}
        sx={{ width: '100%' }}
        renderInput={(params) => (
          <TextField
            variant="standard"
            {...params}
            label="Account Type"
            error={!!errors.accountType}
            helperText={errors.accountType?.message}
          />
          )}
          />
          </Grid>
          <Grid item xs={12} sm={6} >
            <TextField
              id="branchName"
              name="branchName"
              label="Branch Name"
              {...register("branchName", { required: false })}
              // value={personaldetails.address1}
              // onChange={handleInput}
              fullWidth
              autoComplete="shipping address-line1"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6} >
            <TextField
                required
                {...register('ifscCode', { required: "IFSC Code required"}, { shouldUnregister: true })}
              id="ifscCode"
              name="ifscCode"
              label="Branch IFSC Code"
              fullWidth
              autoComplete="shipping address-line1"
              variant="standard"
            />
          </Grid>
          
          <Grid item xs={12}  >
            <TextField
              id="alternatecompanyName"
              name="alternatecompanyName"
              label="If you have an alternate company name"
              {...register("alternatecompanyName", { required: false })}
              // value={personaldetails.address1}
              // onChange={handleInput}
              fullWidth
              autoComplete="shipping address-line1"
              variant="standard"
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
