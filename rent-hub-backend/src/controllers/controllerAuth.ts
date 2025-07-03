import { Request, Response } from "express";
import {
  getAllActiveSessionsService,
  logoutService,
  logoutSingleSessionService,
  refreshTokenService,
  revokeAllSessionsService,
} from "../services/serviceAuth";

export const refreshTokenController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const refreshToken = req.cookies.refreshToken;

  const response = await refreshTokenService(refreshToken);

  if (response.error) {
    return res.status(response.status).json(response);
  }

  res.cookie("accessToken", response.data?.tokens.access, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.cookie("refreshToken", response.data?.tokens.refresh, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res.status(response.status).json(response.data.user);
};

export const logoutController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const refreshToken = req.cookies.refreshToken;

  const response = await logoutService(refreshToken);

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res.status(response.status).json(response);
};

export const revokeAllSessionsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { user } = req;

  const response = await revokeAllSessionsService(user);

  return res.status(response.status).json(response);
};

export const getAllActiveSessionsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { user } = req;

  const response = await getAllActiveSessionsService(user);

  return res.status(response.status).json(response);
};

export const logoutSingleSessionController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const tokenId = parseInt(req.params.tokenId);
  const user = req.user;

  const response = await logoutSingleSessionService(tokenId, user?.id);

  return res.status(response.status).json(response);
};
