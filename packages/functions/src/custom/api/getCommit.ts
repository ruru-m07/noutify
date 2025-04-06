import { z } from "zod";

export const CommitSchema = z.object({
  sha: z.string(),
  node_id: z.string(),
  commit: z.object({
    author: z.object({
      name: z.string(),
      email: z.string().email(),
      date: z.string().datetime(),
    }),
    committer: z.object({
      name: z.string(),
      email: z.string().email(),
      date: z.string().datetime(),
    }),
    message: z.string(),
    tree: z.object({
      sha: z.string(),
      url: z.string().url(),
    }),
    url: z.string().url(),
    comment_count: z.number(),
    verification: z.object({
      verified: z.boolean(),
      reason: z.string(),
      signature: z.string().nullable(),
      payload: z.string().nullable(),
      verified_at: z.string().nullable(),
    }),
  }),
  url: z.string().url(),
  html_url: z.string().url(),
  comments_url: z.string().url(),
  author: z.object({
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string().url(),
    gravatar_id: z.string(),
    url: z.string().url(),
    html_url: z.string().url(),
    followers_url: z.string().url(),
    following_url: z.string(), // Contains template {/other_user}
    gists_url: z.string(), // Contains template {/gist_id}
    starred_url: z.string(), // Contains template {/owner}{/repo}
    subscriptions_url: z.string().url(),
    organizations_url: z.string().url(),
    repos_url: z.string().url(),
    events_url: z.string(), // Contains template {/privacy}
    received_events_url: z.string().url(),
    type: z.string(),
    user_view_type: z.string().optional(),
    site_admin: z.boolean(),
  }),
  committer: z.object({
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string().url(),
    gravatar_id: z.string(),
    url: z.string().url(),
    html_url: z.string().url(),
    followers_url: z.string().url(),
    following_url: z.string(), // Contains template {/other_user}
    gists_url: z.string(), // Contains template {/gist_id}
    starred_url: z.string(), // Contains template {/owner}{/repo}
    subscriptions_url: z.string().url(),
    organizations_url: z.string().url(),
    repos_url: z.string().url(),
    events_url: z.string(), // Contains template {/privacy}
    received_events_url: z.string().url(),
    type: z.string(),
    user_view_type: z.string().optional(),
    site_admin: z.boolean(),
  }),
  parents: z.array(
    z.object({
      sha: z.string(),
      url: z.string().url(),
      html_url: z.string().url(),
    })
  ),
  stats: z.object({
    total: z.number(),
    additions: z.number(),
    deletions: z.number(),
  }),
  files: z.array(
    z.object({
      sha: z.string(),
      filename: z.string(),
      status: z.string(),
      additions: z.number(),
      deletions: z.number(),
      changes: z.number(),
      blob_url: z.string().url(),
      raw_url: z.string().url(),
      contents_url: z.string().url(),
      patch: z.string().optional(),
    })
  ),
});

export type Commit = z.infer<typeof CommitSchema>;

export async function getCommit(
  owner: string,
  repo: string,
  commit_sha: string,
  token: string
): Promise<Commit> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits/${commit_sha}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28"
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching commit: ${response.statusText}`);
  }

  const data = await response.json();

  try {
    return CommitSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.format());
      throw new Error(`Invalid commit data: ${error.message}`);
    }
    throw error;
  }
}
