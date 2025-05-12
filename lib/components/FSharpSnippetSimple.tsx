import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import {CustomSyntaxHighlighterWithCopy} from 'lib/components/CustomSyntaxHighlighter';
import fs from "node:fs";
import { extractBetweenMarkers } from "./shared";
import { CopyCodeComponent } from "./copyCodeComponent";

const basePath = process.env.GHREPO !== undefined ? "/" + process.env.GHREPO : "";

export function FSharpSnippetSimple({ snippet, liveSnippetHeight = "600", highlightLines = "" }: Props) {
  const fsCode = extractBetweenMarkers(fs.readFileSync(`snippets/${snippet}/Client.fs`, 'utf-8'));  

  return (
    <Tabs items={["F#", "Result"]}>
      <Tab value="F#" className="not-prose">
        <CustomSyntaxHighlighterWithCopy id={`snippet_${snippet}_fs`} code={fsCode} language="fsharp" highlightLines={highlightLines}></CustomSyntaxHighlighterWithCopy>
      </Tab>
      <Tab value="Result">
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
          <a
            href={`${basePath}/snippets/${snippet}/index.html`}
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
          src={`${basePath}/snippets/${snippet}/index.html`}
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

interface Props {
  snippet: string;
  liveSnippetHeight?: string;
  highlightLines?: string;
}
