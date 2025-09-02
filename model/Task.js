import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
  description: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  dueDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },

},
   {
    timestamps: true, // Automatically add createdAt and updatedAt fields
   }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;