import { z } from 'zod';

// Auth schemas
export const loginRequestSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const loginResponseSchema = z.object({
  result: z.string(),
  message: z.string(),
  data: z.object({
    token: z.string(),
  }).nullable(),
});

// Team schemas
export const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
  longName: z.string(),
  nickname: z.string(),
  logoUrl: z.string().url().nullable(),
  primaryColor: z.string().nullable(),
  secondaryColor: z.string().nullable(),
  slug: z.string(),
});

export const recordSchema = z.object({
  name: z.string().nullable(),
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
  logoUrl: z.string().url().nullable(),
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
  spread: z.number().nullable(),
  spreadDescription: z.string().nullable(),
  spreadCovered: z.boolean().nullable(),
  overUnder: z.number().nullable(),
  overOrUnder: z.string().nullable(),
  moneyLine: z.number().nullable(),
  moneyLinePaid: z.boolean().nullable(),
  oppMoneyLine: z.number().nullable(),
  oppMoneyLinePaid: z.boolean().nullable(),
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
    logoUrl: z.string().url().nullable(),
    conference: z.string().nullable(),
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

// Server's standard response schema
export const serverResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    result: z.string(),
    message: z.string(),
    data: dataSchema.nullable(),
  });

// Generic API response schema (for Axios responses)
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