import './style.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MatchDetail from './pages/MatchDetail';
import PlayerChart from './pages/PlayerChart';
import TeamRadar from './pages/TeamRadar';
import HomePage from './pages/Index';
import TeamScatter from './pages/TeamScatter';
import PlayerScatter from './pages/PlayerScatter';
import PlayerMatchHistory from './pages/PlayerMatchHistory';
import PlayerMatchScatter from './pages/PlayerMatchScatter';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/player-match-scatter/:id" element={<PlayerMatchScatter />} />
        <Route path="/player-scatter" element={<PlayerScatter />} />
        <Route path="/team-scatter" element={<TeamScatter />} />
        <Route path="/match/:id" element={<MatchDetail />} />
        <Route path="/player/:id" element={<PlayerChart />} />
        <Route path="/team/:id" element={<TeamRadar />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/player/:id/match-history" element={<PlayerMatchHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
