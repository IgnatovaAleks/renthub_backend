import { TokenType } from "@prisma/client";
import { errors } from "../constants/errors";
import prisma from "../prisma/client";
import { ApiResponse, responseService } from "../utils/response";
import httpStatus from "http-status";

export const revokeAllSessionsServiceByAdmin = async (
  userId: number
): Promise<ApiResponse<any>> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return responseService.error(
        "User not found",
        errors.NOT_FOUND,
        {},
        httpStatus.NOT_FOUND
      );
    }

    await prisma.token.updateMany({
      where: { userId: userId, type: "REFRESH" },
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

export const getAllSessionsServiceByAdmin = async (
  userId: number
): Promise<ApiResponse<any>> => {
  try {
    const tokens = await prisma.token.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        device: true,
        ip: true,
        revoked: true,
        createdAt: true,
        expiresAt: true,
        type: true,
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
