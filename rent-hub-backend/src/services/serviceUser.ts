import { errors } from "../constants/errors";
import prisma from "../prisma/client";
import { ApiResponse, responseService } from "../utils/response";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { UserDisplayDTOResponse } from "../utils/responseObject";
import { TokenType } from "@prisma/client";
import { Request } from "express";
import { getClientIP } from "../utils/getClientIp";

export const loginService = async (
  email: string,
  password: string,
  req: Request
): Promise<ApiResponse<any>> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return responseService.error(
      "Invalid email",
      errors.NOT_FOUND,
      {},
      httpStatus.NOT_FOUND
    );
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return responseService.error(
      "Invalid password",
      errors.UNAUTHORIZED,
      {},
      httpStatus.UNAUTHORIZED
    );
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.token.create({
    data: {
      token: refreshToken,
      type: TokenType.REFRESH,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      device: req.headers["user-agent"] || null,
      ip: getClientIP(req),
    },
  });

  return responseService.success(
    "Login successful",
    UserDisplayDTOResponse(user, accessToken, refreshToken),
    {}
  );
};
