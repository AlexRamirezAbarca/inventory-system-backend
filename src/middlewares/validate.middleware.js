import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // 400 Bad Request
    return res.status(400).json({
      code: 400,
      data: errors.array(),
      message: "Validation Error",
    });
  }
  next();
};
