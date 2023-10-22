import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { formatDate } from "../../commonFunctions/commonFunctions";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Button, Typography, Switch, createTheme } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { useGetAllUsersHistoryQuery } from "../../features/api/usersApiSlice";
import {
  clearAllLiveStatus,
  setAutoOpenStatus,
  clearOneLiveStatus,
  toggleNotificationSound,
  clearAllLiveWholeSaleStatus,
  clearOneLiveWholeSaleStatus,
} from "../../features/slice/authSlice";

/// switch color
const theme = createTheme({
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "green", // Change to the desired color when checked
          },
        },
      },
    },
  },
});
const Dropup = () => {
  /// initialize
  const dispatch = useDispatch();
  const draggableRef = useRef(null);

  /// global state
  const {
    allUsers,
    onlineUsers,
    liveStatus,
    autoOpenStatus,
    initialDropUpControl,
    notificationSound,
    liveWholeSaleStatus,
    allWholeSaleUsers,
    onlineWholeSaleUsers,
  } = useSelector((state) => state.auth);

  /// local state
  const [onlineUsersData, setOnlineUsersData] = useState([]);
  const [onlineWholeSaleUsersData, setOnlineWholeSaleUsersData] = useState([]);
  const [statusHistoryData, setStatusHistoryData] = useState([]);
  const [page, setPage] = useState(1);
  const [skip, setSkip] = useState(true);
  const [dropType, setDropType] = useState([
    "live status",
    "Online Users",
    "live WholeSale Status",
    "Online WholeSale Users",
    "settings",
    "Status History",
  ]);
  const [dropUp, openDropUp] = useState(false);
  const [value, setValue] = useState("live status");

  /// rtk query

  const {
    data: userHistoryData,
    refetch,
    isFetching,
  } = useGetAllUsersHistoryQuery(page, {
    skip: value !== "Status History",
    pollingInterval: 1000 * 300,
  });

  ///

  const [array, setArray] = useState([
    {
      time: "20/8/23",
      message: "This is done1",
    },
    {
      time: "21/8/23",
      message: "This is done2",
    },
    {
      time: "22/8/23",
      message: "This is done3",
    },
    {
      time: "23/8/23",
      message: "This is done4",
    },
  ]);

  const handleDelete = (index) => {
    const newArray = array.filter((_, i) => i !== index);
    setArray(newArray);
  };

  /// useEffects

  useEffect(() => {
    if (userHistoryData?.status === "success") {
      setStatusHistoryData(userHistoryData.data);
    }
  }, [userHistoryData]);

  useEffect(() => {
    const resultArray = Object.keys(allUsers).map((key) => {
      const entry = allUsers[key];

      return {
        name: entry.name,
        isOnline: onlineUsers.includes(key) ? true : entry.isOnline,
      };
    });

    setOnlineUsersData(resultArray);
  }, [allUsers, onlineUsers]);

  useEffect(() => {
    const resultArray = Object.keys(allWholeSaleUsers).map((key) => {
      const entry = allWholeSaleUsers[key];

      return {
        name: entry.name,
        isOnline: onlineWholeSaleUsers.includes(key) ? true : entry.isOnline,
      };
    });

    setOnlineWholeSaleUsersData(resultArray);
  }, [allWholeSaleUsers, onlineWholeSaleUsers]);
  useEffect(() => {
    if (initialDropUpControl && autoOpenStatus) {
      setValue("live status");
      openDropUp(true);
    }
  }, [liveStatus]);

  useEffect(() => {
    if (initialDropUpControl && autoOpenStatus) {
      setValue("live WholeSale Status");
      openDropUp(true);
    }
  }, [liveWholeSaleStatus]);

  return (
    <Draggable nodeRef={draggableRef}>
      <Box
        ref={draggableRef}
        sx={{
          userSelect: "none",

          position: "absolute",
          cursor: "pointer",
          bottom: ".5rem",
          right: "1.4rem",
          zIndex: "2000",
          borderRadius: "1.5rem",
          backgroundImage:
            "linear-gradient(to top, #020b5c, #000e82, #0510aa, #160cd3, #2b00fd)",
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
        }}
      >
        <Box
          onClick={() => {
            openDropUp(!dropUp);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem",
            // cursor: "pointer",
          }}
        >
          <ChevronLeftIcon
            sx={{
              fontSize: "15px",

              color: "#fff",
              transform: dropUp ? "rotate(90deg)" : "rotate(0deg)",
              transition: ".3s",
            }}
          />
          <Typography
            sx={{ color: "#fff", paddingRight: ".4rem", fontSize: "12px" }}
          >
            Status
          </Typography>
        </Box>
        {dropUp && (
          <Box
            sx={{
              position: "absolute",
              bottom: "3rem",
              right: ".2rem",
              boxShadow: " rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px",
              height: "30rem",
              width: "25rem",
              display: "flex",
            }}
          >
            <Box sx={{ flexBasis: "35%" }}>
              {dropType.map((items, index) => {
                return (
                  <Box
                    key={index}
                    onClick={() => setValue(items)}
                    sx={{
                      flexBasis: "70%",
                      color: "#010101",
                      backgroundColor: "rgba(0, 100, 255, 0.5)", // Adjust the color and opacity as needed
                      backdropFilter: "blur(9px)",
                      paddingX: ".3rem",
                      paddingY: ".3rem",
                      cursor: "pointer",
                      borderBottom: "1px solid ",
                      borderTopLeftRadius: ".5rem",

                      borderBottomLeftRadius: ".5rem",
                      borderRight: value === items ? "5px solid blue" : "",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        fontSize: "smaller",
                      }}
                    >
                      {items}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Box
              sx={{
                flexBasis: "70%",
                color: "#fff",
                backgroundColor: "rgba(128, 191, 255, 0.7)", // Adjust the color and opacity as needed
                backdropFilter: "blur(9px)",
                padding: ".3rem",
                overflow: "auto",
              }}
            >
              <Box>
                {value === "Online Users" ? (
                  onlineUsersData.map((items, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          backgroundColor: "rgba(0, 89, 179, 0.5)",
                          alignItems: "center",
                          padding: ".3rem",

                          marginTop: ".3rem",
                        }}
                      >
                        <Box
                          sx={{
                            border: ".6px solid",
                            paddingX: ".9rem",
                            paddingY: ".6rem",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            {items.name[0].toUpperCase()}
                          </span>
                        </Box>
                        <Typography
                          variant="paragraph"
                          sx={{
                            fontWeight: "500",
                            color: "#010101",
                            textTransform: "capitalize",
                            cursor: "pointer",
                          }}
                        >
                          {items.name}
                        </Typography>
                        {items.isOnline ? (
                          <span
                            style={{
                              color: "#33ff33",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                          >
                            online
                          </span>
                        ) : (
                          <span style={{ color: "red", cursor: "pointer" }}>
                            offline
                          </span>
                        )}
                      </Box>
                    );
                  })
                ) : value === "live status" ? (
                  liveStatus.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: " rgba(204, 230, 255, 0.7)",
                          color: "#010101",
                        }}
                      >
                        <Box sx={{ marginTop: ".3rem", padding: ".2rem" }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: ".3rem",
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontSize=".9rem"
                              color=" #666666"
                            >
                              {item.time}
                            </Typography>
                            <CloseIcon
                              onClick={() => {
                                dispatch(clearOneLiveStatus(index));
                              }}
                              sx={{ fontSize: "1rem", color: "	 #666666" }}
                            />
                          </Box>

                          <Typography
                            variant="paragraph"
                            sx={{
                              fontSize: ".99rem",
                              wordSpacing: "1px",
                              cursor: "pointer",
                            }}
                          >
                            {item.message}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                ) : value === "settings" ? (
                  <Box sx={{ marginTop: ".3rem", padding: ".2rem" }}>
                    <Box
                      // key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "rgba(0, 89, 179, 0.5)",
                        alignItems: "center",
                        padding: ".3rem",

                        marginTop: ".3rem",
                      }}
                    >
                      <Typography
                        variant="paragraph"
                        sx={{
                          fontWeight: "500",
                          color: "#010101",
                          textTransform: "capitalize",
                          cursor: "pointer",
                        }}
                      >
                        AutoOpen
                      </Typography>

                      <Switch
                        checked={autoOpenStatus}
                        onChange={() => {
                          dispatch(setAutoOpenStatus(!autoOpenStatus));
                        }}
                      />
                    </Box>
                    <Box
                      // key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "rgba(0, 89, 179, 0.5)",
                        alignItems: "center",
                        padding: ".3rem",

                        marginTop: ".3rem",
                      }}
                    >
                      <Typography
                        variant="paragraph"
                        sx={{
                          fontWeight: "500",
                          color: "#010101",
                          textTransform: "capitalize",
                          cursor: "pointer",
                        }}
                      >
                        Notification Sound
                      </Typography>

                      <Switch
                        checked={notificationSound}
                        onChange={() => {
                          dispatch(toggleNotificationSound(!notificationSound));
                        }}
                      />
                    </Box>
                  </Box>
                ) : value === "live WholeSale Status" ? (
                  liveWholeSaleStatus.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: " rgba(204, 230, 255, 0.7)",
                          color: "#010101",
                        }}
                      >
                        <Box sx={{ marginTop: ".3rem", padding: ".2rem" }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: ".3rem",
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontSize=".9rem"
                              color=" #666666"
                            >
                              {item.time}
                            </Typography>
                            <CloseIcon
                              onClick={() => {
                                dispatch(clearOneLiveWholeSaleStatus(index));
                              }}
                              sx={{ fontSize: "1rem", color: "	 #666666" }}
                            />
                          </Box>

                          <Typography
                            variant="paragraph"
                            sx={{
                              fontSize: ".99rem",
                              wordSpacing: "1px",
                              cursor: "pointer",
                            }}
                          >
                            {item.message}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                ) : value === "Online WholeSale Users" ? (
                  onlineWholeSaleUsersData.map((items, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          backgroundColor: "rgba(0, 89, 179, 0.5)",
                          alignItems: "center",
                          padding: ".3rem",

                          marginTop: ".3rem",
                        }}
                      >
                        <Box
                          sx={{
                            border: ".6px solid",
                            paddingX: ".9rem",
                            paddingY: ".6rem",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            {items.name[0].toUpperCase()}
                          </span>
                        </Box>
                        <Typography
                          variant="paragraph"
                          sx={{
                            fontWeight: "500",
                            color: "#010101",
                            textTransform: "capitalize",
                            cursor: "pointer",
                          }}
                        >
                          {items.name}
                        </Typography>
                        {items.isOnline ? (
                          <span
                            style={{
                              color: "#33ff33",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                          >
                            online
                          </span>
                        ) : (
                          <span style={{ color: "red", cursor: "pointer" }}>
                            offline
                          </span>
                        )}
                      </Box>
                    );
                  })
                ) : (
                  ""
                )}
              </Box>
              {value === "live status" && liveStatus.length ? (
                <Button
                  onClick={() => {
                    dispatch(clearAllLiveStatus());
                  }}
                >
                  Clear All
                </Button>
              ) : (
                ""
              )}
              {value === "live WholeSale Status" &&
              liveWholeSaleStatus.length ? (
                <Button
                  onClick={() => {
                    dispatch(clearAllLiveWholeSaleStatus());
                  }}
                >
                  Clear All
                </Button>
              ) : (
                ""
              )}{" "}
              {value === "Status History" && (
                <div style={{ position: "relative" }}>
                  <RefreshIcon onClick={refetch} />

                  {userHistoryData?.data?.map((items, index) => (
                    <Box
                      key={index}
                      sx={{
                        backgroundColor: " rgba(204, 230, 255, 0.7)",
                        color: "#010101",
                      }}
                    >
                      <Box sx={{ marginTop: ".3rem", padding: ".2rem" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: ".3rem",
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontSize=".9rem"
                            color="#666666"
                          >
                            {formatDate(items.Date) +
                              " " +
                              new Date(items.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                          </Typography>
                          {/* <CloseIcon
                            onClick={() => {
                              handleDelete(index);
                            }}
                            sx={{ fontSize: "1rem", color: "#666666" }}
                          /> */}
                        </Box>

                        <Typography
                          variant="paragraph"
                          sx={{
                            fontSize: ".99rem",
                            wordSpacing: "1px",
                            cursor: "pointer",
                          }}
                        >
                          {items.message}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </div>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Draggable>
  );
};

export default Dropup;
