import { Link } from "react-router-dom";

interface SmartTeamLinkProps {
  teamId: number;
  teamName: string;
  className?: string;
  children?: React.ReactNode;
}

export function SmartTeamLink({ teamId, teamName, className = "", children }: SmartTeamLinkProps) {
  return (
    <Link 
      to={`/team/${teamId}`}
      className={`text-blue-600 font-kagoda hover:text-blue-800 hover:underline transition-colors ${className}`}
      title={`View ${teamName} profile`}
    >
      {children || teamName}
    </Link>
  );
}