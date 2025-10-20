import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("category/:id", "routes/category.$id.tsx"),
  route("product/:id", "routes/product.$id.tsx"),
] satisfies RouteConfig;
