import { Request, Response, NextFunction } from "express";
import { responseService } from "../utils/response";
import httpStatus from "http-status";
import { errors } from "../constants/errors";
import { verifyAccessToken } from "../utils/jwt";
import jwt from "jsonwebtoken";

export const authenticateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.accessToken;

  if (!token) {
    const response = responseService.error(
      "Access token not present",
      errors.UNAUTHORIZED,
      {},
      httpStatus.UNAUTHORIZED
    );

    res.status(response.status).json(response);
    return;
  }

  try {
    const decoded = verifyAccessToken(token) as jwt.JwtPayload;
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    const response = responseService.error(
      "Invalid or expired token",
      errors.UNAUTHORIZED,
      {},
      httpStatus.UNAUTHORIZED
    );
    res.status(response.status).json(response);
  }
};
