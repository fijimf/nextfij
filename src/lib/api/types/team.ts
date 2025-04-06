export interface TeamDTO {
  id: number;
  name: string;
  longName: string;
  nickname: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  slug: string;
}

export interface Records {
  conference: Record;
  overall: Record;
}

export interface StandingDTO {
  team: TeamDTO;
  conferenceRecord: Record;
  overallRecord: Record;
}

export interface Record {
  name: string;
  wins: number;
  losses: number;
}

export interface ConferenceDTO {
  id: number;
  name: string;
  shortName: string;
  logoUrl: string;
  standings: StandingDTO[];
}

export interface GameDTO {
  id: number;
  opponent: TeamDTO;
  atVs: string;
  isNeutralSite: boolean;
  date: string;
  score: number;
  oppScore: number;
  wOrL: string;
  spread: number;
  spreadDescription: string;
  spreadCovered: boolean;
  overUnder: number;
  overOrUnder: string;
  moneyLine: number;
  moneyLinePaid: boolean;
  oppMoneyLine: number;
  oppMoneyLinePaid: boolean;
}

export interface TeamPage {
  season: number;
  team: TeamDTO;
  records: Records;
  conference: ConferenceDTO;
  games: GameDTO[];
} 