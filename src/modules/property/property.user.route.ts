import { Router } from "express";
import { auth, role } from "../../middlewares/auth.middleware";
import {
  addProperty,
  editProperty,
  deleteProperty,
  getUserProperties,
  getProperties,
} from "./property.user.controller";

const router = Router();

router.get("/public", getProperties);

router.use([auth, role("user")]);

router.post("/", addProperty);
router.put("/:propertyId", editProperty);
router.delete("/:propertyId", deleteProperty);
router.get("/", getUserProperties);

export default router;

