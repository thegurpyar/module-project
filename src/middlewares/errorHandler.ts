export const successResponse = (
  res,
  data = {},
  message = "Success",
  statusCode = 200,
  meta = null
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
};


// Error response
export const errorResponse = (res, error, statusCode = 500, errors = null) => {
  let message =
    typeof error === "string"
      ? error
      : error?.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

// Global error handling middleware (for uncaught errors)
export const globalErrorHandler = (err, req, res, next) => {
  console.error("❌ Global Error:", err.stack || err.message);
  errorResponse(res, err, err.statusCode || 500);
};