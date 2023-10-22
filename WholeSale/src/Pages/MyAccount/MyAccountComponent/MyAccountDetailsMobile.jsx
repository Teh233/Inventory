import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  TableCell,
  Collapse,
} from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ViewCertificate } from "../../../components/Common/DialogBox";
import { ViewbankDetails } from "../../../components/Common/DialogBox";

const MyAccountDetailsMobile = ({
  allPersonalData,
  handleDialog,
  IsEditing,
  EditIcon,
  openEdit,
  StyledInput,
  EditDetails,
  handleEdit,
  SaveEdit,
  personalDetails,
  FileType,
  openView,
  openbankDetails,
  classestableCell,
}) => {
  const [companyTab, openCompanyTab] = useState(false);
  const [alternateCompanyTab, openAlternateCompanyTab] = useState(false);
  const [address1Tab, openAddress1Tab] = useState(false);
 const [address2Tab, openAddress2Tab] = useState(false);


  return (
    <Container>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        Personal Details
      </Typography>
      <ViewCertificate
        open={openView}
        handleDialog={handleDialog}
        personalDetails={personalDetails}
        FileType={FileType}
      />
      <ViewbankDetails
        open={openbankDetails}
        handleDialog={handleDialog}
        personalDetails={personalDetails}
        FileType={FileType}
        classestableCell={classestableCell}
        isMobile={true}
      />

      <Paper>
        <Box sx={{}}>
          <Box
            onClick={() => openCompanyTab(!companyTab)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: ".4rem",
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{}}>
              Company Name
            </Typography>
            <KeyboardArrowDownIcon
              sx={{
                transform: companyTab ? "rotate(180deg)" : "rotate(0deg)",
                transition: ".5s",
              }}
            />
          </Box>
          <Collapse in={companyTab} sx={{ padding: ".5rem" }}>
            <Typography sx={{ borderRadius: ".2rem" }}>
            {personalDetails?.details.companyName}
            </Typography>
          </Collapse>
        </Box>
        <hr />

        <Box sx={{}}>
          <Box
            onClick={() => openAlternateCompanyTab(!alternateCompanyTab)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: ".4rem",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Alternate Company Name
            </Typography>
            <KeyboardArrowDownIcon
              sx={{
                transform: alternateCompanyTab
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: ".5s",
              }}
            />
          </Box>
          <Collapse in={alternateCompanyTab} sx={{ padding: ".5rem" }}>
            {/* {allPersonalData?.details?.alternateCompanyName} */}
            <Typography sx={{ borderRadius: ".2rem" }}>
            {personalDetails?.details.alternateCompanyName || "Not Available" }

            </Typography>
          </Collapse>
        </Box>
        <hr />

        <Paper
          sx={{
            marginTop: ".4rem",
            display: "grid",
            gridTemplateColumns: "35% 60%",
            gridGap: ".5rem",
            padding: ".5rem",
          }}
        >
          <Typography variant="paragraph" fontWeight="bold">
            Company Type
          </Typography>
          <Typography sx={{ textAlign: "right" }}>
            {allPersonalData?.details?.companyType}
          </Typography>
          <hr />
          <hr />
          <Typography variant="paragraph" fontWeight="bold">
            Concern Person
          </Typography>
          {IsEditing.firstname ? (
            <Typography>
              <StyledInput
                sx={{ width: "7rem" }}
                value={EditDetails.concernPerson}
                name="concernPerson"
                onChange={handleEdit}
              />
              <Button onClick={() => SaveEdit("firstname")}>Save</Button>{" "}
            </Typography>
          ) : (
            <Typography sx={{ textAlign: "right" }}>
              {allPersonalData?.details.concernPerson}
              <Button onClick={() => openEdit("firstname")}>
                {" "}
                <EditIcon />{" "}
              </Button>
            </Typography>
          )}
          <hr />
          <hr />
          <Box sx={{ gridColumn: "1 / span 2" }}>
            <Typography variant="paragraph" fontWeight="bold">
              Email
            </Typography>
            {IsEditing.altEmail ? (
              <Typography>
                <StyledInput
                  sx={{ width: "7rem" }}
                  value={EditDetails.altEmail}
                  name="altEmail"
                  onChange={handleEdit}
                />
                <Button onClick={() => SaveEdit("altEmail")}>Save</Button>{" "}
              </Typography>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    whiteSpace: "wrap",
                    // border: '2px solid blue',
                    padding: ".4rem",
                    backgroundColor: "#cccc",
                  }}
                >
                  <Typography sx={{}}>
                    {" "}
                    {allPersonalData?.details.alternateEmailId}{" "}
                  </Typography>
                  <Button onClick={() => openEdit("altEmail")}>
                    {" "}
                    <EditIcon />{" "}
                  </Button>
                </Box>
              </>
            )}
          </Box>
          <hr />
          <hr />
          <Box sx={{ gridColumn: "1 / span 2" }}>
            <Typography variant="paragraph" fontWeight="bold">
              Alternate Email
            </Typography>
            <Typography
              sx={{
                textAlign: "left",
                padding: ".7rem",
                backgroundColor: "#cccc",
              }}
            >
              {allPersonalData?.details?.alternateEmailId}
            </Typography>
            <hr />
          </Box>
          <Typography variant="paragraph" fontWeight="bold">
            Mobile Number
          </Typography>
          {IsEditing.mobile ? (
            <Typography>
              <StyledInput
                sx={{ width: "7rem" }}
                value={EditDetails.mobile}
                onChange={handleEdit}
                name="mobile"
              />
              <Button onClick={() => SaveEdit("mobile")}>Save</Button>{" "}
            </Typography>
          ) : (
            <Typography sx={{ textAlign: "right" }}>
              {allPersonalData?.details.mobileNo}

              <Button onClick={() => openEdit("mobile")}>
                {" "}
                <EditIcon />{" "}
              </Button>
            </Typography>
          )}
          <hr />
          <hr />
          <Typography variant="paragraph" fontWeight="bold">
            Alternate Mobile Number
          </Typography>
          {IsEditing.altMobile ? (
            <Typography>
              <StyledInput
                sx={{ width: "7rem" }}
                value={EditDetails.altMobile}
                onChange={handleEdit}
                name="altMobile"
              />
              <Button onClick={() => SaveEdit("altMobile")}>Save</Button>{" "}
            </Typography>
          ) : (
            <Typography sx={{ textAlign: "right" }}>
              {" "}
              {allPersonalData?.details.alternateMobileNo}
              <Button onClick={() => openEdit("altMobile")}>
                {" "}
                <EditIcon />{" "}
              </Button>
            </Typography>
          )}
          <hr />
          <hr />
          <Box sx={{ gridColumn: "1 / span 2" }}>
            <Box
              onClick={() => openAddress1Tab(!address1Tab)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="paragraph" fontWeight="bold">
                Address 1
              </Typography>
              <KeyboardArrowDownIcon
                sx={{
                  transform: address1Tab ? "rotate(180deg)" : "rotate(0deg)",
                  transition: ".5s",
                }}
              />
            </Box>
            <Collapse in={address1Tab} sx={{}}>
              <Typography
                sx={{ backgroundColor: " #bfbfbf", borderRadius: ".2rem" }}
              >
                {allPersonalData?.details.address[0]?.addressLine1}
              </Typography>
            </Collapse>
            <hr style={{ marginTop: ".7rem" }} />
          </Box>
          {/* address 2 */}
          <Box sx={{ gridColumn: "1 / span 2" }}>
            <Box
              onClick={() => openAddress2Tab(!address2Tab)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="paragraph" fontWeight="bold">
                Address 2
              </Typography>
              <KeyboardArrowDownIcon
                sx={{
                  transform: address2Tab ? "rotate(180deg)" : "rotate(0deg)",
                  transition: ".5s",
                }}
              />
            </Box>
            <Collapse in={address2Tab} sx={{}}>
              <Typography
                sx={{ backgroundColor: " #bfbfbf", borderRadius: ".2rem" }}
              >
                {" "}
                {allPersonalData?.details.address[0]?.addressLine2}{" "}
              </Typography>
            </Collapse>
            <hr style={{ marginTop: ".7rem" }} />
          </Box>
          <Typography variant="paragraph" fontWeight="bold">
            City
          </Typography>
          <Typography sx={{ textAlign: "right" }}>
            {allPersonalData?.details.address[0]?.city}
          </Typography>
          <hr />
          <hr />
          <Typography variant="paragraph" fontWeight="bold">
            State
          </Typography>
          <Typography sx={{ textAlign: "right" }}>
            {allPersonalData?.details.address[0]?.state}
          </Typography>
          <hr />
          <hr />
          <Typography variant="paragraph" fontWeight="bold">
            Pincode
          </Typography>
          <Typography sx={{ textAlign: "right" }}>
            {allPersonalData?.details.address[0]?.pincode}
          </Typography>
          <hr />
          <hr />
          <Typography variant="paragraph" fontWeight="bold">
            Country
          </Typography>
          <Typography sx={{ textAlign: "right" }}>
            {allPersonalData?.details.address[0]?.country}
          </Typography>
          <hr />
          <hr />
          <Typography variant="paragraph" fontWeight="bold">
            GST No
          </Typography>
          <Typography sx={{ textAlign: "right" }}>
            {allPersonalData?.details.gst}
          </Typography>
          <hr />
          <hr />
          <Typography variant="paragraph" fontWeight="bold">
            GST Certificate
          </Typography>
          <Button
            sx={{ justifySelf: "right" }}
            disabled={allPersonalData?.details.files.gstFile ? false : true}
            onClick={() => handleDialog("GST")}
          >
            View
          </Button>
          <hr />
          <hr />
          <Typography variant="paragraph" fontWeight="bold">
            MSME Number
          </Typography>
          <Typography sx={{ textAlign: "right" }}>
            {" "}
            {allPersonalData?.details.msme
              ? allPersonalData?.details.msme
              : "Not available"}
          </Typography>
          <hr />
          <hr />
          <Typography variant="paragraph" fontWeight="bold">
            MSME Certificate
          </Typography>
          <Button
            sx={{ justifySelf: "right" }}
            disabled={allPersonalData?.details.files.msmeFile ? false : true}
            onClick={() => handleDialog("MSME")}
          >
            View
          </Button>
          <hr />
          <hr />
          <Typography variant="paragraph" fontWeight="bold">
            Bank Details
          </Typography>
          <Button
            sx={{ justifySelf: "right" }}
            disabled={allPersonalData?.details.files.msmeFile ? false : true}
            onClick={() => handleDialog("bankDetails")}
          >
            View
          </Button>
          <hr />
          <hr />
          <Typography variant="paragraph" fontWeight="bold">
            Cancel Cheque
          </Typography>
          <Button
            sx={{ justifySelf: "right" }}
            disabled={allPersonalData?.details.files.gstFile ? false : true}
            onClick={() => handleDialog("cheque")}
          >
            View
          </Button>{" "}
          <hr />
          <hr />
        </Paper>
      </Paper>
    </Container>
  );
};

export default MyAccountDetailsMobile;
