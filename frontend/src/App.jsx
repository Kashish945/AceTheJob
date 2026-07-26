import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AtsChecker from './pages/AtsChecker';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';
import Overview from './pages/Overview';
import MockInterview from './pages/MockInterview';
import InterviewSession from './pages/InterviewSession';
import InterviewFeedback from './pages/InterviewFeedback';
import Profile from './pages/Profile';
import ScoreCards from './pages/ScoreCards';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/registration" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />
        </Route>

        {/* Protected Dashboard Routes with Sidebar */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/ats" element={<AtsChecker />} />
          <Route path="/interview" element={<MockInterview />} />
          <Route path="/interview/:id" element={<InterviewSession />} />
          <Route path="/interview/:id/feedback" element={<InterviewFeedback />} />
          <Route path="/scorecards" element={<ScoreCards />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
