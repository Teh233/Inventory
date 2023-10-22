import { ModeEditOutlineRounded } from "@mui/icons-material";
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    Mode: false ,
    ShowSide_nav : true,
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
    },
  });

  export const { toggleMode,toggleShowNav } = uiSlice.actions;
export default uiSlice.reducer;
