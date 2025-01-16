import {clerkMiddleware,
createClerkClient,
requireAuth,
} from "@clerk/express";

import express from "express";

import dotenv from "dotenv";

import bodyParser from "body-parser";

import cors from "cors";

import helmet from "helmet";

import morgan from "morgan";

import serverless from "serverless-http";

import { connectToDB } from "./database/connection"; 
import courseRoutes from "./routes/courseRoutes"; 
import transactionRoutes from "./routes/transactionRoutes";
import userClerkRoutes from "./routes/userClerkRoutes";
import userCourseProgressRoutes from "./routes/userCourseProgressRoutes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(clerkMiddleware());
app.use("/users/course-progress", requireAuth(), userCourseProgressRoutes);

// Routes



/* ROUTES */
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/courses", courseRoutes);

app.use("/users/clerk", requireAuth(), userClerkRoutes);

app.use("/transactions",requireAuth(), transactionRoutes);
// Start Server
(async () => {
  try {
    await connectToDB(); // Connect to MongoDB
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
})();

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});