"use client";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

// Rest of the component remains the same, but replace the highlightCode function with:

const highlightCode = (code: string, language: string) => {
  try {
    if (language === "diff") {
      return hljs.highlight(code, { language }).value;
    }
    return hljs.highlight(code, { language }).value;
  } catch (error) {
    console.error("Error highlighting code:", error);
    return code;
  }
};

// And remove the highlighter state and initialization
