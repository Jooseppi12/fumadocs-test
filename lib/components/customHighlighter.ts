import {
    type Awaitable,
    type BundledHighlighterOptions,
    type BundledLanguage,
    type CodeOptionsMeta,
    type CodeOptionsThemes,
    type CodeToHastOptionsCommon,
    type Highlighter,
    type RegexEngine,
  } from 'shiki';
  import type { BundledTheme } from 'shiki/themes';
  import { type Components, toJsxRuntime } from 'hast-util-to-jsx-runtime';
  import { Fragment, type ReactNode } from 'react';
  import { jsx, jsxs } from 'react/jsx-runtime';
  import type { Root } from 'hast';
  
  export const defaultThemes = {
    light: 'github-light',
    dark: 'github-dark',
  };
  
  export type HighlightOptionsCommon = CodeToHastOptionsCommon<BundledLanguage> &
    CodeOptionsMeta & {
      engine?: Awaitable<RegexEngine>;
      components?: Partial<Components>;
    };
  
  export type HighlightOptionsThemes = CodeOptionsThemes<BundledTheme>;
  
  export type HighlightOptions = HighlightOptionsCommon &
    (HighlightOptionsThemes | Record<never, never>);
  
  const highlighters = new Map<string, Promise<Highlighter>>();

  function _createRangeCode(range: string) {
    const ranges = [];
    const split = range.split("..")
    if (split.length === 1) {
      // single number mode
      ranges.push(parseInt(range))
    }
    else if (split.length === 2) {
      // range mode
      const a = parseInt(split[0]);
      const b = parseInt(split[1]);
      const len = b - a + 1;
      if (len < 0) {
        throw `Invalid range: {range}`;
      }
      else if (len === 0) {
        ranges.push(a);
      }
      else {
        return [...Array(len).keys()].map(x => x + a);
      }
    }
    else {
      throw `Invalid range: {range}`;
    }
    return ranges;
  }

  function _createRanges (ranges: string) {
    try {
      return ranges.split(",").flatMap(x => _createRangeCode(x))
    }
    catch (ex) {
      throw `Error parsing: ${ranges} : ${ex}`
    }
    
  }
  
  export async function _highlight(code: string, options: HighlightOptions, highlightRanges: string) {
    const { lang, engine, ...rest } = options;
  
    let themes: CodeOptionsThemes<BundledTheme> = { themes: defaultThemes };
    if ('theme' in options && options.theme) {
      themes = { theme: options.theme };
    } else if ('themes' in options && options.themes) {
      themes = { themes: options.themes };
    }
  
    const highlighter = await getHighlighter('custom', {
      engine,
      langs: [lang],
      themes:
        'theme' in themes
          ? [themes.theme]
          : Object.values(themes.themes).filter((v) => v !== undefined),
    });
    const ranges = _createRanges(highlightRanges);
    return highlighter.codeToHast(code, {
      lang,
      ...rest,
      ...themes,
      transformers: [
        {
          line(node, line) {
            if (ranges.includes(line)) {
              this.addClassToHast(node, 'highlight')
            }
          }
        }
      ],
      defaultColor: 'themes' in themes ? false : undefined,
    });
  }
  
  export function _renderHighlight(hast: Root, options?: HighlightOptions) {
    return toJsxRuntime(hast, {
      jsx,
      jsxs,
      development: false,
      components: options?.components,
      Fragment,
    });
  }
  
  /**
   * Get Shiki highlighter instance of Fumadocs (mostly for internal use, don't recommend you to use it).
   *
   * @param engineType - engine type, the engine specified in `options` will only be effective when this is set to `custom`.
   * @param options - Shiki options.
   */
  export async function getHighlighter(
    engineType: 'js' | 'oniguruma' | 'custom',
    options: BundledHighlighterOptions<BundledLanguage, BundledTheme>,
  ) {
    const { createHighlighter } = await import('shiki');
    let highlighter = highlighters.get(engineType);
  
    if (!highlighter) {
      let engine;
  
      if (engineType === 'js') {
        engine = import('shiki/engine/javascript').then((res) =>
          res.createJavaScriptRegexEngine(),
        );
      } else if (engineType === 'oniguruma' || !options.engine) {
        engine = import('shiki/engine/oniguruma').then((res) =>
          res.createOnigurumaEngine(import('shiki/wasm')),
        );
      } else {
        engine = options.engine;
      }
  
      highlighter = createHighlighter({
        ...options,
        engine,
      });
  
      highlighters.set(engineType, highlighter);
      return highlighter;
    }
  
    return highlighter.then(async (instance) => {
      await Promise.all([
        // @ts-expect-error unknown
        instance.loadLanguage(...options.langs),
        // @ts-expect-error unknown
        instance.loadTheme(...options.themes),
      ]);
  
      return instance;
    });
  }
  
  export async function highlight(
    code: string,
    options: HighlightOptions,
    highlightRanges: string,
  ): Promise<ReactNode> {
    return _renderHighlight(await _highlight(code, options, highlightRanges), options);
  }