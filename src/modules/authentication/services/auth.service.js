import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../../config/prisma.js";

console.log("🔍 Prisma importado:", prisma); 
const JWT_SECRET = process.env.JWT_SECRET || "SecretKey";

export const AuthService = {

 async register({ name, email, password, roleId, planId }) {
  try {
    // Verificar si el email ya existe
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      throw new Error("Email already registered");
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
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

  } catch (error) {
    console.error("❌ Error en register:", error.message);
    console.error("Stack trace:", error.stack);
    
    // Re-lanzar el error para que el controller lo maneje
    throw error;
  }
},

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error("Invalid password");

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
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        role: true,
        plan: true,
      },
    });

    return user;
  },
};
