import {z} from "zod";

export const signUpSchema = z.object({
    name : z.string().min(3 , 'Name must be at least 3 characters long').max(255 , 'Name must be at most 255 characters long').trim(),
    email : z.email('Invalid email address').toLowerCase().trim(),
    password : z.string().min(6 , 'Password must be at least 6 characters long').max(255 , 'Password must be at most 255 characters long'),
    role : z.enum(['user' , 'admin']).default('user'),
})

export const signInSchema = z.object({
    email : z.email('Invalid email address').toLowerCase().trim(),
    password : z.string().min(6 , 'Password must be at least 6 characters long').max(255 , 'Password must be at most 255 characters long'),
})
