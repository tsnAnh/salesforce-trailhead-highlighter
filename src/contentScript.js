import { getKeySentences } from './agent';

let highlightingEnabled = true;
let highlightOverlays = [];
let hasHighlighted = false;

async function highlightImportantText(force = false) {
  console.log('highlightImportantText function called');
  if (!highlightingEnabled) {
    console.log('Highlighting is disabled, returning early');
    return;
  }

  if (hasHighlighted && !force) {
    console.log('Page already highlighted, skipping');
    return;
  }

  removeHighlights(); // Clear existing highlights

  const pageContent = document.getElementsByClassName('unit-content')[0].innerText;
  try {
    const sentencesToHighlight = await getSentencesToHighlight(pageContent);
    highlightSentences(sentencesToHighlight);
    hasHighlighted = true;
  } catch (error) {
    console.error('Error getting sentences to highlight:', error);
  }
}

async function getSentencesToHighlight(pageContent) {
  try {
    return await getKeySentences(pageContent);
  } catch (e) {
    return [];
  }
}

function highlightSentences(sentences) {
  const allText = getAllTextNodes(document.body);
  sentences.forEach((sentence) => {
    const ranges = findSentenceInTextNodes(allText, sentence);
    ranges.forEach((range) => highlightRange(range));
  });
}

function getAllTextNodes(node) {
  const allNodes = [];
  if (node.nodeType === Node.TEXT_NODE) {
    allNodes.push(node);
  } else {
    for (let childNode of node.childNodes) {
      allNodes.push(...getAllTextNodes(childNode));
    }
  }
  return allNodes;
}

function findSentenceInTextNodes(textNodes, sentence) {
  const ranges = [];
  const lowerSentence = sentence.toLowerCase();
  let sentenceIndex = 0;
  let currentRange = null;

  for (let nodeIndex = 0; nodeIndex < textNodes.length; nodeIndex++) {
    const node = textNodes[nodeIndex];
    const nodeText = node.textContent.toLowerCase();
    let textIndex = 0;

    while (textIndex < nodeText.length) {
      if (nodeText[textIndex] === lowerSentence[sentenceIndex]) {
        if (!currentRange) {
          currentRange = document.createRange();
          currentRange.setStart(node, textIndex);
        }
        sentenceIndex++;

        if (sentenceIndex === lowerSentence.length) {
          currentRange.setEnd(node, textIndex + 1);
          ranges.push(currentRange);
          currentRange = null;
          sentenceIndex = 0;
          // Don't increment textIndex here to allow overlapping matches
        } else {
          textIndex++;
        }
      } else {
        if (currentRange) {
          currentRange = null;
          sentenceIndex = 0;
          // Don't increment textIndex here to allow for immediate re-matching
        } else {
          textIndex++;
        }
      }
    }
  }

  return ranges;
}

function highlightRange(range) {
  const rects = range.getClientRects();

  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i];
    const overlay = document.createElement('div');

    overlay.style.position = 'absolute';
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.backgroundColor = 'yellow';
    overlay.style.opacity = '0.4';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';
    overlay.style.mixBlendMode = 'multiply';
    overlay.className = 'ai-highlighter-overlay';

    document.body.appendChild(overlay);
    highlightOverlays.push(overlay);
  }
}

function removeHighlights() {
  console.log('removeHighlights function called');
  highlightOverlays.forEach((overlay) => overlay.remove());
  highlightOverlays = [];
  console.log('All highlights removed');
}

function toggleHighlight() {
  console.log('toggleHighlight function called');
  highlightingEnabled = !highlightingEnabled;
  console.log(
    `Highlighting is now ${highlightingEnabled ? 'enabled' : 'disabled'}`
  );
  if (highlightingEnabled) {
    highlightImportantText(true); // Force refresh highlights
  } else {
    removeHighlights();
  }
  return `Highlighting is now ${highlightingEnabled ? 'enabled' : 'disabled'}`;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  if (request.action === 'toggleHighlight') {
    const result = toggleHighlight();
    sendResponse(result);
  } else if (request.action === 'refreshHighlights') {
    highlightImportantText(true);
    sendResponse('Highlights refreshed');
  }
  return true; // Indicates that the response is sent asynchronously
});

async function initializeExtension() {
  console.log('Initializing extension');
  await highlightImportantText();

  // Set up the MutationObserver for significant DOM changes
  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
      console.log('Significant DOM mutation observed');
      hasHighlighted = false; // Reset the flag to allow re-highlighting
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  console.log('Extension initialized');
}

// Ensure the DOM is fully loaded before running our script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

console.log('Content script loaded');
