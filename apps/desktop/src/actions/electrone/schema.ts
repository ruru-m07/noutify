import { z } from "zod";

export const localRepoSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  originUrl: z.string().nullable().optional(),
  description: z.string().optional(),
  isFavorite: z.boolean().optional(),
  repoName: z.string().optional(),
  repoUsername: z.string().optional(),
  isPrivate: z.boolean().optional(),
});

export type LocalRepo = z.infer<typeof localRepoSchema>;

export const localRepoListSchema = z.array(localRepoSchema);
export type LocalRepoList = z.infer<typeof localRepoListSchema>;
