import { db  } from "#config/database.js";
import logger from "#config/logger.js";
import { users } from "#models/user.model.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        logger.error('Error hashing password' , error);
        throw new Error('Error hashing password');
    }
}

export const comparePassword = async (password , hash) => {
    try {
        return await bcrypt.compare(password , hash);
    } catch (error) {
        logger.error('Error comparing password' , error);
        throw new Error('Error comparing password');
    }
}

export const CreateUser = async (user) => {
    try {
        const {name , email , password , role} = user;

        const userExists = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (userExists.length > 0) {
            throw new Error('User already exists');
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await db.insert(users).values({name , email , password : hashedPassword , role}).returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
        });

        logger.info(`User ${newUser[0].email} created successfully`);
        return newUser[0];
    } catch (error) {
        logger.error(`Error creating user ${error}`);
        throw new Error(error.message);
    }
}

export const getUserByEmail = async (email) => {
    try {
        const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (user.length === 0) {
            return null;
        }
        return user[0];
    } catch (error) {
        logger.error(`Error getting user by email ${error}`);
        throw new Error('Error getting user');
    }
}
