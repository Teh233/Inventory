import { apiSlice } from "./apiSlice";
import { DetailsAndAddress_Url } from "../../constants/ApiEndpoints";

export const SellerDetailsAndAddressSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "DetailsAndAddressApi",
    createDetailsAndAddress: builder.mutation({
      query: (data) => ({
        url: `${DetailsAndAddress_Url}/add`,
        method: "POST",
        body: data,
      }),
    }),
    getAddress: builder.query({
      query: (sellerId) => ({
        url: `${DetailsAndAddress_Url}/getAddress/${sellerId}`,
        method: "GET",
      }),
    }),
    addAddress: builder.mutation({
      query: (data) => ({
        url: `${DetailsAndAddress_Url}/addAddress`,
        method: "POST",
        body: data,
      }),
    }),
    updateAddress: builder.mutation({
      query: ({ sellerId, addressId, data }) => ({
        url: `${DetailsAndAddress_Url}/${sellerId}/address/${addressId}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteAddress: builder.mutation({
      query: ({ sellerId, addressId }) => ({
        url: `${DetailsAndAddress_Url}/address/${sellerId}/${addressId}`,
        method: "DELETE",
      }),
    }),
    setDefaultAddress: builder.mutation({
      query: ({ sellerId, data }) => ({
        url: `${DetailsAndAddress_Url}/setDefaultAddress/${sellerId}`,
        method: "PUT",
        body: data,
      }),
    }),
    setUpdateSellerDocument: builder.mutation({
      query: ({ sellerId, data }) => ({
        url: `${DetailsAndAddress_Url}/editSellerDocs/${sellerId}`,
        method: "PUT",
        body: data,
      }),
    }),
    setPersonalDetails: builder.query({
      query: (sellerId) => ({
        url: `${DetailsAndAddress_Url}/getSellerDetails/${sellerId}`,
        method: "GET",
   
      }),
    }),
  }),
});

export const {
  useCreateDetailsAndAddressMutation,
  useGetAddressQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetUpdateSellerDocumentMutation,
  useSetDefaultAddressMutation,
  useSetPersonalDetailsQuery,
} = SellerDetailsAndAddressSlice;
