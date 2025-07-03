import prisma from "../prisma/client";

export enum TokenType {
  REFRESH,
  RESET_PASSWORD,
  EMAIL_VERIFICATION,
}

export enum RoleTypes {
  USER,
  ADMIN,
  COMPANY,
}
