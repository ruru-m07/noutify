export type GitSuccess<T> = {
  success: true;
  data: T;
  error?: undefined;
};

export type GitFailure = {
  success: false;
  data: null;
  error: string;
};

export type GitResult<T> = Promise<GitSuccess<T> | GitFailure>;
