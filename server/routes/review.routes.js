import express from 'express';
import {
  createReview,
  getAllReviewsForAdmin,
  getReviewByIdForAdmin,
  updateReview,
  updateReviewOrder,
  deleteReview,
  getPublicReviews,
} from '../controllers/reviewController.js';
import { requireAdminAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/admin', requireAdminAuth, createReview);
router.get('/admin', requireAdminAuth, getAllReviewsForAdmin);
router.get('/admin/:reviewId', requireAdminAuth, getReviewByIdForAdmin);
router.put('/admin/:reviewId', requireAdminAuth, updateReview);
router.patch('/admin/:reviewId/order', requireAdminAuth, updateReviewOrder);
router.delete('/admin/:reviewId', requireAdminAuth, deleteReview);

router.get('/', getPublicReviews);

export default router;