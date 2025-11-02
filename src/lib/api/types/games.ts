import { TeamDTO, ConferenceDTO } from './team';

export interface GameDetailDTO {
  id: number;
  season: number;
  date: string;
  homeTeam: TeamDTO;
  awayTeam: TeamDTO;
  homeTeamSeed: number | null;
  awayTeamSeed: number | null;
  homeScore: number | null;
  awayScore: number | null;
  isNeutral: boolean;
  conferenceGame: ConferenceDTO | null;
  spread: string | null;
  overUnder: number | null;
  homeMoneyLine: number | null;
  awayMoneyLine: number | null;
}

export interface GamesByDateDTO {
  season: number;
  date: string;
  games: GameDetailDTO[];
}

export interface ApiResponseGamesByDateDTO {
  result: string;
  message: string;
  data: GamesByDateDTO;
}
