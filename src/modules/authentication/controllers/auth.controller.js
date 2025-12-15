import { AuthService } from "../services/auth.service.js";
import { successResponse } from "../../../utils/response.util.js";

export const AuthController = {
  async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      return successResponse(res, 201, user, "User registered successfully");
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { token, user } = await AuthService.login(req.body);
      return successResponse(res, 200, { token, user }, "Login successful");
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      return successResponse(res, 200, user, "User profile retrieved successfully");
    } catch (err) {
      next(err);
    }
  },
};
