import { apiSlice } from "./apiSlice";
import { DISCOUNT_QUERY } from "../../constants/ApiEndpoints";
export const discountQueryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "discountQueryApi",
    createDiscountQuery: builder.mutation({
      query: (data) => ({
        url: `${DISCOUNT_QUERY}/addDiscountQuery`,
        method: "POST",
        body: data,
      }),
    }),
    getDiscountQuery: builder.query({
      query: (data) => ({
        url: `${DISCOUNT_QUERY}/getDiscountQuery`,
        method: "GET",
      }),
    }),
    getDiscountQueryById: builder.query({
      query: (data) => ({
        keepUnusedDataFor: 1,
        url: `${DISCOUNT_QUERY}/getDiscountQuery/${data}`,
        method: "GET",
      }),
    }),
    getDiscountQueryAdmin: builder.query({
      query: (data) => ({
        keepUnusedDataFor: 1,
        url: `${DISCOUNT_QUERY}/getDiscountQuery/${data}?type=admin`,
        method: "GET",
      }),
    }),
    updateDiscountQuery: builder.mutation({
      query: (data) => ({
        url: `${DISCOUNT_QUERY}/updateDiscountQuery/${data.id}?type=${data.type}`,
        method: "PUT",
        body: data.item,
      }),
    }),
  }),
});

export const { useCreateDiscountQueryMutation,useGetDiscountQueryQuery,useGetDiscountQueryByIdQuery,useGetDiscountQueryAdminQuery,useUpdateDiscountQueryMutation } = discountQueryApiSlice;
