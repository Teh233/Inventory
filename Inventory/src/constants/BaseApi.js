const BASEURL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL;

export default BASEURL;
