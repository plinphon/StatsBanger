import MirrorBarChart from '../components/OverallBarChart';
import { useParams } from 'react-router-dom';
import { matchStats } from '../models/matchData';

const MatchDetail = () => {
  const { id } = useParams();
  const match = matchStats.find(m => m.id.toString() === id);

  if (!match) return <div>Match not found</div>;

  const chartData = [
    { label: 'Possession (%)', home: match.possession.home, away: match.possession.away },
    { label: 'Shots on Target', home: match.shotsOnTarget.home, away: match.shotsOnTarget.away },
    { label: 'Fouls', home: match.fouls.home, away: match.fouls.away },
  ];

  return (
    <div>
      <h2>{match.homeTeam} vs {match.awayTeam}</h2>
      <MirrorBarChart data={chartData} />
    </div>
  );
};

export default MatchDetail;
