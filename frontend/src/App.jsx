import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ApplicationsList from "./pages/applications/ApplicationsList";
import CreateApplication from "./pages/applications/CreateApplication";
import EditApplication from "./pages/applications/EditApplication";
import ResumePage from "./pages/resumePage";
import InterviewDashboard from "./pages/interview/InterviewDashboard";
import InterviewSession from "./pages/interview/InterviewSession";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/applications" element={<ApplicationsList />} />
              <Route path="/applications/new" element={<CreateApplication />} />
              <Route path="/applications/:id/edit" element={<EditApplication />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/interview" element={<InterviewDashboard />} />
              <Route path="/interview/:id" element={<InterviewSession />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
