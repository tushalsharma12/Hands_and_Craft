import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/CartController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

// authMiddleware.js
export const restrictAdminAccess = (req, res, next) => {
  if (req.user.role === "admin") {
    return res.status(403).json({ error: "Admins cannot access this route" });
  }
  next();
};


const router = express.Router();

router.get("/", authMiddleware,restrictAdminAccess, getCart);
router.post("/add", authMiddleware,restrictAdminAccess, addToCart);
router.delete("/remove/:productId", authMiddleware,restrictAdminAccess, removeFromCart);

export default router;
