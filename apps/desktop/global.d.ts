/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: any[]) => void;
        on: (
          channel: string,
          listener: (event: any, ...args: any[]) => void
        ) => void;
      };
      openExternal: (url: string) => Promise<void>;
      selectFolder: () => Promise<any>;
    };
  }
}
