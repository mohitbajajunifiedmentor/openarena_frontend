import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Faq from './pages/Faq.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import SportsEvents from './pages/SportsEvents.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import GroundDetail from './pages/grounds/GroundDetail.jsx';
import MyBookings from './pages/bookings/MyBookings.jsx';
import BookingDetail from './pages/bookings/BookingDetail.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';
import UserProfile from './pages/user/UserProfile.jsx';
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx';
import OwnerGrounds from './pages/owner/OwnerGrounds.jsx';
import OwnerGroundForm from './pages/owner/OwnerGroundForm.jsx';
import OwnerBookings from './pages/owner/OwnerBookings.jsx';
import OwnerGroundSchedule from './pages/owner/OwnerGroundSchedule.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminOwners from './pages/admin/AdminOwners.jsx';
import AdminGrounds from './pages/admin/AdminGrounds.jsx';
import AdminBookings from './pages/admin/AdminBookings.jsx';
import AdminCatalog from './pages/admin/AdminCatalog.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<Faq />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="sports-events" element={<SportsEvents />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="grounds" element={<Navigate to="/" replace />} />
        <Route path="grounds/:id" element={<GroundDetail />} />
        <Route path="dashboard" element={<ProtectedRoute roles={['user']}><UserDashboard /></ProtectedRoute>} />
        <Route path="dashboard/profile" element={<ProtectedRoute roles={['user']}><UserProfile /></ProtectedRoute>} />
        <Route path="bookings/:id" element={<ProtectedRoute roles={['user', 'owner', 'admin']}><BookingDetail /></ProtectedRoute>} />
        <Route path="bookings" element={<ProtectedRoute roles={['user', 'owner', 'admin']}><MyBookings /></ProtectedRoute>} />
        <Route path="owner" element={<ProtectedRoute roles={['owner', 'admin']}><OwnerDashboard /></ProtectedRoute>} />
        <Route path="owner/grounds" element={<ProtectedRoute roles={['owner', 'admin']}><OwnerGrounds /></ProtectedRoute>} />
        <Route path="owner/grounds/new" element={<ProtectedRoute roles={['owner', 'admin']}><OwnerGroundForm /></ProtectedRoute>} />
        <Route path="owner/grounds/:id/edit" element={<ProtectedRoute roles={['owner', 'admin']}><OwnerGroundForm /></ProtectedRoute>} />
        <Route path="owner/grounds/:id/schedule" element={<ProtectedRoute roles={['owner', 'admin']}><OwnerGroundSchedule /></ProtectedRoute>} />
        <Route path="owner/bookings" element={<ProtectedRoute roles={['owner', 'admin']}><OwnerBookings /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="admin/owners" element={<ProtectedRoute roles={['admin']}><AdminOwners /></ProtectedRoute>} />
        <Route path="admin/grounds" element={<ProtectedRoute roles={['admin']}><AdminGrounds /></ProtectedRoute>} />
        <Route path="admin/bookings" element={<ProtectedRoute roles={['admin']}><AdminBookings /></ProtectedRoute>} />
        <Route path="admin/catalog" element={<ProtectedRoute roles={['admin']}><AdminCatalog /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
