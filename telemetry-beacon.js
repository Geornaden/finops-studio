/**
 * FinOps Studio — Pure Outside Customer Funnel & Drop-Off Telemetry Beacon (v2)
 * Strictly excludes:
 *   1. Owner devices (any phone/PC that has opened command-center.html or ?owner=1)
 *   2. Automated browsers / WebDriver / localhost
 *   3. Search engine & AI bots (tracked separately under search_crawler_hits, never mixed with customers)
 */
(function () {
  if (typeof window === 'undefined') return;

  // Allow tagging an owner device directly via ?owner=1 or coming from command-center.html
  // Saves BOTH localStorage and a 400-day first-party cookie so iPhone Safari & PC browsers stay excluded permanently
  try {
    if (location.search.includes('owner=1') || (document.referrer && document.referrer.includes('command-center'))) {
      localStorage.setItem('finops_owner_ignore', '1');
      document.cookie = 'finops_owner_ignore=1; path=/; max-age=34560000; SameSite=Lax';
    }
    if (
      localStorage.getItem('finops_owner_ignore') === '1' ||
      (document.cookie && document.cookie.includes('finops_owner_ignore=1'))
    ) {
      // Show a small reassuring badge ONLY on George's excluded devices (invisible to all outside customers)
      const showBadge = () => {
        if (!document.body || document.getElementById('finops-owner-shield')) return;
        const badge = document.createElement('a');
        badge.id = 'finops-owner-shield';
        badge.href = './command-center.html';
        badge.textContent = '🛡️ Owner Device (Not Counted)';
        badge.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:9999;background:#064e3b;color:#ecfdf5;border:1px solid #10b981;padding:6px 12px;border-radius:99px;font-size:12px;font-weight:700;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,0.4);font-family:system-ui,sans-serif;';
        document.body.appendChild(badge);
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showBadge);
      } else {
        showBadge();
      }
      return; // Owner's phone or computer — NEVER count as a customer!
    }
  } catch {}

  // Never count localhost, command-center, or automated WebDriver browsers
  if (
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.pathname.includes('command-center') ||
    navigator.webdriver
  ) {
    return;
  }

  const NS = 'finops_studio_customers_v2';
  const hit = (key) => {
    fetch(`https://abacus.jasoncameron.dev/hit/${NS}/${key}`, { mode: 'cors', keepalive: true }).catch(() => {});
  };

  // Separate search engine / AI crawlers from real human customers
  const ua = navigator.userAgent || '';
  if (/bot|crawl|spider|slurp|bingpreview|headless|lighthouse|pagespeed|gptbot|claudebot|perplexity/i.test(ua)) {
    hit('search_crawler_hits');
    return;
  }

  const startedAt = Date.now();
  let clickedStore = false;
  let testedPreviewOrDownload = false;
  let copiedCodeOrWorkflow = false;
  let exitRecorded = false;

  // 1. Record real outside human visit + specific page bucket
  hit('page_views_total');
  const p = location.pathname.toLowerCase();
  if (p.endsWith('/') || p.endsWith('index.html')) hit('page_home');
  else if (p.includes('sepa-xml-generator')) hit('page_sepa');
  else if (p.includes('einvoice')) hit('page_einvoice');
  else if (p.includes('nacha-ach-file-generator')) hit('page_nacha');
  else if (p.includes('bai2-bank-statement')) hit('page_bai2');
  else if (p.includes('datev-buchungsstapel')) hit('page_datev');
  else if (p.includes('aba-cemtex')) hit('page_aba');
  else if (p.includes('iso20022-pain002')) hit('page_pain002');
  else if (p.includes('uk-bacs')) hit('page_uk_bacs');
  else if (p.includes('canada-cpa')) hit('page_canada_cpa');
  else if (p.includes('positive-pay')) hit('page_positive_pay');
  else if (p.includes('free-iban') || p.includes('checker')) hit('page_free_checker');
  else hit('page_seo_guides');

  // 2. Delegated click tracking across tabs, preview, download, cURL, workflows, and Apify Store CTAs
  document.addEventListener('click', (e) => {
    const el = e.target.closest('a, button');
    if (!el) return;

    if (el.classList.contains('tab-btn') && el.dataset.tool) {
      hit(`tab_${el.dataset.tool}`);
    } else if (el.id === 'btn-run-preview') {
      testedPreviewOrDownload = true;
      hit('action_preview_run');
    } else if (el.id === 'btn-download-preview') {
      testedPreviewOrDownload = true;
      hit('action_sample_download');
    } else if (el.id === 'btn-copy-curl') {
      copiedCodeOrWorkflow = true;
      hit('action_copy_curl');
    } else if (el.tagName === 'A') {
      const href = (el.getAttribute('href') || '').toLowerCase();
      if (href.includes('apify.com/finops_studio')) {
        clickedStore = true;
        hit('action_click_store');
      } else if (href.includes('/workflows/')) {
        copiedCodeOrWorkflow = true;
        hit('action_workflow_download');
      }
    }
  });

  // 3. Record anonymous exit reason when real outside visitor leaves without clicking Store
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && !exitRecorded && !clickedStore) {
      exitRecorded = true;
      const elapsedSec = (Date.now() - startedAt) / 1000;
      if (copiedCodeOrWorkflow) {
        hit('exit_after_code_copy');
      } else if (testedPreviewOrDownload) {
        hit('exit_after_sample');
      } else if (elapsedSec < 10) {
        hit('exit_quick_bounce');
      } else {
        hit('exit_read_no_click');
      }
    }
  });
})();
