import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Overview from './pages/Overview';
import Simulate from './pages/Simulate';
import Hotspots from './pages/Hotspots';
import CircularRecovery from './pages/CircularRecovery';
import ModelLab from './pages/ModelLab';
import OceanGPTWidget from './components/chat/OceanGPTWidget';

function App() {
  return (
    <Router>
      <div className="bg-surface font-body-md text-on-surface flex min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
          <Header />
          <main className="relative pt-16 flex-1 flex flex-col z-0 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/simulate" element={<Simulate />} />
              <Route path="/hotspots" element={<Hotspots />} />
              <Route path="/circular-recovery" element={<CircularRecovery />} />
              <Route path="/model-lab" element={<ModelLab />} />
            </Routes>
          </main>

        </div>
        <OceanGPTWidget />
      </div>
    </Router>
  );
}

export default App;
