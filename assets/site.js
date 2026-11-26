// SPDX-License-Identifier: GPL-2.0-or-later
(() => {
  const url = new URL(window.location.href);
  let language = url.searchParams.get('lang') === 'en' ? 'en' : 'zh';
  const button = document.getElementById('language');
  function apply() {
    document.documentElement.dataset.lang = language;
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    button.innerHTML = (language === 'en' ? '中文' : 'EN') + ' <span aria-hidden="true">↗</span>';
    button.setAttribute('aria-label', language === 'en' ? '切换为中文' : 'Switch to English');
    document.querySelectorAll('a[href]').forEach(link => {
      const target = new URL(link.getAttribute('href'), window.location.href);
      if (target.origin !== window.location.origin || !['http:', 'https:'].includes(target.protocol)) return;
      target.searchParams.set('lang', language);
      link.setAttribute('href', target.pathname + target.search + target.hash);
    });
  }
  button.addEventListener('click', () => {
    language = language === 'en' ? 'zh' : 'en';
    url.searchParams.set('lang', language);
    window.history.replaceState(null, '', url);
    apply();
  });
  document.querySelectorAll('[data-copy-target]').forEach(control => {
    control.addEventListener('click', async () => {
      const code = document.getElementById(control.dataset.copyTarget);
      const status = document.getElementById('copy-status');
      if (!code || !status) return;
      try {
        await navigator.clipboard.writeText(code.textContent);
        status.textContent = language === 'en' ? 'Command copied.' : '命令已复制。';
        control.querySelector('[data-zh]').textContent = '已复制';
        control.querySelector('[data-en]').textContent = 'Copied';
        window.setTimeout(() => {
          control.querySelector('[data-zh]').textContent = '复制命令';
          control.querySelector('[data-en]').textContent = 'Copy command';
        }, 1800);
      } catch {
        status.textContent = language === 'en'
          ? 'Copy was unavailable. Select and copy the command manually.'
          : '无法自动复制，请选中命令手动复制。';
      }
    });
  });
  apply();
})();
