/**
 * Generates headers for GitHub API requests.
 *
 * @param apiVersion - The version of the GitHub API to use.
 * @returns An object containing the headers for the GitHub API request.
 */
export function getGitHubHeaders(apiVersion: string): Record<string, string> {
  return { "X-GitHub-Api-Version": apiVersion };
}
