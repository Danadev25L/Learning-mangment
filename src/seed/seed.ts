import mongoose from "mongoose";

import fs from "fs";

import path from "path";

import dotenv from "dotenv";

import{connectToDB} from "../database/connection";
import Course from "../database/models/courseModel";
import Transaction from "../database/models/transactionModel";
import UserCourseProgress from "../database/models/userCourseProgressModel";

dotenv.config();

/* Mongoose Configuration */
const isProduction = process.env.NODE_ENV === "production";


async function seedData(model: mongoose.Model<any>, filePath: string) {
  const data: { [key: string]: any }[] = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );

  console.log(`Seeding data for model: ${model.modelName}`);

  for (const item of data) {
    try {
      await model.create(item);
    } catch (err) {
      console.error(
        `Unable to add item to ${model.modelName}. Error:`,
        JSON.stringify(err, null, 2)
      );
    }
  }

  console.log(
    "\x1b[32m%s\x1b[0m",
    `Successfully seeded data for model: ${model.modelName}`
  );
}

async function clearCollections(models: mongoose.Model<any>[]) {
  for (const model of models) {
    try {
      await model.deleteMany({});
      console.log(`Cleared data for collection: ${model.collection.name}`);
    } catch (err) {
      console.error(
        `Unable to clear data for collection ${model.collection.name}. Error:`,
        err
      );
    }
  }
}

export default async function seed() {
  // Connect to MongoDB
  await connectToDB();

  // Define the models to seed
  const models = [
    { model: Transaction, fileName: "transactions.json" },
    { model: UserCourseProgress, fileName: "userCourseProgress.json" },
    { model: Course, fileName: "courses.json" },
  ];

  // Clear all collections before seeding
  const modelInstances = models.map((item) => item.model);
  await clearCollections(modelInstances);

  // Seed data from JSON files
  const seedDataPath = path.join(__dirname, "./data");
  for (const { model, fileName } of models) {
    const filePath = path.join(seedDataPath, fileName);
    await seedData(model, filePath);
  }

  console.log("\x1b[32m%s\x1b[0m", "Successfully seeded all data!");
  process.exit(0);
}

if (require.main === module) {
  seed().catch((error) => {
    console.error("Failed to run seed script:", error);
    process.exit(1);
  });
}
