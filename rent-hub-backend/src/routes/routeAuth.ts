import express from "express";
import {
  getAllActiveSessionsController,
  logoutController,
  logoutSingleSessionController,
  refreshTokenController,
  revokeAllSessionsController,
} from "../controllers/controllerAuth";
import { authenticateAccessToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);
router.post(
  "/logout-all",
  authenticateAccessToken,
  revokeAllSessionsController
);
router.get(
  "/sessions",
  authenticateAccessToken,
  getAllActiveSessionsController
);
router.post(
  "/logout-session/:tokenId",
  authenticateAccessToken,
  logoutSingleSessionController
);

export default router;
