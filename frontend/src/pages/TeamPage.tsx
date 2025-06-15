import '../styles/style.css'
import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

// Import your team-related components (you'll need to create these)
import type { Team } from "../models/team"
import { fetchTeamSeasonStatsWithMeta, fetchTeamById, searchTeamsByName } from "../lib/api"
import { fetchAllTeamMatches } from "../lib/api";
import type { Match } from '../models/match'
import type { TeamMatchStat } from '../models/team-match-stat'

import type { TeamSeasonStat } from '../models/team-season-stat'
import { TeamStat } from '../components/ui/teamStat'
import { SeasonTeamStats } from '../components/ui/TeamSeasonStats'
import { SmartTeamLink } from '../components/link/teamTextlink'

const UNIQUE_TOURNAMENT_ID = 8
const SEASON_ID = 52376

function formatDateDDMMYYYY(timestamp: number | string): string {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
} 

interface TeamChartProps {
  teamId: number; // Define the type of teamId
}

type ChartType = 'radar' | 'scatter';

/**
 * TeamPage component displays detailed statistics for a specific team.
 * It fetches team data and season stats, then renders them in a user-friendly format.
 * 
 * @returns JSX Element representing the team page.
 */

// Utility function to convert snake_case to camelCase
function convertSnakeToCamelCase(obj: Record<string, unknown>): Record<string, number | null> {
  const result: Record<string, number | null> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = typeof value === 'number' ? value : null;
  }
  
  return result;
}

