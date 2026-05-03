import { Router } from "express";
import { auth, role } from "../../middlewares/auth.middleware";
import {
  approveProperty,
  deleteProperty,
  getProperties,
  markPropertyAsSold,
  editProperty,
  getStat,
} from "./property.admin.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Property Admin
 *   description: Property management APIs for administrators
 */

router.use([auth, role("admin", "agent")]);

/**
 * @swagger
 * /api/property/admin/properties:
 *   get:
 *     summary: Get all properties with pagination, filters, and search
 *     tags: [Property Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: purpose
 *         schema:
 *           type: string
 *           enum: [rent, sale]
 *         description: Filter by purpose
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [flat, apartment, house, villa, studio, pg, shop, office, plot, warehouse]
 *         description: Filter by category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, sold, pending]
 *         description: Filter by status
 *       - in: query
 *         name: furnishing
 *         schema:
 *           type: string
 *           enum: [unfurnished, semi-furnished, fully-furnished]
 *         description: Filter by furnishing
 *       - in: query
 *         name: bhk
 *         schema:
 *           type: integer
 *         description: Filter by BHK
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *     responses:
 *       200:
 *         description: Properties fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Properties fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     properties:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Property'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get("/properties", getProperties);

/**
 * @swagger
 * /api/property/admin/stats:
 *   get:
 *     summary: Get comprehensive property statistics
 *     tags: [Property Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Property statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Property statistics fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         overview:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: integer
 *                               example: 150
 *                               description: Total number of properties
 *                             available:
 *                               type: integer
 *                               example: 80
 *                               description: Number of available properties
 *                             sold:
 *                               type: integer
 *                               example: 45
 *                               description: Number of sold properties
 *                             pending:
 *                               type: integer
 *                               example: 25
 *                               description: Number of pending properties
 *                             avgPrice:
 *                               type: number
 *                               example: 25000
 *                               description: Average property price
 *                         breakdown:
 *                           type: object
 *                           properties:
 *                             byCategory:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   _id:
 *                                     type: string
 *                                     example: "apartment"
 *                                   count:
 *                                     type: integer
 *                                     example: 45
 *                               description: Properties grouped by category
 *                             byCity:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   _id:
 *                                     type: string
 *                                     example: "Mumbai"
 *                                   count:
 *                                     type: integer
 *                                     example: 30
 *                               description: Top 10 cities by property count
 *                             byPurpose:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   _id:
 *                                     type: string
 *                                     example: "sale"
 *                                   count:
 *                                     type: integer
 *                                     example: 90
 *                               description: Properties grouped by purpose
 *                         recent:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                                 example: "Luxury Apartment"
 *                               price:
 *                                 type: number
 *                                 example: 35000
 *                               city:
 *                                 type: string
 *                                 example: "Mumbai"
 *                               status:
 *                                 type: string
 *                                 example: "available"
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                           description: 5 most recent properties
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get("/stats", getStat);

/**
 * @swagger
 * /api/property/admin/properties/{propertyId}/approve:
 *   patch:
 *     summary: Toggle property status between pending and available
 *     tags: [Property Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID to toggle status
 *     responses:
 *       200:
 *         description: Property status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Property approved successfully"
 *                   description: Will be "Property approved successfully" or "Property pending successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     property:
 *                       $ref: '#/components/schemas/Property'
 *       400:
 *         description: Property is already sold
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Property is already sold"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 *       500:
 *         description: Internal server error
 */

router.patch("/properties/:propertyId/approve", approveProperty);

/**
 * @swagger
 * /api/property/admin/properties/{propertyId}/mark-sold:
 *   patch:
 *     summary: Mark property as sold
 *     tags: [Property Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID to mark as sold
 *     responses:
 *       200:
 *         description: Property marked as sold successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Property marked as sold successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     property:
 *                       $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 *       500:
 *         description: Internal server error
 */

router.patch("/properties/:propertyId/mark-sold", markPropertyAsSold);

/**
 * @swagger
 * /api/property/admin/properties/{propertyId}:
 *   put:
 *     summary: Update property (admin can update any field)
 *     tags: [Property Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Any property fields can be updated
 *             example:
 *               title: "Updated Property Title"
 *               price: 35000
 *               status: "available"
 *     responses:
 *       200:
 *         description: Property updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Property updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     property:
 *                       $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 *       500:
 *         description: Internal server error
 */

router.put("/properties/:propertyId", editProperty);

/**
 * @swagger
 * /api/property/admin/properties/{propertyId}:
 *   delete:
 *     summary: Delete property permanently
 *     tags: [Property Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID to delete
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Property deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     property:
 *                       $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 *       500:
 *         description: Internal server error
 */

router.delete("/properties/:propertyId", deleteProperty);

export default router;