import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProduct: [],
  brands: [],
  categories: [],
  cart: {},
  orders: [],
  oneOrder: {},
  unApprovedCount: {},
  customerInfo: {},
  searchTerm: null,
  forceSearch: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setAllProducts: (state, action) => {
      state.allProduct = action.payload.data;
      state.categories = action.payload.categories;
      state.brands = action.payload.brands;
    },
    removeAllProducts: (state) => {
      state.allProduct = [];
      state.brands = [];
      state.categories = [];
    },
    setAllCart: (state, action) => {
      state.cart = action.payload;
    },
    setAllOrder: (state, action) => {
      state.orders = action.payload;
    },
    setOneOrder: (state, action) => {
      state.oneOrder = action.payload;
    },
    setUnApprovedCount: (state, action) => {
      state.unApprovedCount = action.payload;
    },
    setCustomerInfo: (state, action) => {
      state.customerInfo = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.forceSearch = !state.forceSearch;
    },
    clearSearchTerm: (state, action) => {
      state.searchTerm = null;
      state.forceSearch = !state.forceSearch;
    },
  },
});

export const {
  setAllProducts,
  removeAllProducts,
  setAllCart,
  setUpdateCart,
  setAllOrder,
  setOneOrder,
  setUnApprovedCount,
  setCustomerInfo,
  setSearchTerm,
  clearSearchTerm,
} = productSlice.actions;
export default productSlice.reducer;
