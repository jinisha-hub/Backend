
import express from "express";
//import passport from "passport";
import { login, googleAuthRedirect, signup } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), googleAuthRedirect);

export default router;

// config/passportconfig.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.CALLBACK_URL!
    
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails ? profile.emails[0].value : '';
      let user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: profile.displayName,
            email,
            password: "google-oauth-placeholder" // Placeholder password for Google users
          }
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));


passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
