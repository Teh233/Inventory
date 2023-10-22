import { apiSlice } from "./apiSlice";
import { PRODUCT_URL } from "../../constants/ApiEndpoints";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "productApi",

    getAllProduct: builder.query({
      query: (filter) => {
        return {
          url: `${PRODUCT_URL}/allProducts?searchTerm=${filter}`,
          method: "GET",
        };
      },
    }),
    addProduct: builder.mutation({
      query: (data) => {
        return {
          url: `${PRODUCT_URL}/addRoboProduct`,
          method: "POST",
          body: data,
        };
      },
    }),
    getProductBySearch: builder.query({
      query: (keyword) => {
        return {
          url: `${PRODUCT_URL}/search`,
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
    updateProductsColumn: builder.mutation({
      query: (params) => {
        return {
          url: `${PRODUCT_URL}/updateProducts?query=${params.type}`,
          method: "PUT",
          body: params.body,
        };
      },
    }),

    updateNotation: builder.mutation({
      query: (data) => {
        return {
          url: `${PRODUCT_URL}/updateNotation/${data.sku}`,
          method: "PUT",
          body: data.body,
        };
      },
    }),
    updateOneProduct: builder.mutation({
      query: (data) => {
        return {
          url: `${PRODUCT_URL}/updateOneRoboProduct/${data.sku}`,
          method: "PUT",
          body: data.body,
        };
      },
    }),
    getProductHistory: builder.query({
      query: (SKU) => {
        return {
          url: `${PRODUCT_URL}/getProductHistory/${SKU}`,
          method: "GET",
        };
      },
    }),

    uploadMainImage: builder.mutation({
      query: (data) => {
        return {
          url: `${PRODUCT_URL}/uploadImage/${data.sku}`,
          method: "POST",
          body: data.image,
        };
      },
    }),
    uploadSideImages: builder.mutation({
      query: (data) => {
        return {
          url: `${PRODUCT_URL}/uploadMultiImages/${data.sku}`,
          method: "POST",
          body: data.Images,
        };
      },
    }),
    deleteSideImage: builder.mutation({
      query: (data) => {
        return {
          url: `${PRODUCT_URL}/deleteImage/${data.sku}`,
          method: "Delete",
          body: { fileId: data.fileId },
        };
      },
    }),
    setDefaultImage: builder.mutation({
      query: (data) => {
        return {
          url: `${PRODUCT_URL}/makeDefaultImage/${data.sku}`,
          method: "POST",
          body: data.body,
        };
      },
    }),
    getUnApprovedProduct: builder.query({
      query: (query) => {
        return {
          url: `${PRODUCT_URL}/getUnApprovedProducts?query=${query}`,
          method: "GET",
        };
      },
    }),
    approveProducts: builder.mutation({
      query: (params) => {
        return {
          url: `${PRODUCT_URL}/approveAllProducts?query=${params.query}`,
          method: "PUT",
          body: params.body,
        };
      },
    }),
    getUnApprovedCount: builder.query({
      query: () => {
        return {
          url: `${PRODUCT_URL}/productApprovalCount`,
          method: "GET",
        };
      },
    }),
    addBrand: builder.mutation({
      query: (data) => {
        return {
          url: `${PRODUCT_URL}/addBrand`,
          method: "POST",
          body: data,
        };
      },
    }),
    getAllBrand: builder.query({
      query: () => {
        return {
          url: `${PRODUCT_URL}/getAllBrand`,
          method: "GET",
        };
      },
    }),

    deleteBrand: builder.mutation({
      query: (id) => {
        return {
          url: `${PRODUCT_URL}/deleteBrand/${id}`,
          method: "DELETE",
        };
      },
    }),

    updateBrand: builder.mutation({
      query: (data) => {
        return {
          url: `${PRODUCT_URL}/updateBrand`,
          method: "PUT",
          body: data,
        };
      },
    }),
    autoCompleteProduct: builder.mutation({
      query: (searchTerm) => {
        return {
          url: `${PRODUCT_URL}/indexAutoComplete?searchTerm=${searchTerm}`,
          method: "GET",
        };
      },
    }),
    addCalc: builder.mutation({
      query: (data) => {
        return {
          url: `${PRODUCT_URL}/addCalc`,
          method: "POST",
          body: data,
        };
      },
    }),
    getCalcById: builder.query({
      query: (id) => {
        return {
          url: `${PRODUCT_URL}/getCalcById/${id}`,
          method: "GET",
        };
      },
    }),
    getCalc: builder.query({
      query: () => {
        return {
          url: `${PRODUCT_URL}/getCalc`,
          method: "GET",
        };
      },
    }),
    updateCalc: builder.mutation({
      query: (data) => {
        return {
          url: `${PRODUCT_URL}/updateCalcById/${data.id}`,
          method: "PUT",
          body: data.data,
        };
      },
    }),
  }),
});

export const {
  useGetAllProductQuery,
  useGetProductBySearchQuery,
  useUpdateProductsColumnMutation,
  useGetOneProductQuery,
  useUploadMainImageMutation,
  useUpdateNotationMutation,
  useGetProductHistoryQuery,
  useUploadSideImagesMutation,
  useDeleteSideImageMutation,
  useSetDefaultImageMutation,
  useGetUnApprovedProductQuery,
  useApproveProductsMutation,
  useGetUnApprovedCountQuery,
  useAddProductMutation,
  useUpdateOneProductMutation,
  useAddBrandMutation,
  useGetAllBrandQuery,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
  useAutoCompleteProductMutation,
  useAddCalcMutation,
  useGetCalcByIdQuery,
  useGetCalcQuery,
  useUpdateCalcMutation,
} = productApiSlice;
