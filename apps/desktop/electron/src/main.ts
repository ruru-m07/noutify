import { is } from "@electron-toolkit/utils";
import {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  nativeImage,
  Tray,
  Menu,
} from "electron";
import { getPort } from "get-port-please";
import { join } from "path";
import { spawn } from "child_process";
import type { ChildProcess } from "child_process";

let tray: Tray | null = null;
let serverProcess: ChildProcess | null = null;
let mainWindow: BrowserWindow | null = null;
let isQuiting = false;

const createWindow = (): BrowserWindow => {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 870,
    show: false,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: is.dev,
    },
  });

  mainWindow.setMenuBarVisibility(false);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.control && !input.alt && !input.meta && mainWindow) {
      if (input.key === "=" || input.key === "+") {
        const currentZoom = mainWindow.webContents.getZoomFactor();
        mainWindow.webContents.setZoomFactor(currentZoom + 0.1);
        event.preventDefault();
      } else if (input.key === "-") {
        const currentZoom = mainWindow.webContents.getZoomFactor();
        const newZoom = Math.max(0.1, currentZoom - 0.1);
        mainWindow.webContents.setZoomFactor(newZoom);
        event.preventDefault();
      } else if (input.key === "0") {
        mainWindow.webContents.setZoomFactor(1);
        event.preventDefault();
      }
    }
  });

  mainWindow.on("ready-to-show", () => mainWindow?.show());

  mainWindow.on("close", (event) => {
    if (!isQuiting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  const loadURL = async () => {
    if (is.dev) {
      mainWindow!.loadURL("http://localhost:3000");
    } else {
      try {
        const port = await startNextJSServer();
        if (process.env.DEBUG === "true") {
          console.log("Next.js server started on port:", port);
        }
        mainWindow!.loadURL(`http://localhost:${port}`);
      } catch (error) {
        console.error("Error starting Next.js server:", error);
      }
    }
  };

  loadURL();
  return mainWindow!;
};

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
        AUTH_SECRET:
          "I58r485cKM9O1Da1v8CqDTDj9Mn7mwzurNowiFvKK47OCnn4m9jKKNHgbFo=",
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

process.on("SIGINT", () => {
  isQuiting = true;
  if (serverProcess) {
    serverProcess.kill("SIGTERM");
  }
  app.quit();
});

ipcMain.handle("open-external", async (_event, url: string) => {
  console.log("Opening external:", url);
  await shell.openExternal(url);
});

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("ping", () => console.log("pong"));
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else mainWindow?.show();
  });

  const iconPath = join(__dirname, "../public/icons/linux/64x64.png");
  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon);

  tray.setToolTip("Your App Name");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        mainWindow?.show();
      },
    },
    {
      label: "Quit",
      click: () => {
        isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    if (mainWindow?.isVisible()) {
      // mainWindow.hide();
      mainWindow?.webContents.send("tray-click");
    } else {
      mainWindow?.show();
    }
  });
});

app.on("window-all-closed", () => {
  // ! Do not quit, keep in tray
  if (process.platform !== "darwin") {
    // ? On Linux/Windows keep running in tray
    // ? macOS has its own "keep-alive" model
  }
});
