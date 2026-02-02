import { Navigate, useLocation } from 'react-router-dom';

// Protects admin-only pages. If the stored session is missing or the role is not authorized,
// redirect to the hardened admin login route instead of silently rendering public pages.
const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch (err) {
    // Corrupted data should not allow access
    localStorage.removeItem('user');
  }

  const roleMatches = requiredRole
    ? user?.role?.toUpperCase() === requiredRole.toUpperCase()
    : Boolean(user);

  if (!user || !roleMatches) {
    // Clear any stale client-side session and send the user to the admin login screen
    localStorage.removeItem('user');
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
