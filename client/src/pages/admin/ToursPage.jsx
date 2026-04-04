/* eslint-disable no-useless-catch */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiCall } from '../../config/api';
import AdminLayout from '../../layouts/AdminLayout';
import TourModal from '../../components/TourModal';

export const ToursPage = () => {
    const [tours, setTours] = useState([]);
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    // console.log(tours)

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [toursRes, citiesRes] = await Promise.all([
                apiCall.get('/tours/admin'),
                apiCall.get('/cities/admin'),
            ]);
            setTours(toursRes.tours || []);
            setCities(citiesRes.cities || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (tour = null) => {
        setEditingTour(tour);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTour(null);
    };

    const handleSave = async (formData) => {
        try {
            if (editingTour) {
                await apiCall.put(`/tours/admin/${editingTour._id}`, formData);
            } else {
                await apiCall.post('/tours/admin', formData);
            }
            await fetchData();
            handleCloseModal();
        } catch (err) {
            throw err;
        }
    };

    const handleDelete = async (tourId) => {
        if (!window.confirm('Are you sure you want to delete this tour?')) {
            return;
        }
        try {
            await apiCall.delete(`/tours/admin/${tourId}`);
            await fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const getCityName = (cityId) => {
        
        return cities.find((c) => c._id === cityId._id)?.title || 'Unknown';
    };

    const selectedCityId = searchParams.get('city') || '';
    const selectedCityName = selectedCityId ? getCityName(selectedCityId) : '';
    const filteredTours = selectedCityId
        ? tours.filter((tour) => {
            const cityValue = typeof tour.city === 'string' ? tour.city : tour.city?._id;
            return cityValue === selectedCityId;
        })
        : tours;

    const clearCityFilter = () => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('city');
        setSearchParams(nextParams);
    };

    console.log("Cities",cities)

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Tours</h2>
                        <p className="text-slate-400 mt-1">Manage your tour packages</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="w-full sm:w-auto px-6 py-3 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                    >
                        + Create Tour
                    </button>
                </div>

                {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {selectedCityId && (
                    <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-sm text-blue-200">
                            Showing tours for city: <span className="font-semibold text-blue-100">{selectedCityName}</span>
                        </p>
                        <button
                            onClick={clearCityFilter}
                            className="px-3 py-2 rounded-lg bg-slate-800/60 text-slate-200 hover:bg-slate-700 transition-colors text-sm"
                        >
                            Clear Filter
                        </button>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-slate-400">Loading tours...</p>
                        </div>
                    </div>
                ) : filteredTours.length === 0 ? (
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-12 text-center">
                        <p className="text-slate-400 text-lg mb-4">
                            {selectedCityId ? 'No tours found for this city' : 'No tours yet'}
                        </p>
                        {selectedCityId ? (
                            <button
                                onClick={clearCityFilter}
                                className="text-blue-500 hover:text-blue-400 font-medium"
                            >
                                View all tours →
                            </button>
                        ) : (
                            <button
                                onClick={() => handleOpenModal()}
                                className="text-blue-500 hover:text-blue-400 font-medium"
                            >
                                Create your first tour →
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="md:hidden space-y-3">
                            {filteredTours.map((tour) => (
                                <div key={tour._id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        {tour.image && (
                                            <img
                                                src={tour.image}
                                                alt={tour.title}
                                                className="w-14 h-14 rounded-lg object-cover shrink-0"
                                            />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-white truncate">{tour.title}</p>
                                            <p className="text-slate-400 text-sm mt-1">{tour.duration}</p>
                                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                                <span className="px-2 py-1 rounded-full bg-slate-700/60 text-slate-300">
                                                    {getCityName(tour.city)}
                                                </span>
                                                <span className="px-2 py-1 rounded-full bg-slate-700/60 text-slate-300">Order: {tour.order}</span>
                                                {tour.featured && (
                                                    <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300">Featured</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(tour)}
                                            className="flex-1 p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                                            title="Edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tour._id)}
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
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Tour</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">City</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Duration</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Featured</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Order</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTours.map((tour) => (
                                        <tr key={tour._id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {tour.image && (
                                                        <img
                                                            src={tour.image}
                                                            alt={tour.title}
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                    )}
                                                    <span className="font-medium text-white">{tour.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-300">{getCityName(tour.city)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">{tour.duration}</td>
                                            <td className="px-6 py-4 text-center">
                                                {tour.featured ? (
                                                    <span className="text-xl">⭐</span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-300">{tour.order}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(tour)}
                                                        className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(tour._id)}
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
                    <TourModal
                        tour={editingTour}
                        cities={cities}
                        onClose={handleCloseModal}
                        onSave={handleSave}
                        onError={(err) => setError(err)}
                    />
                )}
            </div>
        </AdminLayout>
    );
};


