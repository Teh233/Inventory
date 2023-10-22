import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/system";


const StyledTheme = ({theme}) => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    display: "flex",
    justifyContent: "right",
  }));
  
  const Qty = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
    padding: "0 10px",
    border: "1px solid rgb(168, 176, 186)",
    width: "50%",
    "&:hover": {
      border: "1px solid rgb(15, 126, 252)",
      color: "rgb(15, 126, 252)",
      cursor: "pointer",
    },
  }));
  
  const StyledQty = styled("div")(({ theme }) => ({
    display: "flex",
    backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
    padding: "0 10px",
    justifyContent: "center",
    width: "100%",
  }));
  
  const StyledQtyBtn = styled("div")(({ theme }) => ({
    display: "flex",
    backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
    padding: "0 10px",
    justifyContent: "center",
    border: "1px solid rgb(168, 176, 186)",
    alignItems: "center",
    width: "20%",
    "&:hover": {
      border: "1px solid rgb(15, 126, 252)",
      color: "rgb(15, 126, 252)",
      cursor: "pointer",
    },
  }));
  
  const StyledInputbase = styled(InputBase)(({ theme }) => ({
    input: {
      textAlign: "center",
      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
      },
      "&[type=number]": {
        MozAppearance: "textfield",
      },
      "&:hover": {
        color: "rgb(15, 126, 252)",
      },
    },
    background: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
    color: theme.palette.mode === "dark" ? "#fff" : "black",
  }));

  return { Qty, StyledQty, StyledQtyBtn, StyledInputbase,Item };
};

export default StyledTheme;
