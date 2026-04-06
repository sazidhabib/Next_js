const { z } = require('zod');

//Creating an object schema for sign up
const signUpSchema = z.object({
    username: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(3, { message: "Name must be at least 3 chars." })
        .max(255, { message: "Name must be less than 255 characters." }),

    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid email" })
        .min(3, { message: "Email must be at least 3 chars." })
        .max(255, { message: "Email must be less than 255 characters." }),

    phone: z
        .string({ required_error: "Phone is required" })
        .trim()
        .min(11, { message: "Phone must be at least 11 chars." })
        .max(20, { message: "Phone must be less than 20 characters." }),

    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(7, { message: "Password must be at least 7 chars." })
        .max(1024, { message: "Password must be less than 1024 characters." }),

    // ✅ Add this line:
    isAdmin: z.boolean().optional(), // Accept boolean; optional if not always present
});

const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid email" })
        .min(3, { message: "Email must be at lest of 3 chars." })
        .max(255, { message: "Email must be more than 255 characters." }),
    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(7, { message: "Password must be at lest of 7 chars." })
        .max(1024, { message: "Password must be more than 1024 characters." }),
});

module.exports = { signUpSchema, loginSchema };
