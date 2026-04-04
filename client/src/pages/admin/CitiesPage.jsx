import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../config/api';
import AdminLayout from '../../layouts/AdminLayout';
import CityModal from '../../components/CityModal';

export const CitiesPage = () => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [draggingCityId, setDraggingCityId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCall.get('/cities/admin');
      setCities(response.cities || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (city = null) => {
    setEditingCity(city);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCity(null);
  };

  const handleSave = async (formData) => {
    if (editingCity) {
      await apiCall.put(`/cities/admin/${editingCity._id}`, formData);
    } else {
      await apiCall.post('/cities/admin', formData);
    }
    await fetchCities();
    handleCloseModal();
  };

  const handleDelete = async (cityId) => {
    if (!window.confirm('Are you sure you want to delete this city? All related tours will be deleted too.')) {
      return;
    }
    try {
      await apiCall.delete(`/cities/admin/${cityId}`);
      await fetchCities();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewTours = (cityId) => {
    navigate(`/admin/tours?city=${cityId}`);
  };

  const reorderList = (list, fromCityId, toCityId) => {
    const fromIndex = list.findIndex((city) => city._id === fromCityId);
    const toIndex = list.findIndex((city) => city._id === toCityId);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      return list;
    }

    const updated = [...list];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    return updated.map((city, index) => ({
      ...city,
      order: index,
    }));
  };

  const persistCityOrder = async (orderedCities, previousCities) => {
    try {
      setIsSavingOrder(true);
      await apiCall.patch('/cities/admin/reorder', {
        cityIds: orderedCities.map((city) => city._id),
      });
    } catch (err) {
      setCities(previousCities);
      setError(err.message || 'Failed to update city order');
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDropOnCity = async (targetCityId) => {
    if (!draggingCityId || draggingCityId === targetCityId || isSavingOrder) {
      setDraggingCityId(null);
      return;
    }

    const previousCities = [...cities];
    const reorderedCities = reorderList(cities, draggingCityId, targetCityId);
    setCities(reorderedCities);
    setError(null);
    setDraggingCityId(null);
    await persistCityOrder(reorderedCities, previousCities);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Cities</h2>
            <p className="text-slate-400 mt-1">Manage your tour destinations</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
          >
            + Create City
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {cities.length > 1 && (
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-blue-200 text-sm">
            Drag and drop cities to change how they appear on the user tours page.
            {isSavingOrder && <span className="ml-2 text-blue-100">Saving order...</span>}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading cities...</p>
            </div>
          </div>
        ) : cities.length === 0 ? (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-12 text-center">
            <p className="text-slate-400 text-lg mb-4">No cities yet</p>
            <button
              onClick={() => handleOpenModal()}
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              Create your first city →
            </button>
          </div>
        ) : (
          <>
            <div className="md:hidden space-y-3">
              {cities.map((city) => (
                <div
                  key={city._id}
                  draggable={!isSavingOrder}
                  onDragStart={() => setDraggingCityId(city._id)}
                  onDragEnd={() => setDraggingCityId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDropOnCity(city._id)}
                  className={`bg-slate-800/30 border rounded-xl p-4 transition-colors ${
                    draggingCityId === city._id
                      ? 'border-blue-500/60 opacity-70'
                      : 'border-slate-700/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {city.image && (
                      <img
                        src={city.image}
                        alt={city.title}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white truncate">{city.title}</p>
                      <p className="text-slate-400 text-sm mt-1 line-clamp-2">{city.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300">
                          {city.toursCount || 0} tours
                        </span>
                        <span className="px-2 py-1 rounded-full bg-slate-700/60 text-slate-300">Order: {city.order}</span>
                        <span className="px-2 py-1 rounded-full bg-slate-700/60 text-slate-300">Drag</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleViewTours(city._id)}
                      className="flex-1 p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 transition-colors"
                      title="View Tours"
                    >
                      View Tours
                    </button>
                    <button
                      onClick={() => handleOpenModal(city)}
                      className="flex-1 p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(city._id)}
                      className="flex-1 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-800/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">City</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Description</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Tours</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Order</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city) => (
                    <tr
                      key={city._id}
                      draggable={!isSavingOrder}
                      onDragStart={() => setDraggingCityId(city._id)}
                      onDragEnd={() => setDraggingCityId(null)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => handleDropOnCity(city._id)}
                      className={`border-b border-slate-700/30 transition-colors ${
                        draggingCityId === city._id
                          ? 'bg-blue-500/10'
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {city.image && (
                            <img
                              src={city.image}
                              alt={city.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <span className="text-slate-500 text-lg leading-none" title="Drag to reorder">::</span>
                          <span className="font-medium text-white">{city.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {city.description?.substring(0, 50)}...
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium">
                          {city.toursCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-300">{city.order}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewTours(city._id)}
                            className="px-3 py-2 rounded-lg hover:bg-indigo-500/20 text-indigo-300 transition-colors text-xs font-semibold"
                            title="View city tours"
                          >
                            View Tours
                          </button>
                          <button
                            onClick={() => handleOpenModal(city)}
                            className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(city._id)}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
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

        {/* Modal */}
        {showModal && (
          <CityModal
            city={editingCity}
            onClose={handleCloseModal}
            onSave={handleSave}
            onError={(err) => setError(err)}
          />
        )}
      </div>
    </AdminLayout>
  );
};
