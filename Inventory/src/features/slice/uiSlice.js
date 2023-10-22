import { ModeEditOutlineRounded } from "@mui/icons-material";
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  Mode: false ,
  ShowSide_nav : true,
  ToggleMenu: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.Mode = !state.Mode 
  
    },
    toggleShowNav: (state) => {
      state.ShowSide_nav = !state.ShowSide_nav 

    },
    Showmenu: (state) => {
      state.ToggleMenu = !state.ToggleMenu 

    },
  },
});

  export const { toggleMode,toggleShowNav,Showmenu } = uiSlice.actions;
export default uiSlice.reducer;
