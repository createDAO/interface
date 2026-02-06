import React, { useEffect, useState } from 'react';
import { highlighterPromise } from '../../utils/highlighter'; // Import the promise

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  theme?: 'dark' | 'light';
}

const escapeHtml = (input: string) =>
  input.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return ch;
    }
  });

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'solidity',
  title,
  theme = 'dark',
}) => {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component
    const highlightCode = async () => {
      try {
        setIsLoading(true);
        const highlighter = await highlighterPromise; // Resolve the promise
        const selectedTheme = theme === 'dark' ? 'github-dark' : 'github-light';

        // Use the actual language prop, ensure 'solidity' is loaded in highlighter.ts
        const html = await highlighter.codeToHtml(code, {
          lang: language, // Use the actual language
          theme: selectedTheme,
        });

        if (isMounted) {
          setHighlightedCode(html);
        }
      } catch (error) {
        console.error(`Error highlighting code for language "${language}":`, error);
        // Fallback to plain text if highlighting fails
        if (isMounted) {
          // Basic HTML escaping for safety (used with dangerouslySetInnerHTML)
          const escapedCode = escapeHtml(code);
          setHighlightedCode(`<pre><code>${escapedCode}</code></pre>`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    highlightCode();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [code, language, theme]);

  // Custom styles for the code block
  const codeBlockStyles = {
    container: `relative rounded-lg overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
    } ${title ? 'rounded-t-none' : ''}`,
    title: `px-4 py-2 font-medium text-sm ${
      theme === 'dark'
        ? 'bg-gray-700 text-gray-300 border-gray-600'
        : 'bg-gray-200 text-gray-700 border-gray-300'
    } border-t border-l border-r rounded-t-lg`,
    codeContainer: `p-4 overflow-x-auto`,
    loadingState: `p-4 ${
      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    } animate-pulse`,
  };

  // Removed manual line number processing - rely on Shiki's output or add transformer later

  return (
    <div className="mb-6">
      {title && <div className={codeBlockStyles.title}>{title}</div>}
      <div className={codeBlockStyles.container}>
        {isLoading ? (
          <div className={codeBlockStyles.loadingState}>Loading code...</div>
        ) : (
          <div
            className={codeBlockStyles.codeContainer}
            dangerouslySetInnerHTML={{ __html: highlightedCode }} // Use highlightedCode directly
            style={{
              fontFamily:
                'JetBrains Mono, Menlo, Monaco, Consolas, "Courier New", monospace', // Keep font style
            }}
          />
        )}
      </div>
      <style>{`
        .shiki {
          background: transparent !important;
          padding: 0 !important;
          margin: 0 !important;
          font-family: JetBrains Mono, Menlo, Monaco, Consolas, "Courier New", monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          tab-size: 2;
        }
        /* Removed line number specific styles */
      `}</style>
    </div>
  );
};

export default CodeBlock;
