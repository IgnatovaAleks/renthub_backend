import { Request, Response, NextFunction } from "express";
import { RoleTypes } from "../utils/types";
import { responseService } from "../utils/response";
import { errors } from "../constants/errors";
import httpStatus from "http-status";

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.user?.role !== RoleTypes.ADMIN) {
    const response = responseService.error(
      "You are not an Admin!",
      errors.FORBIDDEN,
      {},
      httpStatus.FORBIDDEN
    );

    res.status(response.status).json(response);
    return;
  }

  next();
};
