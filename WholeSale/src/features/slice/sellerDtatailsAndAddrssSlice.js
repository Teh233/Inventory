import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sellerDetails: {},
  address: [],
  defaultShipping: null,
  defaultBilling: null,

};

const SellerDetailsAndAddressSlice = createSlice({
  name: "SellerDetailsAndAddress",
  initialState,
  reducers: {
    setsellerDetails: (state, action) => {
      state.sellerDetails = action.payload.data;
    },
    removesellerDetails: (state) => {
      state.sellerDetails = [];
    },
    setAllAddress: (state, action) => {
      state.address = action.payload.Address;
      state.defaultShipping = action.payload.defaultShipping;
      state.defaultBilling = action.payload.defaultBilling;
    },
    setUpdateAddress: (state, action) => {
      state.address = action.payload;
    },
    removeAddress: (state) => {
      state.address = [];
    },
  },
});
export const {
  setsellerDetails,
  removesellerDetails,
  setAllAddress,
  setUpdateAddress,
  removeAddress,
} = SellerDetailsAndAddressSlice.actions;
export default SellerDetailsAndAddressSlice.reducer;
