import { useRef, useState } from 'react';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';

const STAR_OPTIONS = [1, 2, 3, 4, 5];

const ReviewModal = ({ review, onClose, onSave, onError }) => {
  const [formData, setFormData] = useState({
    customerName: review?.customerName || '',
    location: review?.location || '',
    reviewText: review?.reviewText || '',
    rating: review?.rating || 5,
    image: review?.image || null,
    isActive: review?.isActive ?? true,
  });
  const [preview, setPreview] = useState(review?.image || null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.reviewText.trim()) {
      newErrors.reviewText = 'Review text is required';
    }

    const numericRating = Number(formData.rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    if (!preview && !review) {
      newErrors.image = 'Image is required';
    }

    return newErrors;
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    setPreview(URL.createObjectURL(file));

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const removeImage = () => {
    setPreview(null);
    setSelectedImageFile(null);
    setFormData((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        rating: Number(formData.rating),
      };

      if (selectedImageFile) {
        payload.image = await uploadImageToCloudinary(selectedImageFile, 'SandCTours/Reviews');
      }

      await onSave(payload);
    } catch (error) {
      const message = error.message || 'Failed to save review';
      onError(message);
      setErrors((prev) => ({ ...prev, submit: message }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-800">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-700 bg-slate-800 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">{review ? 'Edit Review' : 'Create Review'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {errors.submit && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {errors.submit}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">Customer Name *</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(event) => {
                setFormData((prev) => ({ ...prev, customerName: event.target.value }));
                if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }));
              }}
              placeholder="e.g. Priya Sharma"
              className={`w-full rounded-lg border bg-slate-700/30 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 ${
                errors.customerName ? 'border-red-500/50 focus:border-red-500' : 'border-slate-600/50 focus:border-blue-500'
              }`}
            />
            {errors.customerName && <p className="mt-1 text-sm text-red-400">{errors.customerName}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">Location / Trip</label>
            <input
              type="text"
              value={formData.location}
              onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
              placeholder="e.g. Rajasthan Heritage"
              className="w-full rounded-lg border border-slate-600/50 bg-slate-700/30 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">Rating *</label>
            <div className="flex items-center gap-2">
              {STAR_OPTIONS.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, rating: star }));
                    if (errors.rating) setErrors((prev) => ({ ...prev, rating: '' }));
                  }}
                  className={`text-2xl transition-transform hover:scale-110 ${Number(formData.rating) >= star ? 'text-yellow-400' : 'text-slate-500'}`}
                  aria-label={`Set rating to ${star}`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-slate-300">{formData.rating}/5</span>
            </div>
            {errors.rating && <p className="mt-1 text-sm text-red-400">{errors.rating}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">Review Text *</label>
            <textarea
              value={formData.reviewText}
              onChange={(event) => {
                setFormData((prev) => ({ ...prev, reviewText: event.target.value }));
                if (errors.reviewText) setErrors((prev) => ({ ...prev, reviewText: '' }));
              }}
              rows={5}
              placeholder="Write customer feedback..."
              className={`w-full resize-none rounded-lg border bg-slate-700/30 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 ${
                errors.reviewText ? 'border-red-500/50 focus:border-red-500' : 'border-slate-600/50 focus:border-blue-500'
              }`}
            />
            {errors.reviewText && <p className="mt-1 text-sm text-red-400">{errors.reviewText}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">Customer Image {!review && '*'}</label>
            <div className="space-y-4">
              {preview && (
                <div className="relative">
                  <img src={preview} alt="Review preview" className="h-44 w-full rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-2 top-2 rounded-lg bg-red-500 px-2 py-1 text-white hover:bg-red-600"
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
                className="w-full rounded-lg border-2 border-dashed border-slate-600/50 px-4 py-3 text-slate-400 transition-all hover:border-blue-500 hover:text-blue-400"
              >
                📸 {preview ? 'Change Image' : 'Upload Image'}
              </button>
            </div>
            {errors.image && <p className="mt-1 text-sm text-red-400">{errors.image}</p>}
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-700/20 p-3">
            <input
              id="isActive"
              type="checkbox"
              checked={Boolean(formData.isActive)}
              onChange={(event) => setFormData((prev) => ({ ...prev, isActive: event.target.checked }))}
              className="h-4 w-4 rounded border-slate-600"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-200">
              Show this review on website
            </label>
          </div>

          <div className="flex gap-3 border-t border-slate-700 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-600 px-4 py-3 font-medium text-slate-300 transition-all hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 px-4 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : review ? 'Update Review' : 'Create Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
