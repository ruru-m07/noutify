"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@noutify/ui/components/tabs";
import { Textarea } from "@noutify/ui/components/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@noutify/ui/components/card";
import { Loader2, Copy, Check } from "lucide-react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
// import "highlight.js/styles/github.css";
import { Button } from "@noutify/ui/components/button";

// Define CSS variables for diff colors
// :root {
//   --diff-added-bg: rgba(74, 124, 77, 0.3);
//   --diff-removed-bg: rgba(124, 74, 74, 0.3);
//   --diff-header-bg: rgba(80, 92, 109, 0.3);
//   --diff-hover-bg: rgba(100, 100, 100, 0.2);
//   --diff-border-color: rgba(80, 92, 109, 0.5);
// }

interface DiffLine {
  type: "added" | "removed" | "context" | "info" | "header";
  content: string;
  lineNumberOld?: number;
  lineNumberNew?: number;
}

interface DiffFile {
  oldFile: string;
  newFile: string;
  lines: DiffLine[];
  metaData: string[]; // Store metadata lines separately
}

export function DiffViewer() {
  const [diffText, setDiffText] = useState<string>("");
  const [parsedDiff, setParsedDiff] = useState<DiffFile[]>([]);
  const [viewMode, setViewMode] = useState<"split" | "unified">("unified");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Example diff for demonstration
  //   const exampleDiff = `diff --git a/apps/desktop/electron/src/main.ts b/apps/desktop/electron/src/main.ts
  // index fbc3b16..d78c711 100644
  // --- a/apps/desktop/electron/src/main.ts
  // +++ b/apps/desktop/electron/src/main.ts
  // @@ -7,6 +7,7 @@ import {
  //    nativeImage,
  //    Tray,
  //    Menu,
  // +  dialog,
  //  } from "electron";
  //  import { getPort } from "get-port-please";
  //  import { join } from "path";
  // @@ -196,6 +197,19 @@ app.whenReady().then(() => {
  //    createWindow();

  //    ipcMain.on("ping", () => console.log("pong"));
  // +
  // +  ipcMain.handle("select-folder", async () => {
  // +    const result = await dialog.showOpenDialog({
  // +      properties: ["openDirectory"],
  // +    });
  // +
  // +    if (result.canceled || result.filePaths.length === 0) {
  // +      return null;
  // +    }
  // +
  // +    return result.filePaths[0];
  // +  });
  // +
  //    app.on("activate", () => {
  //      if (BrowserWindow.getAllWindows().length === 0) createWindow();
  //      else mainWindow?.show();`;
  //   const exampleDiff = `diff --git a/apps/desktop/src/actions/storeTempCode.ts b/apps/desktop/src/actions/storeTempCode.ts
  // index 4e898b7..082b965 100644
  // --- a/apps/desktop/src/actions/storeTempCode.ts
  // +++ b/apps/desktop/src/actions/storeTempCode.ts
  // @@ -1,6 +1,6 @@
  //  "use server";

  // -import fs from "fs";
  // +import { promises as fs } from "fs";

  //  import { NOUTIFY_DEBUG } from "@/env";
  //  import { TEMP_CODE_FILE } from "@/lib/constant";
  // @@ -8,7 +8,7 @@ import { TEMP_CODE_FILE } from "@/lib/constant";
  //  export async function storeTempCode() {
  //    const code = Math.random().toString(36).substring(2, 8);

  // -  fs.writeFileSync(TEMP_CODE_FILE, JSON.stringify({ code }));
  // +  await fs.writeFile(TEMP_CODE_FILE, JSON.stringify({ code }));

  //    if (NOUTIFY_DEBUG) {
  //      console.log("TEMP_CODE_FILE", TEMP_CODE_FILE);`;
  const exampleDiff = `diff --git a/apps/desktop/src/app/auth/verify-code/page.tsx b/apps/desktop/src/app/auth/verify-code/page.tsx
index 95fb60e..ce15e65 100644
--- a/apps/desktop/src/app/auth/verify-code/page.tsx
+++ b/apps/desktop/src/app/auth/verify-code/page.tsx
@@ -1,200 +1,240 @@
 "use client";
 
-import React, { useId } from "react";
-
-import type { SlotProps } from "input-otp";
-import { OTPInput } from "input-otp";
+import React from "react";
 
+import { CheckIcon, CircleCheckIcon, XIcon } from "lucide-react";
+import { Muted } from "@/components/typography";
 import { Label } from "@noutify/ui/components/label";
-import { cn } from "@noutify/ui/lib/utils";
-import { H4, Muted } from "@/components/typography";
 import { Button } from "@noutify/ui/components/button";
+import { getUpStreamURL } from "@/actions/getUpStream";
+import { getServerPort } from "@/actions/getServerPort";
 
-import { toast, Toaster } from "sonner";
-import { CircleCheckIcon, LoaderCircleIcon, XIcon } from "lucide-react";
+import { Toaster, toast } from "sonner";
+import { storeTempCode } from "@/actions/storeTempCode";
+import { poolTempUser } from "@/actions/poolTempUser";
 import { createSession } from "@/actions/createSession";
 import { useRouter } from "next/navigation";
-import { getUpStreamURL } from "@/actions/getUpStream";
 
 export default function LoginPage() {
-  const [deviceId, setDeviceId] = React.useState<string | null>(null);
-  const [error, setError] = React.useState<string | null>(null);
-  const [otp, setOtp] = React.useState<string | null>(null);
-  const [loading, setLoading] = React.useState(false);
+  const router = useRouter();
+  const [code, setCode] = React.useState<string | null>(null);
+
+  const [copied, setCopied] = React.useState(false);
+  const [isPolling, setIsPolling] = React.useState(false);
+  const [isAuthorized, setIsAuthorized] = React.useState(false);
   const [streamURL, setStreamURL] = React.useState<string | null>(null);
+  const [port, setPort] = React.useState<string | null>(null);
 
-  const router = useRouter();
+  const pollingRef = React.useRef(false);
+  const pollingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
 
   React.useEffect(() => {
-    (async () => {
+    const fetchInitialData = async () => {
       try {
-        const response = await fetch("/api/fingerprint");
-        if (!response.ok) {
-          throw new Error("Network response was not ok");
+        const [streamURLResult, portResult, codeResult] = await Promise.all([
+          getUpStreamURL(),
+          getServerPort(),
+          storeTempCode(),
+        ]);
+
+        setStreamURL(streamURLResult);
+        setPort(portResult.port as string);
+        setCode(codeResult.code);
+
+        if (codeResult.code) {
+          setIsPolling(true);
+          pollingRef.current = true;
+          startPolling();
         }
-        const data = await response.text();
-        setDeviceId(data);
       } catch (error) {
-        console.error("Error fetching device ID:", error);
+        console.error("Error fetching initial data:", error);
       }
-    })();
-    (async () => {
-      const streamURL = await getUpStreamURL();
-      setStreamURL(streamURL);
-    })();
-  }, []);
+    };
 
-  const handelOnSubmit = async (otp: string) => {
-    setLoading(true);
-    setError(null);
+    fetchInitialData();
 
-    try {
-      if (!deviceId) {
-        console.error("Device ID is null");
-        return;
+    return () => {
+      if (pollingIntervalRef.current) {
+        clearInterval(pollingIntervalRef.current);
+        pollingIntervalRef.current = null;
       }
+      pollingRef.current = false;
+      setIsPolling(false);
+    };
+    // eslint-disable-next-line react-hooks/exhaustive-deps
+  }, []);
 
-      const response = await fetch(\`\${streamURL}/api/auth/verify-code\`, {
-        method: "POST",
-        headers: {
-          "Content-Type": "application/json",
-        },
-        body: JSON.stringify({
-          deviceId: deviceId,
-          code: otp,
-        }),
-      });
-
-      const jsonResponse: {
-        success: boolean;
-        error?: string;
-        data?: unknown;
-      } = await response.json();
-
-      if (jsonResponse.error) {
-        setError(jsonResponse.error);
-        return;
-      }
+  const startPolling = () => {
+    if (pollingIntervalRef.current) {
+      clearInterval(pollingIntervalRef.current);
+    }
 
-      if (!jsonResponse.success) {
-        setError("Invalid code, device ID or might be expired");
+    pollingIntervalRef.current = setInterval(async () => {
+      if (!pollingRef.current) {
+        if (pollingIntervalRef.current) {
+          clearInterval(pollingIntervalRef.current);
+          pollingIntervalRef.current = null;
+        }
         return;
       }
 
-      if (jsonResponse.data) {
-        console.log({
-          response,
-          jsonResponse,
-        });
-        const { success } = await createSession({
-          // session: (jsonResponse.data as { session?: unknown })?.session || {},
-          code: (jsonResponse.data as { code?: string }).code || "",
-          deviceId: deviceId,
-        });
-        if (!success) {
-          setError("Failed to create session");
-          return;
+      try {
+        const user = await poolTempUser();
+
+        if (user && user.success === true) {
+          if (pollingIntervalRef.current) {
+            clearInterval(pollingIntervalRef.current);
+            pollingIntervalRef.current = null;
+          }
+          pollingRef.current = false;
+          setIsPolling(false);
+          setIsAuthorized(true);
+
+          if (user.user.user) {
+            await createSession({ user: user.user.user });
+            setTimeout(() => {
+              router.push("/auth/token");
+            }, 500);
+          }
         }
-
-        router.push("/");
+      } catch (error) {
+        console.error("Error polling user:", error);
       }
-    } catch (error) {
-      console.error("Error authorizing device:", error);
-    } finally {
-      setLoading(false);
+    }, 1000);
+  };
+
+  const copyToClipboard = () => {
+    if (code) {
+      navigator.clipboard.writeText(code).then(() => {
+        setCopied(true);
+        setTimeout(() => setCopied(false), 2000);
+      });
     }
   };
 
-  const id = useId();
+  const firstPart = code?.slice(0, 3);
+  const secondPart = code?.slice(3);
 
   return (
-    <>
-      <div className="flex flex-col items-center justify-center h-screen">
-        <div className="items-center justify-center border bg-accent/50 text-card-foreground shadow w-96 p-4 gap-4 flex flex-col rounded-3xl">
-          <H4>Enter your verification code</H4>
-          <div className="*:not-first:mt-2">
-            <OTPInput
-              id={id}
-              containerClassName="flex items-center gap-3 has-disabled:opacity-50"
-              maxLength={6}
-              render={({ slots }) => (
-                <>
-                  <div className="flex gap-3">
-                    {slots.slice(0, 3).map((slot, idx) => (
-                      <Slot key={idx} {...slot} />
-                    ))}
-                  </div>
-                  <div className="h-1 w-4 bg-border mx-1 rounded-full"></div>
-                  <div className="flex gap-3">
-                    {slots.slice(3).map((slot, idx) => (
-                      <Slot key={idx} {...slot} />
-                    ))}
-                  </div>
-                </>
-              )}
-              onChange={(newValue) => {
-                setOtp(newValue);
-              }}
-            />
+    <div className="flex flex-col items-center justify-center h-screen">
+      <div className="border bg-accent/50 text-card-foreground shadow p-5 gap-7 flex flex-col rounded-3xl justify-center items-center">
+        <h4 className="text-xl font-semibold text-primary">
+          Authorize device via web app.
+        </h4>
+
+        {isPolling && !isAuthorized && (
+          <div className="flex items-center gap-2">
+            <span className="text-lg text-muted-foreground">
+              Waiting for authorization...
+            </span>
+            <svg
+              className="h-4 w-4 text-emerald-700 scale-125"
+              xmlns="http://www.w3.org/2000/svg"
+              viewBox="0 0 24 24"
+            >
+              <circle
+                className="opacity-25"
+                cx="12"
+                cy="12"
+                r="10"
+                fill="none"
+                strokeWidth="4"
+                stroke="currentColor"
+              />
+              <path
+                className="animate-pulse"
+                fill="currentColor"
+                d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
+              />
+            </svg>
+          </div>
+        )}
+        <div
+          className="rounded-xl bg-card p-6 border shadow-sm relative cursor-pointer group"
+          onClick={copyToClipboard}
+        >
+          <div className="flex items-center justify-center gap-2">
+            {firstPart?.split("").map((digit, index) => (
+              <div
+                key={\`first-$\{index}\`}
+                className="flex px-6 items-center justify-center w-10 h-12 rounded-md bg-accent/50 border text-3xl font-bold text-primary"
+              >
+                {digit}
+              </div>
+            ))}
+
+            <div className="h-1 w-4 bg-border mx-1 rounded-full"></div>
+
+            {secondPart?.split("").map((digit, index) => (
+              <div
+                key={\`second-\${index}\`}
+                className="flex px-6 items-center justify-center w-10 h-12 rounded-md bg-accent/50 border text-3xl font-bold text-primary"
+              >
+                {digit}
+              </div>
+            ))}
           </div>
-          <Button
-            className="w-full"
-            disabled={otp?.length !== 6 || loading}
-            onClick={() => otp && handelOnSubmit(otp)}
+
+          <div
+            className={\`absolute -top-2 -right-2 transition-opacity duration-200 ${copied ? "opacity-100" : "opacity-0"}\`}
           >
-            {loading && (
-              <LoaderCircleIcon
-                className="-ms-1 animate-spin mr-2"
-                size={16}
-                aria-hidden="true"
-              />
-            )}
-            Authorize Device
-          </Button>
-          {error && (
-            <div className="w-full mx-2 rounded-md border border-destructive bg-destructive/15 p-2 text-sm text-destructive flex justify-center items-center">
-              {error}
+            <div className="bg-green-950 border border-green-700 text-green-700 text-xs rounded-full px-2 py-1 flex items-center">
+              <CheckIcon className="h-3 w-3 mr-1" />
+              Copied
             </div>
-          )}
-          <Muted>
+          </div>
+
+          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
+            <span className="text-xs font-medium text-primary/70">
+              Click to copy
+            </span>
+          </div>
+        </div>
+        {isAuthorized && (
+          <div className="text-sm text-emerald-700">Authorized successfully!</div>
+        )}
+        <div className="flex flex-col items-center gap-1">
+          <Muted className="text-sm text-muted-foreground">
             <Label
-              htmlFor={id}
+              htmlFor="deviceId"
               className="text-muted-foreground text-sm text-center"
             >
               Can&apos;t open link?{" "}
               <span
                 onClick={() => {
-                  window.navigator.clipboard.writeText(
-                    \`\${streamURL}/auth/device?deviceId=\${deviceId}\`
-                  );
-                  toast.custom((t) => (
-                    <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
-                      <div className="flex gap-2">
-                        <div className="flex grow gap-3">
-                          <CircleCheckIcon
-                            className="mt-0.5 shrink-0 text-emerald-500"
-                            size={16}
-                            aria-hidden="true"
-                          />
-                          <div className="flex grow justify-between gap-12">
-                            <p className="text-sm">Copied to clipboard!</p>
+                  if (streamURL && port) {
+                    window.navigator.clipboard.writeText(
+                      \`\${streamURL}/auth/device?port=\${port}\`
+                    );
+                    toast.custom((t) => (
+                      <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
+                        <div className="flex gap-2">
+                          <div className="flex grow gap-3">
+                            <CircleCheckIcon
+                              className="mt-0.5 shrink-0 text-emerald-500"
+                              size={16}
+                              aria-hidden="true"
+                            />
+                            <div className="flex grow justify-between gap-12">
+                              <p className="text-sm">Copied to clipboard!</p>
+                            </div>
                           </div>
+                          <Button
+                            variant="ghost"
+                            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
+                            onClick={() => toast.dismiss(t)}
+                            aria-label="Close banner"
+                          >
+                            <XIcon
+                              size={16}
+                              className="opacity-60 transition-opacity group-hover:opacity-100"
+                              aria-hidden="true"
+                            />
+                          </Button>
                         </div>
-                        <Button
-                          variant="ghost"
-                          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
-                          onClick={() => toast.dismiss(t)}
-                          aria-label="Close banner"
-                        >
-                          <XIcon
-                            size={16}
-                            className="opacity-60 transition-opacity group-hover:opacity-100"
-                            aria-hidden="true"
-                          />
-                        </Button>
                       </div>
-                    </div>
-                  ));
+                    ));
+                  }
                 }}
                 className="underline cursor-pointer"
               >
@@ -203,21 +243,8 @@ export default function LoginPage() {
             </Label>
           </Muted>
         </div>
-        <Toaster />
       </div>
-    </>
-  );
-}
-
-function Slot(props: SlotProps) {
-  return (
-    <div
-      className={cn(
-        "border-input bg-background text-foreground relative -ms-px flex size-9 items-center justify-center border font-medium shadow-xs transition-[color,box-shadow] first:ms-0 first:rounded-s-md last:rounded-e-md",
-        { "border-ring ring-ring/50 z-10 ring-[3px]": props.isActive }
-      )}
-    >
-      {props.char !== null && <div>{props.char}</div>}
+      <Toaster />
     </div>
   );
 }
`;

  useEffect(() => {
    // Initialize highlight.js
    hljs.configure({
        languages: ["typescript", "javascript", "diff"],
    //   languages: ["tsx", "diff"],

    });
  }, []);

  useEffect(() => {
    if (diffText) {
      parseDiff(diffText);
    } else if (exampleDiff) {
      setDiffText(exampleDiff);
      parseDiff(exampleDiff);
    }
  }, [diffText]);

  const parseDiff = (text: string) => {
    setIsLoading(true);

    try {
      const lines = text.split("\n");
      const files: DiffFile[] = [];
      let currentFile: DiffFile | null = null;
      let oldLineNumber = 0;
      let newLineNumber = 0;
      let inMetaData = true; // Flag to track if we're still in the metadata section

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // File header
        if (line.startsWith("diff --git")) {
          if (currentFile) {
            files.push(currentFile);
          }

          const [, oldFile, newFile] = line.match(
            /diff --git a\/(.*) b\/(.*)/
          ) || [null, "", ""];

          currentFile = {
            oldFile,
            newFile,
            lines: [],
            metaData: [line],
          };

          oldLineNumber = 0;
          newLineNumber = 0;
          inMetaData = true;
        }
        // File metadata
        else if (
          line.startsWith("index ") ||
          line.startsWith("---") ||
          line.startsWith("+++")
        ) {
          if (currentFile) {
            currentFile.metaData.push(line);
          }
        }
        // Chunk header
        else if (line.startsWith("@@")) {
          if (currentFile) {
            inMetaData = false; // End of metadata section
            const match = line.match(/@@ -(\d+),\d+ \+(\d+),\d+ @@/);
            if (match) {
              oldLineNumber = Number.parseInt(match[1], 10);
              newLineNumber = Number.parseInt(match[2], 10);

              currentFile.lines.push({
                type: "header",
                content: line,
              });
            }
          }
        }
        // Added line
        else if (line.startsWith("+")) {
          if (currentFile && !inMetaData) {
            currentFile.lines.push({
              type: "added",
              content: line.substring(1),
              lineNumberNew: newLineNumber++,
            });
          }
        }
        // Removed line
        else if (line.startsWith("-")) {
          if (currentFile && !inMetaData) {
            currentFile.lines.push({
              type: "removed",
              content: line.substring(1),
              lineNumberOld: oldLineNumber++,
            });
          }
        }
        // Context line
        else {
          if (currentFile && !inMetaData) {
            currentFile.lines.push({
              type: "context",
              content: line.startsWith(" ") ? line.substring(1) : line,
              lineNumberOld: oldLineNumber++,
              lineNumberNew: newLineNumber++,
            });
          }
        }
      }

      if (currentFile) {
        files.push(currentFile);
      }

      setParsedDiff(files);
    } catch (error) {
      console.error("Error parsing diff:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(diffText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightCode = (code: string, language: string) => {
    try {
      const highlighted = hljs.highlight(code, { language }).value;
      return highlighted;
    } catch (error) {
      console.error("Error highlighting code:", error);
      return code;
    }
  };

  const renderUnifiedView = (file: DiffFile) => {
    return (
      <div className="overflow-x-auto">
        {/* Render metadata section */}
        {/* <div className="font-mono text-xs p-2 diff-header whitespace-pre">
          {file.metaData.map((line, index) => (
            <div key={`meta-${index}`}>{line}</div>
          ))}
        </div> */}

        <table className="w-full border-collapse">
          <tbody>
            {file.lines.map((line, index) => {
              let bgClass = "";
              if (line.type === "added") bgClass = "diff-added";
              if (line.type === "removed") bgClass = "diff-removed";
              if (line.type === "header") bgClass = "diff-header";

              return (
                <tr key={index} className={`${bgClass} diff-hover`}>
                  <td className="text-center px-1 w-12 text-xs text-muted-foreground select-none border-r diff-border">
                    {line.lineNumberOld || ""}
                  </td>
                  <td className="text-center px-1 w-12 text-xs text-muted-foreground select-none border-r diff-border">
                    {line.lineNumberNew || ""}
                  </td>
                  <td className="pl-2 font-mono whitespace-pre">
                    {line.type === "added" && (
                      <span className="text-emerald-700">+</span>
                    )}
                    {line.type === "removed" && (
                      <span className="text-red-500">-</span>
                    )}
                    {line.type === "context" && (
                      <span className="text-muted-foreground"> </span>
                    )}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightCode(line.content, "typescript"),
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSplitView = (file: DiffFile) => {
    // Group lines for side-by-side view
    const groupedLines: Array<{
      left: DiffLine | null;
      right: DiffLine | null;
    }> = [];

    for (let i = 0; i < file.lines.length; i++) {
      const line = file.lines[i];

      if (line.type === "header") {
        groupedLines.push({
          left: line,
          right: null,
        });
        continue;
      }

      if (line.type === "context") {
        groupedLines.push({
          left: line,
          right: line,
        });
      } else if (line.type === "removed") {
        // Look ahead for an 'added' line to pair with
        const nextLine = i + 1 < file.lines.length ? file.lines[i + 1] : null;

        if (nextLine && nextLine.type === "added") {
          groupedLines.push({
            left: line,
            right: nextLine,
          });
          i++; // Skip the next line since we've used it
        } else {
          groupedLines.push({
            left: line,
            right: null,
          });
        }
      } else if (line.type === "added") {
        groupedLines.push({
          left: null,
          right: line,
        });
      }
    }

    return (
      <div className="overflow-x-auto">
        {/* Render metadata section */}
        {/* <div className="font-mono text-xs p-2 diff-header whitespace-pre">
          {file.metaData.map((line, index) => (
            <div key={`meta-${index}`}>{line}</div>
          ))}
        </div> */}

        <div className="flex">
          <table className="w-full border-collapse">
            <tbody>
              {groupedLines.map((group, index) => {
                const leftBgClass =
                  group.left?.type === "removed"
                    ? "diff-removed"
                    : group.left?.type === "header"
                      ? "diff-header"
                      : "";

                const rightBgClass =
                  group.right?.type === "added" ? "diff-added" : "";

                // For header lines, span both columns
                if (group.left?.type === "header" && !group.right) {
                  return (
                    <tr key={index} className={`${leftBgClass} diff-hover`}>
                      <td colSpan={4} className="pl-2 font-mono whitespace-pre">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightCode(
                              group.left?.content || "",
                              "diff"
                            ),
                          }}
                        />
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={index} className="">
                    {/* Left side */}
                    <td
                      className={`text-right pr-2 w-12 text-xs text-muted-foreground select-none border-r ${leftBgClass}`}
                    >
                      {group.left?.lineNumberOld || ""}
                    </td>
                    <td
                      // className={`pl-2 font-mono whitespace-pre border-r ${leftBgClass} w-full`}
                      className={`pl-2 font-mono whitespace-pre border-r ${leftBgClass} max-w-[calc(100vw-65vw)]`}
                    >
                      {group.left && (
                        <>
                          {group.left.type === "removed" && (
                            <span className="text-red-500">-</span>
                          )}
                          {group.left.type === "context" && (
                            <span className="text-muted-foreground"> </span>
                          )}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightCode(
                                group.left.content,
                                "typescript"
                              ),
                            }}
                          />
                        </>
                      )}
                    </td>

                    {/* Right side */}
                    <td
                      className={`text-right pr-2 w-12 text-xs text-muted-foreground select-none border-r ${rightBgClass}`}
                    >
                      {group.right?.lineNumberNew || ""}
                    </td>
                    <td
                      className={`pl-2 font-mono whitespace-pre ${rightBgClass} w-full`}
                    >
                      {group.right && (
                        <>
                          {group.right.type === "added" && (
                            <span className="text-emerald-700">+</span>
                          )}
                          {group.right.type === "context" && (
                            <span className="text-muted-foreground"> </span>
                          )}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightCode(
                                group.right.content,
                                "typescript"
                              ),
                            }}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Add the CSS variables */}
      {/* <style dangerouslySetInnerHTML={{ __html: diffStyles }} /> */}

      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle>Git Diff Viewer</CardTitle>
          <CardDescription>
            Paste a git diff to visualize it in side-by-side or unified view
            with syntax highlighting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Tabs
              defaultValue="split"
              className="w-[400px]"
              onValueChange={(value) =>
                setViewMode(value as "split" | "unified")
              }
            >
              <TabsList>
                <TabsTrigger value="split">Side by Side</TabsTrigger>
                <TabsTrigger value="unified">Unified</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" onClick={handleCopyClick}>
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <Textarea
            placeholder="Paste your git diff here..."
            className="font-mono text-sm mb-4 h-32"
            value={diffText}
            onChange={(e) => setDiffText(e.target.value)}
          />
        </CardContent>
      </Card> */}

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {parsedDiff.map((file, fileIndex) => (
            <Card key={fileIndex} className="overflow-hidden rounded-none border-none">
              {/* <CardHeader className="py-3">
                <CardTitle className="text-sm font-mono">
                  {file.oldFile === file.newFile
                    ? file.newFile
                    : `${file.oldFile} → ${file.newFile}`}
                </CardTitle>
              </CardHeader> */}
              <CardContent className="p-0">
                <div className="text-slate-200 overflow-hidden">
                  {viewMode === "split"
                    ? renderSplitView(file)
                    : renderUnifiedView(file)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
