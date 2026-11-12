/**
 * FinOps Studio — Privacy-Safe Anonymous Funnel & Drop-Off Telemetry Beacon
 * Records anonymous page opens, tool tab clicks, sample downloads, API copies, Store clicks,
 * and exit/drop-off categories (no cookies, no personal data, GDPR-safe).
 */
(function () {
  if (typeof window === 'undefined') return;
  // Never count localhost or owner command-center views as customer visits
  if (location.hostname === 'localhost' || location.pathname.includes('command-center')) return;

  const NS = 'finops_studio_live';
  const hit = (key) => {
    fetch(`https://abacus.jasoncameron.dev/hit/${NS}/${key}`, { mode: 'cors', keepalive: true }).catch(() => {});
  };

  const startedAt = Date.now();
  let clickedStore = false;
  let testedPreviewOrDownload = false;
  let copiedCodeOrWorkflow = false;
  let exitRecorded = false;

  // 1. Record total visit + specific page bucket
  hit('page_views_total');
  const p = location.pathname.toLowerCase();
  if (p.endsWith('/') || p.endsWith('index.html')) hit('page_home');
  else if (p.includes('sepa-xml-generator')) hit('page_sepa');
  else if (p.includes('einvoice')) hit('page_einvoice');
  else if (p.includes('nacha')) hit('page_nacha');
  else if (p.includes('bai2')) hit('page_bai2');
  else if (p.includes('datev-buchungsstapel')) hit('page_datev');
  else if (p.includes('aba-cemtex')) hit('page_aba');
  else if (p.includes('pain002')) hit('page_pain002');
  else if (p.includes('uk-bacs')) hit('page_uk_bacs');
  else if (p.includes('canada-cpa')) hit('page_canada_cpa');
  else if (p.includes('positive-pay')) hit('page_positive_pay');
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

  // 3. Record anonymous exit reason when visitor leaves without clicking Store
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
