import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import { AuthProvider } from "./context/AuthContext";
import { RequireAuth } from "./context/AuthContext";
import Layouts from "./components/layout/Layouts";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import DrawList from "./components/draws/DrawList";
import MyTickets from "./components/tickets/MyTickets";
import Profile from "./components/profile/Profile";
import AdminDashboard from "./components/admin/AdminDashboard";
import Terms from './components/Terms';


// Define Lenis options interface
interface LenisOptions {
  lerp: number;
  smooth: boolean;
  smoothTouch: boolean;
  touchMultiplier: number;
  infinite: boolean;
  orientation: "vertical";
}

// Custom hook for Lenis smooth scrolling
function useLenis(): void {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 2,
      infinite: false,
      orientation: "vertical",
    } as LenisOptions);

    function raf(time: number): void {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      lenis.destroy?.();
    };
  }, []);
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layouts>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<Terms />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <Navigate to="/draws" replace />
              }
            />
            <Route
              path="/draws"
              element={<DrawList />}
            />
            <Route
              path="/tickets"
              element={
                <RequireAuth>
                  <MyTickets />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAuth allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
          </Routes>
        </Layouts>
      </AuthProvider>
    </Router>
  );
}

export default App;
