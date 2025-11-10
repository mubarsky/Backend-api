// import dotenv from "dotenv";
import express from "express";
import connectToDatabase from "./databaseConnection/connection.js";
import userRoutes from "./routes/user.route.js";
import taskRouters from "./routes/task.route.js";
import morgan from "morgan";
import cors from "cors";

console.log("🔍 Render Environment Variables:", Object.keys(process.env));
console.log(
  "✅ RESEND_API_KEY:",
  process.env.RESEND_API_KEY ? "Loaded ✅" : "Missing ❌"
);

// dotenv.config();
const app = express();

console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);
// parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logger
app.use(morgan("dev"));

const port = process.env.PORT || 3000;
app.use(cors());

connectToDatabase();

app.get("/", (req, res) => {
  res.send("  Hello MongoDB with Node.js and Express!");
});

//user routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/task", taskRouters);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


