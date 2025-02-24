
import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import "./config/passportconfig.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
