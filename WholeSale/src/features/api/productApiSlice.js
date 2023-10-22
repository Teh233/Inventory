import { apiSlice } from "./apiSlice";
import { PRODUCT_URL } from "../../constants/ApiEndpoints";
import Cookies from "js-cookie";
export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "productApi",

    getAllProduct: builder.query({
      query: (filter) => {
        return {
          url: `${PRODUCT_URL}?${filter}`,
          method: "GET",
        };
      },
    }),
    getOneProduct: builder.query({
      query: (id) => {
        return {
          url: `${PRODUCT_URL}/oneProduct/${id}`,
          method: "GET",
        };
      },
    }),
    getProductBySearch: builder.query({
      query: () => {
        return {
          url: `${PRODUCT_URL}/search`,
          method: "GET",
          // params: { keyword: keyword }, // Pass the keyword as a query parameter
        };
      },
    }),
    autoCompleteProduct: builder.mutation({
      query: (searchTerm) => {
        return {
          url: `${PRODUCT_URL}/indexAutoComplete?searchTerm=${searchTerm}`,
          method: "GET",
          // params: { keyword: keyword }, // Pass the keyword as a query parameter
        };
      },
    }),
  }),
});

export const {
  useGetAllProductQuery,
  useGetProductBySearchQuery,
  useGetOneProductQuery,
  useAutoCompleteProductMutation
} = productApiSlice;
