import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../../constants/ApiEndpoints";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "useApi",
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),
    otpVerify: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/otpVerification`,
        method: "POST",
        body: data,
      }),
    }),
    otpRegenerate: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/otpReGenerate`,
        method: "POST",
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgetPassword`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({data,token}) => ({
        url: `${USERS_URL}/resetPassword/${token}`,
        method: "PUT",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: ({data,id}) => ({
        url: `${USERS_URL}/changePassword/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    authenticateSeller: builder.query({
      query: () => ({
        url: `${USERS_URL}/authenticated`,
        method: "GET",
        cacheOptions: { cacheTime: 0 }, // Set cacheTime to 0 to disable caching
      }),
    }),
  }),
});


export const {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useOtpVerifyMutation,
  useOtpRegenerateMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useAuthenticateSellerQuery
} = userApiSlice;
