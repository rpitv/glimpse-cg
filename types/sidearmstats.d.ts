import type { StringLiteral } from "typescript";

interface Game {
  Game: {
    Type: string;
    HasStarted: boolean;
    IsComplete: boolean;
    Source: string;
    Date: string;
    DateUTC?: string | null;
    StartTime: string;
    EndTime: string;
    UseLiveStatsAutomation: string;
    NcaaGameId: string;
    ClientId: string;
    ClientAbbrev: string;
    ClientLiveStatsURL: string;
    Notes: string[],
    Location: string,
    GlobalSportShortname: string,
    BannerMessage: string;
    StadiumImage?: string | null;
    SiteImage?: string | null;
    ClientHostname: string;
    Officials: string;
    Attendance: number;
    PeriodsRegulation: number;
    Period: number;
    ClockSeconds: number;
    Context: string;
    Rules: {
      PeriodMinutes: number;
      PeriodName: string;
      OTMinutes: number;
      ShowExtraPeriodAsOT: boolean;
      ClockDirection: string;
      ClockSegmentation: string;
    }
    HomeTeam: GameTeam;
    VisitingTeam: GameTeam;
    LastPlays: Play[]
  }
  Leaders: {

  }
  Stats: {

  }
  SeasonStats: {
    
  }
  Plays: Play[];
}

interface GameTeam {
  Id: string;
  Name: string;
  Score: number;
  CurrentRecord: string;
  PostgameRecord: string;
  NcaaSchoolCode: string;
  Color: string;
  TextColor: string;
  Logo: string;
  Url: string;
  PeriodScores: number[];
  PeriodTimeouts: number[];
}

interface Play {
  Player?: Player | null;
  InvolvedPlayers: Player[];
  Team: string;
  Narrative: string;
  Context: string;
  Id: string;
  Type: string;
  Action?: string | null;
  Period: number;
  ClockSeconds: number;
  Coordinate?: {
    X: number;
    Y: number;
    Side: string;
  } | null;
  Score: {
    HomeTeam: number;
    VisitingTeam: number;
  }
}

interface SoccerPlay extends Play {
  Qualifiers: string[];
}

interface Player {
  Team: string;
  FirstName: string;
  LastName: string;
  UniformNumber: string;
  Photo: string;
  PersonId: string;
}

interface LeadersTeamHockey {
  Goals: PlayerValue[];
  Assists: PlayerValue[];
  Points: PlayerValue[];
  "+/-": PlayerValue[];
  "Save Percentage": PlayerValue[];
}

interface LeadersTeamLax {
  Goals: PlayerValue[];
  Assists: PlayerValue[];
  Points: PlayerValue[];
  Shots: PlayerValue[];
  "Shots on Goal": PlayerValue[];
  "Ground Balls": PlayerValue[];
  "Caused Turnovers": PlayerValue[];
  Saves: PlayerValue[];
}

interface LeadersTeamSoccer {
  Goals: PlayerValue[];
  Assists: PlayerValue[];
  Shots: PlayerValue[];
  "Shots on Goal": PlayerValue[];
  "Red Cards": PlayerValue[];
  "Yellow Cards": PlayerValue[];
  Fouls: PlayerValue[];
}

interface LeadersTeamBasketball {
  Points: PlayerValue[];
  Rebounds: PlayerValue[];
  Assists: PlayerValue[];
  Blocks: PlayerValue[];
  Steals: PlayerValue[];
  "Personal Fouls": PlayerValue[];
  "Efficiency": PlayerValue[];
  "Usage Percentage": PlayerValue[];
}

interface PlayerValue {
  Player: Player;
  Value: string;
}

interface StatsTeam {
  TopPerformer?: Player | null;
  Players: Player[];
  PlayerGroups: {};
  Totals: {
    Key: {};
    FullKey: {};
    Values: {};
  };
  PeriodStats: [];
}

interface HockeyStatsTeams {
  PlayerGroups: HockeyPlayerGroups;
  Totals: {
    Key: HockeyTotals;
    FullKey: HockeyTotals;
    Values: HockeyTotals;
  }
  PeriodStats: HockeyPeriodStats[];
}

interface HockeyPlayerGroups {
  Skaters: {
    Title: string;
    Key: HockeySkaters;
    Descriptors: HockeySkaters;
    Values: HockeySkaters[];
  }
  Goalies: {
    Title: string;
    Key: HockeyGoalies;
    Descriptors: HockeyGoalies;
    Values: HockeyGoalies[];
  }
}

interface HockeySkaters {
  Uni: string;
  Name: string;
  Position: string;
  Goals: string;
  Assists: string;
  Points: string;
  ShotAttempts: string;
  Shots: string;
  PowerPlayGoals: string;
  ShorthandedGoals: string;
  FaceoffWon: string;
  FaceoffLost: string;
  BlockShot: string;
  PlusMinus: string;
  PenaltyMins: string;
  PersonId: string;
}

interface HockeyGoalies {
  Uni: string;
  Name: string;
  Position: string;
  Saves: string;
  GoalsAllowed: string;
  SavePercentage: string;
  PersonId: string;
}

interface HockeyTotals {
  Goals: string;
  Assists: string;
  Shots: string;
  ShotAttempts: string;
  PowerPlayGoals: string;
  PowerPlayEfficiency: string;
  ShorthandedGoals: string;
  Penalties: string;
  FaceoffWon: string;
  FaceoffLost: string;
  BlockShot: string;
  PenaltyMins: string;
}

interface HockeyPeriodStats {
  Period: string;
  Goals: string;
  Shots: string;
  ShotAttempts: string;
  Saves: string;
  PowerPlayGoals: string;
  PowerPlayAttempts: string;
  FaceoffWon: string;
  Penalties: string;
  PenatliesMins: string;
}

interface SeasonStatsTeam {
  HomeTeam?: {} | null;
  VisingTeam?: {} | null;
}