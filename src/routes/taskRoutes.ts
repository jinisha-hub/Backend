
import express from "express";
import { fetchTasks, addTask } from "../controllers/taskController.js";
import  {protect}  from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, fetchTasks);
router.post("/", protect, addTask);

export default router;

