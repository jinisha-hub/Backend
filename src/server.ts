import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import cors from "cors"; // <-- Import cors
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import "./config/passportconfig.js";

dotenv.config();

const app = express();

// CORS middleware
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // If you’re using sessions or cookies
}));

app.use(express.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
