import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Box,
  Button,
  Paper,
  styled,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  InputBase,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { ViewCertificate } from "../../../components/Common/DialogBox";
import { useVerifySellerMutation } from "../../../features/api/sellerApiSlice";
import { useSetPersonalDetailsQuery } from "../../../features/api/SellerDetailsAndAddressSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ViewbankDetails } from "../../../components/Common/DialogBox";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#fff",
  height: "100%",
  width: "70%",
}));
const StyledInput = styled(InputBase)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#fff",
  border: "1px solid grey",
  borderRadius: "5px",
}));
const useStyles = makeStyles({
  tableCell: {
    padding: "8px 50px", // Adjust the padding as needed,
    fontWeight: 700,
  },
  IconButton: {
    fontSize: "18px",
    color: "blue",
    paddingLeft: "20px",
    "&:hover": {
      color: "red",
    },
  },
  save: {
    fontSize: "15px",
    color: "green",
    paddingLeft: "20px",
    // paddingTop: "15px",
    alignContent: "center",
    "&:hover": {
      color: "black",
      backgroundColor: "transparent",
    },
  },
});

const MyAccountDetails = () => {
  /// initialization
  const id = useParams().id;
  const status = useLocation().search.substring(1);
  const navigate = useNavigate();
  const [openbankDetails, setopenbankDetails] = useState(false);

  const classes = useStyles();
  const [openView, setOpenview] = useState(false);
  const [FileType, setFileType] = useState("");

  const { refetch, data: personalDetails } = useSetPersonalDetailsQuery(id);
  const [verifySeller] = useVerifySellerMutation();

  /// handler

  const handleVerify = async (value) => {
    try {
      const data = {
        id: id,
        body: {
          personalQuery: value,
        },
      };
      const res = await verifySeller(data).unwrap();
      toast.success(`Seller Verifcation Complete`);
      navigate("/sellerVerify");
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };
  const handleDialog = (e) => {
    if (e === "bankDetails") {
      setopenbankDetails(!openbankDetails);
    } else {
      setOpenview(!openView);
    }
    if (e) {
      setFileType(e);
    }
  };
  // console.log("personalDetails", personalDetails);
  return (
    <Box
      sx={{
        mt: 2,
        m: 2,
        height: "auto",

        display: "flex",
        justifyContent: "center",
      }}
    >
      <StyledPaper>
        <Typography
          variant="h5"
          align="center"
          p={2}
          sx={{ textDecoration: "underline" }}
        >
          {" "}
          Seller Personal Details{" "}
        </Typography>
        <Grid container align="center"></Grid>

        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={classes.tableCell}>
                  Company Name
                </TableCell>
                <TableCell>{personalDetails?.details.companyName} </TableCell>
                <TableCell className={classes.tableCell}>
                  Company Type
                </TableCell>
                <TableCell>{personalDetails?.details.companyType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableCell}>
                  Concern Person
                </TableCell>

                <TableCell>{personalDetails?.details.concernPerson}</TableCell>
                <TableCell className={classes.tableCell}>
                  Alternate Company Name
                </TableCell>
                <TableCell>
                  {personalDetails?.details.alternateCompanyName
                    ? personalDetails?.details.alternateCompanyName
                    : "Not available"}
                </TableCell>
                {/* <TableCell className={classes.tableCell}></TableCell> */}
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableCell}>Email</TableCell>
                <TableCell> {personalDetails?.details.email} </TableCell>
                <TableCell className={classes.tableCell}>
                  Alternate Email
                </TableCell>
                <TableCell>
                  {" "}
                  {personalDetails?.details.alternateEmailId}{" "}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableCell}>
                  Mobile number
                </TableCell>
                <TableCell>{personalDetails?.details.mobileNo}</TableCell>

                <TableCell className={classes.tableCell}>
                  Alternate Mobile number
                </TableCell>
                <TableCell>
                  {" "}
                  {personalDetails?.details.alternateMobileNo}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableCell}>Address 1</TableCell>
                <TableCell>
                  {personalDetails?.details.address[0]?.addressLine1}{" "}
                </TableCell>
                <TableCell className={classes.tableCell}>Address 2</TableCell>
                <TableCell>
                  {personalDetails?.details.address[0]?.addressLine2}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableCell}>City</TableCell>
                <TableCell>
                  {personalDetails?.details.address[0]?.city}
                </TableCell>
                <TableCell className={classes.tableCell}>State</TableCell>
                <TableCell>
                  {personalDetails?.details.address[0]?.state}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableCell}>Pin code</TableCell>
                <TableCell>
                  {personalDetails?.details.address[0]?.pincode}
                </TableCell>
                <TableCell className={classes.tableCell}>Country</TableCell>
                <TableCell>
                  {personalDetails?.details.address[0]?.country}{" "}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableCell}>GST Number</TableCell>
                <TableCell>{personalDetails?.details.gst} </TableCell>
                <TableCell className={classes.tableCell}>
                  GST Certificate
                </TableCell>
                <TableCell>
                  <Button
                    disabled={
                      personalDetails?.details.files.gstFile ? false : true
                    }
                    onClick={() => handleDialog("GST")}
                  >
                    View
                  </Button>
                  {openView && FileType === "GST" && (
                    <ViewCertificate
                      open={openView}
                      handleDialog={handleDialog}
                      personalDetails={personalDetails}
                      FileType={FileType}
                    />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableCell}>MSME Number</TableCell>
                <TableCell>
                  {personalDetails?.details.msme
                    ? personalDetails?.details.msme
                    : "Not available"}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  MSME Certificate
                </TableCell>
                <TableCell>
                  <Button
                    disabled={
                      personalDetails?.details.files.msmeFile ? false : true
                    }
                    onClick={() => handleDialog("MSME")}
                  >
                    View
                  </Button>
                  {openView && FileType === "MSME" && (
                    <ViewCertificate
                      open={openView}
                      handleDialog={handleDialog}
                      personalDetails={personalDetails}
                      FileType={FileType}
                    />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableCell}>
                  Bank details
                </TableCell>
                <TableCell>
                  <Button
                    disabled={
                      personalDetails?.details.files.msmeFile ? false : true
                    }
                    onClick={() => handleDialog("bankDetails")}
                  >
                    View
                  </Button>
                  {openbankDetails && (
                    <ViewbankDetails
                      open={openbankDetails}
                      handleDialog={handleDialog}
                      personalDetails={personalDetails}
                      FileType={FileType}
                      classestableCell={classes.tableCell}
                    />
                  )}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  Cancel Cheque
                </TableCell>
                <TableCell>
                  <Button
                    disabled={
                      personalDetails?.details.files.gstFile ? false : true
                    }
                    onClick={() => handleDialog("Cheque")}
                  >
                    View
                  </Button>
                  {openView && FileType === "Cheque" && (
                    <ViewCertificate
                      open={openView}
                      handleDialog={handleDialog}
                      personalDetails={personalDetails}
                      FileType={FileType}
                    />
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {status === "submit" ? (
            <Box
              sx={{
                mt: 10,
                display: "flex",
                justifyContent: "space-evenly",
                gap: "1rem",
              }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  handleVerify("verify");
                }}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ background: "red" }}
                onClick={() => {
                  handleVerify("reject");
                }}
              >
                Reject
              </Button>
            </Box>
          ) : (
            ""
          )}
        </TableContainer>
      </StyledPaper>
    </Box>
  );
};

export default MyAccountDetails;
