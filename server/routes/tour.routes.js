import express from 'express';
import {
	createTour,
	getAllToursForAdmin,
	getTourByIdForAdmin,
	updateTour,
	updateTourOrder,
	deleteTour,
	getTours,
	getToursByCity,
	getPublicTourById,
} from '../controllers/tourController.js';
import { requireAdminAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/admin', requireAdminAuth, createTour);
router.get('/admin', requireAdminAuth, getAllToursForAdmin);
router.get('/admin/:tourId', requireAdminAuth, getTourByIdForAdmin);
router.put('/admin/:tourId', requireAdminAuth, updateTour);
router.patch('/admin/:tourId/order', requireAdminAuth, updateTourOrder);
router.delete('/admin/:tourId', requireAdminAuth, deleteTour);

router.get('/', getTours);
router.get('/city/:cityId', getToursByCity);
router.get('/:tourId', getPublicTourById);

export default router;
