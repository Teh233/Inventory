import React from "react";
import { Box, Stack, styled, Typography } from "@mui/material";
import MyAccountDetails from "./MyAccountComponent/MyAccountDetails";
import StepForm from "./MyAccountComponent/Form/StepForm";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import checkImg from "../../assets/check.gif";
import ToggleNav from "../../components/Common/Togglenav";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#eee",
  height: "100vh",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const MyAccount = () => {
  // global state
  const isVerified =
    useSelector((state) => state?.auth?.userInfo?.personalQuery) === "verify"
      ? true
      : false;

  const isSubmit =
    useSelector((state) => state?.auth?.userInfo?.personalQuery) === "submit"
      ? true
      : false;

  return (
    <StyledBox>
      <ToggleNav filter_show={true} />
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <DrawerHeader />
        <Stack
          direction="row"
          gap={{ sm: 30, md: 0, xs: 0, lg: 30, xl: 30, xxl: 30 }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            {isVerified ? (
              <MyAccountDetails />
            ) : isSubmit ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  rowGap: ".5rem",
                  width: "60%",
                  textAlign: "center",
                }}
              >
                <Avatar
                  src={checkImg}
                  variant="square"
                  sx={{ width: "150px", height: "auto" }}
                />

                <Typography
                  variant="h2"
                  sx={{ color: "green", fontWeight: "700" }}
                >
                  Great!
                </Typography>
                <Typography variant="body1">
                  Your personal details are successfully registered. Now please
                  be patient while our team at IRS verifies your account. Then,
                  you can login and avail our services.
                </Typography>
                <Box sx={{ marginTop: "6rem" }}>
                  <Typography variant="h6">
                    If you need any assistance, please feel free to contact us:
                  </Typography>
                  <Typography variant="body2">
                    <PhoneIcon
                      sx={{
                        verticalAlign: "middle",
                        color: "green",
                        fontSize: "1.9rem",
                      }}
                    />{" "}
                    Contact Number: 9205777125
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: "1rem" }}>
                    <EmailIcon
                      sx={{
                        verticalAlign: "middle",
                        color: "blue",
                        fontSize: "1.9rem",
                        marginLeft: "1.5rem",
                      }}
                    />{" "}
                    Email: wholesale@indianrobostore.com
                  </Typography>
                </Box>
              </Box>
            ) : (
              <StepForm />
            )}
          </Box>
        </Stack>
      </Box>
    </StyledBox>
  );
};

export default MyAccount;
