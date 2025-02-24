import { Request, Response } from "express";
import { createTask, getUserTasks } from "../services/taskServices.js";


interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface TaskBody {
  title: string;
  description?: string;
  expectedDate?: string;
}

export const addTask = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, description, expectedDate } = req.body as TaskBody;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const userId = req.user.id;

    const task = await createTask(userId, title, description ?? "", expectedDate ?? "");

    res.status(201).json(task);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(400).json({ error: (error as Error).message || "Something went wrong" });
  }
};
export const fetchTasks = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tasks = await getUserTasks(req.user.id);
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: (error as Error).message || "Something went wrong" });
  }
};