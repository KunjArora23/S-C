# S&C Tours Admin Panel - Setup & Usage Guide

## 📋 Overview

A professional, modern admin panel for S&C Tours built with React, Tailwind CSS, and React Router. Manage cities, tours, and admin operations with a sleek dark theme UI.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Backend server running on `http://localhost:8000`
- MongoDB connection configured on backend

### Installation

```bash
cd client
npm install
npm run dev
```

The admin panel will be available at `http://localhost:5173`

## 📁 Project Structure

```
client/src/
├── config/
│   └── api.js                 # API utility functions
├── context/
│   └── AuthContext.jsx        # Authentication state management
├── layouts/
│   └── AdminLayout.jsx        # Main admin layout with sidebar
├── pages/
│   ├── AdminLogin.jsx         # Login page
│   ├── AdminDashboard.jsx     # Dashboard overview
│   ├── CitiesPage.jsx         # Cities management
│   └── ToursPage.jsx          # Tours management
├── components/
│   ├── ProtectedRoute.jsx     # Route protection wrapper
│   ├── CityModal.jsx          # City create/edit modal
│   └── TourModal.jsx          # Tour create/edit modal
└── App.jsx                    # Main app routing
```

## 🔐 Authentication Flow

### Login
1. User enters email and password on `/admin/login`
2. Backend validates and returns `accessToken` + `refreshToken`
3. Tokens stored in localStorage
4. User redirected to dashboard

### Protected Routes
- All admin routes require valid JWT token
- `ProtectedRoute` component checks authentication
- Unauthenticated users redirected to login

### Logout
- Clears tokens from localStorage
- Clears admin state
- Redirects to login page

## 📊 Pages & Features

### 1. Admin Login (`/admin/login`)
- Professional dark-themed login form
- Email validation
- Password strength validation
- Error handling with user feedback
- Loading states

### 2. Admin Dashboard (`/admin/dashboard`)
- Statistics cards (Total Cities, Total Tours, Featured Tours)
- Recent cities list with tour counts
- Recent tours list with featured status
- Quick action buttons
- Real-time data from API

### 3. Cities Management (`/admin/cities`)
- Table view of all cities
- Create new city with image upload
- Edit city (title, description, image)
- Delete city (cascade deletes tours)
- Tour count per city
- Response to image deletion from Cloudinary

**Create/Edit City Modal:**
- City title (required)
- Description (required)
- Image upload (required for new cities)
- Image preview with change option
- Form validation

### 4. Tours Management (`/admin/tours`)
- Table view of all tours
- Create new tour with comprehensive data
- Edit tour details and relationships
- Delete tour
- Featured status toggle
- City association

**Create/Edit Tour Modal:**
- Tour title (required)
- Duration (required)
- City selection (required)
- Destinations list (required, at least one)
- Featured checkbox
- Image upload (required for new tours)
- Itinerary (optional - day-by-day breakdown)
  - Add/remove itinerary days
  - Day title, activity title, activity description

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Background**: Slate (#0F172A, #1E293B)
- **Text**: White, Slate-300, Slate-400
- **Accent**: Purple, Yellow
- **Error**: Red

### Components
- Modern cards with glassmorphism effects
- Smooth transitions and hover states
- Loading spinners (animated SVG)
- Modal dialogs with backdrop blur
- Responsive tables
- Form validation with error messages

## 🔌 API Integration

### Base URL
```javascript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

### Authentication Headers
```javascript
Authorization: Bearer {accessToken}
```

### Endpoints Used

#### Admin
- `POST /admin/register` - Register admin
- `POST /admin/login` - Login admin
- `GET /admin/me` - Get current admin (protected)
- `POST /admin/logout` - Logout admin (protected)
- `POST /admin/refresh-token` - Refresh access token

#### Cities
- `GET /cities/admin` - Get all cities (protected)
- `POST /cities/admin` - Create city (protected)
- `GET /cities/admin/:cityId` - Get city with tours (protected)
- `PUT /cities/admin/:cityId` - Update city (protected)
- `PATCH /cities/admin/:cityId/order` - Update order (protected)
- `DELETE /cities/admin/:cityId` - Delete city (protected)

#### Tours
- `GET /tours/admin` - Get all tours (protected)
- `POST /tours/admin` - Create tour (protected)
- `GET /tours/admin/:tourId` - Get tour details (protected)
- `PUT /tours/admin/:tourId` - Update tour (protected)
- `PATCH /tours/admin/:tourId/order` - Update order (protected)
- `DELETE /tours/admin/:tourId` - Delete tour (protected)

## 🛠️ Key Features Implemented

### ✅ Authentication
- Email/password validation
- JWT token management
- Refresh token support
- Protected routes
- Auto-logout on auth failure

### ✅ City Management
- Full CRUD operations
- Image upload to Cloudinary
- Auto-delete old images
- Tour count tracking
- Order management

### ✅ Tour Management
- Full CRUD operations
- City association
- Multiple destinations support
- Itinerary day-by-day planning
- Featured tour toggle
- Image upload to Cloudinary
- Auto-delete old images

### ✅ User Experience
- Real-time form validation
- Error messages
- Loading states
- Success feedback
- Confirmation dialogs for deletes
- Responsive design
- Professional styling

## 🚨 Error Handling

All API calls include:
- Try/catch blocks
- User-friendly error messages
- Console logging for debugging
- State error management
- Loading state management

## 📝 Development Notes

### State Management
- Auth context for global auth state
- Local state for pages (cities, tours)
- Individual component state for forms

### File Uploads
- Base64 encoding for image data
- Cloudinary integration on backend
- Preview before upload
- Change/remove image functionality

### Validation
- Client-side form validation
- Required field checks
- Email format validation
- Minimum password length

### Navigation
- React Router v7 for routing
- Programmatic navigation with `useNavigate`
- URL-based navigation
- Protected route wrappers

## 🔄 Environment Setup

Create `.env` file in backend if not exists:
```env
PORT=8000
MONGO_URI=mongodb://...
JWT_ACCESS_SECRET=your-secret
JWT_REFRESH_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## 📚 Dependencies

### Frontend
- react (19.2.4)
- react-dom (19.2.4)
- react-router-dom (7.13.1)
- tailwindcss (4.2.1)
- vite (7.3.1)

## 🎯 Future Enhancements

- [ ] Tour ordering UI
- [ ] City ordering UI
- [ ] Batch operations
- [ ] Advanced filters/search
- [ ] User activity logs
- [ ] Image optimization
- [ ] PWA support
- [ ] Dark/Light mode toggle

## 🐛 Troubleshooting

### Login Not Working
- Verify backend is running on `localhost:8000`
- Check browser console for CORS errors
- Verify admin credentials in database

### Images Not Uploading
- Verify Cloudinary env vars in backend
- Check file size limits
- Verify image format (jpg, png, etc.)

### Styling Issues
- Clear browser cache
- Rebuild Tailwind: `npm run build`
- Verify Tailwind config

## 📞 Support

For issues or questions, check:
1. Browser console for errors
2. Network tab for API responses
3. Backend logs for server errors

---

**Last Updated**: March 2026
**Version**: 1.0.0
