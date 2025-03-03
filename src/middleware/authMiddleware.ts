import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";


interface DecodedToken {
  id: number;
}

interface AuthRequest extends Request {
  user?:any;
}

export const protect = async (req: any, res: any, next: NextFunction) => {
  console.log(req, "2535213521351423512351243")
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach only the needed user fields
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
console.log("authMiddleware loaded");
