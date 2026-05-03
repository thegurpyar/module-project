import { Request, Response } from "express";
import User from "../user/user.model";
import {
  successResponse,
  errorResponse,
} from "../../middlewares/errorHandler";

/* ==================================================
   GET ALL USERS
   Pagination + Filters + Search
================================================== */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      full_name,
      number,
      email,
      role,
      status,
    } = req.query;

    const filter: any = {
      isDeleted: false,
    };

    // Search by full name
    if (full_name) {
      filter.full_name = {
        $regex: full_name,
        $options: "i", // case insensitive
      };
    }

    // Filter by number
    if (number) filter.number = number;

    // Filter by email
    if (email) {
      filter.email = {
        $regex: email,
        $options: "i", // case insensitive
      };
    }

    // Filter by role
    if (role) filter.role = role;

    // Filter by status
    if (status) {
      filter.status = Number(status);
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password') // Exclude password from results
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter),
    ]);

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return successResponse(
      res,
      { users, pagination },
      "Users fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return errorResponse(res, "Failed to fetch users", 500);
  }
};

/* ==================================================
   DELETE USER (SOFT DELETE)
================================================== */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (req.user?.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(
      res,
      { user },
      "User deleted successfully"
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return errorResponse(res, "Failed to delete user", 500);
  }
};

/* ==================================================
   UPDATE USER STATUS
================================================== */
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (req.user?.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }
    
    if (![1, 2].includes(Number(status))) {
      return errorResponse(res, "Invalid status. Must be 1 (active) or 2 (inactive)", 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status: Number(status) },
      { new: true }
    );

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(
      res,
      { user },
      "User status updated successfully"
    );
  } catch (error) {
    console.error("Error updating user status:", error);
    return errorResponse(res, "Failed to update user status", 500);
  }
};


export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (req.user?.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }

    const ifExists = await User.findOne({ email });
    if (ifExists) {
      return errorResponse(res, "User already exists", 400);
    }
    
    const user = await User.create({
      full_name: name,
      email,
      password,
      role,
    });

    return successResponse(
      res,
      { user },
      "User created successfully"
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return errorResponse(res, "Failed to create user", 500);
  }
};