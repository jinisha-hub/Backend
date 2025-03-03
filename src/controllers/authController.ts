import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authServices.js";
import generateToken from "../utils/generateToken.js";
import { number } from "yup";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    // Assert error as an instance of Error
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.json({ user, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(401).json({ error: "An unknown error occurred" });
    }
  }
};

// export const googleAuthRedirect = (req: Request, res: Response) => {
//   const user = req.user as { id: number }; 
//   res.json({ user, token: user ? generateToken(user.id) : null });
// };

export const googleAuthRedirect = (req: Request, res: Response) => {
  if (!req.user) {
    return res.redirect("http://localhost:5173/login?error=Unauthorized");
  }

  const user = req.user as { id: number; email: string; name: string };
  const token = generateToken(user.id);

  // Redirect to frontend with token and user details in query parameters
  res.redirect(`http://localhost:5173/home?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
};
