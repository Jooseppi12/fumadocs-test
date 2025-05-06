"use client";

import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'; // a clean light theme
import { useTheme } from "next-themes";

const basePath = process.env.GHREPO !== undefined ? "/" + process.env.GHREPO : "";

export function FSharpSnippetTabs({ snippet, liveSnippetHeight = "600" }: FSharpSnippetTabsProps) {
    const [fsCode, setFsCode] = useState<string | null>(null);
    const [htmlCode, setHtmlCode] = useState<string | null>(null);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        fetch(basePath + `/snippets/${snippet}/code/Client.fs`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((code) => {
                const extractedCode = extractBetweenMarkers(code);
                setFsCode(extractedCode);
            })
            .catch((error) => {
                console.error("Error fetching F# code:", error);
            });
    }, [snippet]);

    useEffect(() => {
        fetch(basePath + `/snippets/${snippet}/code/index.html`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then(setHtmlCode)
            .catch((error) => {
                console.error("Error fetching HTML code:", error);
            });
    }, [snippet]);

    if (!resolvedTheme) return null;

    return (
        <Tabs items={["F#", "index.html", "Result"]}>
            <Tab value="F#">
                <SyntaxHighlighter 
                    language="fsharp" 
                    style={resolvedTheme === "dark" ? vscDarkPlus : oneLight }
                    customStyle={codeBlockStyle}
                >
                    {fsCode ?? "Loading..."}
                </SyntaxHighlighter>
            </Tab>
            <Tab value="index.html">
                <SyntaxHighlighter 
                    language="html" 
                    style={resolvedTheme === "dark" ? vscDarkPlus : oneLight }
                    customStyle={codeBlockStyle}
                >
                    {htmlCode ?? "Loading..."}
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
                      marginTop: "1rem",
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

    if (startIndex === -1 || endIndex === -1) {
        return fileContent; // Return the original content if markers are not found
    }

    return fileContent.substring(startIndex + startMarker.length, endIndex).trim();
}

interface FSharpSnippetTabsProps {
    snippet: string; // e.g. "forms_example_1"
    liveSnippetHeight?: string;
}