import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

startServer();
