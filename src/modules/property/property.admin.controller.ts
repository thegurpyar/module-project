import { Request, Response } from "express";
import Property from "./property.model";
import {
  successResponse,
  errorResponse,
} from "../../middlewares/errorHandler";

/* ==================================================
   ADMIN APPROVE PROPERTY
================================================== */
export const approveProperty = async (
  req: Request,
  res: Response
) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);

    if (!property) {
      return errorResponse(res, "Property not found", 404);
    }

    if (property.status === "sold") {
      return errorResponse(res, "Property is already sold", 400);
    }
    
    // Toggle between pending and available
    property.status = property.status === "pending" ? "available" : "pending";

    await property.save();

    const statusText = property.status === "available" ? "approved" : "pending";
    return successResponse(
      res,
      { property },
      `Property ${statusText} successfully`
    );
  } catch (error) {
    console.error("Error approving property:", error);
    return errorResponse(res, "Failed to approve property", 500);
  }
};

/* ==================================================
   ADMIN DELETE PROPERTY
================================================== */
export const deleteProperty = async (
  req: Request,
  res: Response
) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findByIdAndDelete(propertyId);

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
   ADMIN GET ALL PROPERTIES
   Pagination + Filters
================================================== */
export const getProperties = async (
  req: Request,
  res: Response
) => {
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
      userId,
    } = req.query;

    const filter: any = {};

    if (city) filter.city = city;
    if (purpose) filter.purpose = purpose;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (furnishing) filter.furnishing = furnishing;
    if (bhk) filter.bhk = Number(bhk);
    if (userId) filter.userId = userId;

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("userId", "name email")
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


export const markPropertyAsSold = async (
  req: Request,
  res: Response
) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);

    if (!property) {
      return errorResponse(res, "Property not found", 404);
    }

    property.status = "sold";

    await property.save();

    return successResponse(
      res,
      { property },
      "Property marked as sold successfully"
    );
  } catch (error) {
    return errorResponse(res, "Failed to mark property as sold", 500);
  }
};


export const editProperty = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findOne({
      _id: propertyId,
    });

    if (!property) {
      return errorResponse(res, "Property not found", 404);
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

export const getStat = async (req: Request, res: Response) => {
  try {
    // Get overall property statistics
    const [
      totalProperties,
      availableProperties,
      soldProperties,
      pendingProperties,
      propertiesByCategory,
      propertiesByCity,
      propertiesByPurpose,
      avgPrice,
      recentProperties
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: "available" }),
      Property.countDocuments({ status: "sold" }),
      Property.countDocuments({ status: "pending" }),
      Property.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Property.aggregate([
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Property.aggregate([
        { $group: { _id: "$purpose", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Property.aggregate([
        { $group: { _id: null, avgPrice: { $avg: "$price" } } }
      ]),
      Property.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title price city status createdAt")
    ]);

    const stats = {
      overview: {
        total: totalProperties,
        available: availableProperties,
        sold: soldProperties,
        pending: pendingProperties,
        avgPrice: avgPrice[0]?.avgPrice || 0
      },
      breakdown: {
        byCategory: propertiesByCategory,
        byCity: propertiesByCity,
        byPurpose: propertiesByPurpose
      },
      recent: recentProperties
    };

    return successResponse(
      res,
      { stats },
      "Property statistics fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching property stats:", error);
    return errorResponse(res, "Failed to fetch property statistics", 500);
  }
};