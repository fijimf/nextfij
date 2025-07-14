import { z } from 'zod';

// Auth schemas
export const loginRequestSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    username: z.string(),
  }).optional(),
});

// Team schemas
export const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
  longName: z.string(),
  nickname: z.string(),
  logoUrl: z.string().url(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  slug: z.string(),
});

export const recordSchema = z.object({
  name: z.string(),
  wins: z.number(),
  losses: z.number(),
});

export const recordsSchema = z.object({
  conference: recordSchema,
  overall: recordSchema,
});

export const standingSchema = z.object({
  team: teamSchema,
  conferenceRecord: recordSchema,
  overallRecord: recordSchema,
});

export const conferenceSchema = z.object({
  id: z.number(),
  name: z.string(),
  shortName: z.string(),
  logoUrl: z.string().url(),
  standings: z.array(standingSchema),
});

export const gameSchema = z.object({
  id: z.number(),
  opponent: teamSchema,
  atVs: z.string(),
  isNeutralSite: z.boolean(),
  date: z.string(),
  score: z.number(),
  oppScore: z.number(),
  wOrL: z.string(),
  spread: z.number(),
  spreadDescription: z.string(),
  spreadCovered: z.boolean(),
  overUnder: z.number(),
  overOrUnder: z.string(),
  moneyLine: z.number(),
  moneyLinePaid: z.boolean(),
  oppMoneyLine: z.number(),
  oppMoneyLinePaid: z.boolean(),
});

export const teamPageSchema = z.object({
  season: z.number(),
  team: teamSchema,
  records: recordsSchema,
  conference: conferenceSchema,
  games: z.array(gameSchema),
});

export const teamsResponseSchema = z.object({
  teams: z.array(z.object({
    id: z.number(),
    name: z.string(),
    nickname: z.string(),
    logoUrl: z.string().url(),
    conference: z.string(),
    conferenceLogoUrl: z.string().url().nullable(),
    conferenceId: z.number(),
    record: z.object({
      name: z.string().nullable(),
      wins: z.number(),
      losses: z.number(),
    }),
  })),
});

// Error schema
export const apiErrorSchema = z.object({
  message: z.string(),
  status: z.number(),
  errors: z.record(z.array(z.string())).optional(),
});

// Generic API response schema
export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    status: z.number(),
    message: z.string().optional(),
  });

// Export types
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type Team = z.infer<typeof teamSchema>;
export type Record = z.infer<typeof recordSchema>;
export type Records = z.infer<typeof recordsSchema>;
export type Standing = z.infer<typeof standingSchema>;
export type Conference = z.infer<typeof conferenceSchema>;
export type Game = z.infer<typeof gameSchema>;
export type TeamPage = z.infer<typeof teamPageSchema>;
export type TeamsResponse = z.infer<typeof teamsResponseSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;