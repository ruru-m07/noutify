"use server";

import { type StatusResult } from "simple-git";
import simpleGit from "simple-git";
import type { GitResult } from "./type";
import { log } from "./utils/logger";

/**
 * ? A server-side cache to store SimpleGit instances by `baseDir` (IDK if it will works or not)
 */
const gitInstanceCache = new Map<string, ReturnType<typeof simpleGit>>();

/**
 * @param baseDir - The base directory of the git repository.
 * @returns The SimpleGit instance for the specified base directory.
 */
function getGitInstance(baseDir: string) {
  if (!gitInstanceCache.has(baseDir)) {
    const instance = simpleGit({
      baseDir,
      binary: "git",
      maxConcurrentProcesses: 6,
    });
    gitInstanceCache.set(baseDir, instance);
  }
  return gitInstanceCache.get(baseDir)!;
}

// ! fukin helper
function serializeToPlainObject<T>(obj: T): Record<string, any> {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * ? Get the git status of the repository.
 */
export async function getGitStatus(
  baseDir: string
): Promise<GitResult<StatusResult>> {
  try {
    const git = getGitInstance(baseDir);
    const statusResult = await git.status();

    const serializableStatus = serializeToPlainObject(statusResult);
    log.info("Git status success");
    return { success: true, data: serializableStatus as StatusResult };
  } catch (error) {
    log.error("Failed to get git status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

export async function addStaged(
  baseDir: string,
  files: string
): Promise<GitResult<StatusResult>> {
  try {
    const git = getGitInstance(baseDir);
    const statusResult = await git.add(files);

    const serializableStatus = serializeToPlainObject(statusResult);

    log.info("Files added successfully");
    return { success: true, data: serializableStatus as StatusResult };
  } catch (error) {
    log.error("Failed to add files:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

export async function removeStaged(
  baseDir: string,
  files: string
): Promise<GitResult<StatusResult>> {
  try {
    const git = getGitInstance(baseDir);
    const statusResult = await git.reset([files]);

    const serializableStatus = serializeToPlainObject(statusResult);

    log.info("Files removed successfully");
    return { success: true, data: serializableStatus as StatusResult };
  } catch (error) {
    log.error("Failed to remove files:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

export async function getRemoteOrigin(
  baseDir: string
): Promise<GitResult<string>> {
  try {
    const git = getGitInstance(baseDir);
    const remoteUrl = await git.remote(["get-url", "origin"]);
    log.info("Remote origin fetched successfully");
    return { success: true, data: remoteUrl as string };
  } catch (error) {
    log.error("Failed to get remote origin:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

export async function getGitDiff(
  baseDir: string,
  files: string
): Promise<GitResult<string>> {
  try {
    console.log({
      baseDir,
      files,
    })
    
    const git = getGitInstance(baseDir);
    const diffResult = await git.diff([files]);
    log.info("Git diff fetched successfully");
    console.log({
      diffResult,
    });

    return { success: true, data: diffResult as string };
  } catch (error) {
    log.error("Failed to get git diff:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}
