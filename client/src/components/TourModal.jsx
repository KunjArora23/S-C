import { useState, useRef } from 'react';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';

const TourModal = ({ tour, cities, onClose, onSave, onError }) => {
  const [formData, setFormData] = useState({
    title: tour?.title || '',
    duration: tour?.duration || '',
    city: tour?.city?._id || tour?.city || '',
    destinations: tour?.destinations || [],
    itinerary: tour?.itinerary || [],
    image: tour?.image || null,
    featured: tour?.featured || false,
  });
  const [preview, setPreview] = useState(tour?.image || null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [destinationInput, setDestinationInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    if (!formData.destinations || formData.destinations.length === 0) {
      newErrors.destinations = 'At least one destination is required';
    }
    if (!preview && !tour) {
      newErrors.image = 'Image is required';
    }
    return newErrors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      setPreview(URL.createObjectURL(file));
      if (errors.image) setErrors({ ...errors, image: '' });
    }
  };

  const addDestination = () => {
    if (destinationInput.trim()) {
      setFormData({
        ...formData,
        destinations: [...formData.destinations, destinationInput.trim()],
      });
      setDestinationInput('');
      if (errors.destinations) setErrors({ ...errors, destinations: '' });
    }
  };

  const removeDestination = (index) => {
    setFormData({
      ...formData,
      destinations: formData.destinations.filter((_, i) => i !== index),
    });
  };

  const addItinerary = () => {
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { day: '', title: '', description: '' }],
    });
  };

  const updateItinerary = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index][field] = value;
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const removeItinerary = (index) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const payload = { ...formData };

      if (selectedImageFile) {
        payload.image = await uploadImageToCloudinary(selectedImageFile, 'SandCTours/Tours');
      }

      await onSave(payload);
    } catch (err) {
      onError(err.message);
      setErrors({ submit: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {tour ? 'Edit Tour' : 'Create Tour'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Tour Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              placeholder="Enter tour name"
              className={`w-full px-4 py-3 rounded-lg bg-slate-700/30 border outline-none text-white placeholder-slate-500 transition-all
                ${
                  errors.title
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-slate-600/50 focus:border-blue-500'
                }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Duration and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Duration *
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => {
                  setFormData({ ...formData, duration: e.target.value });
                  if (errors.duration) setErrors({ ...errors, duration: '' });
                }}
                placeholder="e.g., 5 Days"
                className={`w-full px-4 py-3 rounded-lg bg-slate-700/30 border outline-none text-white placeholder-slate-500 transition-all
                  ${
                    errors.duration
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-slate-600/50 focus:border-blue-500'
                  }`}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-400">{errors.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                City *
              </label>
              <select
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: '' });
                }}
                className={`w-full px-4 py-3 rounded-lg bg-slate-700/30 border outline-none text-white transition-all
                  ${
                    errors.city
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-slate-600/50 focus:border-blue-500'
                  }`}
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.title}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="mt-1 text-sm text-red-400">{errors.city}</p>
              )}
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600/50"
            />
            <label htmlFor="featured" className="text-white font-medium">
              Mark as Featured
            </label>
          </div>

          {/* Destinations */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Destinations * ({formData.destinations.length})
            </label>
            <div className="space-y-2">
              {formData.destinations.map((dest, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 px-3 py-2 rounded-lg bg-slate-700/30 text-white">
                    {dest}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDestination(index)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDestination())}
                  placeholder="Add destination and press Enter"
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-700/30 border border-slate-600/50 outline-none text-white placeholder-slate-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addDestination}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Add
                </button>
              </div>
            </div>
            {errors.destinations && (
              <p className="mt-1 text-sm text-red-400">{errors.destinations}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Tour Image {!tour && '*'}
            </label>
            <div className="space-y-4">
              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setSelectedImageFile(null);
                      setFormData({ ...formData, image: null });
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  >
                    ✕
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-slate-600/50 hover:border-blue-500 text-slate-400 hover:text-blue-400 transition-all"
              >
                📸 {preview ? 'Change Image' : 'Upload Image'}
              </button>
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-400">{errors.image}</p>
            )}
          </div>

          {/* Itinerary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-white">
                Itinerary (Optional)
              </label>
              <button
                type="button"
                onClick={addItinerary}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                + Add Day
              </button>
            </div>
            <div className="space-y-3">
              {formData.itinerary.map((day, index) => (
                <div key={index} className="p-3 rounded-lg bg-slate-700/20 border border-slate-700/50 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={day.day}
                      onChange={(e) => updateItinerary(index, 'day', e.target.value)}
                      placeholder="Day title"
                      className="flex-1 px-3 py-2 rounded bg-slate-700/30 border border-slate-600/30 outline-none text-white placeholder-slate-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeItinerary(index)}
                      className="px-3 py-2 rounded hover:bg-red-500/20 text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) => updateItinerary(index, 'title', e.target.value)}
                    placeholder="Activity title"
                    className="w-full px-3 py-2 rounded bg-slate-700/30 border border-slate-600/30 outline-none text-white placeholder-slate-500 focus:border-blue-500"
                  />
                  <textarea
                    value={day.description}
                    onChange={(e) => updateItinerary(index, 'description', e.target.value)}
                    placeholder="Activity description"
                    rows={2}
                    className="w-full px-3 py-2 rounded bg-slate-700/30 border border-slate-600/30 outline-none text-white placeholder-slate-500 focus:border-blue-500 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : tour ? (
                'Update Tour'
              ) : (
                'Create Tour'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourModal;
