// This script runs in the offscreen document.
// It has access to the DOM and the clipboard API.

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === 'read-clipboard') {
    const container = document.getElementById('clipboard-container');
    container.value = '';
    container.focus();
    document.execCommand('paste');
    const clipboardText = container.value;
    sendResponse(clipboardText);
  }
});