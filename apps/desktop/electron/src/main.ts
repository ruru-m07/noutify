import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import { getPort } from "get-port-please";
import { join } from "path";
import { spawn } from "child_process";
import type { ChildProcess } from "child_process";

let serverProcess: ChildProcess | null = null;

/**
 * @returns {BrowserWindow} The created BrowserWindow instance.
 * @throws {Error} If there is an error creating the window.
 */
const createWindow = (): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 870,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: is.dev,
    },
  });

  mainWindow.setMenuBarVisibility(false);

  // mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  //   shell.openExternal(url);
  //   return { action: "deny" };
  // });

  // mainWindow.webContents.on("will-navigate", (event, url) => {
  //   const currentURL = mainWindow.webContents.getURL();
  //   const isExternal = new URL(url).origin !== new URL(currentURL).origin;

  //   if (isExternal) {
  //     event.preventDefault();
  //     shell.openExternal(url);
  //   }
  // });

  // ? Enable key shortcuts for zooming in/out/resetting zoom.
  mainWindow.webContents.on("before-input-event", (event, input) => {
    // * Only act on non-macOS platforms (or modify as necessary for macOS)
    if (input.control && !input.alt && !input.meta) {
      // ? Zoom In: Ctrl + "=" or Ctrl + "+"
      if (input.key === "=" || input.key === "+") {
        const currentZoom = mainWindow.webContents.getZoomFactor();
        mainWindow.webContents.setZoomFactor(currentZoom + 0.1);
        event.preventDefault();
      }
      // ? Zoom Out: Ctrl + "-"
      else if (input.key === "-") {
        const currentZoom = mainWindow.webContents.getZoomFactor();
        // ! Ensure zoom factor is never less than 0.1
        const newZoom = Math.max(0.1, currentZoom - 0.1);
        mainWindow.webContents.setZoomFactor(newZoom);
        event.preventDefault();
      }
      // ? Reset Zoom: Ctrl + "0"
      else if (input.key === "0") {
        mainWindow.webContents.setZoomFactor(1);
        event.preventDefault();
      }
    }
  });

  mainWindow.on("ready-to-show", () => mainWindow.show());

  const loadURL = async () => {
    if (is.dev) {
      mainWindow.loadURL("http://localhost:3000");
    } else {
      try {
        const port = await startNextJSServer();
        if (process.env.DEBUG === "true") {
          console.log("Next.js server started on port:", port);
        }
        mainWindow.loadURL(`http://localhost:${port}`);
      } catch (error) {
        console.error("Error starting Next.js server:", error);
      }
    }
  };

  loadURL();
  return mainWindow;
};

/**
 * @returns {Promise<number>} The port number on which the Next.js server is running.
 * @throws {Error} If there is an error starting the Next.js server.
 *
 * This function starts the Next.js server in standalone mode and waits for it to be ready.
 * It uses the `get-port` library to find an available port in the range [30011, 50000].
 * The server is spawned as a child process using the `child_process` module.
 * The server's stdout and stderr streams are piped to the parent process for logging.
 */
const startNextJSServer = async (): Promise<number> => {
  try {
    const nextJSPort = await getPort({ portRange: [30011, 50000] });
    const serverPath = join(app.getAppPath(), ".next/standalone/server.js");

    if (process.env.DEBUG === "true") {
      console.log({
        nextJSPort,
        getAppPath: app.getAppPath(),
        serverPath,
      });
    }

    serverProcess = spawn("node", [serverPath], {
      shell: true,
      env: {
        ...process.env,
        PORT: nextJSPort.toString(),
        NODE_ENV: "production",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    await new Promise((resolve, reject) => {
      let resolved = false;
      serverProcess?.stdout?.on("data", (data) => {
        const output = data.toString();
        if (output.includes("Ready") || output.includes("Server started")) {
          if (!resolved) {
            resolved = true;
            resolve(null);
          }
        }
      });
      serverProcess?.stderr?.on("data", (data) => {
        console.error(data.toString());
      });
      serverProcess?.on("error", (err) => {
        reject(err);
      });
    });

    return nextJSPort;
  } catch (error) {
    console.error("Error starting Next.js server:", error);
    throw error;
  }
};

app.on("will-quit", () => {
  if (serverProcess) {
    serverProcess.kill("SIGTERM");
    serverProcess = null;
  }
});

// ? Handle Ctrl+C from terminal
process.on("SIGINT", () => {
  if (serverProcess) {
    serverProcess.kill("SIGTERM");
  }
  app.quit();
});

ipcMain.handle("open-external", async (_event, url: string) => {
  await shell.openExternal(url);
});

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("ping", () => console.log("pong"));
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
