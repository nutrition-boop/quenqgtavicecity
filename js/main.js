// 1. Global Loader - fade out immediately on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.classList.add('loader-hidden');
  }

  // 2. iOS detection (modern - no deprecated navigator.platform)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent));

  // 3. Fullscreen handling (native + pseudo for iOS)
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const container = document.querySelector('.app-container');

  if (fullscreenBtn && container) {
    // Create pseudo-exit button
    let exitBtn = container.querySelector('.pseudo-exit-btn');
    if (!exitBtn) {
      exitBtn = document.createElement('button');
      exitBtn.className = 'pseudo-exit-btn';
      exitBtn.setAttribute('type', 'button');
      exitBtn.setAttribute('aria-label', 'Exit Fullscreen');
      exitBtn.setAttribute('title', 'Exit Fullscreen');
      exitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      container.appendChild(exitBtn);
    }

    function togglePseudoFullscreen(enable) {
      const active = (typeof enable === 'boolean') ? enable : !container.classList.contains('is-pseudo-fullscreen');
      if (active) {
        container.classList.add('is-pseudo-fullscreen');
        document.documentElement.classList.add('pseudo-fullscreen-active');
        document.body.classList.add('pseudo-fullscreen-active');
      } else {
        container.classList.remove('is-pseudo-fullscreen');
        document.documentElement.classList.remove('pseudo-fullscreen-active');
        document.body.classList.remove('pseudo-fullscreen-active');
      }
    }

    exitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      togglePseudoFullscreen(false);
    });

    // iOS uses pseudo-fullscreen, desktop uses native
    if (isIOS || !document.fullscreenEnabled) {
      fullscreenBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        togglePseudoFullscreen();
      }, true);
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && container.classList.contains('is-pseudo-fullscreen')) {
        togglePseudoFullscreen(false);
      }
    });
  }

  // 4. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : null;
      });
    }
  });
});

// 5. Game page specific - iframe focus, fullscreen, share
window.addEventListener('load', function() {
  const iframe = document.getElementById('app-iframe');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const shareBtn = document.getElementById('share-btn');

  function focusGame() {
    if (iframe && iframe.contentWindow) {
      try { iframe.contentWindow.focus(); } catch(e) {}
    }
  }

  const appContainer = document.querySelector('.app-container');
  if (appContainer) {
    appContainer.addEventListener('click', focusGame);
  }

  if (fullscreenBtn && iframe) {
    fullscreenBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const fsPromise = iframe.requestFullscreen
        ? iframe.requestFullscreen()
        : (iframe.webkitRequestFullscreen ? iframe.webkitRequestFullscreen() : null);
      if (fsPromise && fsPromise.catch) {
        fsPromise.catch(function() {
          // Native fullscreen denied — fall back to pseudo-fullscreen
          const container = document.querySelector('.app-container');
          if (container) {
            container.classList.add('is-pseudo-fullscreen');
            document.documentElement.classList.add('pseudo-fullscreen-active');
            document.body.classList.add('pseudo-fullscreen-active');
          }
        });
      }
      if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
        navigator.keyboard.lock(['Escape']).catch(function() {});
      }
      setTimeout(focusGame, 100);
    });
  }

  if (shareBtn) {
    function showToast(msg) {
      var toast = document.createElement('div');
      toast.textContent = msg;
      toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1e1e2e;color:#4fc3f7;padding:10px 22px;border-radius:6px;font-size:0.9rem;z-index:99999;border:1px solid #4fc3f7;opacity:1;transition:opacity 0.5s';
      document.body.appendChild(toast);
      setTimeout(function() { toast.style.opacity = '0'; setTimeout(function() { toast.remove(); }, 500); }, 2500);
    }
    shareBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      var shareUrl = window.location.href;
      var shareData = {
        title: document.title,
        text: 'Play GTA Vice City in your browser!',
        url: shareUrl
      };
      try {
        if (navigator.share) await navigator.share(shareData);
        else {
          await navigator.clipboard.writeText(shareUrl);
          showToast('Link copied to clipboard!');
        }
      } catch(err) {
        if (err.name === 'AbortError') return;
        try {
          await navigator.clipboard.writeText(shareUrl);
          showToast('Link copied to clipboard!');
        } catch(e) {
          showToast('Could not share. Copy the URL manually.');
        }
      }
    });
  }

  // Fullscreen change cleanup
  document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if ('keyboard' in navigator && 'unlock' in navigator.keyboard) {
        navigator.keyboard.unlock();
      }
    }
  });
});

