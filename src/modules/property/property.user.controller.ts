import { Request, Response } from "express";
import Property from "./property.model";
import {
  successResponse,
  errorResponse,
} from "../../middlewares/errorHandler";

/* ==================================================
   ADD PROPERTY
================================================== */
export const addProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.create({
      ...req.body,
      userId: req.userId,
    });

    return successResponse(
      res,
      { property },
      "Property added successfully"
    );
  } catch (error) {
    console.error("Error adding property:", error);
    return errorResponse(res, "Failed to add property", 500);
  }
};

/* ==================================================
   EDIT PROPERTY
   Only owner can edit
   Only if status = pending
================================================== */
export const editProperty = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findOne({
      _id: propertyId,
      userId: req.userId,
    });

    if (!property) {
      return errorResponse(res, "Property not found", 404);
    }

    if (property.status !== "pending") {
      return errorResponse(
        res,
        "Only pending properties can be edited",
        400
      );
    }

    Object.assign(property, req.body);

    await property.save();

    return successResponse(
      res,
      { property },
      "Property updated successfully"
    );
  } catch (error) {
    return errorResponse(res, "Failed to update property", 500);
  }
};

/* ==================================================
   DELETE PROPERTY
   Only owner can delete
================================================== */
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findOneAndDelete({
      _id: propertyId,
      userId: req.userId,
    });

    if (!property) {
      return errorResponse(res, "Property not found", 404);
    }

    return successResponse(
      res,
      { property },
      "Property deleted successfully"
    );
  } catch (error) {
    return errorResponse(res, "Failed to delete property", 500);
  }
};

/* ==================================================
   GET ALL PROPERTIES
   Pagination + Filters
================================================== */
export const getProperties = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      city,
      purpose,
      category,
      status,
      furnishing,
      minPrice,
      maxPrice,
      bhk,
    } = req.query;

    const filter: any = {
      status: { $in: ["available", "sold"] },
    };

    if (city) filter.city = city;
    if (purpose) filter.purpose = purpose;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (furnishing) filter.furnishing = furnishing;
    if (bhk) filter.bhk = Number(bhk);

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Property.countDocuments(filter),
    ]);

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return successResponse(
      res,
      { properties, pagination },
      "Properties fetched successfully"
    );
  } catch (error) {
    return errorResponse(res, "Failed to fetch properties", 500);
  }
};

/* ==================================================
   GET USER PROPERTIES
================================================== */
export const getUserProperties = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      userId: req.userId,
    };

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Property.countDocuments(filter),
    ]);

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return successResponse(
      res,
      { properties, pagination },
      "User properties fetched successfully"
    );
  } catch (error) {
    return errorResponse(
      res,
      "Failed to fetch user properties",
      500
    );
  }
};