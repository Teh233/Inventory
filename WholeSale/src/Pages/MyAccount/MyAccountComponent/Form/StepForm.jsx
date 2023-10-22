import { React, useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddressDetails from "./AddressDetails";
import DocumentDetails from "./DocumentDetails";
import BankDetails from "./BankDetails";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateDetailsAndAddressMutation } from "../../../../features/api/SellerDetailsAndAddressSlice";
import { setCredentials } from "../../../../features/slice/authSlice";
const steps = ["Company details", "Bank Details", "Certificate Upload"];
import axios from "axios";
import Loading from "../../../../components/Common/Loading";

const StyledBox = styled(Step)(({ theme }) => ({
  "& ": {
    display: "flex !important",
    flexDirection: "column !important",
  },
}));
export default function Checkout() {
  const navigate = useNavigate();
  const sellerId = useSelector((state) => state?.auth?.userInfo?.sellerId);
  // rtk query
  const [addsellerDetails, { isLoading, iserror }] =
    useCreateDetailsAndAddressMutation();
  const dispatch = useDispatch();
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState({
    MSME_file: "",
    GST_file: "",
    GST_no: "",
    MSME_no: "",
    logoFile: "",
    chequeFile: "",
    required: false,
  });
  const [personaldetails, setPersonaldetails] = useState();
  const [bankDetails, setbankDetails] = useState();
  const [errorShow, seterrorShow] = useState(false);

  // used pincode api for auto field state city country using pincoe
  const handlePincodeChange = (event) => {
    const pincode = event.target.value;
    if (pincode.length >= 5) {
      axios
        .get(`https://api.postalpincode.in/pincode/${pincode}`)
        .then((response) => {
          const data =
            response.data && response.data.length > 0 ? response.data[0] : null;
          // console.log(data)
          if (data && data.PostOffice) {
            const postOffice =
              data.PostOffice.length > 0 ? data.PostOffice[0] : null;
            if (postOffice) {
              setCity(postOffice.Block);
              setDistrict(postOffice.District);
              setState(postOffice.State);
              setCountry(postOffice.Country);
              setPincodeError("");
            }
          } else {
            setDistrict("");
            setCity("");
            setState("");
            setCountry("");
            setPincodeError("Invalid pincode"); // Set the pincode error message
            console.log("No records found for the provided pincode");
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  };

  // using useForm from react useForm
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <AddressDetails
            errors={errors}
            handleSubmit={handleSubmit}
            register={register}
            onNext={handleNext}
            personaldetails={personaldetails}
            setPersonaldetails={setPersonaldetails}
            setValue={setValue}
            city={city}
            state={state}
            country={country}
            district={district}
            pincodeError={pincodeError}
            handlePincodeChange={handlePincodeChange}
          />
        );
      case 1:
        return (
          <BankDetails
            errors={errors}
            handleSubmit={handleSubmit}
            register={register}
            onNext={handleNext}
            bankDetails={bankDetails}
            setbankDetails={setbankDetails}
            setValue={setValue}
          />
        );
      case 2:
        return (
          <DocumentDetails
            setFile={setFile}
            file={file}
            seterrorShow={seterrorShow}
            errorShow={errorShow}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }
  // handle next step for form stepper
  const handleNext = async () => {
    if (activeStep === 0 || activeStep === 1) {
      setActiveStep(activeStep + 1);
    }
    if (file.GST_file && file.chequeFile && activeStep === steps.length - 1) {
      const formData = new FormData();
      formData.append("sellerId", sellerId);
      formData.append("mobileNo", +personaldetails.mobile);
      formData.append("companyName", personaldetails.companyName);
      formData.append("companyType", personaldetails.companyType);
      formData.append("concernPerson", personaldetails.concernPerson);
      formData.append("email", personaldetails.email);
      formData.append("gst", file.GST_no);
      formData.append("msme", file.MSME_no);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("district", district);
      formData.append("pincode", +personaldetails.pincode);
      formData.append("country", country);
      formData.append("bankName", bankDetails.bankName);
      formData.append("bankBranch", bankDetails.branchName);
      formData.append("accountNumber", bankDetails.accountNumber);
      formData.append("accountType", bankDetails.accountType);
      formData.append("alternateCompanyName", bankDetails.alternatecompanyName);
      formData.append("ifscCode", bankDetails.ifscCode);
      formData.append("alternateMobileNo", personaldetails.mobileAlternate);
      formData.append("alternateEmailId", personaldetails.emailAlternate);
      formData.append("nameOfBeneficiary", bankDetails.beneficiaryName);
      formData.append("addressLine1", personaldetails.address1);
      formData.append("addressLine2", personaldetails.address2);
      if (file.GST_file?.[0]) {
        formData.append("gstFile", file.GST_file[0]);
      }
      if (file.MSME_file?.[0]) {
        formData.append("msmeFile", file.MSME_file[0]);
      }
      if (file.chequeFile?.[0]) {
        formData.append("chequeFile", file.chequeFile[0]);
      }
      if (file.logoFile?.[0]) {
        formData.append("logoFile", file.logoFile[0]);
      }

      try {
        const res = await addsellerDetails(formData).unwrap();
        dispatch(setCredentials(res.data));
        navigate("/myAccount");
        toast.success("Form Submitted Successfully");
      } catch (err) {
        console.error("An error occurred during StepForm:", err);
      }
    } else if (activeStep === 2) {
      seterrorShow(true);
    }
  };

  // handle back for form stepper
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    if (file.GST_file && file.chequeFile) {
      seterrorShow(false);
    }
  }, [file.GST_file, file.chequeFile]);

  return (
    <Box>
      <CssBaseline />
      {isLoading ? (
        <Loading />
      ) : (
        <Container component="main" maxWidth="md">
          <Paper
            variant="outlined"
            sx={{ my: { xs: 2, md: 2, xl: 1.5, xxl: 1 }, p: { xs: 2, md: 3 } }}
          >
            <Typography component="h1" variant="h4" align="center">
              {activeStep === 0
                ? "Company details"
                : activeStep === 1
                ? "Bank Details"
                : activeStep === 2
                ? "Certificate Upload"
                : ""}
            </Typography>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{ pt: 3, pb: 5 }}
            >
              {steps.map((label) => (
                <StyledBox key={label}>
                  <StepLabel>{label}</StepLabel>
                </StyledBox>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              ""
            ) : (
              <>
                {getStepContent(activeStep)}
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  {activeStep !== 0 && (
                    <Button
                      onClick={handleBack}
                      sx={
                        activeStep === 1
                          ? { position: "relative", bottom: 30 }
                          : ""
                      }
                    >
                      Back
                    </Button>
                  )}

                  {activeStep === 2 ? (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      // disabled={file.GST_file && file.chequeFile ? false : true}
                      type="submit"
                      sx={activeStep === 1 ? { mt: 3, ml: 1 } : { ml: "auto" }}
                    >
                      Save
                    </Button>
                  ) : (
                    ""
                  )}
                </Box>
              </>
            )}
          </Paper>
        </Container>
      )}
    </Box>
  );
}
