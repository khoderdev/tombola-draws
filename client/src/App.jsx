import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RequireAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import DrawList from "./components/draws/DrawList";
import MyTickets from "./components/tickets/MyTickets";
import Profile from "./components/profile/Profile";
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <>
                    <Navbar />
                    <Navigate to="/draws" replace />
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/draws"
              element={
                <RequireAuth>
                  <>
                    <Navbar />
                    <DrawList />
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/tickets"
              element={
                <RequireAuth>
                  <>
                    <Navbar />
                    <MyTickets />
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <>
                    <Navbar />
                    <Profile />
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAuth allowedRoles={["admin"]}>
                  <>
                    <Navbar />
                    <AdminDashboard />
                  </>
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
