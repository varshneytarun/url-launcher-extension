// This script is shared between the service worker (background.js) and the popup (popup.js).
// It must be imported in both places to ensure consistent matching logic.

/**
 * Finds all patterns that match the given text.
 *
 * @param {string} text The text to search for matches.
 * @param {Array<object>} patterns The array of pattern objects to match against.
 * @returns {Array<{pattern: object, value: string}>} An array of matching patterns and their matched values.
 */
function findMatchingPatterns(text, patterns) {
  if (!text || !patterns) return [];

  const trimmedText = text.trim();
  const matches = [];

  for (const p of patterns) {
    if (!p.enabled) continue;

    try {
      // Use substring matching (no anchors) to allow partial matches
      const regex = new RegExp(p.pattern, 'i');
      const match = trimmedText.match(regex);
      if (match) {
        // Use the actual matched text, not the entire selection
        const matchedText = match[0];
        matches.push({ pattern: p, value: matchedText });
        if (matches.length >= 5) break; // Limit to 5 matches
      }
    } catch (e) {
      // This can happen if the user enters an invalid regex in the options
      console.warn('Invalid pattern in storage:', p.pattern, e);
    }
  }

  return matches;
}

// These functions are also shared between the background and popup scripts.
async function getPatterns() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['patterns'], (result) => {
      resolve(result.patterns || []);
    });
  });
}

function buildUrl(pattern, value) {
  return pattern.urlTemplate.replace(/{value}/g, value);
}