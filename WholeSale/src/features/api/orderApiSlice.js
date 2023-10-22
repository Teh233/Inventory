import { apiSlice } from "./apiSlice";
import { ORDER_URL } from "../../constants/ApiEndpoints";
import { useSelector } from "react-redux";
export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "orderApi",
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDER_URL}/add`,
        method: "POST",
        body: data,
      }),
    }),
    getSellerOrders: builder.query({
      query: (id) => ({
        url: `${ORDER_URL}/bySeller/${id}`,
        method: "GET",
      }),
    }),
    getOrdersById: builder.query({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetSellerOrdersQuery,
  useGetOrdersByIdQuery,
} = cartApiSlice;
