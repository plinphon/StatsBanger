import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MatchDetail from './pages/MatchDetail';
import PlayerChart from './pages/PlayerChart';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/player-chart">Stats</Link> | <Link to="/match/:id">match</Link>
      </nav>

      <Routes>
        <Route path="/match/:id" element={<MatchDetail />} />
        <Route path="/player-chart" element={<PlayerChart />} />
      </Routes>
    </Router>
  );
}

export default App;
