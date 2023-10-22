import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASEURL from "../../constants/BaseApi";
const baseQuery = fetchBaseQuery({
  baseUrl: BASEURL,
  credentials: "include",
  withCredentials: "true",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
