import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Navigate to appropriate dashboard if on login/register page
        if (location.pathname === "/login" || location.pathname === "/register") {
          navigateToDashboard(userData);
        }
        // Refresh token periodically
        const refreshToken = async () => {
          try {
            const data = await authService.refreshToken();
            if (data.data?.user) {
              setUser(data.data.user);
            }
          } catch (err) {
            console.error("Token refresh failed:", err);
            logout();
          }
        };
        const intervalId = setInterval(refreshToken, 14 * 60 * 1000); // Refresh every 14 minutes
        return () => clearInterval(intervalId);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const navigateToDashboard = (userData) => {
    if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/draws");
    }
  };

  const login = async (credentials) => {
    try {
      setError("");
      const response = await authService.login(credentials);
      if (response.data?.user) {
        setUser(response.data.user);
        navigateToDashboard(response.data.user);
      } else {
        throw new Error("Invalid response format");
      }
      return response;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError("");
      const response = await authService.register(userData);
      if (response.data?.user) {
        setUser(response.data.user);
        navigateToDashboard(response.data.user);
      } else {
        throw new Error("Invalid response format");
      }
      return response;
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate("/login");
  };

  const forgotPassword = async (email) => {
    try {
      setError("");
      await authService.forgotPassword(email);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
      throw err;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setError("");
      await authService.resetPassword(token, password);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      throw err;
    }
  };

  const verifyEmail = async (token) => {
    try {
      setError("");
      await authService.verifyEmail(token);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify email");
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Protected Route Component
export function RequireAuth({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
