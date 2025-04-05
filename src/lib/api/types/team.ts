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
  spread: number;
  overUnder: number;
  moneyLine: number;
  oppMoneyLine: number;
}

export interface TeamPage {
  season: number;
  team: TeamDTO;
  records: Records;
  conference: ConferenceDTO;
  games: GameDTO[];
} 