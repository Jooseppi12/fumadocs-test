import {highlight} from "lib/components/customHighlighter"
// import { CodeBlock } from "fumadocs-ui/components/codeblock";


export function CustomSyntaxHighlighter({ code, language, highlightLines }: Props) {
    // const { resolvedTheme } = useTheme();
  
    // if (!resolvedTheme) return null;
    console.log(language);
    return (highlight(code, {lang: language}, highlightLines));
}


interface Props {
  code: string;
  language: string;
  highlightLines: string;
}
