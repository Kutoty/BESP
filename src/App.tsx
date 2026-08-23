import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useRoleStore } from './store/useRoleStore';
import Login from './pages/auth/Login';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

import StudentDashboard from './pages/student/StudentDashboard';
import UploadForm from './pages/student/UploadForm';
import PerformanceCurve from './pages/student/PerformanceCurve';
import StudentAnnouncements from './pages/student/StudentAnnouncements';
import StudentMessages from './pages/student/Messages';

import MyStudents from './pages/admin/MyStudents';
import ApplicationsTable from './pages/admin/ApplicationsTable';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import StudentDetail from './pages/admin/StudentDetail';
import Notifications from './pages/admin/Notifications';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminMessages from './pages/admin/AdminMessages';
import AddScholar from './pages/admin/AddScholar';
import ScholarDetail from './pages/admin/ScholarDetail';

function AppLayout() {
  const { currentRole } = useRoleStore();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-72 transition-all duration-300 min-w-0">
        <TopBar />
        <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-10">
          <Routes>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/upload" element={<UploadForm />} />
            <Route path="/student/performance" element={<PerformanceCurve />} />
            <Route path="/student/announcements" element={<StudentAnnouncements />} />
            <Route path="/student/messages" element={<StudentMessages />} />

            <Route path="/admin" element={<MyStudents />} />
            <Route path="/admin/add-scholar" element={<AddScholar />} />
            <Route path="/admin/applications" element={<ApplicationsTable />} />
            <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
            <Route path="/admin/student/:id" element={<StudentDetail />} />
            <Route path="/admin/scholar/:id" element={<ScholarDetail />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/messages" element={<AdminMessages />} />

            <Route
              path="/"
              element={
                <Navigate
                  to={currentRole === 'admin' ? '/admin' : '/student'}
                  replace
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { currentRole } = useRoleStore();

  return (
    <Router>
      {!currentRole ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <AppLayout />
      )}
    </Router>
  );
}

export default App;
