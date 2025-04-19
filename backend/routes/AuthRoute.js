import express from "express";
import {
  register,
  login,
  getUserProfile,
  updatePassword,
  uploadProfilePic,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} from "../controllers/AuthController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

export const restrictAdminAccess = (req, res, next) => {
  if (req.user.role === "admin") {
    return res.status(403).json({ error: "Admins cannot access this route" });
  }
  next();
};

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware,restrictAdminAccess , getUserProfile); // Get user details
router.get("/users", getAllUsers);
router.delete("/delete/:id", authMiddleware, deleteUser);
router.post("/change-password", authMiddleware, updatePassword); // Update user password
router.post(
  "/upload-profile",
  authMiddleware,restrictAdminAccess,
  upload.single("profilePic"),
  uploadProfilePic
);
router.put(
  "/update-profile",
  authMiddleware,restrictAdminAccess,
  upload.single("profilePic"),
  updateUserProfile
);

export default router;
