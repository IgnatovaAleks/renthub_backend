import { TokenType } from "@prisma/client";
import { errors } from "../constants/errors";
import prisma from "../prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { ApiResponse, responseService } from "../utils/response";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { UserDisplayDTOResponse } from "../utils/responseObject";

export const refreshTokenService = async (
  refreshToken: string
): Promise<ApiResponse<any>> => {
  try {
    const decoded = verifyRefreshToken(refreshToken) as jwt.JwtPayload;

    const existingToken = await prisma.token.findUnique({
      where: { token: refreshToken },
    });

    if (
      !existingToken ||
      existingToken.revoked ||
      new Date(existingToken.expiresAt) < new Date()
    ) {
      return responseService.error(
        "Refresh token invalid or expired",
        errors.UNAUTHORIZED,
        {},
        httpStatus.UNAUTHORIZED
      );
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return responseService.error(
        "User not found",
        errors.NOT_FOUND,
        {},
        httpStatus.NOT_FOUND
      );
    }

    await prisma.token.delete({
      where: {
        token: refreshToken,
      },
    });

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await prisma.token.create({
      data: {
        token: newRefreshToken,
        type: TokenType.REFRESH,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        device: "REFRESH_ROTATION",
        ip: "",
      },
    });

    return responseService.success(
      "Token refreshed",
      UserDisplayDTOResponse(user, newAccessToken, newRefreshToken)
    );
  } catch (error) {
    return responseService.error(
      "Invalid token",
      errors.UNAUTHORIZED,
      {},
      httpStatus.UNAUTHORIZED
    );
  }
};

export const logoutService = async (
  refreshToken: string
): Promise<ApiResponse<any>> => {
  try {
    const existingToken = await prisma.token.findUnique({
      where: { token: refreshToken },
    });

    if (!existingToken) {
      return responseService.error(
        "Refresh token not found",
        errors.UNAUTHORIZED,
        {},
        httpStatus.UNAUTHORIZED
      );
    }

    await prisma.token.delete({ where: { token: refreshToken } });

    return responseService.success("Logged out successfully");
  } catch (error) {
    return responseService.error(
      "Logout failed",
      errors.SERVER_ERROR,
      {},
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const revokeAllSessionsService = async (
  user: jwt.JwtPayload | undefined
): Promise<ApiResponse<any>> => {
  try {
    await prisma.token.updateMany({
      where: { userId: user?.id, type: "REFRESH" },
      data: {
        revoked: true,
      },
    });

    return responseService.success("All sessions revoked successfully");
  } catch (error) {
    return responseService.error(
      "Failed to revoke sessions",
      errors.SERVER_ERROR,
      {},
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const getAllActiveSessionsService = async (
  user: jwt.JwtPayload | undefined
): Promise<ApiResponse<any>> => {
  try {
    const tokens = await prisma.token.findMany({
      where: {
        userId: user?.id,
        type: TokenType.REFRESH,
        revoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        device: true,
        ip: true,
        revoked: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return responseService.success("Fetched all sessions successfully", tokens);
  } catch (error) {
    return responseService.error(
      "Failed to fetch session",
      errors.SERVER_ERROR,
      {},
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const logoutSingleSessionService = async (
  tokenId: number,
  userId: number
): Promise<ApiResponse<any>> => {
  try {
    const token = await prisma.token.findUnique({
      where: { id: tokenId },
    });

    if (!token || token.userId !== userId) {
      return responseService.error(
        "Session not found or access denied",
        errors.FORBIDDEN,
        {},
        httpStatus.FORBIDDEN
      );
    }

    await prisma.token.delete({ where: { id: tokenId } });

    return responseService.success("Session logged out successfully");
  } catch (error) {
    return responseService.error(
      "Failed to logout session",
      errors.SERVER_ERROR,
      {},
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
