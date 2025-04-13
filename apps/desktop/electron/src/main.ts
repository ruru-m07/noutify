import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain } from "electron";
import { getPort } from "get-port-please";
import { join } from "path";
import { spawn } from "child_process";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 870,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  mainWindow.setMenuBarVisibility(false);

  mainWindow.on("ready-to-show", () => mainWindow.show());

  const loadURL = async () => {
    if (is.dev) {
      mainWindow.loadURL("http://localhost:3000");
    } else {
      try {
        const port = await startNextJSServer();
        console.log("Next.js server started on port:", port);
        mainWindow.loadURL(`http://localhost:${port}`);
      } catch (error) {
        console.error("Error starting Next.js server:", error);
      }
    }
  };

  loadURL();
  return mainWindow;
};

const startNextJSServer = async () => {
  try {
    const nextJSPort = await getPort({ portRange: [30011, 50000] });
    const serverPath = join(app.getAppPath(), ".next/standalone/server.js");

    console.log({
      serverPath,
    });

    const serverProcess = spawn("node", [serverPath], {
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
      serverProcess.stdout.on("data", (data) => {
        const output = data.toString();
        if (output.includes("Ready") || output.includes("Server started")) {
          if (!resolved) {
            resolved = true;
            resolve(null);
          }
        }
      });
      serverProcess.stderr.on("data", (data) => {
        console.error(data.toString());
      });
      serverProcess.on("error", (err) => {
        reject(err);
      });
    });

    return nextJSPort;
  } catch (error) {
    console.error("Error starting Next.js server:", error);
    throw error;
  }
};

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
