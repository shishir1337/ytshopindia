import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "./prisma";
import { sendPasswordResetEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendPasswordResetEmail({
        to: user.email,
        resetUrl: url,
        userName: user.name || "User",
      });
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "",
  rateLimit: {
    enabled: process.env.NODE_ENV === "production",
    window: 60, // 60 seconds
    max: 100, // max 100 requests per window
    customRules: {
      "/sign-in/email": {
        window: 10,
        max: 5, // 5 login attempts per 10 seconds
      },
      "/forgot-password": {
        window: 60,
        max: 3, // 3 password reset requests per minute
      },
      "/reset-password": {
        window: 10,
        max: 3, // 3 reset attempts per 10 seconds
      },
    },
    storage: "database", // Use database for rate limiting
  },
  plugins: [
    admin(),
  ],
});

