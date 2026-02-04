/**
 * Displays a status message in the popup.
 * @param {string} message - The message to display.
 * @param {'info' | 'success' | 'error'} [type='info'] - The type of message, for styling.
 */
function showStatus(message, type = 'info') {
  const statusDiv = document.getElementById('statusMessage');
  statusDiv.className = `status ${type}`;
  statusDiv.textContent = message;
  statusDiv.style.display = 'block';
  // Show the configure button for actionable errors
  if (type === 'error' || type === 'info') {
    const openOptionsBtn = document.getElementById('openOptions');
    if (openOptionsBtn) openOptionsBtn.style.display = 'block';
  }
}
document.getElementById('openOptions').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// Auto-read clipboard on popup open
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const reason = params.get('reason');

  if (reason) {
    const messages = {
      'insecure': 'Clipboard unavailable on insecure pages. Focus an HTTPS tab and try again.',
      'no-patterns': 'No patterns configured. Click Configure to add patterns.',
      'no-match': 'No matching pattern found for clipboard content. Open Configure to add patterns.',
      'clipboard-empty': 'Clipboard is empty.'
    };
    
    showStatus(messages[reason] || 'An unexpected error occurred.', 'error');
  }
});