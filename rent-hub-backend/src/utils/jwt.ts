import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

export const generateAccessToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: "15m",
  };

  return jwt.sign(payload, accessTokenSecret, options);
};

export const generateRefreshToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, refreshTokenSecret, options);
};

export const verifyAccessToken = (token: string): string | jwt.JwtPayload => {
  return jwt.verify(token, accessTokenSecret);
};

export const verifyRefreshToken = (token: string): string | jwt.JwtPayload => {
  return jwt.verify(token, refreshTokenSecret);
};
