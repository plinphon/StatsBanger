// src/pages/analytics.tsx
import React, { useEffect, useState } from "react"

import MirorBarChart from "../components/OverallBarChart"
import type { TeamMatchStat } from "../models/team-match-stat"
import { fetchMatchById, fetchPlayerStatsByMatch, fetchTeamMatchStats } from "../lib/api"
import type { Match } from "../models/match"
import MatchMirrorBarChart from "../components/OverallBarChart"
import type { PlayerMatchStat } from "../models/player-match-stat"
import { useParams } from "react-router-dom"
import { PlayerMatchBar } from "../components/allCharts2"
import { PlayerStat } from "../components/ui/PlayerStat"
import { positionOrder } from "../utils/dataTransformation"
import TeamPlayerStats from "../components/ui/TeamPlayerStats"
import { PlayerScatter } from "../components/PlayerScatter"

export default function AnalyticsPage() {
  const [match, setMatch] = useState<Match>()
  const [homeStats, setHomeStats] = useState<TeamMatchStat>()
  const [awayStats, setAwayStats] = useState<TeamMatchStat>()
  const [allPlayerStats, setAllPlayerStats] = useState<PlayerMatchStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [showTeamStats, setShowTeamStats] = useState(false)
  
  const { id } = useParams();

  const tabs = [
    { 
      id: 0, 
      label: 'Team Comparison', 
      icon: '⚖️',
      component: <MatchMirrorBarChart data={[homeStats, awayStats]} /> 
    },
    { 
      id: 1, 
      label: 'Player Scatter', 
      icon: '📊',
      component: <PlayerScatter data={allPlayerStats}/> 
    },
    { 
      id: 2, 
      label: 'Player Performance', 
      icon: '👥',
      component: <PlayerMatchBar data={allPlayerStats} yAxisMetric="total_pass" barLimit={10} /> 
    }
  ];

  const MATCH_ID = parseInt(id ?? '0', 10);

  useEffect(() => {
    async function loadStats() {
      try {
        const match = await fetchMatchById(MATCH_ID)
        
        const HOMETEAM_ID = match.homeTeam.teamId
        const AWAYTEAM_ID = match.awayTeam.teamId

        const homeStats = await fetchTeamMatchStats(MATCH_ID, HOMETEAM_ID)
        const awayStats = await fetchTeamMatchStats(MATCH_ID, AWAYTEAM_ID)

        const allPlayerStats = await fetchPlayerStatsByMatch(MATCH_ID)
        console.log("Player Stats:", allPlayerStats);

        setMatch(match)
        console.log("Match:", match);
        setHomeStats(homeStats);
        setAwayStats(awayStats)
        setAllPlayerStats(allPlayerStats)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8113] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading match analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#FF8113] hover:bg-[#e6730f] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!homeStats || !awayStats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-gray-400 text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
          <p className="text-gray-600">Match statistics are not available for this game.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Match Analytics</h1>
              {match && (
                <p className="text-sm text-gray-600 mt-1">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </p>
              )}
            </div>
            
            {/* Toggle Team Stats Button */}
            <button
              onClick={() => setShowTeamStats(!showTeamStats)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                showTeamStats 
                  ? 'bg-[#FF8113] text-white border-[#FF8113]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#FF8113] hover:text-[#FF8113]'
              }`}
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <span className="font-medium">
                {showTeamStats ? 'Hide' : 'Show'} Team Rosters
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto p-6">
        {allPlayerStats.length > 0 && match ? (
          <div className={`transition-all duration-300 ${showTeamStats ? 'flex space-x-6' : ''}`}>
            {/* Team Stats Sidebars - Only show when toggled */}
            {showTeamStats && (
              <>
                {/* Home Team Stats */}
                <div className="w-80 flex-shrink-0">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-blue-600 text-white px-4 py-3">
                      <h3 className="font-semibold">{match.homeTeam.name}</h3>
                      <p className="text-blue-100 text-sm">Home Team</p>
                    </div>
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                      <TeamPlayerStats
                        key={match.homeTeam.teamId}
                        team={match.homeTeam}
                        allPlayerStats={allPlayerStats}
                        positionOrder={positionOrder}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Chart Section - Takes full width when team stats are hidden */}
            <div className={`${showTeamStats ? 'flex-1 min-w-0' : 'w-full'} flex flex-col`}>
              {/* Enhanced Tabs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex border-b border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-all duration-200 relative ${
                        activeTab === tab.id
                          ? 'text-[#FF8113] bg-orange-50'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span>{tab.label}</span>
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF8113]"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
      
              {/* Chart Container - Much larger now */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                <div style={{ minHeight: showTeamStats ? '600px' : '700px' }}>
                  {tabs[activeTab].component}
                </div>
              </div>
            </div>

            {/* Away Team Stats - Only show when toggled */}
            {showTeamStats && (
              <div className="w-80 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-red-600 text-white px-4 py-3">
                    <h3 className="font-semibold">{match.awayTeam.name}</h3>
                    <p className="text-red-100 text-sm">Away Team</p>
                  </div>
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    <TeamPlayerStats
                      key={match.awayTeam.teamId}
                      team={match.awayTeam}
                      allPlayerStats={allPlayerStats}
                      positionOrder={positionOrder}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-gray-400 text-5xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Player Data</h3>
              <p className="text-gray-500">Player statistics are not available for this match.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}