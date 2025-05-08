import React from "react";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import {CustomSyntaxHighlighter} from 'lib/components/CustomSyntaxHighlighter';
import fs from "node:fs";

const basePath = process.env.GHREPO !== undefined ? "/" + process.env.GHREPO : "";

export function FSharpSnippetTabs({ snippet, liveSnippetHeight = "600", highlightLines = "" }: FSharpSnippetTabsProps) {
    // const { resolvedTheme } = useTheme();

    const fsCode = extractBetweenMarkers(fs.readFileSync(`snippets/${snippet}/Client.fs`, 'utf-8'));
    const htmlCode = extractBetweenMarkers(fs.readFileSync(`snippets/${snippet}/wwwroot/index.html`, 'utf-8'));

    
    // if (!resolvedTheme) return null;

    return (
        <Tabs items={["F#", "index.html", "Result"]}>
            <Tab value="F#" className="not-prose">
                <CustomSyntaxHighlighter code={fsCode} language="fsharp" highlightLines={highlightLines}></CustomSyntaxHighlighter>
            </Tab>
            <Tab value="index.html" className="not-prose">
                <CustomSyntaxHighlighter code={htmlCode} language="html" highlightLines=""></CustomSyntaxHighlighter>
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
                    src={`/snippets/${snippet}/index.html`}
                    style={{
                      width: "100%",
                      height: `${liveSnippetHeight}px`,
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      marginTop: "1rem",
                    }}
                />
            </Tab>      
        </Tabs>
    );
}

function extractBetweenMarkers(fileContent: string): string {
    const startMarker = "// <FUMADOCS BEGIN>";
    const endMarker = "// <FUMADOCS END>";

    const startIndex = fileContent.indexOf(startMarker);
    const endIndex = fileContent.indexOf(endMarker, startIndex + startMarker.length);

    if (startIndex === -1 || endIndex === -1) {
        return fileContent; // Return the original content if markers are not found
    }

    return fileContent.substring(startIndex + startMarker.length, endIndex).trim();
}

interface FSharpSnippetTabsProps {
    snippet: string; // e.g. "forms_example_1"
    liveSnippetHeight?: string;
    highlightLines?: string;
}