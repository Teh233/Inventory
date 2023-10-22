import { React, useState } from "react";
import { Box, styled, Button } from "@mui/material";
import UserList from "./Components/UsersList";
import AddUser from "./Components/AddUser";
import { useGetAllUsersQuery } from "../../features/api/usersApiSlice";
import MasterPassword from "./Components/MasterPasswordDialog";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Users = () => {
  const [open, setOpen] = useState(false);
  const [openMaster, setOpenMaster] = useState(false);

  /// rtk query
  const {
    refetch: refetchAllUser,
    data: AllUserData,
    isFetching,
  } = useGetAllUsersQuery();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenMaster = () => {
    setOpenMaster(true);
  };
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Button onClick={handleClickOpen}>Add</Button>
      {/* <Button onClick={handleClickOpenMaster}>Set Master Password</Button> */}
      <UserList
        isFetching={isFetching}
        refetchAllUser={refetchAllUser}
        AllUserData={AllUserData}
      />
      <AddUser open={open} setOpen={setOpen} refetchAllUser={refetchAllUser} />
      <MasterPassword open={openMaster} setOpen={setOpenMaster} />
    </Box>
  );
};

export default Users;
