import './style.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MatchDetail from './pages/MatchDetail';
import PlayerChart from './pages/PlayerChart';
import TeamRadar from './pages/TeamRadar';
import HomePage from './pages/Index';
import TeamScatter from './pages/TeamScatter';
import PlayerScatter from './pages/PlayerScatter';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/player-scatter" element={<PlayerScatter />} />
        <Route path="/team-scatter" element={<TeamScatter />} />
        <Route path="/match/:id" element={<MatchDetail />} />
        <Route path="/player/:id" element={<PlayerChart />} />
        <Route path="/team/:id" element={<TeamRadar />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
