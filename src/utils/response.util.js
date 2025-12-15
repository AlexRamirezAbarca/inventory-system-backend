export const successResponse = (res, code, data, message = "Success") => {
  return res.status(code).json({
    code,
    data,
    message,
  });
};
