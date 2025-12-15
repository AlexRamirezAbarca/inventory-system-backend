import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../../config/prisma.js";
import { AppError } from "../../../utils/AppError.js";


const JWT_SECRET = process.env.JWT_SECRET || "SecretKey";

export const AuthService = {
  async register({ name, email, password, roleId, planId }) {
    // Check if email exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError("Email already registered", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        roleId,
        planId,
      },
    });

    return user;
  },

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        roleId: user.roleId,
        planId: user.planId,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return { token, user };
  },

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        plan: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  },
};

