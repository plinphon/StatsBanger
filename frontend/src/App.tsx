import './style.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MatchDetail from './pages/MatchDetail';
import PlayerChart from './pages/PlayerChart';
import TeamRadar from './pages/TeamRadar';
import HomePage from './pages/Index';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/player">Stats</Link> | <Link to="/match/:id">match</Link>
      </nav>

      <Routes>
        <Route path="/match/:id" element={<MatchDetail />} />
        <Route path="/player/:id" element={<PlayerChart />} />
        <Route path="/team/:id" element={<TeamRadar />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
