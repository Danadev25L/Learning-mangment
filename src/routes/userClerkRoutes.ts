import express from "express";
import { updateUser } from "../../../learning-management/server/src/controllers/userClerkController";

const router = express.Router();

router.put("/:userId", updateUser);

export default router;
