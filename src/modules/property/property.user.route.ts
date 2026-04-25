import { Router } from "express";
import { auth, role } from "../../middlewares/auth.middleware";
import {
  addProperty,
  editProperty,
  deleteProperty,
  getUserProperties,
  getProperties,
  markPropertyAsSold,
  getPropertyById,
} from "./property.user.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Property User
 *   description: Property management APIs for users
 */

/**
 * @swagger
 * /api/property/user/public:
 *   get:
 *     summary: Get all public properties with filters
 *     tags: [Property User]
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
 *           enum: [available, sold]
 *         description: Filter by status
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search by title (case insensitive)
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
 */

router.get("/public", getProperties);

/**
 * @swagger
 * /api/property/user/public/{propertyId}:
 *   get:
 *     summary: Get property by ID (public access)
 *     tags: [Property User]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property fetched successfully
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
 *                   example: "Property fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     property:
 *                       $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
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
 *                   example: "Property not found"
 *       500:
 *         description: Internal server error
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
 *                   example: "Failed to fetch property"
 */

router.get("/public/:propertyId", getPropertyById);

router.use([auth, role("user")]);

/**
 * @swagger
 * /api/property/user/:
 *   post:
 *     summary: Add a new property
 *     tags: [Property User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - purpose
 *               - category
 *               - price
 *               - totalArea
 *               - city
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Beautiful 3BHK Apartment in Delhi"
 *               purpose:
 *                 type: string
 *                 enum: [rent, sale]
 *                 example: "rent"
 *               category:
 *                 type: string
 *                 enum: [flat, apartment, house, villa, studio, pg, shop, office, plot, warehouse]
 *                 example: "apartment"
 *               price:
 *                 type: number
 *                 example: 25000
 *               priceType:
 *                 type: string
 *                 enum: [monthly, yearly, total]
 *                 example: "monthly"
 *               bhk:
 *                 type: number
 *                 example: 3
 *               bathrooms:
 *                 type: number
 *                 example: 2
 *               totalArea:
 *                 type: number
 *                 example: 1200
 *               areaUnit:
 *                 type: string
 *                 enum: [sqft, sqm, marla, kanal, acre]
 *                 example: "sqft"
 *               city:
 *                 type: string
 *                 example: "Delhi"
 *               sector:
 *                 type: string
 *                 example: "Sector 15"
 *               locality:
 *                 type: string
 *                 example: "Rohini"
 *               landmark:
 *                 type: string
 *                 example: "Near Metro Station"
 *               fullAddress:
 *                 type: string
 *                 example: "123 Main Street, Rohini, Delhi"
 *               furnishing:
 *                 type: string
 *                 enum: [unfurnished, semi-furnished, fully-furnished]
 *                 example: "semi-furnished"
 *               parking:
 *                 type: string
 *                 enum: [none, bike, car, both]
 *                 example: "car"
 *               age:
 *                 type: number
 *                 example: 2
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [lift, gym, power_backup, swimming_pool, security, clubhouse, park, near_market]
 *                 example: ["lift", "gym", "security"]
 *               description:
 *                 type: string
 *                 example: "Spacious 3BHK apartment with modern amenities"
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://example.com/image1.jpg"
 *     responses:
 *       200:
 *         description: Property added successfully
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
 *                   example: "Property added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     property:
 *                       $ref: '#/components/schemas/Property'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post("/", addProperty);

/**
 * @swagger
 * /api/property/user/{propertyId}:
 *   put:
 *     summary: Update a property (only owner, only if status is pending)
 *     tags: [Property User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Beautiful 3BHK Apartment"
 *               purpose:
 *                 type: string
 *                 enum: [rent, sale]
 *                 example: "rent"
 *               category:
 *                 type: string
 *                 enum: [flat, apartment, house, villa, studio, pg, shop, office, plot, warehouse]
 *                 example: "apartment"
 *               price:
 *                 type: number
 *                 example: 30000
 *               priceType:
 *                 type: string
 *                 enum: [monthly, yearly, total]
 *                 example: "monthly"
 *               bhk:
 *                 type: number
 *                 example: 3
 *               bathrooms:
 *                 type: number
 *                 example: 2
 *               totalArea:
 *                 type: number
 *                 example: 1200
 *               areaUnit:
 *                 type: string
 *                 enum: [sqft, sqm, marla, kanal, acre]
 *                 example: "sqft"
 *               city:
 *                 type: string
 *                 example: "Delhi"
 *               sector:
 *                 type: string
 *                 example: "Sector 15"
 *               locality:
 *                 type: string
 *                 example: "Rohini"
 *               landmark:
 *                 type: string
 *                 example: "Near Metro Station"
 *               fullAddress:
 *                 type: string
 *                 example: "123 Main Street, Rohini, Delhi"
 *               furnishing:
 *                 type: string
 *                 enum: [unfurnished, semi-furnished, fully-furnished]
 *                 example: "semi-furnished"
 *               parking:
 *                 type: string
 *                 enum: [none, bike, car, both]
 *                 example: "car"
 *               age:
 *                 type: number
 *                 example: 2
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [lift, gym, power_backup, swimming_pool, security, clubhouse, park, near_market]
 *                 example: ["lift", "gym", "security"]
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://example.com/image1.jpg"
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
 *       400:
 *         description: Only pending properties can be edited
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 *       500:
 *         description: Internal server error
 */

router.put("/:propertyId", editProperty);

/**
 * @swagger
 * /api/property/user/{propertyId}:
 *   delete:
 *     summary: Delete a property (only owner)
 *     tags: [Property User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
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

router.delete("/:propertyId", deleteProperty);

/**
 * @swagger
 * /api/property/user/:
 *   get:
 *     summary: Get current user's properties
 *     tags: [Property User]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, sold, pending]
 *         description: Filter by status
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search by title (case insensitive)
 *     responses:
 *       200:
 *         description: User properties fetched successfully
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
 *                   example: "User properties fetched successfully"
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

router.patch("/:propertyId/mark-sold", markPropertyAsSold);

/**
 * @swagger
 * /api/property/user/{propertyId}/mark-sold:
 *   patch:
 *     summary: Mark property as sold (only owner)
 *     tags: [Property User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
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
 *                   example: "Unauthorized"
 *       403:
 *         description: Forbidden - Not property owner
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
 *                   example: "Unauthorized"
 *       404:
 *         description: Property not found
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
 *                   example: "Property not found"
 *       500:
 *         description: Internal server error
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
 *                   example: "Failed to mark property as sold"
 */

router.get("/", getUserProperties);

export default router;

