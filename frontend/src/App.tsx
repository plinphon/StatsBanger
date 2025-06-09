import './style.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MatchDetail from './pages/MatchDetail';
import PlayerChart from './pages/PlayerChart';
import HomePage from './pages/Index';
import PlayerCustomRadar from './pages/PlayerCustomRadar';
import PlayerMatchHistory from './pages/PlayerMatchHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/match/:id" element={<MatchDetail />} />
        <Route path="/player/:id" element={<PlayerChart />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/player/:id/custom-radar" element={<PlayerCustomRadar />} />
        <Route path="/player/:id/matches" element={<PlayerMatchHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
