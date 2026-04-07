import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import "./styles/auth.css";
import "./i18n";
import Login from "./pages/Login";
import DriverDashboard from "./pages/driver/DriverDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import Register from "./pages/Register";
// OWNER LAYOUT
import OwnerLayout from "./pages/owner/OwnerLayout";

// SECTION 1
import Overview from "./pages/owner/dashboard/Overview";
import Trucks from "./pages/owner/dashboard/Trucks";
import Trips from "./pages/owner/dashboard/Trips";

// SECTION 2
import LiveTracking from "./pages/owner/tracking/LiveTracking";

// SECTION 3
import ExpenseList from "./pages/owner/expenses/ExpenseList";
import AddExpense from "./pages/owner/expenses/AddExpense";
import Reports from "./pages/owner/expenses/Reports";



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ROOT ROUTE */}
          <Route
            path="/"
            element={
              localStorage.getItem("access")
                ? localStorage.getItem("role") === "OWNER"
                  ? <Navigate to="/owner" />
                  : <Navigate to="/driver" />
                : <Navigate to="/login" />
            }
          />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* OWNER */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute role="OWNER">
                <OwnerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="trucks" element={<Trucks />} />
            <Route path="trips" element={<Trips />} />
            <Route path="tracking" element={<LiveTracking />} />
            <Route path="expenses" element={<ExpenseList />} />
            <Route path="expenses/add" element={<AddExpense />} />
            <Route path="expenses/reports" element={<Reports />} />
          </Route>

          {/* DRIVER */}
          <Route
            path="/driver"
            element={
              <ProtectedRoute role="DRIVER">
                <DriverDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
