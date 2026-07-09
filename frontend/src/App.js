import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./styles/theme";
import { AuthProvider } from "./context/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import StudentApplication from "./pages/StudentApplication";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import CourseManagement from "./pages/CourseManagement";
import StudentAllocation from "./pages/StudentAllocation";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/student-application"
              element={<StudentApplication />}
            />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/course-management" element={<CourseManagement />} />
              <Route
                path="/student-allocation"
                element={<StudentAllocation />}
              />
              <Route path="/ai-assistant" element={<AIAssistant />} />
            </Route>

            {/* Not Found */}
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
