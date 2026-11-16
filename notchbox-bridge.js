// Ponte na página do NOTCHBOX
window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'NB_MEDIA_CMD') {
    chrome.runtime?.sendMessage(e.data).catch(() => {});
  }
});
