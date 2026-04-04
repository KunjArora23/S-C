import mongoose from 'mongoose';
import Tour from '../models/tour.model.js';
import CityTour from '../models/city.model.js';
import { uploadMedia, deleteMediaFromCloudinary } from '../utils/cloudinary.js';

// Helper function to extract public_id from Cloudinary URL
function extractPublicIdFromUrl(imageUrl) {
  if (!imageUrl) return null;
  try {
    const url = new URL(imageUrl);
    const pathnameParts = url.pathname.split('/').filter(Boolean);
    // Find the index of 'upload' in the path and get everything after it
    const uploadIndex = pathnameParts.indexOf('upload');
    if (uploadIndex !== -1) {
      // Join everything after upload (skip version like v123456)
      const publicIdParts = pathnameParts.slice(uploadIndex + 2);
      return publicIdParts.join('/');
    }
  } catch (error) {
    console.warn('Failed to extract public_id from image URL:', imageUrl);
  }
  return null;
}

function normalizeDestinations(destinations) {
  if (Array.isArray(destinations)) {
    return destinations.map((item) => String(item).trim()).filter(Boolean);
  }
  return [];
}

function normalizeItinerary(itinerary) {
  if (Array.isArray(itinerary)) return itinerary;
  return [];
}

async function createTour(req, res) {
  try {
    const { title, duration, destinations, itinerary, city, image, featured } = req.body;
    console.log('Admin create tour requested:', { title, city });

    if (!title || !duration || !city) {
      console.warn('Create tour validation failed');
      return res.status(400).json({ message: 'title, duration and city are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(city)) {
      console.warn('Create tour failed: invalid city id', city);
      return res.status(400).json({ message: 'Invalid city id' });
    }

    const cityDoc = await CityTour.findById(city);
    if (!cityDoc) {
      console.warn('Create tour failed: city not found', city);
      return res.status(404).json({ message: 'City not found' });
    }

    const normalizedDestinations = normalizeDestinations(destinations);
    if (normalizedDestinations.length === 0) {
      console.warn('Create tour failed: destinations missing/invalid');
      return res.status(400).json({ message: 'destinations must be a non-empty array' });
    }

    let imageUrl = image || '';
    if (imageUrl && typeof imageUrl === 'string' && !imageUrl.startsWith('http')) {
      const uploadResponse = await uploadMedia(imageUrl, 'SandCTours/Tours');
      if (!uploadResponse?.secure_url) {
        console.error('Create tour failed: image upload failed');
        return res.status(400).json({ message: 'Image upload failed' });
      }
      imageUrl = uploadResponse.secure_url;
    }

    const lastTour = await Tour.findOne({ city }).sort({ order: -1 });
    const nextOrder = lastTour ? lastTour.order + 1 : 0;

    const tour = await Tour.create({
      title: String(title).trim(),
      duration: String(duration).trim(),
      destinations: normalizedDestinations,
      itinerary: normalizeItinerary(itinerary),
      city,
      image: imageUrl,
      featured: Boolean(featured),
      order: nextOrder,
    });

    return res.status(201).json({
      message: 'Tour created successfully',
      tour,
    });
  } catch (error) {
    console.error('Failed to create tour:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getAllToursForAdmin(req, res) {
  try {
    console.log('Admin fetch all tours requested');
    const tours = await Tour.find()
      .populate('city', 'title image')
      .sort({ order: 1, createdAt: -1 });

    return res.status(200).json({ tours });
  } catch (error) {
    console.error('Failed to fetch all tours for admin:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getTourByIdForAdmin(req, res) {
  try {
    const { tourId } = req.params;
    console.log('Admin fetch tour by id requested:', tourId);

    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      console.warn('Invalid tour id in admin fetch:', tourId);
      return res.status(400).json({ message: 'Invalid tour id' });
    }

    const tour = await Tour.findById(tourId).populate('city', 'title image');
    if (!tour) {
      console.warn('Tour not found in admin fetch:', tourId);
      return res.status(404).json({ message: 'Tour not found' });
    }

    return res.status(200).json({ tour });
  } catch (error) {
    console.error('Failed to fetch tour by id for admin:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function updateTour(req, res) {
  try {
    const { tourId } = req.params;
    const { title, duration, destinations, itinerary, city, image, featured } = req.body;
    console.log('Admin update tour requested:', tourId);

    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      console.warn('Invalid tour id in update tour:', tourId);
      return res.status(400).json({ message: 'Invalid tour id' });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      console.warn('Tour not found in update tour:', tourId);
      return res.status(404).json({ message: 'Tour not found' });
    }

    if (city) {
      if (!mongoose.Types.ObjectId.isValid(city)) {
        console.warn('Invalid city id in update tour:', city);
        return res.status(400).json({ message: 'Invalid city id' });
      }
      const cityDoc = await CityTour.findById(city);
      if (!cityDoc) {
        console.warn('Update tour failed: city not found', city);
        return res.status(404).json({ message: 'City not found' });
      }
      tour.city = city;
    }

    if (title) tour.title = String(title).trim();
    if (duration) tour.duration = String(duration).trim();

    if (destinations !== undefined) {
      const normalizedDestinations = normalizeDestinations(destinations);
      if (normalizedDestinations.length === 0) {
        console.warn('Update tour failed: destinations missing/invalid');
        return res.status(400).json({ message: 'destinations must be a non-empty array' });
      }
      tour.destinations = normalizedDestinations;
    }

    if (itinerary !== undefined) {
      tour.itinerary = normalizeItinerary(itinerary);
    }

    if (featured !== undefined) {
      tour.featured = Boolean(featured);
    }

    if (image) {
      if (typeof image === 'string' && image.startsWith('http')) {
        tour.image = image;
      } else {
        // Delete old image from Cloudinary before uploading new one
        const oldPublicId = extractPublicIdFromUrl(tour.image);
        if (oldPublicId) {
          console.log('Deleting old tour image from Cloudinary:', oldPublicId);
          await deleteMediaFromCloudinary(oldPublicId);
        }
        
        const uploadResponse = await uploadMedia(image, 'SandCTours/Tours');
        if (!uploadResponse?.secure_url) {
          console.error('Update tour failed: image upload failed');
          return res.status(400).json({ message: 'Image upload failed' });
        }
        tour.image = uploadResponse.secure_url;
      }
    }

    await tour.save();

    return res.status(200).json({
      message: 'Tour updated successfully',
      tour,
    });
  } catch (error) {
    console.error('Failed to update tour:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function updateTourOrder(req, res) {
  try {
    const { tourId } = req.params;
    const { order } = req.body;
    console.log('Admin update tour order requested:', { tourId, order });

    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      console.warn('Invalid tour id in update tour order:', tourId);
      return res.status(400).json({ message: 'Invalid tour id' });
    }

    if (!Number.isInteger(order)) {
      console.warn('Invalid order in update tour order:', order);
      return res.status(400).json({ message: 'order must be an integer' });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      console.warn('Tour not found in update tour order:', tourId);
      return res.status(404).json({ message: 'Tour not found' });
    }

    tour.order = order;
    await tour.save();

    return res.status(200).json({
      message: 'Tour order updated successfully',
      tour,
    });
  } catch (error) {
    console.error('Failed to update tour order:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function deleteTour(req, res) {
  try {
    const { tourId } = req.params;
    console.log('Admin delete tour requested:', tourId);

    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      console.warn('Invalid tour id in delete tour:', tourId);
      return res.status(400).json({ message: 'Invalid tour id' });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      console.warn('Tour not found in delete tour:', tourId);
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Delete tour image from Cloudinary
    if (tour.image) {
      const publicId = extractPublicIdFromUrl(tour.image);
      if (publicId) {
        console.log('Deleting tour image from Cloudinary:', publicId);
        await deleteMediaFromCloudinary(publicId);
      }
    }

    await tour.deleteOne();

    return res.status(200).json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Failed to delete tour:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getTours(req, res) {
  try {
    console.log('Public tours list requested');
    const tours = await Tour.find()
      .select('title duration destinations image featured order city')
      .populate('city', 'title image')
      .sort({ order: 1, createdAt: -1 });

    return res.status(200).json({ tours });
  } catch (error) {
    console.error('Failed to fetch public tours:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getToursByCity(req, res) {
  try {
    const { cityId } = req.params;
    console.log('Public tours by city requested:', cityId);

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      console.warn('Invalid city id in public tours by city:', cityId);
      return res.status(400).json({ message: 'Invalid city id' });
    }

    const tours = await Tour.find({ city: cityId })
      .select('title duration destinations image featured order')
      .sort({ order: 1, createdAt: -1 });

    return res.status(200).json({ tours });
  } catch (error) {
    console.error('Failed to fetch tours by city:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getPublicTourById(req, res) {
  try {
    const { tourId } = req.params;
    console.log('Public tour detail requested:', tourId);

    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      console.warn('Invalid tour id in public tour detail:', tourId);
      return res.status(400).json({ message: 'Invalid tour id' });
    }

    const tour = await Tour.findById(tourId)
      .select('title duration destinations itinerary city image featured order')
      .populate('city', 'title description image');

    if (!tour) {
      console.warn('Tour not found in public tour detail:', tourId);
      return res.status(404).json({ message: 'Tour not found' });
    }

    return res.status(200).json({ tour });
  } catch (error) {
    console.error('Failed to fetch public tour detail:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

export {
  createTour,
  getAllToursForAdmin,
  getTourByIdForAdmin,
  updateTour,
  updateTourOrder,
  deleteTour,
  getTours,
  getToursByCity,
  getPublicTourById,
};