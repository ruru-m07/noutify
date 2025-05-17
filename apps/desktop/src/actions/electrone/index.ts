"use server";

import { log } from "@/lib/logger";
import path from "path";
import { randomUUID } from "crypto";
import {
  localRepoSchema,
  localRepoListSchema,
  type LocalRepo,
  type LocalRepoList,
} from "./schema";
import { getRemoteOrigin } from "@noutify/git";
import { getGithubClient } from "@/lib/ghClient";

function parseGitHubInfo(originUrl: string) {
  const cleanUrl = originUrl.trim();

  // eslint-disable-next-line no-useless-escape
  const regex = /github\.com[:/]([^/]+)\/([^/\.]+)(?:\.git)?/;
  const match = cleanUrl.match(regex);

  if (match) {
    return {
      repoUsername: match[1],
      repoName: match[2],
    };
  }

  log.error("Failed to parse GitHub info from origin URL:", originUrl);
  return null;
}

export async function saveUserRepoPath(repoPath: string) {
  const userDataPath = process.env.NOUTIFY_USER_DATA_PATH;

  log.info("userDataPath is", userDataPath);
  if (!userDataPath) {
    log.error("User data path is not set.");
    return { success: false, error: "User data path is not set." };
  }

  const configFilePath = path.join(userDataPath, "local-repo.json");
  try {
    const fs = await import("fs/promises");

    let originUrl: string | null = null;
    try {
      const { error, data } = await getRemoteOrigin(repoPath);

      if (error) {
        throw new Error(error || "Failed to get remote origin");
      }

      originUrl = data;
    } catch {
      log.warn("No origin found for", repoPath);
      originUrl = null;
    }

    const ghClient = await getGithubClient();

    console.log({
      originUrl,
    });

    const parsedInfo = originUrl ? parseGitHubInfo(originUrl) : null;

    console.log({
      parsedInfo,
    });

    if (!parsedInfo?.repoUsername || !parsedInfo?.repoName) {
      log.error("Parsed GitHub info is missing username or repository name.");
      return {
        success: false,
        error: "Invalid GitHub repository information.",
      };
    }

    const repoDetails = await ghClient.repos.getRepository(
      parsedInfo?.repoUsername,
      parsedInfo?.repoName
    );

    const isPrivate = repoDetails.visibility === "public" ? false : true;

    const cleanOriginUrl = originUrl ? originUrl.trim() : null;

    const repoData: LocalRepo = localRepoSchema.parse({
      id: randomUUID(),
      name: path.basename(repoPath),
      path: repoPath,
      createdAt: new Date(),
      updatedAt: new Date(),
      originUrl: cleanOriginUrl,
      repoUsername: repoDetails?.owner.login,
      repoName: repoDetails?.name,
      isPrivate: isPrivate ?? undefined,
    });

    let fileContent: string;
    try {
      await fs.access(configFilePath);
      fileContent = await fs.readFile(configFilePath, "utf-8");
    } catch {
      await fs.writeFile(configFilePath, JSON.stringify([]));
      fileContent = "[]";
    }

    let existingRepos: LocalRepoList = [];
    try {
      const parsedRaw = JSON.parse(fileContent);
      const hydrated = parsedRaw.map((repo: LocalRepo) => ({
        ...repo,
        createdAt: new Date(repo.createdAt),
        updatedAt: new Date(repo.updatedAt),
      }));
      existingRepos = localRepoListSchema.parse(hydrated);
    } catch {
      log.warn("Config file is corrupted or invalid. Reinitializing...");
      await fs.writeFile(configFilePath, JSON.stringify([]));
      existingRepos = [];
    }

    const duplicate = existingRepos.find((r) => r.path === repoPath);
    if (duplicate) {
      log.warn("Duplicate repository path detected:", repoPath);
      return {
        success: false,
        error: "This repository is already exists.",
      };
    }

    existingRepos.push(repoData);
    await fs.writeFile(configFilePath, JSON.stringify(existingRepos, null, 2));

    log.info("Local repository path saved successfully:", repoPath);

    return { success: true, data: repoData };
  } catch (error) {
    log.error("Error saving local repository path:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getUserRepos() {
  const userDataPath = process.env.NOUTIFY_USER_DATA_PATH;

  log.info("userDataPath is", userDataPath);
  if (!userDataPath) {
    log.error("User data path is not set.");
    return { success: false, error: "User data path is not set." };
  }

  const configFilePath = path.join(userDataPath, "local-repo.json");
  try {
    const fs = await import("fs/promises");

    let fileContent: string;
    try {
      await fs.access(configFilePath);
      fileContent = await fs.readFile(configFilePath, "utf-8");
    } catch {
      log.warn("Config file does not exist. Returning empty list.");
      return { success: true, data: [] as LocalRepoList };
    }

    let existingRepos: LocalRepoList = [];
    try {
      const parsedRaw = JSON.parse(fileContent);
      const hydrated = parsedRaw.map((repo: LocalRepo) => ({
        ...repo,
        createdAt: new Date(repo.createdAt),
        updatedAt: new Date(repo.updatedAt),
      }));
      existingRepos = localRepoListSchema.parse(hydrated);
    } catch {
      log.warn("Config file is corrupted or invalid. Reinitializing...");
      await fs.writeFile(configFilePath, JSON.stringify([]));
      existingRepos = [];
    }

    return { success: true, data: existingRepos };
  } catch (error) {
    log.error("Error reading local repository paths:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function setLastSelectedRepo(repoId: string) {
  const userDataPath = process.env.NOUTIFY_USER_DATA_PATH;

  log.info("userDataPath is", userDataPath);
  if (!userDataPath) {
    log.error("User data path is not set.");
    return { success: false, error: "User data path is not set." };
  }

  const configFilePath = path.join(userDataPath, "last-selected-repo.json");
  const localReposFilePath = path.join(userDataPath, "local-repo.json");

  try {
    const fs = await import("fs/promises");

    // Find the full repo object from local-repo.json
    let localRepos: LocalRepoList = [];
    try {
      await fs.access(localReposFilePath);
      const fileContent = await fs.readFile(localReposFilePath, "utf-8");
      const parsedRaw = JSON.parse(fileContent);
      const hydrated = parsedRaw.map((repo: LocalRepo) => ({
        ...repo,
        createdAt: new Date(repo.createdAt),
        updatedAt: new Date(repo.updatedAt),
      }));
      localRepos = localRepoListSchema.parse(hydrated);
    } catch (error) {
      log.error("Error reading local repositories:", error);
      return {
        success: false,
        error: "Failed to access local repositories data",
      };
    }

    // Find the repository with matching ID
    const selectedRepo = localRepos.find((repo) => repo.id === repoId);
    if (!selectedRepo) {
      log.error("Repository with ID not found:", repoId);
      return {
        success: false,
        error: "Repository not found in the local repositories list",
      };
    }

    const lastSelectedRepo = {
      ...selectedRepo,
      lastSelectedAt: new Date(),
    };

    await fs.writeFile(
      configFilePath,
      JSON.stringify(lastSelectedRepo, null, 2)
    );

    log.info("Last selected repository saved successfully:", selectedRepo.name);
    return { success: true, data: lastSelectedRepo };
  } catch (error) {
    log.error("Error saving last selected repository:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getLastSelectedRepo() {
  const userDataPath = process.env.NOUTIFY_USER_DATA_PATH;

  log.info("userDataPath is", userDataPath);
  if (!userDataPath) {
    log.error("User data path is not set.");
    return { success: false, error: "User data path is not set." };
  }

  const configFilePath = path.join(userDataPath, "last-selected-repo.json");
  try {
    const fs = await import("fs/promises");

    let fileContent: string;
    try {
      await fs.access(configFilePath);
      fileContent = await fs.readFile(configFilePath, "utf-8");
    } catch {
      log.warn("Last selected repo file does not exist. Returning null.");
      return { success: true, data: null };
    }

    const parsedRepo = JSON.parse(fileContent);
    // Hydrate date objects
    const lastSelectedRepo: LocalRepo & { lastSelectedAt: Date } = {
      ...parsedRepo,
      createdAt: new Date(parsedRepo.createdAt),
      updatedAt: new Date(parsedRepo.updatedAt),
      lastSelectedAt: new Date(parsedRepo.lastSelectedAt),
    };

    return { success: true, data: lastSelectedRepo };
  } catch (error) {
    log.error("Error reading last selected repository:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
