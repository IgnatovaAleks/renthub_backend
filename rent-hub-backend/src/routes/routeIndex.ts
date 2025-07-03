import express from "express";
import routeAuth from "./routeAuth";
import routeUser from "./routeUser";
import path from "path";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: routeAuth,
  },
  {
    path: "/user",
    route: routeUser,
  },
];

defaultRoutes.forEach((value) => router.use(value.path, value.route));

export default router;
