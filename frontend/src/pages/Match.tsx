import { matchStats } from '../models/matchData';

const Match = () => {
  return (
    <div>
      <h2>Match Statistics</h2>
      {matchStats.map((match) => (
        <div key={match.id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
          <h3>{match.homeTeam} vs {match.awayTeam}</h3>
          <p><strong>Score:</strong> {match.homeScore} - {match.awayScore}</p>
          <p><strong>Possession:</strong> {match.possession.home}% - {match.possession.away}%</p>
          <p><strong>Shots on Target:</strong> {match.shotsOnTarget.home} - {match.shotsOnTarget.away}</p>
          <p><strong>Fouls:</strong> {match.fouls.home} - {match.fouls.away}</p>
        </div>
      ))}
    </div>
  );
};

export default Match;
