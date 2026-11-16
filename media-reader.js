// Lê Spotify Web e YouTube e envia para o background/localStorage via storage ou runtime
setInterval(() => {
  let payload = null;
  if (location.hostname.includes('spotify.com')) {
    const titleEl = document.querySelector('[data-testid="context-item-info-title"]');
    const artistEl = document.querySelector('[data-testid="context-item-info-subtitles"]');
    const playBtn = document.querySelector('[data-testid="control-button-playpause"]');
    if (titleEl) {
      const isPlaying = playBtn && playBtn.getAttribute('aria-label')?.toLowerCase().includes('paus');
      payload = {
        title: titleEl.textContent.trim(),
        artist: artistEl ? artistEl.textContent.trim() : 'Spotify',
        playing: !!isPlaying,
        source: 'Spotify'
      };
    }
  } else if (location.hostname.includes('youtube.com')) {
    const titleEl = document.querySelector('h1.ytd-watch-metadata yt-formatted-string');
    const video = document.querySelector('video');
    if (titleEl && video && !video.ended) {
      payload = {
        title: titleEl.textContent.trim(),
        artist: 'YouTube',
        playing: !video.paused,
        source: 'YouTube'
      };
    }
  }
  if (payload) {
    chrome.runtime?.sendMessage({ type: 'NB_MEDIA', payload }).catch(() => {});
  }
}, 1000);
