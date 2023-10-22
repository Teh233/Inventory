import React, { useState, useEffect } from "react";
import userRolesData from "../../../constants/UserRolesItems";
import { Dialog, DialogContent, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useUserRoleUpdateMutation } from "../../../features/api/usersApiSlice";
import UserRoleDailogBoxSubmenu from "./UserRoleDailogBoxSubmenu";
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    minWidth: "400px",
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  width: "300px",
  height: "400px",
  border: "2px solid gray",
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
}));

const StyledDraggableItem = styled("div")(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: "lightblue",
  margin: theme.spacing(1),
  cursor: "pointer",
}));

const UserRolesDialog = ({
  open,
  setOpen,
  handleClose,
  oneUserData,
  adminId,
  refetchOneUser,
}) => {
  /// local state
  const [userSubmenuData, setUserSubmenuData] = useState(userRolesData);
  const [userRights, setUserRights] = useState([]);

  /// RTK query
  const [userRoleUpdateApi, { isLoading }] = useUserRoleUpdateMutation();

  /// userEffect
  useEffect(() => {
    if (oneUserData?.status === "success") {
      setUserRights(oneUserData.data.userRoles);
    }
  }, [oneUserData]);

  return (
    <div>
      <StyledDialog
        open={open}
        onClose={handleClose}
        sx={{ backdropFilter: "blur(5px)" }}
        maxWidth="xl"
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                flex: "1",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {`UserRights To ${oneUserData?.data?.name}`}
            </Typography>
            <CloseIcon
              onClick={handleClose}
              sx={{
                cursor: "pointer",
                background: "linear-gradient(0deg, #01127D, #04012F)",
                color: "#fff",
                borderRadius: "5rem",
                padding: ".1rem",
                marginLeft: "auto",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              // border: '2px solid blue',
              height: "60vh",
              overflowY: "auto",
            }}
          >
            <Box sx={{ width: "100%" }}>
              {userSubmenuData.map((item, index) => {
                return (
                  <UserRoleDailogBoxSubmenu
                    key={index}
                    {...item}
                    userRights={userRights}
                    setUserRights={setUserRights}
                    refetchOneUser={refetchOneUser}
                    userRoleUpdateApi={userRoleUpdateApi}
                    adminId={adminId}
                  ></UserRoleDailogBoxSubmenu>
                );
              })}
            </Box>
          </Box>
        </DialogContent>
      </StyledDialog>
    </div>
  );
};

export default UserRolesDialog;
