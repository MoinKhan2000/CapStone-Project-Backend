import { ErrorHandler } from "../utils/errorHandler.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
  // Check if the error is an instance of ErrorHandler, which means it's a known error
  if (err instanceof ErrorHandler) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  } else {
    // If not, handle it as an internal server error
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

export const handleUncaughtError = () => {
  process.on("uncaughtException", (err) => {
    console.error(`Error: ${err.message}`);
    console.error("Shutting down the server due to an uncaught exception...");

    // Optionally, shut down the process gracefully
    // process.exit(1);
  });
};
