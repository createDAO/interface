import { createHighlighter, Highlighter } from 'shiki';

// Define the languages and themes you expect to use
const languagesToLoad = ['solidity', 'javascript', 'typescript', 'html', 'css']; // Add others if needed
const themesToLoad = ['github-dark', 'github-light'];

// Create the highlighter instance asynchronously
// We export the promise directly. Components will need to resolve it.
export const highlighterPromise: Promise<Highlighter> = createHighlighter({
  themes: themesToLoad,
  langs: languagesToLoad,
});

// Optional: Function to get the highlighter, handling the promise
export async function getHighlighter(): Promise<Highlighter> {
  return highlighterPromise;
}
