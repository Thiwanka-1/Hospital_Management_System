import express from 'express';
import {
  test,
  updateUser,
  deleteUser,
  verifyAdmin,
  getAllUsers,
  getAllNonDoctorsAndAdmins,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/all', verifyToken, getAllUsers);
router.get('/allPatients', verifyToken, getAllNonDoctorsAndAdmins);


router.get('/admin', verifyToken, verifyAdmin, (req, res) => {
  res.json('Admin route, only accessible by admin.');
});

export default router;