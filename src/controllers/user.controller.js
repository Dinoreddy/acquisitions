import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from '#services/user.service.js';
import logger from '#config/logger.js';

export const getAll = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res
      .status(200)
      .json({ message: 'Users retrieved successfully', data: users });
  } catch (error) {
    logger.error(`Error in getAll users controller: ${error}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(Number(id));

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res
      .status(200)
      .json({ message: 'User retrieved successfully', data: user });
  } catch (error) {
    logger.error(`Error in getById user controller: ${error}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    // Basic validation - can be enhanced with Zod
    if (!req.body.name && !req.body.email && !req.body.role) {
      return res
        .status(400)
        .json({
          message:
            'At least one field (name, email, role) is required for update',
        });
    }

    const updatedUser = await updateUserById(Number(id), req.body);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res
      .status(200)
      .json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    logger.error(`Error in update user controller: ${error}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(Number(id));

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error(`Error in remove user controller: ${error}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
