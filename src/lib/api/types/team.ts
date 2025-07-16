export interface TeamDTO {
  id: number;
  name: string;
  longName: string;
  nickname: string;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
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
  name: string | null;
  wins: number;
  losses: number;
}

export interface ConferenceDTO {
  id: number;
  name: string;
  shortName: string;
  logoUrl: string | null;
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
  spread: number | null;
  spreadDescription: string | null;
  spreadCovered: boolean | null;
  overUnder: number | null;
  overOrUnder: string | null;
  moneyLine: number | null;
  moneyLinePaid: boolean | null;
  oppMoneyLine: number | null;
  oppMoneyLinePaid: boolean | null;
}

export interface TeamPage {
  season: number;
  team: TeamDTO;
  records: Records;
  conference: ConferenceDTO;
  games: GameDTO[];
} 