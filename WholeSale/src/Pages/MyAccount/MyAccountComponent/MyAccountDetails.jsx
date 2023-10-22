import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { ViewCertificate } from "../../../components/Common/DialogBox";
import { ViewbankDetails } from "../../../components/Common/DialogBox";
import { useGetSellerDetailsQuery } from "../../../features/api/SellerDetailsAndAddressSlice";
import { useSetUpdateSellerDocumentMutation } from "../../../features/api/SellerDetailsAndAddressSlice";
import { toast } from "react-toastify";
import MyAccountDetailsMobile from "./MyAccountDetailsMobile";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#fff",
  height: "100%",
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
  // set component according to screen
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1053);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1053);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const theme = useTheme();
  const isSmorDown = useMediaQuery(theme.breakpoints.between("xxs", "md"));
  const classes = useStyles();
  const [openView, setOpenview] = useState(false);
  const [openbankDetails, setopenbankDetails] = useState(false);
  const [FileType, setFileType] = useState("");
  const sellerId = useSelector((state) => state.auth?.userInfo?.sellerId);
  const [updateSellerDocs] = useSetUpdateSellerDocumentMutation();
  const { refetch, data: personalDetails } = useGetSellerDetailsQuery(sellerId);

  const [EditDetails, setEditDetails] = useState(
    {
      concernPerson: "",
      mobile: "",
      altEmail: "",
      altMobile: "",
    },
    []
  );

  const handleEdit = (e) => {
    setEditDetails({ ...EditDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setEditDetails({
      concernPerson: personalDetails?.details.concernPerson,
      mobile: personalDetails?.details.mobileNo,
      altEmail: personalDetails?.details.alternateEmailId,
      altMobile: personalDetails?.details.alternateMobileNo,
    });
  }, [personalDetails]);

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

  const [IsEditing, setIsEditing] = useState({
    firstname: false,
    lastname: false,
    mobile: false,
    altEmail: false,
    altMobile: false,
  });

  const openEdit = (e) => {
    if (e === "firstname") {
      setIsEditing({ ...IsEditing, firstname: true });
    } else if (e === "mobile") {
      setIsEditing({ ...IsEditing, mobile: true });
    } else if (e === "altEmail") {
      setIsEditing({ ...IsEditing, altEmail: true });
    } else if (e === "altMobile") {
      setIsEditing({ ...IsEditing, altMobile: true });
    }
  };
  const SaveEdit = async (e) => {
    if (e === "firstname") {
      setIsEditing({ ...IsEditing, firstname: false });
    } else if (e === "mobile") {
      setIsEditing({ ...IsEditing, mobile: false });
    } else if (e === "altEmail") {
      setIsEditing({ ...IsEditing, altEmail: false });
    } else if (e === "altMobile") {
      setIsEditing({ ...IsEditing, altMobile: false });
    }
    try {
      const data = {
        sellerId: sellerId,
        data: {
          concernPerson: EditDetails.concernPerson,
          mobileNo: EditDetails.mobile,
          alternateEmailId: EditDetails.altEmail,
          alternateMobileNo: EditDetails.altMobile,
        },
      };

      const res = await updateSellerDocs(data).unwrap();
      refetch();
    } catch (err) {
      console.log(err);
      if (err?.data?.message && Array.isArray(err.data.message)) {
        err.data.message.forEach((item) => {
          toast.error(item);
        });
      } else {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      {isMobileView ? (
        <MyAccountDetailsMobile
          allPersonalData={personalDetails}
          handleDialog={handleDialog}
          IsEditing={IsEditing}
          EditIcon={EditIcon}
          openEdit={openEdit}
          StyledInput={StyledInput}
          EditDetails={EditDetails}
          handleEdit={handleEdit}
          SaveEdit={SaveEdit}
          personalDetails={personalDetails}
          FileType={FileType}
          openView = {openView}
          openbankDetails={openbankDetails}
          classestableCell={classes.tableCell}
          
        />
      ) : (
        // the main component is starting
        <Box
          sx={{
            // width:"25rem",
            height: "auto",
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
              Personal Details{" "}
            </Typography>
            <Grid container align="center"></Grid>

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow
                    sx={{
                      display: isSmorDown ? "flex" : "",
                      flexDirection: isSmorDown ? "column" : "row",
                    }}
                  >
                    <TableCell
                      className={classes.tableCell}
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                    >
                      Company Name
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      {personalDetails?.details.companyName}{" "}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      Company Type
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      {personalDetails?.details.companyType}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      display: isSmorDown ? "flex" : "",
                      flexDirection: isSmorDown ? "column" : "row",
                    }}
                  >
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      Concern Person
                    </TableCell>
                    {IsEditing.firstname ? (
                      <TableCell>
                        <StyledInput
                          value={EditDetails.concernPerson}
                          name="concernPerson"
                          onChange={handleEdit}
                        />
                        <Button
                          className={classes.save}
                          onClick={() => SaveEdit("firstname")}
                        >
                          Save
                        </Button>{" "}
                      </TableCell>
                    ) : (
                      <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                        {personalDetails?.details.concernPerson}
                        <Button
                          className={classes.IconButton}
                          onClick={() => openEdit("firstname")}
                        >
                          {" "}
                          <EditIcon />{" "}
                        </Button>
                      </TableCell>
                    )}

                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      Alternate Company Name
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      {personalDetails?.details.alternateCompanyName
                        ? personalDetails?.details.alternateCompanyName
                        : "Not available"}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      display: isSmorDown ? "flex" : "",
                      flexDirection: isSmorDown ? "column" : "row",
                    }}
                  >
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      Email
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      {" "}
                      {personalDetails?.details.email}{" "}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center" }}
                      className={classes.tableCell}
                    >
                      Alternate Email
                    </TableCell>
                    {IsEditing.altEmail ? (
                      <TableCell>
                        <StyledInput
                          value={EditDetails.altEmail}
                          name="altEmail"
                          onChange={handleEdit}
                        />
                        <Button
                          className={classes.save}
                          onClick={() => SaveEdit("altEmail")}
                        >
                          Save
                        </Button>{" "}
                      </TableCell>
                    ) : (
                      <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                        {" "}
                        {personalDetails?.details.alternateEmailId}{" "}
                        <Button
                          className={classes.IconButton}
                          onClick={() => openEdit("altEmail")}
                        >
                          {" "}
                          <EditIcon />{" "}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                  <TableRow
                    sx={{
                      display: isSmorDown ? "flex" : "",
                      flexDirection: isSmorDown ? "column" : "row",
                    }}
                  >
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      Mobile number
                    </TableCell>

                    {IsEditing.mobile ? (
                      <TableCell>
                        <StyledInput
                          value={EditDetails.mobile}
                          onChange={handleEdit}
                          name="mobile"
                        />
                        <Button
                          className={classes.save}
                          onClick={() => SaveEdit("mobile")}
                        >
                          Save
                        </Button>{" "}
                      </TableCell>
                    ) : (
                      <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                        {personalDetails?.details.mobileNo}

                        <Button
                          className={classes.IconButton}
                          onClick={() => openEdit("mobile")}
                        >
                          {" "}
                          <EditIcon />{" "}
                        </Button>
                      </TableCell>
                    )}
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      Alternate Mobile number
                    </TableCell>
                    {IsEditing.altMobile ? (
                      <TableCell>
                        <StyledInput
                          value={EditDetails.altMobile}
                          onChange={handleEdit}
                          name="altMobile"
                        />
                        <Button
                          className={classes.save}
                          onClick={() => SaveEdit("altMobile")}
                        >
                          Save
                        </Button>{" "}
                      </TableCell>
                    ) : (
                      <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                        {" "}
                        {personalDetails?.details.alternateMobileNo}
                        <Button
                          className={classes.IconButton}
                          onClick={() => openEdit("altMobile")}
                        >
                          {" "}
                          <EditIcon />{" "}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow
                    sx={{
                      display: isSmorDown ? "flex" : "",
                      flexDirection: isSmorDown ? "column" : "row",
                    }}
                  >
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      Address 1
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      {personalDetails?.details.address[0]?.addressLine1}{" "}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      Address 2
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      {personalDetails?.details.address[0]?.addressLine2}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      display: isSmorDown ? "flex" : "",
                      flexDirection: isSmorDown ? "column" : "row",
                    }}
                  >
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      City
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      {personalDetails?.details.address[0]?.city}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      State
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      {personalDetails?.details.address[0]?.state}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      display: isSmorDown ? "flex" : "",
                      flexDirection: isSmorDown ? "column" : "row",
                    }}
                  >
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      Pin code
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      {personalDetails?.details.address[0]?.pincode}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      Country
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      {personalDetails?.details.address[0]?.country}{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      display: isSmorDown ? "flex" : "",
                      flexDirection: isSmorDown ? "column" : "row",
                    }}
                  >
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      GST Number
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      {personalDetails?.details.gst}{" "}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      GST Certificate
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      <Button
                        disabled={
                          personalDetails?.details.files.gstFile ? false : true
                        }
                        onClick={() => handleDialog("GST")}
                      >
                        View
                      </Button>
                      <ViewCertificate
                        open={openView}
                        handleDialog={handleDialog}
                        personalDetails={personalDetails}
                        FileType={FileType}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      display: isSmorDown ? "flex" : "",
                      flexDirection: isSmorDown ? "column" : "row",
                    }}
                  >
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      MSME Number
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      {personalDetails?.details.msme
                        ? personalDetails?.details.msme
                        : "Not available"}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      MSME Certificate
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      <Button
                        disabled={
                          personalDetails?.details.files.msmeFile ? false : true
                        }
                        onClick={() => handleDialog("MSME")}
                      >
                        View
                      </Button>
                      <ViewCertificate
                        open={openView}
                        handleDialog={handleDialog}
                        personalDetails={personalDetails}
                        FileType={FileType}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      display: isSmorDown ? "flex" : "",
                      flexDirection: isSmorDown ? "column" : "row",
                    }}
                  >
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      Bank details
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      <Button
                        disabled={
                          personalDetails?.details.files.msmeFile ? false : true
                        }
                        onClick={() => handleDialog("bankDetails")}
                      >
                        View
                      </Button>
                      <ViewbankDetails
                        open={openbankDetails}
                        handleDialog={handleDialog}
                        personalDetails={personalDetails}
                        FileType={FileType}
                        classestableCell={classes.tableCell}
                        isMobile ={false}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: isSmorDown ? "center" : "" }}
                      className={classes.tableCell}
                    >
                      Cancel Cheque
                    </TableCell>
                    <TableCell sx={{ textAlign: isSmorDown ? "center" : "" }}>
                      <Button
                        disabled={
                          personalDetails?.details.files.gstFile ? false : true
                        }
                        onClick={() => handleDialog("cheque")}
                      >
                        View
                      </Button>
                      <ViewCertificate
                        open={openView}
                        handleDialog={handleDialog}
                        personalDetails={personalDetails}
                        FileType={FileType}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Box>
      )}
    </>
  );
};

export default MyAccountDetails;