export default function TeamPage() {
  const { id } = useParams<{ id: string }>() 
  const TEAM_ID = parseInt(id || "", 10)

  const [stats, setStats] = useState<TeamSeasonStat | null>(null)
  const [allSeasonStats, setAllSeasonStats] = useState<TeamSeasonStat[]>([])
  const [allLeagueStats, setAllLeagueStats] = useState<TeamSeasonStat[]>([])
  const [team, setTeam] = useState<Team | null>(null)
  const [recentMatches, setRecentMatches] = useState<TeamMatchStat[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showStats, setShowStats] = useState(true)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [chartType, setChartType] = useState<ChartType>('radar');

  const navigate = useNavigate();

  const [expandedMatchIndex, setExpandedMatchIndex] = useState<number | null>(null);

  const toggleMatch = (index: number) => {
    setExpandedMatchIndex(prev => (prev === index ? null : index));
  };
 
  const sortedRecentMatches = [...recentMatches].sort((a, b) => {
    return new Date(b.match.currentPeriodStartTimestamp).getTime() - new Date(a.match.currentPeriodStartTimestamp).getTime();
  });

  const handleTeamSearch = async (query: string): Promise<Team[]> => {
    if (!query || query.length < 0) return [];
    
    try {
      // Use your existing searchFunction for teams
      const results = await searchTeamsByName(query); // This should be your API call function
      
      // Filter to only return Team objects
      const teams = results.filter((result): result is Team => 
        'teamId' in result && result.teamId !== undefined
      );
      
      return teams;
    } catch (error) {
      console.error('Team search error:', error);
      return [];
    }
  };

  const handleFetchTeamStats = async (
    uniqueTournamentID: number, 
    seasonID: number, 
    teamID: number
  ): Promise<TeamSeasonStat[]> => {
    try {
      return await fetchTeamSeasonStatsWithMeta(uniqueTournamentID, seasonID, teamID);
    } catch (error) {
      console.error('Error fetching team stats:', error);
      throw error;
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
  
        if (isNaN(TEAM_ID)) {
          throw new Error("Invalid TEAM_ID");
        }
  
        const [teamData, statsData, teamMatchHistory, leagueStatsData] = await Promise.all([
          fetchTeamById(TEAM_ID),
          fetchTeamSeasonStatsWithMeta(UNIQUE_TOURNAMENT_ID, SEASON_ID, TEAM_ID),
          fetchAllTeamMatches(TEAM_ID),
          fetchTeamSeasonStatsWithMeta(UNIQUE_TOURNAMENT_ID, SEASON_ID) // Fetch all league teams
        ]);
  
        setTeam(teamData);
        setStats(statsData?.length > 0 ? statsData[0] : null);
        setAllSeasonStats(statsData || []);
        setAllLeagueStats(leagueStatsData || []);
        setRecentMatches(teamMatchHistory);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
  
    loadData();
  }, [TEAM_ID]);

  if (loading) return <p className="p-4">Loading team data...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>
  if (!team || !stats) return <p className="p-4">No data found.</p>

  return (
    <div className="min-h-screen bg-grid-pattern text-[#FFB13C] relative font-kagoda">
      <button
        className="fixed top-4 left-4 p-4 rounded-full bg-[#FF8113] text-black hover:bg-gray-200 transition z-50 shadow"
        onClick={() => navigate(-1)}
        aria-label="Go Back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
  
      <div className="max-w-5xl mx-auto p-4 relative">
        {/* Team Info Card */}
        <div className="flex flex-col md:flex-row items-center box-style rounded-2xl shadow-lg p-6 mb-8 gap-6">
          <div className="flex-shrink-0">
            {team.logo && (
              <img
                src={team.logo}
                alt={`${team.name} logo`}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-black mb-2">{team.name}</h2>

          </div>
        </div>

        {/* Chart Type Toggle Bar */}
        <div className="bg-[#FFFFFF] rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-xl p-1 flex">
              <button
                onClick={() => setChartType('radar')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  chartType === 'radar'
                    ? 'bg-white text-gray-800 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Radar Chart</span>
              </button>
              <button
                onClick={() => setChartType('scatter')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  chartType === 'scatter'
                    ? 'bg-white text-gray-800 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
                </svg>
                <span>Scatter Chart</span>
              </button>
            </div>
          </div>
        </div>
  
        {/* Stats Graph */}
        <div className="bg-[#FFFFFF] rounded-2xl shadow-lg p-6 mb-8 relative">
          <div className="flex justify-center items-center mb-4">
            <h3 className="text-2xl font-semibold text-black">
              {chartType === 'radar' ? 'Season Performance' : 'Season Statistics Comparison'}
            </h3>
          </div>

        </div>
  
        {/* Team Stats */}
        <div className="flex flex-wrap gap-4">
            <SeasonTeamStats stats={stats}/>
          {/* Recent Matches */}
          <div className="flex-1 bg-gray-100 rounded-2xl shadow p-6 max-w-sm mx-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recent Matches</h3>
            {recentMatches.length > 0 ? (
              <div className="space-y-3">
                {sortedRecentMatches.map((matchItem, index) => { 
                    if (!matchItem.match) return null; 
                    const isExpanded = expandedMatchIndex === index;
                    const isHomeTeam = matchItem.match.homeTeam.teamId === TEAM_ID;
                    const opponent = isHomeTeam ? matchItem.match.awayTeam : matchItem.match.homeTeam;
                    
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow transition overflow-hidden border"
                    >
                      <button
                        onClick={() => toggleMatch(index)}
                        className="w-full text-left px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-blue-100"
                      >
                        <div>
                          <div className="font-semibold text-gray-700">
                            vs                       { <SmartTeamLink 
                                                      teamId={opponent.teamId} 
                                                      teamName={opponent.name}
                                                      className="font-medium text-base font-semibold text-gray-800 text-lg"
                                                    />
                                                    } {isHomeTeam ? '(H)' : '(A)'} 
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <span>{formatDateDDMMYYYY(matchItem.match.currentPeriodStartTimestamp)}</span>
                            {matchItem.match.homeScore !== undefined && matchItem.match.awayScore !== undefined && (
                              <span className="font-medium">
                                {isHomeTeam 
                                  ? `${matchItem.match.homeScore}-${matchItem.match.awayScore}`
                                  : `${matchItem.match.awayScore}-${matchItem.match.homeScore}`
                                }
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xl text-gray-400">
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </button>
                      {isExpanded && (
                        <TeamStat matchItem={matchItem} />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600">No recent matches available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}