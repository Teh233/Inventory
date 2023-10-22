import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

const OTPverify = ({
  email,
  otp,
  setOtp,
  handleOtpSubmit,
  resendButton,
  setResendButton,
  handleOtpRegenerate,
  otpRegenLoading,
  otpVerifyLoading
}) => {
  /// local state
  const [timer, setTimer] = useState(500);

  /// useEffect
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(countdown);
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setResendButton(true);
      toast.error("OTP expired");
    }
  }, [timer]);

  /// functions

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  return (
    <div style={{padding:"20px"}}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <Typography variant="body1">OTP sent to {email}</Typography>
        </Grid>
        <Grid item>
          <TextField
            label="Enter OTP To Verify"
            variant="outlined"
            type="number"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
            }}
          />
        </Grid>
        {timer > 0 ? (
          <Grid item>
            <Typography variant="body1">
              Time Remaining: {formatTime(timer)}
            </Typography>
          </Grid>
        ) : null}
        {resendButton ? (
          <Grid item>
            <Button
              onClick={handleOtpRegenerate}
              variant="contained"
              style={{ backgroundColor: "black"}}
            >
                   {otpRegenLoading ? (
                          <CircularProgress style={{ color: "#fcbf49", }} />
                        ) : (
                          "Resend OTP"
                        )}
              
            </Button>
          </Grid>
        ) : (
          <Grid item>
            <Button
              variant="contained"
              style={{ backgroundColor: "black"}}
              onClick={handleOtpSubmit}
            >
                  {otpVerifyLoading ? (
                          <CircularProgress style={{ color: "#fcbf49", }} />
                        ) : (
                          "Submit"
                        )}
              
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default OTPverify;
