import { apiSlice } from "./apiSlice";
import { ORDER_URL } from "../../constants/ApiEndpoints";
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
        url: `${ORDER_URL}/orders/${id}`,
        method: "GET",
      }),
    }),
    getOrdersById: builder.query({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`,
        method: "GET",
      }),
    }),
    getAllOrders: builder.query({
      query: (id) => ({
        url: `${ORDER_URL}/orders`,
        method: "GET",
      }),
    }),
    updateOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDER_URL}/updateOrderItems/${data.id}`,
        method: "PUT",
        body: data.body,
      }),
    }),
    removeOrderItem: builder.mutation({
      query: (data) => ({
        url: `${ORDER_URL}/deleteOrderItems/${data.id}`,
        method: "PUT",
        body: data.body,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetSellerOrdersQuery,
  useGetOrdersByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useRemoveOrderItemMutation,
} = cartApiSlice;
