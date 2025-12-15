export const errorMiddleware = (err, req, res, next) => {
  console.error("❌ Error:", err.message);
  if (err.stack) console.error(err.stack);

  const code = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const data = err.data || null;

  return res.status(code).json({
    code,
    data,
    message,
  });
};
