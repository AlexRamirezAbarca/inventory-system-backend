import express from "express";
import authRoutes from "./modules/authentication/routes/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

// Global Error Handler
app.use(errorMiddleware);

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
