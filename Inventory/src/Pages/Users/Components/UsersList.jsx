import React, { useState, useEffect } from "react";
import {
  styled,
  Box,
  Switch,
  Button,
  Dialog,
  DialogTitle,
} from "@mui/material";
import CartGrid from "../../../components/Common/CardGrid";
import UserRolesDialog from "./UserRolesDialog";
import ProductColumnDialog from "./ProductColumnDialog";
import CheckIcon from "@mui/icons-material/Check";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import Loading from "../../../components/Common/Loading";
import { useSelector } from "react-redux";
import DeleteConfirmDialogue from "./DeleteConfirmDialogue";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

import {
  useGetOneUsersQuery,
  useUserRoleUpdateMutation,
} from "../../../features/api/usersApiSlice";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));

const UserList = ({ refetchAllUser, AllUserData, isFetching }) => {
  /// initialization

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  /// local state

  const [rows, setRows] = useState([]);
  const [skip, setSkip] = useState(true);
  const [adminId, setAdminId] = useState("");
  const [openUserRole, setOpenUserRole] = useState(false);
  const [openProductRole, setOpenProductRole] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [confirmUser, setconfirmUser] = useState("");
  const [open, setOpen] = useState(false);

  const [values, setValues] = useState({
    userId: "",
    userInfo: "",
  });

  /// rtk query
  const [userUpdateApi, { isLoading }] = useUserRoleUpdateMutation();
  const { refetch: refetchOneUser, data: oneUserData } = useGetOneUsersQuery(
    adminId,
    {
      skip: skip,
      refetchOnMountOrArgChange: true,
    }
  );

  /// useEffect
  useEffect(() => {
    if (AllUserData?.status === "success") {
      const newRow = AllUserData.data.map((item, index) => {
        return {
          id: index,
          sno: index + 1,
          adminId: item.adminId,
          email: item.email,
          name: item.name,
          department: item.Department ? item.Department : "",
          isActive: item.isActive,
          isAdmin: item.isAdmin,
        };
      });
      setRows(newRow);
    }
  }, [AllUserData]);

  /// hanlders
  const handleOpenUserRoles = (params) => {
    setSkip(false);
    setOpenUserRole(true);
  };

  const handleOpenProductRoles = (params) => {
    setSkip(false);
    setOpenProductRole(true);
  };

  const handleDelete = () => {
    if (!confirmUser) {
      toast.error("Please Enter User's Id");
      return;
    } else if (values.userId !== confirmUser) {
      toast.error("incorrect user id");
      return;
    }

    handleUserDelete(values.userId);
  };

  const handleCloseUserRole = () => {
    setOpenUserRole(false);
    setOpenProductRole(false);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirm(!deleteConfirm);
    setconfirmUser("");
  };
  const handleUserAcountUpdate = async (adminId, isActive) => {
    try {
      const data = {
        type: "isActive",
        body: {
          adminId: adminId,
          isActive: isActive,
        },
      };
      const res = await userUpdateApi(data).unwrap();
      refetchAllUser();
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const handleUserDelete = async (adminId) => {
    try {
      const data = {
        type: "delete",
        body: {
          adminId: adminId,
        },
      };
      const res = await userUpdateApi(data).unwrap();
      refetchAllUser();
      setconfirmUser("");
      setDeleteConfirm(false);
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  /// columns
  const columns = [
    {
      field: "sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "adminId",
      headerName: "UserId",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.3,
      minWidth: 240,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "isAdmin",
      headerName: "Admin",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return <div>{params.row.isAdmin ? <CheckIcon /> : ""}</div>;
      },
    },
    {
      field: "isActive",
      headerName: "Active",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div>
            {" "}
            <Switch
              checked={params.row.isActive}
              onChange={() => {
                if (params.row.adminId === userInfo.adminId) {
                  return;
                }
                handleUserAcountUpdate(
                  params.row.adminId,
                  !params.row.isActive
                );
              }}
            />
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "UserRights",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <PostAddIcon
            onClick={() => {
              setAdminId(params.row.adminId);
              handleOpenUserRoles(params);
            }}
            sx={{
              fontSize: "2rem",
              "&:hover": { color: "#01127D" },
            }}
          />
        );
      },
    },
    {
      field: "product",
      headerName: "ProductColumns",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <ViewWeekIcon
            variant="contained"
            onClick={() => {
              setAdminId(params.row.adminId);
              handleOpenProductRoles(params);
            }}
            sx={{
              fontSize: "2rem",
              "&:hover": { color: "#01127D" },
            }}
          />
        );
      },
    },
    {
      field: "delete",
      headerName: "Action",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          setValues({
            ...values,
            userId: params.row.adminId,
            userInfo: params.row.name,
          });
          handleCloseDeleteConfirm();
        };

        return (
          <div>
            <DeleteIcon
              sx={{
                cursor: "pointer",
                "& :hover": {
                  color: "red",
                },
              }}
              onClick={onClick}
            />
          </div>
        );
      },
    },
    {
      field: "otp",
      headerName: "OTP",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const onClick = (e) => {
          setOpen(true);
          e.stopPropagation(); // don't select this row after clicking
          setAdminId(params.row.adminId);
          setSkip(false);
        };

        return (
          <div>
            <Button variant="outlined" onClick={onClick}>
              View
            </Button>
            <Dialog
              open={open}
              onClose={() => {
                setValues({
                  userId: "",
                  userInfo: "",
                });
                setSkip(true);
                setOpen(false);
              }}
            >
              <DialogTitle>
                <Box sx={{ p: 5, border: "2px dotted red" }}>
                  {oneUserData?.data?.loginOtp || "no OTP"}
                </Box>
              </DialogTitle>
              <Box
                sx={{
                  p: 2,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setValues({
                      userId: "",
                      userInfo: "",
                    });
                    setSkip(true);
                    setOpen(false);
                  }}
                >
                  Close
                </Button>
              </Box>
            </Dialog>
          </div>
        );
      },
    },
  ];

  return (
    <Box>
      <Loading loading={isLoading || isFetching} />
      <DeleteConfirmDialogue
        handleClose={handleCloseDeleteConfirm}
        open={deleteConfirm}
        setconfirmUser={setconfirmUser}
        confirmUser={confirmUser}
        handleDelete={handleDelete}
        values={values}
        loading={isLoading}
      />
      <ProductColumnDialog
        open={openProductRole}
        setOpen={setOpenProductRole}
        handleClose={handleCloseUserRole}
        oneUserData={oneUserData}
        adminId={adminId}
        refetchOneUser={refetchOneUser}
      />
      <UserRolesDialog
        open={openUserRole}
        setOpen={setOpenUserRole}
        handleClose={handleCloseUserRole}
        oneUserData={oneUserData}
        adminId={adminId}
        refetchOneUser={refetchOneUser}
      />
      <StyledBox>
        <CartGrid
          columns={columns}
          rows={rows}
          rowHeight={40}
          Height={"85.6vh"}
        />
      </StyledBox>
    </Box>
  );
};

export default UserList;
