// Phone app only: register the offline worker and tell the page when an update is ready.
(function () {
  if (window.mpMac || !('serviceWorker' in navigator) || location.protocol !== 'https:') return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      setInterval(function () { reg.update().catch(function () {}); }, 30 * 60 * 1000);
    }).catch(function () {});
    var had = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!had) { had = true; return; }
      if (document.hidden) location.reload();
      else window.dispatchEvent(new Event('mp-update-ready'));
    });
  });
})();
