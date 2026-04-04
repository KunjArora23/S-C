import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    destinations: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'At least one destination is required',
      },
    },
    itinerary: {
      type: [itinerarySchema],
      default: [],
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CityTour',
      required: true,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

tourSchema.index({ city: 1, order: 1 });

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
