import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import SessionManager from './components/SessionManager';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Accounting from './pages/Accounting';
import Banks from './pages/Banks';
import OtherCredit from './pages/OtherCredit';
import OtherDebit from './pages/OtherDebit';
import NotificationsFixed from './pages/NotificationsFixed';
import './App.css';

// Main App component that uses auth context
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">sclatean loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated()) {
    return <Login />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SessionManager />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Admin Only Routes */}
          <Route 
            path="/buy" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Buy />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sell" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Sell />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/accounting" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Accounting />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/banks" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Banks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/other-credit" 
            element={
              <ProtectedRoute adminOnly={true}>
                <OtherCredit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/other-debit" 
            element={
              <ProtectedRoute adminOnly={true}>
                <OtherDebit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute adminOnly={true}>
                <NotificationsFixed />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// Main App wrapper with AuthProvider and NotificationProvider
function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppContent />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
