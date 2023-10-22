import { apiSlice } from "./apiSlice";
import { PRICEHISTORY_URL } from "../../constants/ApiEndpoints";

export const PriceHistorySlice = apiSlice.injectEndpoints({
  refetchOnMountOrArgChange: 30,
  endpoints: (builder) => ({
    reducerPath: "PriceHistoryApi",
    addPriceHistory: builder.mutation({
      query: (data) => ({
        url: `${PRICEHISTORY_URL}/createHistory`,
        method: "POST",
        body: data,
      }),
    }),

    getAllPriceHistory: builder.query({
      query: () => ({
        url: `${PRICEHISTORY_URL}/getAllHistory`,
        method: "GET",
      }),
    }),
    getSinglePriceHistory: builder.query({
      query: (id) => ({
        keepUnusedDataFor: 1,
        url: `${PRICEHISTORY_URL}/getHistory/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddPriceHistoryMutation,
  useGetAllPriceHistoryQuery,
  useGetSinglePriceHistoryQuery,
} = PriceHistorySlice;
