/**
 * FinOps Studio — Zero-Dependency Shadow-DOM Embeddable Bank & VAT Validator Widget
 * Drop onto any accounting blog, ERP guide, payroll site, or documentation portal:
 *   <div data-finops-widget="bank-validator" data-theme="dark" data-default-type="auto"></div>
 *   <script src="https://geornaden.github.io/finops-studio/embed-bank-validator.js" defer></script>
 */
(function () {
  'use strict';

  var EDGE_VALIDATE_URL = 'https://finops-rapidapi-edge.ria-rader.workers.dev/v1/demo/validate';
  var HUB_URL = 'https://geornaden.github.io/finops-studio/?utm_source=embed_widget';
  var RAPIDAPI_URL = 'https://rapidapi.com/user/Geornaden';

  function offlineValidate(rawVal, mode) {
    var clean = String(rawVal || '').replace(/[\s-]+/g, '').toUpperCase();
    if (!clean) {
      return { ok: false, label: 'Enter an IBAN, US ABA routing #, UK Sort Code, AU BSB, or EU VAT ID', mode: 'offline' };
    }
    if (mode === 'iban' || (mode === 'auto' && /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(clean))) {
      var rearranged = clean.slice(4) + clean.slice(0, 4);
      var numeric = '';
      for (var i = 0; i < rearranged.length; i++) {
        var c = rearranged.charCodeAt(i);
        numeric += c >= 65 && c <= 90 ? String(c - 55) : rearranged[i];
      }
      var rem = 0;
      for (var j = 0; j < numeric.length; j += 7) {
        rem = Number(String(rem) + numeric.slice(j, j + 7)) % 97;
      }
      return rem === 1
        ? { ok: true, label: 'VALID (' + clean.slice(0, 2) + ' IBAN MOD-97)', detail: clean + ' passed ISO 13616 MOD-97 check.', mode: 'offline' }
        : { ok: false, label: 'INVALID (IBAN MOD-97 Failed)', detail: 'Check digits failed ISO 13616 MOD-97 math — bank will reject.', mode: 'offline' };
    }
    if (mode === 'aba' || (mode === 'auto' && /^\d{9}$/.test(clean))) {
      if (!/^\d{9}$/.test(clean)) {
        return { ok: false, label: 'INVALID (US ABA Routing)', detail: 'Must be exactly 9 digits.', mode: 'offline' };
      }
      var d = clean.split('').map(Number);
      var sum = 3 * (d[0] + d[3] + d[6]) + 7 * (d[1] + d[4] + d[7]) + (d[2] + d[5] + d[8]);
      return sum > 0 && sum % 10 === 0
        ? { ok: true, label: 'VALID (US ABA MOD-10)', detail: clean + ' passed Federal Reserve 9-digit checksum.', mode: 'offline' }
        : { ok: false, label: 'INVALID (US ABA MOD-10 Failed)', detail: 'Routing number failed MOD-10 check.', mode: 'offline' };
    }
    return {
      ok: false,
      label: 'Could not verify offline',
      detail: 'Check network connection or enter an IBAN / 9-digit US ABA routing number.',
      mode: 'offline'
    };
  }

  function renderWidget(host) {
    if (!host) return;
    var theme = (host.getAttribute('data-theme') || 'dark').toLowerCase() === 'light' ? 'light' : 'dark';
    var defType = (host.getAttribute('data-default-type') || 'auto').toLowerCase();
    var isLight = theme === 'light';

    var root = host.shadowRoot || host.attachShadow({ mode: 'open' });

    var bg = isLight ? '#ffffff' : '#0f172a';
    var cardBg = isLight ? '#f8fafc' : '#111827';
    var border = isLight ? '#cbd5e1' : '#334155';
    var text = isLight ? '#0f172a' : '#f8fafc';
    var muted = isLight ? '#475569' : '#94a3b8';
    var inputBg = isLight ? '#ffffff' : '#070b14';
    var chipBg = isLight ? '#e2e8f0' : '#1e293b';

    root.innerHTML =
      '<style>' +
      ':host{display:block;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:560px;}' +
      '.fw-box{background:' + cardBg + ';color:' + text + ';border:1px solid ' + border + ';border-radius:14px;padding:16px 18px;box-shadow:0 10px 30px rgba(0,0,0,' + (isLight ? '0.07' : '0.32') + ');}' +
      '.fw-top{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;}' +
      '.fw-title{font-weight:800;font-size:15px;display:flex;align-items:center;gap:7px;}' +
      '.fw-badge{font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px;background:rgba(16,185,129,0.16);color:#10b981;border:1px solid rgba(16,185,129,0.35);}' +
      '.fw-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:9px;}' +
      '.fw-sel,.fw-inp{background:' + inputBg + ';color:' + text + ';border:1px solid ' + border + ';border-radius:8px;padding:9px 11px;font-size:13.5px;outline:none;}' +
      '.fw-inp{flex:1;min-width:190px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}' +
      '.fw-inp:focus,.fw-sel:focus{border-color:#10b981;}' +
      '.fw-btn{background:#10b981;color:#04130d;border:none;border-radius:8px;padding:9px 15px;font-weight:700;font-size:13.5px;cursor:pointer;white-space:nowrap;}' +
      '.fw-btn:hover{background:#059669;color:#ffffff;}' +
      '.fw-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;}' +
      '.fw-chip{background:' + chipBg + ';color:' + muted + ';border:1px solid ' + border + ';border-radius:6px;padding:3px 8px;font-size:11.5px;cursor:pointer;}' +
      '.fw-chip:hover{color:' + text + ';border-color:#38bdf8;}' +
      '.fw-res{background:' + bg + ';border:1px solid ' + border + ';border-radius:9px;padding:10px 12px;font-size:13px;line-height:1.45;min-height:44px;}' +
      '.fw-ok{color:#10b981;font-weight:700;}' +
      '.fw-err{color:#ef4444;font-weight:700;}' +
      '.fw-foot{margin-top:11px;padding-top:9px;border-top:1px solid ' + border + ';display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;font-size:11.5px;color:' + muted + ';}' +
      '.fw-foot a{color:#0284c7;text-decoration:none;font-weight:700;}' +
      '.fw-foot a:hover{text-decoration:underline;}' +
      '</style>' +
      '<div class="fw-box">' +
      '  <div class="fw-top">' +
      '    <span class="fw-title">&#127974; Free Bank Routing &amp; IBAN Checker</span>' +
      '    <span class="fw-badge">Zero Signup &bull; Instant Checksum</span>' +
      '  </div>' +
      '  <div class="fw-row">' +
      '    <select class="fw-sel" aria-label="Check Type">' +
      '      <option value="auto"' + (defType === 'auto' ? ' selected' : '') + '>Auto-Detect</option>' +
      '      <option value="iban"' + (defType === 'iban' ? ' selected' : '') + '>IBAN (MOD-97)</option>' +
      '      <option value="aba"' + (defType === 'aba' ? ' selected' : '') + '>US ABA Routing</option>' +
      '      <option value="uk"' + (defType === 'uk' ? ' selected' : '') + '>UK Sort Code</option>' +
      '      <option value="au"' + (defType === 'au' ? ' selected' : '') + '>AU BSB</option>' +
      '      <option value="vat"' + (defType === 'vat' ? ' selected' : '') + '>EU VAT ID</option>' +
      '    </select>' +
      '    <input class="fw-inp" type="text" value="DE89370400440532013000" placeholder="IBAN, 9-digit ABA, Sort Code, BSB, or VAT ID" />' +
      '    <button class="fw-btn" type="button">Check Now</button>' +
      '  </div>' +
      '  <div class="fw-chips">' +
      '    <button type="button" class="fw-chip" data-val="DE89370400440532013000" data-type="iban">DE IBAN</button>' +
      '    <button type="button" class="fw-chip" data-val="021000021" data-type="aba">US Chase ABA</button>' +
      '    <button type="button" class="fw-chip" data-val="20-00-00" data-type="uk">UK Sort Code</button>' +
      '    <button type="button" class="fw-chip" data-val="062-000" data-type="au">AU BSB</button>' +
      '    <button type="button" class="fw-chip" data-val="DE129273398" data-type="vat">EU VAT</button>' +
      '    <button type="button" class="fw-chip" data-val="DE00370400440532013000" data-type="iban">Typo Test</button>' +
      '  </div>' +
      '  <div class="fw-res">Ready &mdash; click <strong>Check Now</strong> or type any bank identifier.</div>' +
      '  <div class="fw-foot">' +
      '    <span>&#9889; Powered by <a href="' + HUB_URL + '" target="_blank" rel="noopener">FinOps Studio</a></span>' +
      '    <a href="' + RAPIDAPI_URL + '" target="_blank" rel="noopener">Convert Full Excel/CSV to SEPA, ACH, BACS &amp; Peppol ($14.99/mo) &rarr;</a>' +
      '  </div>' +
      '</div>';

    var sel = root.querySelector('.fw-sel');
    var inp = root.querySelector('.fw-inp');
    var btn = root.querySelector('.fw-btn');
    var resEl = root.querySelector('.fw-res');
    var timer = null;

    function runCheck() {
      var val = inp.value.trim();
      var mode = sel.value || 'auto';
      if (!val) {
        resEl.innerHTML = '<span style="color:' + muted + '">Enter an IBAN, US ABA routing #, UK Sort Code, AU BSB, or EU VAT ID above.</span>';
        return;
      }
      resEl.innerHTML = '<span style="color:' + muted + '">Checking deterministic bank rules...</span>';
      var reqUrl = EDGE_VALIDATE_URL + '?q=' + encodeURIComponent(val) + '&type=' + encodeURIComponent(mode);
      fetch(reqUrl, { method: 'GET' })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && typeof data.ok === 'boolean') {
            var cls = data.ok ? 'fw-ok' : 'fw-err';
            var icon = data.ok ? '&#10003; ' : '&#10007; ';
            var title = data.label || (data.ok ? 'VALID' : 'INVALID');
            var msg = data.detail || data.error || '';
            resEl.innerHTML =
              '<div class="' + cls + '">' + icon + escapeHtml(title) + '</div>' +
              '<div style="color:' + muted + ';margin-top:2px;">' + escapeHtml(msg) + '</div>';
          } else {
            throw new Error('Unexpected response');
          }
        })
        .catch(function () {
          var fb = offlineValidate(val, mode);
          var cls = fb.ok ? 'fw-ok' : 'fw-err';
          var icon = fb.ok ? '&#10003; ' : '&#10007; ';
          resEl.innerHTML =
            '<div class="' + cls + '">' + icon + escapeHtml(fb.label) + ' (Offline Fallback)</div>' +
            '<div style="color:' + muted + ';margin-top:2px;">' + escapeHtml(fb.detail || '') + '</div>';
        });
    }

    function escapeHtml(s) {
      return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    btn.addEventListener('click', runCheck);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') runCheck();
    });
    inp.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(runCheck, 450);
    });
    sel.addEventListener('change', runCheck);

    var chips = root.querySelectorAll('.fw-chip');
    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener('click', function () {
        inp.value = this.getAttribute('data-val') || '';
        sel.value = this.getAttribute('data-type') || 'auto';
        runCheck();
      });
    }

    runCheck();
  }

  function mountAll(selector) {
    var nodes = document.querySelectorAll(selector || '[data-finops-widget="bank-validator"]');
    for (var i = 0; i < nodes.length; i++) {
      renderWidget(nodes[i]);
    }
    return nodes.length;
  }

  window.FinOpsEmbedWidget = { mount: mountAll, renderOne: renderWidget };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { mountAll(); });
  } else {
    mountAll();
  }
})();
