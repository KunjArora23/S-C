import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CitiesPage } from './pages/admin/CitiesPage';
import { ToursPage } from './pages/admin/ToursPage';
import { ReviewsPage } from './pages/admin/ReviewsPage';
import { HomePage } from './pages/user/HomePage';
import { PublicToursPage } from './pages/user/PublicToursPage';
import { CityToursPage } from './pages/user/CityToursPage';
import { TourDetailsPage } from './pages/user/TourDetailsPage';
import { AboutPage } from './pages/user/AboutPage';
import { ContactPage } from './pages/user/ContactPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tours" element={<PublicToursPage />} />
          <Route path="/tours/:cityId" element={<CityToursPage />} />
          <Route path="/tours/:cityId/:tourId" element={<TourDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cities"
            element={
              <ProtectedRoute>
                <CitiesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tours"
            element={
              <ProtectedRoute>
                <ToursPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute>
                <ReviewsPage />
              </ProtectedRoute>
            }
          />

          {/* Default route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
