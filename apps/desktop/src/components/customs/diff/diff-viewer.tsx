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
import { useGit } from "@/context/git";

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

  const { selectedFile } = useGit();

  useEffect(() => {
    // Initialize highlight.js
    hljs.configure({
      languages: ["typescript", "javascript", "diff"],
      //   languages: ["tsx", "diff"],
    });
  }, []);

  useEffect(() => {
    if (selectedFile?.diff) {
      setDiffText(selectedFile.diff);
    }
  }, [selectedFile]);

  useEffect(() => {
    console.log({
      selectedFile,
      diffText,
    });

    if (diffText) {
      parseDiff(diffText);
    }
  }, [diffText]);

  useEffect(() => {
    // if (diffText) {
    //   parseDiff(diffText);
    // } else if (exampleDiff) {
    //   setDiffText(exampleDiff);
    //   parseDiff(exampleDiff);
    // }

    if (!selectedFile?.diff) {
      return;
    }
    console.log({
      selectedFile,
      diffText,
    });
    if (diffText) {
      parseDiff(diffText);
    } else if (selectedFile?.diff) {
      setDiffText(selectedFile?.diff);
      parseDiff(selectedFile?.diff);
    }
  }, [diffText, selectedFile]);

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
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {parsedDiff.map((file, fileIndex) => (
            <Card
              key={fileIndex}
              className="overflow-hidden rounded-none border-none"
            >
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
