import {
  getLastSelectedRepo,
  getUserRepos,
  setLastSelectedRepo,
} from "@/actions/electrone";
import type { LocalRepo, LocalRepoList } from "@/actions/electrone/schema";
import { getGitDiff, getGitStatus } from "@noutify/git";
import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { FileStatusResult, StatusResult } from "simple-git";
import { toast } from "sonner";

interface GitContextType {
  allLocalRepos: LocalRepoList;
  selectedRepo: LocalRepo | null;
  setSelectedRepo: React.Dispatch<React.SetStateAction<LocalRepo | null>>;
  updateRepoList: () => Promise<void>;
  updateSelectRepo: (repoId: string) => Promise<void>;
  status: StatusResult | null;
  selectedFile: {
    meta: FileStatusResult;
    diff?: string | null;
  } | null;
  updateGitDiff: (
    repoPath: string,
    filePath: FileStatusResult
  ) => Promise<void>;
}

const GitContext = createContext<GitContextType | undefined>(undefined);

interface GitProviderProps {
  children: ReactNode;
}

export const GitProvider: React.FC<GitProviderProps> = ({ children }) => {
  const [selectedRepo, setSelectedRepo] = useState<LocalRepo | null>(null);
  const [allLocalRepos, setAllLocalRepos] = useState<LocalRepoList>([]);
  const [status, setStatus] = React.useState<StatusResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    meta: FileStatusResult;
    diff?: string | null;
  } | null>(null);

  async function updateRepoList() {
    const { data, error } = await getUserRepos();
    if (error) {
      toast.error(error);
    }
    if (data) {
      setAllLocalRepos(data);
    }
  }

  async function updateSelectRepo(repoId: string) {
    const { data, error } = await setLastSelectedRepo(repoId);

    if (error) {
      toast.error(error);
      return;
    }
    if (data) {
      setSelectedRepo(data);
      await getStatus();
    }
  }

  const getStatus = async () => {
    const gitStatus = await getGitStatus(selectedRepo?.path as string);
    if (gitStatus.success) {
      setStatus(gitStatus.data);

      // setSelectedFile({
      //   meta: gitStatus.data.files[0],
      //   diff: null,
      // });
    }
  };

  async function updateGitDiff(repoPath: string, file: FileStatusResult) {
    const data = await getGitDiff(repoPath, file.path);
    if (data.error) {
      toast.error(data.error);
    }

    if (data.success) {
      setSelectedFile({
        meta: file,
        diff: data.data,
      });
    }
  }

  async function updateLastSelectedRepo() {
    const data = await getLastSelectedRepo();

    if (data.error) {
      toast.error(data.error);
      return;
    }

    if (data && data.data) {
      setSelectedRepo(data.data);
    }
  }

  useEffect(() => {
    (async () => {
      await updateRepoList();
      await updateLastSelectedRepo();
    })();
  }, []);
  
  useEffect(() => {
    (async () => {
      if (selectedRepo) {
        await getStatus();
      }
    })();
  }, [selectedRepo]);
  

  const value: GitContextType = {
    allLocalRepos,
    selectedRepo,
    setSelectedRepo,
    updateRepoList,
    updateSelectRepo,
    status,
    updateGitDiff,
    selectedFile,
  };

  return <GitContext.Provider value={value}>{children}</GitContext.Provider>;
};

export const useGit = (): GitContextType => {
  const context = useContext(GitContext);

  if (context === undefined) {
    throw new Error("useGit must be used within a GitProvider");
  }

  return context;
};
