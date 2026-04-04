import { useEffect, useState } from 'react';
import { apiCall } from '../../config/api';
import AdminLayout from '../../layouts/AdminLayout';
import ReviewModal from '../../components/ReviewModal';

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCall.get('/reviews/admin');
      setReviews(response.reviews || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (review = null) => {
    setEditingReview(review);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReview(null);
  };

  const handleSave = async (formData) => {
    if (editingReview) {
      await apiCall.put(`/reviews/admin/${editingReview._id}`, formData);
    } else {
      await apiCall.post('/reviews/admin', formData);
    }
    await fetchReviews();
    handleCloseModal();
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await apiCall.delete(`/reviews/admin/${reviewId}`);
      await fetchReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderStars = (rating) => {
    const normalized = Number(rating) || 0;
    return (
      <span className="text-yellow-400">
        {'★'.repeat(normalized)}
        <span className="text-slate-600">{'★'.repeat(Math.max(0, 5 - normalized))}</span>
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Reviews</h2>
            <p className="mt-1 text-slate-400">Manage customer testimonials shown on the website</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/50 sm:w-auto"
          >
            + Add Review
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="text-slate-400">Loading reviews...</p>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-12 text-center">
            <p className="mb-4 text-lg text-slate-400">No reviews yet</p>
            <button onClick={() => handleOpenModal()} className="font-medium text-blue-500 hover:text-blue-400">
              Add your first review →
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 md:hidden">
              {reviews.map((review) => (
                <div key={review._id} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                  <div className="flex items-start gap-3">
                    {review.image ? (
                      <img src={review.image} alt={review.customerName} className="h-14 w-14 shrink-0 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-700 text-slate-300">
                        {review.customerName?.charAt(0)?.toUpperCase() || 'R'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">{review.customerName}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{review.location || 'No location'}</p>
                      <p className="mt-1 text-sm">{renderStars(review.rating)}</p>
                      <p className="mt-2 line-clamp-3 text-sm text-slate-300">{review.reviewText}</p>
                      <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${review.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-600/40 text-slate-300'}`}>
                        {review.isActive ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(review)}
                      className="flex-1 rounded-lg bg-blue-500/10 p-2 text-blue-400 transition-colors hover:bg-blue-500/20"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="flex-1 rounded-lg bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/30 md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-800/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Review</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Rating</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review._id} className="border-b border-slate-700/30 transition-colors hover:bg-slate-800/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {review.image ? (
                              <img src={review.image} alt={review.customerName} className="h-12 w-12 rounded-full object-cover" />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-slate-300">
                                {review.customerName?.charAt(0)?.toUpperCase() || 'R'}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-white">{review.customerName}</p>
                              <p className="text-xs text-slate-400">{review.location || 'No location'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {review.reviewText?.length > 120 ? `${review.reviewText.slice(0, 120)}...` : review.reviewText}
                        </td>
                        <td className="px-6 py-4 text-center">{renderStars(review.rating)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${review.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-600/40 text-slate-300'}`}>
                            {review.isActive ? 'Visible' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(review)}
                              className="rounded-lg p-2 text-blue-400 transition-colors hover:bg-blue-500/20"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(review._id)}
                              className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/20"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {showModal && (
          <ReviewModal
            review={editingReview}
            onClose={handleCloseModal}
            onSave={handleSave}
            onError={(message) => setError(message)}
          />
        )}
      </div>
    </AdminLayout>
  );
};
