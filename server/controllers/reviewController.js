import mongoose from 'mongoose';
import Review from '../models/review.model.js';
import { uploadMedia, deleteMediaFromCloudinary } from '../utils/cloudinary.js';

function extractPublicIdFromUrl(imageUrl) {
  if (!imageUrl) return null;
  try {
    const url = new URL(imageUrl);
    const pathnameParts = url.pathname.split('/').filter(Boolean);
    const uploadIndex = pathnameParts.indexOf('upload');
    if (uploadIndex !== -1) {
      const publicIdParts = pathnameParts.slice(uploadIndex + 2);
      return publicIdParts.join('/');
    }
  } catch (error) {
    console.warn('Failed to extract public_id from review image URL:', imageUrl);
  }
  return null;
}

function normalizeRating(rating) {
  const parsed = Number(rating);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < 1 || parsed > 5) return null;
  return Math.round(parsed);
}

async function createReview(req, res) {
  try {
    const { customerName, location, reviewText, rating, image, isActive } = req.body;

    if (!customerName || !reviewText) {
      return res.status(400).json({ message: 'customerName and reviewText are required' });
    }

    const normalizedRating = normalizeRating(rating);
    if (!normalizedRating) {
      return res.status(400).json({ message: 'rating must be between 1 and 5' });
    }

    let imageUrl = image || '';
    if (imageUrl && typeof imageUrl === 'string' && !imageUrl.startsWith('http')) {
      const uploadResponse = await uploadMedia(imageUrl, 'SandCTours/Reviews');
      if (!uploadResponse?.secure_url) {
        return res.status(400).json({ message: 'Image upload failed' });
      }
      imageUrl = uploadResponse.secure_url;
    }

    const lastReview = await Review.findOne().sort({ order: -1 });
    const nextOrder = lastReview ? lastReview.order + 1 : 0;

    const review = await Review.create({
      customerName: String(customerName).trim(),
      location: location ? String(location).trim() : '',
      reviewText: String(reviewText).trim(),
      rating: normalizedRating,
      image: imageUrl,
      order: nextOrder,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    console.error('Failed to create review:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getAllReviewsForAdmin(req, res) {
  try {
    const reviews = await Review.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ reviews });
  } catch (error) {
    console.error('Failed to fetch all reviews for admin:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getReviewByIdForAdmin(req, res) {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    return res.status(200).json({ review });
  } catch (error) {
    console.error('Failed to fetch review by id for admin:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function updateReview(req, res) {
  try {
    const { reviewId } = req.params;
    const { customerName, location, reviewText, rating, image, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (customerName !== undefined) review.customerName = String(customerName).trim();
    if (location !== undefined) review.location = String(location).trim();
    if (reviewText !== undefined) review.reviewText = String(reviewText).trim();

    if (rating !== undefined) {
      const normalizedRating = normalizeRating(rating);
      if (!normalizedRating) {
        return res.status(400).json({ message: 'rating must be between 1 and 5' });
      }
      review.rating = normalizedRating;
    }

    if (isActive !== undefined) {
      review.isActive = Boolean(isActive);
    }

    if (image) {
      if (typeof image === 'string' && image.startsWith('http')) {
        review.image = image;
      } else {
        const oldPublicId = extractPublicIdFromUrl(review.image);
        if (oldPublicId) {
          await deleteMediaFromCloudinary(oldPublicId);
        }

        const uploadResponse = await uploadMedia(image, 'SandCTours/Reviews');
        if (!uploadResponse?.secure_url) {
          return res.status(400).json({ message: 'Image upload failed' });
        }
        review.image = uploadResponse.secure_url;
      }
    }

    await review.save();

    return res.status(200).json({
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    console.error('Failed to update review:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function updateReviewOrder(req, res) {
  try {
    const { reviewId } = req.params;
    const { order } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    if (!Number.isInteger(order)) {
      return res.status(400).json({ message: 'order must be an integer' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.order = order;
    await review.save();

    return res.status(200).json({
      message: 'Review order updated successfully',
      review,
    });
  } catch (error) {
    console.error('Failed to update review order:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.image) {
      const publicId = extractPublicIdFromUrl(review.image);
      if (publicId) {
        await deleteMediaFromCloudinary(publicId);
      }
    }

    await review.deleteOne();

    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Failed to delete review:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getPublicReviews(req, res) {
  try {
    const reviews = await Review.find({ isActive: true })
      .select('customerName location reviewText rating image order')
      .sort({ order: 1, createdAt: -1 });

    return res.status(200).json({ reviews });
  } catch (error) {
    console.error('Failed to fetch public reviews:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

export {
  createReview,
  getAllReviewsForAdmin,
  getReviewByIdForAdmin,
  updateReview,
  updateReviewOrder,
  deleteReview,
  getPublicReviews,
};