import { apiSlice } from "./apiSlice";
import { CART_URL } from "../../constants/ApiEndpoints";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "cartApi",
    createCart: builder.mutation({
      query: (data) => ({
        url: `${CART_URL}/addCart`,
        method: "POST",
        body: data,
      }),
    }),
    getCart: builder.query({
      query: (id) => ({
        url: `${CART_URL}/${id}`,
        method: "GET",
      }),
    }),
    updateQtyCart: builder.mutation({
      query: (data) => ({
        url: `${CART_URL}/updateCartQty/${data.id}`,
        method: "PUT",
        body: data.data,
      }),
    }),
    deleteCartItem: builder.mutation({
      query: (data) => ({
        url: `${CART_URL}/deleteCartItem/${data.id}?sku=${data.query}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCartMutation,
  useGetCartQuery,
  useUpdateQtyCartMutation,
  useDeleteCartItemMutation,
} = cartApiSlice;
