import express from 'express';
import {
	createCity,
	reorderCities,
	getAllCitiesForAdmin,
	getCityByIdForAdmin,
	updateCity,
	updateCityOrder,
	deleteCity,
	getPublicCities,
	getCityPageData,
} from '../controllers/cityController.js';
import { requireAdminAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/admin', requireAdminAuth, createCity);
router.get('/admin', requireAdminAuth, getAllCitiesForAdmin);
router.patch('/admin/reorder', requireAdminAuth, reorderCities);
router.get('/admin/:cityId', requireAdminAuth, getCityByIdForAdmin);
router.put('/admin/:cityId', requireAdminAuth, updateCity);
router.patch('/admin/:cityId/order', requireAdminAuth, updateCityOrder);
router.delete('/admin/:cityId', requireAdminAuth, deleteCity);

router.get('/', getPublicCities);
router.get('/:cityId', getCityPageData);


export default router;
