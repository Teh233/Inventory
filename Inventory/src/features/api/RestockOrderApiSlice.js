import { apiSlice } from "./apiSlice";
import { RESTOCK_URL } from "../../constants/ApiEndpoints";
import { VENDOR_URL } from "../../constants/ApiEndpoints";

export const restockApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "restockApi",
    createRestock: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/create`,
          method: "POST",
          body: data,
        };
      },
    }),
    CreateOverseasOrder: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/createOverseasOrder`,
          method: "POST",
          body: data,
        };
      },
    }),

    getAllRestock: builder.query({
      query: () => {
        return {
          url: `${RESTOCK_URL}/getAll`,
          method: "GET",
        };
      },
    }),
    getRestockProductDetail: builder.query({
      query: (id) => {
        return {
          url: `${RESTOCK_URL}/getRestock/${id}`,
          method: "GET",
        };
      },
    }),
    getAllVendor: builder.query({
      query: () => {
        return {
          url: `${VENDOR_URL}/getAll`,
          method: "GET",
        };
      },
    }),
    getAllOverseasOrder: builder.query({
      query: () => {
        return {
          url: `${RESTOCK_URL}/getAllOverseasOrder`,
          method: "GET",
        };
      },
    }),
    getOneOverseasOrder: builder.query({
      query: (id) => {
        return {
          url: `${RESTOCK_URL}/getOneOverseasOrder/${id}`,
          method: "GET",
        };
      },
    }),

    deleteOrderItem: builder.mutation({
      query: (params) => {
        return {
          url: `${RESTOCK_URL}/deleteOrderItem/${params.id}`,
          method: "DELETE",
          body: params.body,
        };
      },
    }),
    updateOverseaseOrder: builder.mutation({
      query: (params) => {
        return {
          url: `${RESTOCK_URL}/updateColumn/${params.id}?type=${params.type}`,
          method: "PUT",
          body: params.body,
        };
      },
    }),
    uploadOverseasReciept: builder.mutation({
      query: (params) => {
        return {
          url: `${RESTOCK_URL}/uploadReciept/${params.id}`,
          method: "POST",
          body: params.body,
        };
      },
    }),
    addVendorIdToAssignOrder: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/assignOrder`,
          method: "POST",
          body: data,
        };
      },
    }),
    createPriceComparision: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/createPriceComparision`,
          method: "POST",
          body: data,
        };
      },
    }),
    getPriceComparision: builder.query({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/getPriceComparision`,
          method: "GET",
        };
      },
    }),
    getSinglePriceComparision: builder.query({
      query: (id) => {
        return {
          url: `${RESTOCK_URL}/getPriceComparision/${id}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreateRestockMutation,
  useCreateOverseasOrderMutation,
  useGetAllRestockQuery,
  useGetRestockProductDetailQuery,
  useGetAllVendorQuery,
  useGetAllOverseasOrderQuery,
  useGetOneOverseasOrderQuery,
  useDeleteOrderItemMutation,
  useUpdateOverseaseOrderMutation,
  useUploadOverseasRecieptMutation,
  useAddVendorIdToAssignOrderMutation,
  useGetPriceComparisonQuery,
  useCreatePriceComparisionMutation,
  useGetPriceComparisionQuery,
  useGetSinglePriceComparisionQuery,
} = restockApiSlice;
