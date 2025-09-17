import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  
  console.log('CheckAuth:', { isAuthenticated, user, pathname: location.pathname });

  // Redirect root based on user role
  if (location.pathname === "/") {
    if (isAuthenticated && user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/shop/home" />;
  }

  // Only protect admin routes
  if (location.pathname.includes("/admin")) {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }
    if (user?.role !== "admin") {
      return <Navigate to="/unauth-page" />;
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && location.pathname.includes("/auth")) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Redirect to login if trying to access auth pages while not authenticated
  if (!isAuthenticated && location.pathname.includes("/auth")) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

export default CheckAuth;
