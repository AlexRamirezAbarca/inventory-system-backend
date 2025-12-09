import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  async register(req, res) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ success: true, user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async login(req, res) {
    try {
      const { token, user } = await AuthService.login(req.body);
      res.json({ success: true, token, user });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  },

  async me(req, res) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
