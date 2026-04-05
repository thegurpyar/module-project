import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

interface User {
  _id: string | ObjectId;
  role: string;
}


export const generateToken = (user: User) => {
  if (!user || !user._id || !user.role) {
    throw new Error("User data is incomplete for token generation");
  }

  const accessSecret = process.env.JWT_SECRET;
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!accessSecret || !refreshSecret) {
    throw new Error("Access or Refresh token secret missing");
  }

  // 1. Access Token (short expiry)
  const accessToken = jwt.sign(
    { id: user._id.toString(), role: user.role },
    accessSecret,
    { expiresIn: "1m" }   // Best practice
  );

  // 2. Refresh Token (long expiry)
  const refreshToken = jwt.sign(
    { id: user._id.toString(), role: user.role },
    refreshSecret,
    { expiresIn: "30d" }   // Refresh should live long
  );

  return { accessToken, refreshToken };
};
