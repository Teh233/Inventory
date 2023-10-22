import { apiSlice } from "./apiSlice";
import { LOGISTICS_URL } from "../../constants/ApiEndpoints";

export const logisticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "logisticsApi",
    addLogistics: builder.mutation({
      query: (params) => {
        return {
          url: `${LOGISTICS_URL}/addLogistic`,
          method: "POST",
          body: params,
        };
      },
    }),
    getAllLogistics: builder.query({
      query: (params) => {
        return {
          url: `${LOGISTICS_URL}/getallLogistics`,
          method: "GET",
        };
      },
    }),
    getOneLogistics: builder.query({
      query: (params) => {
        return {
          url: `${LOGISTICS_URL}/getLogistic/${params}`,
          method: "GET",
        };
      },
    }),
    addBoxDetails: builder.mutation({
      query: (params) => {
        return {
          url: `${LOGISTICS_URL}/addBoxes/${params.id}`,
          method: "POST",
          body: params.body,
        };
      },
    }),
  }),
});

export const {
  useAddLogisticsMutation,
  useGetAllLogisticsQuery,
  useGetOneLogisticsQuery,
  useAddBoxDetailsMutation
} = logisticsApiSlice;
