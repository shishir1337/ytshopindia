import { z } from "zod";

/**
 * Validation schemas for API endpoints
 */

// Email validation
export const emailSchema = z.string().email("Invalid email address").min(1).max(255);

// Order creation validation
export const createOrderSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  channelAccessEmail: z.string().email("Invalid channel access email address").min(1, "Channel access email is required"),
  guestEmail: z.string().email("Invalid email address").optional().nullable(),
  guestName: z.string().min(1).max(255).optional().nullable(),
});

// Checkout validation
export const checkoutSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  guestEmail: z.string().email("Invalid email address").optional().nullable(),
  guestName: z.string().min(1).max(255).optional().nullable(),
});

// Delivery validation
export const deliverySchema = z.object({
  deliveryDetails: z.string().min(10, "Delivery details must be at least 10 characters").max(5000),
  deliveryNotes: z.string().max(5000).optional().nullable(),
});

// Password reset validation
export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(100),
  token: z.string().min(1, "Token is required"),
});

// Forgot password validation
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Login validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Sign up validation
export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

/**
 * Validate and sanitize email
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  try {
    emailSchema.parse(email);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.issues[0]?.message || "Invalid email address" };
    }
    return { valid: false, error: "Invalid email address" };
  }
}

