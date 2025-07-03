import express from "express";
const router = express.Router();
import { loginController } from "../controllers/controllerUser";

router.post("/login", loginController);

export default router;
