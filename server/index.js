import mongoose from "mongoose";

import app from "./app";
import config from "./config/config";
import logger from "./config/logger";

let server;
const PORT = process.env.PORT || 3000;
server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
    });
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
