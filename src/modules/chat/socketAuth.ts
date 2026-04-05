import cookie from "cookie";
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../../modules/user/user.model";

export interface AuthenticatedSocket extends Socket {
  userId: string;
}

export const socketAuth = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
  const rawCookie = socket.handshake.headers.cookie || socket.handshake.query.token;

  if (!rawCookie) {
    return next(new Error("No authentication token provided"));
  }

  // Convert to string if it's not already
  const cookieString = typeof rawCookie === 'string' ? rawCookie : '';
  
  // Parse cookies if the string is not empty
  const cookies = cookieString ? cookie.parse(cookieString) : {};
  const refreshToken = cookies.refresh_token || (typeof rawCookie === 'string' ? rawCookie : '');


  if (!refreshToken) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as any;

    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.isDeleted) {
      return next(new Error("User not found"));
    }

    if(user.role ==="user" && !user.otpVerified){
      return next(new Error("User not verified"));
    }

    if (
      user.passwordChangedAt &&
      decoded.iat &&
      user.passwordChangedAt.getTime() / 1000 > decoded.iat
    ) {
      return next(new Error("Password was changed. Please log in again."));
    }

    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
};
