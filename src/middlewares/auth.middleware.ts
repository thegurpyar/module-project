import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../modules/user/user.model';
import { IUser } from '../modules/user/user.model';
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: IUser;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user || user.isDeleted) {
      return res.status(401).json({ message: 'User not found' });
    }

    if(user.status !== 1){
          return res.status(400).json({
            message:"Account inactive please contact support"
          })
      }

    if (
      user.passwordChangedAt &&
      decoded.iat &&
      user.passwordChangedAt.getTime() / 1000 > decoded.iat
    ) {
      return res.status(401).json({
        message: 'Password was changed. Please log in again.',
      });
    }

    req.userId = user._id.toString();
    req.user = user.toObject();

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Authentication failed' });
  }
};


export const role = (...allowedRoles: string[]) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'User not authenticated' });

    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({ message: 'Access denied, Invalid role' });

    next();
  };
};

