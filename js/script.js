document.addEventListener('DOMContentLoaded', function () {
  // Keep only the social icon animation here.
  // Mobile navbar behavior is owned centrally by navbar.js.
  document.querySelectorAll('.social').forEach(s => {
    let timeout;
    function triggerPop() {
      s.classList.remove('pop');
      void s.offsetWidth;
      s.classList.add('pop');
      clearTimeout(timeout);
      timeout = setTimeout(() => s.classList.remove('pop'), 320);
    }
    s.addEventListener('touchstart', function () { triggerPop(); }, { passive: true });
    s.addEventListener('mousedown', function () { triggerPop(); });
    s.addEventListener('focus', function () { triggerPop(); });
  });
});