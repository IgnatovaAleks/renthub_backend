import express from "express";
import {
  getAllSessionsControllerByAdmin,
  revokeAllSessionsControllerByAdmin,
} from "../controllers/controllerAdmin";
import { authenticateAccessToken } from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/adminMiddleware";

const router = express.Router();

router.post(
  "/revoke-sessions/:userId",
  authenticateAccessToken,
  requireAdmin,
  revokeAllSessionsControllerByAdmin
);
router.get(
  "/sessions-all/:userId",
  authenticateAccessToken,
  requireAdmin,
  getAllSessionsControllerByAdmin
);
