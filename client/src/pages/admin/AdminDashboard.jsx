import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../config/api';
import AdminLayout from '../../layouts/AdminLayout';

export const AdminDashboard = () => {
  const [cities, setCities] = useState([]);
  const [tours, setTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [citiesRes, toursRes, reviewsRes] = await Promise.all([
        apiCall.get('/cities/admin'),
        apiCall.get('/tours/admin'),
        apiCall.get('/reviews/admin'),
      ]);
      setCities(citiesRes.cities || []);
      setTours(toursRes.tours || []);
      setReviews(reviewsRes.reviews || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <div
      onClick={onClick}
      className={`p-4 sm:p-6 rounded-xl border transition-all cursor-pointer hover:shadow-lg ${
        color === 'blue'
          ? 'bg-slate-800/30 border-blue-500/20 hover:border-blue-500/50'
          : color === 'purple'
          ? 'bg-slate-800/30 border-purple-500/20 hover:border-purple-500/50'
          : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl sm:text-4xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="text-2xl sm:text-3xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-slate-400">Overview of your tours and cities</p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              <StatCard
                title="Total Cities"
                value={cities.length}
                icon="🏙️"
                color="blue"
                onClick={() => navigate('/admin/cities')}
              />
              <StatCard
                title="Total Tours"
                value={tours.length}
                icon="✈️"
                color="purple"
                onClick={() => navigate('/admin/tours')}
              />
              <StatCard
                title="Active Tours"
                value={tours.filter((t) => t.featured).length}
                icon="⭐"
                color="yellow"
              />
              <StatCard
                title="Customer Reviews"
                value={reviews.length}
                icon="💬"
                color="green"
                onClick={() => navigate('/admin/reviews')}
              />
            </div>

            {/* Recent sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Recent Cities */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
                  <h3 className="text-xl font-bold text-white">Recent Cities</h3>
                  <button
                    onClick={() => navigate('/admin/cities')}
                    className="text-blue-500 hover:text-blue-400 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>

                {cities.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No cities yet</p>
                ) : (
                  <div className="space-y-3">
                    {cities.slice(0, 5).map((city) => (
                      <div key={city._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/20 hover:bg-slate-700/40 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          {city.image && (
                            <img
                              src={city.image}
                              alt={city.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-white">{city.title}</p>
                            <p className="text-xs text-slate-400">{city.toursCount || 0} tours</p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/admin/cities?edit=${city._id}`)}
                          className="text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          ✏️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Tours */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
                  <h3 className="text-xl font-bold text-white">Recent Tours</h3>
                  <button
                    onClick={() => navigate('/admin/tours')}
                    className="text-blue-500 hover:text-blue-400 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>

                {tours.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No tours yet</p>
                ) : (
                  <div className="space-y-3">
                    {tours.slice(0, 5).map((tour) => (
                      <div key={tour._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/20 hover:bg-slate-700/40 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          {tour.image && (
                            <img
                              src={tour.image}
                              alt={tour.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-white">{tour.title}</p>
                            <p className="text-xs text-slate-400">{tour.duration}</p>
                          </div>
                        </div>
                        {tour.featured && <span className="text-xs sm:text-sm text-yellow-400">⭐ Featured</span>}
                        <button
                          onClick={() => navigate(`/admin/tours?edit=${tour._id}`)}
                          className="text-slate-400 hover:text-blue-400 transition-colors ml-3"
                        >
                          ✏️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate('/admin/cities')}
                  className="p-4 rounded-lg bg-linear-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 hover:border-blue-500/60 transition-all hover:shadow-lg hover:shadow-blue-500/10 text-left group"
                >
                  <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                    Manage Cities
                  </p>
                  <p className="text-slate-400 text-sm mt-1">Create, edit, and organize cities</p>
                </button>
                <button
                  onClick={() => navigate('/admin/tours')}
                  className="p-4 rounded-lg bg-linear-to-br from-purple-600/20 to-purple-700/20 border border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/10 text-left group"
                >
                  <p className="text-white font-semibold group-hover:text-purple-400 transition-colors">
                    Manage Tours
                  </p>
                  <p className="text-slate-400 text-sm mt-1">Create, edit, and organize tours</p>
                </button>
                <button
                  onClick={() => navigate('/admin/reviews')}
                  className="p-4 rounded-lg bg-linear-to-br from-emerald-600/20 to-emerald-700/20 border border-emerald-500/30 hover:border-emerald-500/60 transition-all hover:shadow-lg hover:shadow-emerald-500/10 text-left group"
                >
                  <p className="text-white font-semibold group-hover:text-emerald-400 transition-colors">
                    Manage Reviews
                  </p>
                  <p className="text-slate-400 text-sm mt-1">Add customer testimonials with image and rating</p>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};
