import express from "express";

import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/createdTask", createTask);
router.get("/getTasks", getAllTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
