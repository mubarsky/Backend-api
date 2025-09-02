import Task from "../model/Task.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// Create the business logic for tasks
// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, priority } = req.body;

    // Create a new task
    const newTask = new Task({
      title,
      description,
      status,
      dueDate,
      priority,
    });

    const createdTask = await newTask.save();
    return res.status(201).json({
      message: "Task created successfully",
      task: createdTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    return res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
// Get a single task
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    console.log(task);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    return res.status(200).json({
      message: "Task retrieved successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
// Update a task
export const updateTask = async (req, res) => {
   const { id } = req.params;
   const { title, description, status, dueDate, priority } = req.body;
  try {
   
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    // update task fields
    const taskToUpdate = await Task.findByIdAndUpdate(
      id,
      {
        title: title || task.title,
        description: description || task.description,
        status: status || task.status,
        dueDate: dueDate || task.dueDate,
        priority: priority || task.priority,
      },
      { new: true } //
    );

    return res.status(200).json({
      message:  " Task updated successfully",
      task: taskToUpdate,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    await Task.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Task deleted successfully",
      
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};