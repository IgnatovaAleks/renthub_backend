import { Request, Response } from "express";
import {
  getAllSessionsServiceByAdmin,
  revokeAllSessionsServiceByAdmin,
} from "../services/serviceAdmin";

export const revokeAllSessionsControllerByAdmin = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = parseInt(req.params.userId);

  const response = await revokeAllSessionsServiceByAdmin(userId);

  return res.status(response.status).json(response);
};

export const getAllSessionsControllerByAdmin = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = parseInt(req.params.userId);

  const response = await getAllSessionsServiceByAdmin(userId);

  return res.status(response.status).json(response);
};
