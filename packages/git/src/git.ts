"use server";

import { type StatusResult } from "simple-git";
import simpleGit from "simple-git";
import type { GitResult } from "./type";

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

    return { success: true, data: serializableStatus as StatusResult };
  } catch (error) {
    console.error("[Git Error]:", error);
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

    return { success: true, data: serializableStatus as StatusResult };
  } catch (error) {
    console.error("[Git Error]:", error);
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

    return { success: true, data: serializableStatus as StatusResult };
  } catch (error) {
    console.error("[Git Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}
