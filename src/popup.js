document.getElementById('toggleHighlight').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "toggleHighlight"}, (response) => {
          console.log(response);
      });
  });
});

document.getElementById('refreshHighlights').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "refreshHighlights"}, (response) => {
          console.log(response);
      });
  });
});