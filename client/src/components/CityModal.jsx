import { useState, useRef } from 'react';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';

const CityModal = ({ city, onClose, onSave, onError }) => {
  const [formData, setFormData] = useState({
    title: city?.title || '',
    description: city?.description || '',
    image: city?.image || null,
  });
  const [preview, setPreview] = useState(city?.image || null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!preview && !city) {
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
        payload.image = await uploadImageToCloudinary(selectedImageFile, 'SandCTours/Cities');
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
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {city ? 'Edit City' : 'Create City'}
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
              City Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              placeholder="Enter city name"
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

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              placeholder="Enter city description"
              rows={4}
              className={`w-full px-4 py-3 rounded-lg bg-slate-700/30 border outline-none text-white placeholder-slate-500 transition-all resize-none
                ${
                  errors.description
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-slate-600/50 focus:border-blue-500'
                }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              City Image {!city && '*'}
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
              ) : city ? (
                'Update City'
              ) : (
                'Create City'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CityModal;
