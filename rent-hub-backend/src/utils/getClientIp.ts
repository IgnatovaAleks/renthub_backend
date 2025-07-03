import { Request } from "express";

export const getClientIP = (req: Request): string | null => {
  const ip =
    req.ip ||
    req.connection.remoteAddress ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    (req.headers["x-real-ip"] as string) ||
    null;

  if (ip && !isValidIP(ip)) {
    return null;
  }

  return ip;
};

const isValidIP = (ip: string): boolean => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};
