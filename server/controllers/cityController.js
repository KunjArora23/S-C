import mongoose from 'mongoose';
import CityTour from '../models/city.model.js';
import Tour from '../models/tour.model.js';
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

async function createCity(req, res) {
  try {
    const { title, description, image } = req.body;
    console.log('Admin create city requested:', { title });

    if (!title || !description || !image) {
      console.warn('Create city validation failed');
      return res.status(400).json({ message: 'title, description and image are required' });
    }

    const existingCity = await CityTour.findOne({ title: title.trim() });
    if (existingCity) {
      console.warn('Create city blocked: title already exists:', title);
      return res.status(409).json({ message: 'City with this title already exists' });
    }

    let imageUrl = image;
    if (typeof image === 'string' && !image.startsWith('http')) {
      const uploadResponse = await uploadMedia(image, 'SandCTours/Cities');
      if (!uploadResponse?.secure_url) {
        console.error('City image upload failed');
        return res.status(400).json({ message: 'Image upload failed' });
      }
      imageUrl = uploadResponse.secure_url;
    }

    const lastCity = await CityTour.findOne().sort({ order: -1 }).lean();
    const nextOrder = Number.isInteger(lastCity?.order) ? lastCity.order + 1 : 0;

    const city = await CityTour.create({
      title: title.trim(),
      description: description.trim(),
      image: imageUrl,
      order: nextOrder,
    });

    return res.status(201).json({
      message: 'City created successfully',
      city,
      toursCount: 0,
    });
  } catch (error) {
    console.error('Failed to create city:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function reorderCities(req, res) {
  try {
    const { cityIds } = req.body;
    console.log('Admin bulk city reorder requested');

    if (!Array.isArray(cityIds) || cityIds.length === 0) {
      return res.status(400).json({ message: 'cityIds must be a non-empty array' });
    }

    const uniqueIds = [...new Set(cityIds)];
    if (uniqueIds.length !== cityIds.length) {
      return res.status(400).json({ message: 'cityIds must not contain duplicates' });
    }

    for (const cityId of cityIds) {
      if (!mongoose.Types.ObjectId.isValid(cityId)) {
        return res.status(400).json({ message: `Invalid city id: ${cityId}` });
      }
    }

    const existingCount = await CityTour.countDocuments({ _id: { $in: cityIds } });
    if (existingCount !== cityIds.length) {
      return res.status(404).json({ message: 'One or more cities were not found' });
    }

    const operations = cityIds.map((cityId, index) => ({
      updateOne: {
        filter: { _id: cityId },
        update: { $set: { order: index } },
      },
    }));

    await CityTour.bulkWrite(operations);

    return res.status(200).json({ message: 'City order updated successfully' });
  } catch (error) {
    console.error('Failed to reorder cities:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getAllCitiesForAdmin(req, res) {
  try {
    console.log('Admin fetch all cities requested');
    const cities = await CityTour.find().sort({ order: 1, createdAt: -1 }).lean();

    const cityIds = cities.map((city) => city._id);
    const groupedCounts = await Tour.aggregate([
      { $match: { city: { $in: cityIds } } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(groupedCounts.map((entry) => [String(entry._id), entry.count]));

    const citiesWithCount = cities.map((city) => ({
      ...city,
      toursCount: countMap.get(String(city._id)) || 0,
    }));

    return res.status(200).json({ cities: citiesWithCount });
  } catch (error) {
    console.error('Failed to fetch all cities for admin:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getCityByIdForAdmin(req, res) {
  try {
    const { cityId } = req.params;
    console.log('Admin fetch city by id requested:', cityId);

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      console.warn('Invalid city id in admin city fetch:', cityId);
      return res.status(400).json({ message: 'Invalid city id' });
    }

    const city = await CityTour.findById(cityId).lean();
    if (!city) {
      console.warn('City not found in admin city fetch:', cityId);
      return res.status(404).json({ message: 'City not found' });
    }

    const tours = await Tour.find({ city: cityId })
      .select('title duration destinations image featured order createdAt updatedAt')
      .sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      city: {
        ...city,
        toursCount: tours.length,
      },
      tours,
    });
  } catch (error) {
    console.error('Failed to fetch city by id for admin:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function updateCity(req, res) {
  try {
    const { cityId } = req.params;
    const { title, description, image } = req.body;
    console.log('Admin update city requested:', cityId);

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      console.warn('Invalid city id in update city:', cityId);
      return res.status(400).json({ message: 'Invalid city id' });
    }

    const city = await CityTour.findById(cityId);
    if (!city) {
      console.warn('City not found in update city:', cityId);
      return res.status(404).json({ message: 'City not found' });
    }

    if (title) {
      const duplicate = await CityTour.findOne({ title: title.trim(), _id: { $ne: cityId } });
      if (duplicate) {
        console.warn('Update city blocked: duplicate title:', title);
        return res.status(409).json({ message: 'Another city with this title already exists' });
      }
      city.title = title.trim();
    }

    if (description) city.description = description.trim();

    if (image) {
      if (typeof image === 'string' && image.startsWith('http')) {
        city.image = image;
      } else {
        // Delete old image from Cloudinary before uploading new one
        const oldPublicId = extractPublicIdFromUrl(city.image);
        if (oldPublicId) {
          console.log('Deleting old city image from Cloudinary:', oldPublicId);
          await deleteMediaFromCloudinary(oldPublicId);
        }
        
        const uploadResponse = await uploadMedia(image, 'SandCTours/Cities');
        if (!uploadResponse?.secure_url) {
          console.error('City image upload failed in update city');
          return res.status(400).json({ message: 'Image upload failed' });
        }
        city.image = uploadResponse.secure_url;
      }
    }

    await city.save();
    const toursCount = await Tour.countDocuments({ city: city._id });

    return res.status(200).json({
      message: 'City updated successfully',
      city,
      toursCount,
    });
  } catch (error) {
    console.error('Failed to update city:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function updateCityOrder(req, res) {
  try {
    const { cityId } = req.params;
    const { order } = req.body;
    console.log('Admin update city order requested:', { cityId, order });

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      console.warn('Invalid city id in update city order:', cityId);
      return res.status(400).json({ message: 'Invalid city id' });
    }

    if (!Number.isInteger(order)) {
      console.warn('Invalid order in update city order:', order);
      return res.status(400).json({ message: 'order must be an integer' });
    }

    const city = await CityTour.findById(cityId);
    if (!city) {
      console.warn('City not found in update city order:', cityId);
      return res.status(404).json({ message: 'City not found' });
    }

    city.order = order;
    await city.save();

    return res.status(200).json({
      message: 'City order updated successfully',
      city,
    });
  } catch (error) {
    console.error('Failed to update city order:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function deleteCity(req, res) {
  try {
    const { cityId } = req.params;
    console.log('Admin delete city requested:', cityId);

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      console.warn('Invalid city id in delete city:', cityId);
      return res.status(400).json({ message: 'Invalid city id' });
    }

    const city = await CityTour.findById(cityId);
    if (!city) {
      console.warn('City not found in delete city:', cityId);
      return res.status(404).json({ message: 'City not found' });
    }

    // Delete city image from Cloudinary
    if (city.image) {
      const publicId = extractPublicIdFromUrl(city.image);
      if (publicId) {
        console.log('Deleting city image from Cloudinary:', publicId);
        await deleteMediaFromCloudinary(publicId);
      }
    }

    // Delete all related tours and their images
    const tours = await Tour.find({ city: cityId });
    for (const tour of tours) {
      if (tour.image) {
        const publicId = extractPublicIdFromUrl(tour.image);
        if (publicId) {
          console.log('Deleting tour image from Cloudinary:', publicId);
          await deleteMediaFromCloudinary(publicId);
        }
      }
    }

    await Tour.deleteMany({ city: cityId });
    await city.deleteOne();

    return res.status(200).json({ message: 'City and related tours deleted successfully' });
  } catch (error) {
    console.error('Failed to delete city:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getCityPageData(req, res) {
  try {
    const { cityId } = req.params;
    console.log('City page data requested:', cityId);

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      console.warn('City page request with invalid city id:', cityId);
      return res.status(400).json({ message: 'Invalid city id' });
    }

    const city = await CityTour.findById(cityId).select('title description image order');
    if (!city) {
      console.warn('City not found:', cityId);
      return res.status(404).json({ message: 'City not found' });
    }

    const tours = await Tour.find({ city: cityId })
      .select('title duration destinations image featured order')
      .sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      city,
      tours,
    });
  } catch (error) {
    console.error('Failed to get city page data:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getPublicCities(req, res) {
  try {
    console.log('Public cities list requested');

    const cities = await CityTour.find()
      .select('title description image order')
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const cityIds = cities.map((city) => city._id);

    const groupedCounts = await Tour.aggregate([
      { $match: { city: { $in: cityIds } } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(groupedCounts.map((entry) => [String(entry._id), entry.count]));

    const citiesWithCount = cities.map((city) => ({
      ...city,
      toursCount: countMap.get(String(city._id)) || 0,
    }));

    return res.status(200).json({ cities: citiesWithCount });
  } catch (error) {
    console.error('Failed to fetch public cities:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

export {
  createCity,
  reorderCities,
  getAllCitiesForAdmin,
  getCityByIdForAdmin,
  updateCity,
  updateCityOrder,
  deleteCity,
  getPublicCities,
  getCityPageData,
};
