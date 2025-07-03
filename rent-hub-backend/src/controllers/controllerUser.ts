import { Request, Response } from "express";
import { loginService } from "../services/serviceUser";

export const loginController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, password } = req.body;
  const response = await loginService(email, password, req);

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

  return res.status(response.status).json(response);
};
