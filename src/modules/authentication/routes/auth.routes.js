import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../../../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../middlewares/auth.validators.js";

const router = express.Router();

router.post("/register", registerSchema, validateRequest, AuthController.register);
router.post("/login", loginSchema, validateRequest, AuthController.login);
router.get("/me", verifyToken, AuthController.me);

export default router;
