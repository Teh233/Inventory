import { apiSlice } from "./apiSlice";
import { BARCODE_URL } from "../../constants/ApiEndpoints";

export const BarcodeSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "BarcodeApi",
    generateBarcode: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/generate`,
        method: "POST",
        body: data,
      }),
    }),
    getBarcode: builder.mutation({
      query: (id) => ({
        url: `${BARCODE_URL}/getSerialNumber/${id}`,
        method: "GET",
      }),
    }),
    verifyBarcodeForDispatch: builder.mutation({
      query: (params) => ({
        url: `${BARCODE_URL}/verifyBarcodeForDispatch`,
        method: "POST",
        body: params,
      }),
    }),
    verifyBarcodeForReturn: builder.mutation({
      query: (params) => ({
        url: `${BARCODE_URL}/verifyBarcodeForReturn`,
        method: "POST",
        body: params,
      }),
    }),
    barcodeForRejection: builder.mutation({
      query: (params) => ({
        url: `${BARCODE_URL}/barcodeForRejection`,
        method: "POST",
        body: params,
      }),
    }),
    dispatchBarcodeInBulk: builder.mutation({
      query: (params) => ({
        url: `${BARCODE_URL}/dispatchBarcodeInBulk`,
        method: "POST",
        body: params,
      }),
    }),
    returnBarcodeInBulk: builder.mutation({
      query: (params) => ({
        url: `${BARCODE_URL}/returnProduct`,
        method: "POST",
        body: params,
      }),
    }),
    getAllBarcodesSkus: builder.query({
      query: () => ({
        url: `${BARCODE_URL}/getAllBarcodes`,
        method: "GET",
      }),
    }),
    scanBarcodeForVerify: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/searchVerifySticky`,
        method: "POST",
        body: data,
      }),
    }),
    getBarcodesReturnHistory: builder.query({
      query: () => ({
        url: `${BARCODE_URL}/getreturnHistory`,
        method: "GET",
      }),
    }),
    getBarcodesDispatchHistory: builder.query({
      query: () => ({
        url: `${BARCODE_URL}/getBarcodeHistory`,
        method: "GET",
      }),
    }),   
    addSubCategory: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/addSubCategory`,
        method: "POST",
        body: data,
      }),
    }),
    getAllProductBySku: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/getProducts`,
        method: "POST",
        body: data,
      }),
    }),
    getAllSalesHistory: builder.query({
      query: () => ({
        url: `${BARCODE_URL}/salesHistory`,
        method: "GET",
      }),
    }),
    getSingleSalesHistory: builder.mutation({
      query: (id) => ({
        url: `${BARCODE_URL}/salesHistory/${id}`,
        method: "GET",
      }),
    }),
    addCustomer: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/addCustomer`,
        method: "POST",
        body:data
      }),
    }),
    getCustomer: builder.query({
      query: () => ({
        url: `${BARCODE_URL}/getAllCustomer`,
        method: "GET",
       
      }),
    }),
    getSingleCustomer: builder.query({
      query: (id) => ({
        url: `${BARCODE_URL}/getSingleCustomer/${id}`,
        method: "GET",
       
      }),
    }),
  }),
  
});

export const {
  useGenerateBarcodeMutation,
  useGetBarcodeMutation,
  useVerifyBarcodeForDispatchMutation,
  useDispatchBarcodeInBulkMutation,
  useGetAllBarcodesSkusQuery,
  useScanBarcodeForVerifyMutation,
  useVerifyBarcodeForReturnMutation,
  useGetBarcodesReturnHistoryQuery,
  useGetBarcodesDispatchHistoryQuery,
  useReturnBarcodeInBulkMutation,
  useBarcodeForRejectionMutation,
  useAddSubCategoryMutation,
  useGetAllProductBySkuMutation,
  useGetAllSalesHistoryQuery,
  useGetSingleSalesHistoryMutation,
  useAddCustomerMutation,
  useGetCustomerQuery,
  useGetSingleCustomerQuery,
} = BarcodeSlice;
