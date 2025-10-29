import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CredentialsSetup from './pages/CredentialsSetup';
import Dashboard from './pages/Dashboard';
import Automations from './pages/Automations';
import Connections from './pages/Connections';
import DataDashboard from './pages/DataDashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ControlPanel from './pages/ControlPanel';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Credentials Setup - No Layout */}
        <Route path="/credentials-setup" element={<CredentialsSetup />} />
        
        {/* Main App - With Layout */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/automations" element={<Layout><Automations /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/data" element={<Layout><DataDashboard /></Layout>} />
        <Route path="/connections" element={<Layout><Connections /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/control" element={<Layout><ControlPanel /></Layout>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
