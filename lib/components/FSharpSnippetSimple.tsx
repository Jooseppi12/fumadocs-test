"use client";

import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

export function FSharpSnippetSimple({ snippet, liveSnippetHeight = "600" }: Props) {
  const [fsCode, setFsCode] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    fetch(`/snippets/${snippet}/code/Client.fs`)
      .then((res) => res.text())
      .then((code) => setFsCode(extractBetweenMarkers(code)))
      .catch((err) => console.error("Error loading F# code:", err));
  }, [snippet]);

  if (!resolvedTheme) return null;

  return (
    <Tabs items={["F#", "Result"]}>
      <Tab value="F#">
        <SyntaxHighlighter
          language="fsharp"
          style={resolvedTheme === "dark" ? vscDarkPlus : oneLight}
          customStyle={codeBlockStyle}
        >
          {fsCode ?? "Loading..."}
        </SyntaxHighlighter>
      </Tab>
      <Tab value="Result">
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
          <a
            href={`/snippets/${snippet}/wwwroot/index.html`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.875rem",
              padding: "0.25rem 0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              textDecoration: "none",
              backgroundColor: "#f8f8f8",
              color: "#333",
            }}
          >
            Open in new tab ↗
          </a>
        </div>
        <iframe
          src={`/snippets/${snippet}/wwwroot/index.html`}
          style={{
            width: "100%",
            height: `${liveSnippetHeight}px`,
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
      </Tab>
    </Tabs>
  );
}

const codeBlockStyle: React.CSSProperties = {
  overflowY: "auto",
  maxHeight: "600px",
  padding: "1rem",
  borderRadius: "6px",
};

function extractBetweenMarkers(fileContent: string): string {
  const startMarker = "// <FUMADOCS BEGIN>";
  const endMarker = "// <FUMADOCS END>";
  const startIndex = fileContent.indexOf(startMarker);
  const endIndex = fileContent.indexOf(endMarker, startIndex + startMarker.length);
  return startIndex === -1 || endIndex === -1
    ? fileContent
    : fileContent.substring(startIndex + startMarker.length, endIndex).trim();
}

interface Props {
  snippet: string;
  liveSnippetHeight?: string;
}
