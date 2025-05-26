import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MatchDetail from './pages/MatchDetail';


function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/stats">Stats</Link>
      </nav>

      <Routes>
        <Route path="/match/:id" element={<MatchDetail />} />
      </Routes>
    </Router>
  );
}


export default App;
