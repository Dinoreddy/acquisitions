import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';
import logger from '#config/logger.js';

export const getAllUsers = async () => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);
    return allUsers;
  } catch (error) {
    logger.error(`Error getting all users: ${error}`);
    throw new Error('Error getting all users', { cause: error });
  }
};

export const getUserById = async id => {
  try {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (user.length === 0) {
      return null;
    }
    return user[0];
  } catch (error) {
    logger.error(`Error getting user by id: ${error}`);
    throw new Error('Error getting user by id', { cause: error });
  }
};

export const updateUserById = async (id, data) => {
  try {
    const { name, email, role } = data;
    const updatedUser = await db
      .update(users)
      .set({ name, email, role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        updatedAt: users.updatedAt,
      });

    if (updatedUser.length === 0) {
      return null;
    }
    return updatedUser[0];
  } catch (error) {
    logger.error(`Error updating user: ${error}`);
    throw new Error('Error updating user', { cause: error });
  }
};

export const deleteUserById = async id => {
  try {
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (deletedUser.length === 0) {
      return null;
    }
    return deletedUser[0];
  } catch (error) {
    logger.error(`Error deleting user: ${error}`);
    throw new Error('Error deleting user', { cause: error });
  }
};
