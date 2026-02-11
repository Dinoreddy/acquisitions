import express from 'express';
import {
  getAll,
  getById,
  update,
  remove,
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
