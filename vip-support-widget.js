/**
 * FinOps Studio — VIP Customer Support Drawer, Scoped AI Concierge & Screenshot Issue Reporter
 * Mounted across all 89 pages via telemetry-beacon.js (0% external dependencies).
 */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (location.pathname.includes('command-center') || window.__finopsVipWidgetLoaded) return;
  window.__finopsVipWidgetLoaded = true;

  const API_BASE = 'https://finops-rapidapi-edge.ria-rader.workers.dev';
  const LS_VIS = 'finops_sup_visitor_v1';
  const LS_CONV = 'finops_sup_conv_v1';
  const LS_SESS = 'finops_sup_sessions_v1';
  const LS_TKTS = 'finops_sup_tickets_v1';
  const LS_PASS = 'finops_pro_pass';

  // Auto-capture ?paid=1&pass_key=fop_... OR promote finops_pending_pass after Stripe Payment Link / PayPal redirect
  try {
    const qp = new URLSearchParams(location.search);
    const urlPass = (qp.get('pass_key') || '').trim();
    if (urlPass.startsWith('fop_')) {
      localStorage.setItem(LS_PASS, urlPass);
    } else if (qp.get('paid') === '1') {
      const pending = (localStorage.getItem('finops_pending_pass') || '').trim();
      if (pending.startsWith('fop_')) localStorage.setItem(LS_PASS, pending);
    }
  } catch {}

  window.finopsSafeCopy = function (text) {
    const str = String(text ?? '');
    const fallback = () => {
      try {
        const ta = document.createElement('textarea');
        ta.value = str;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch {}
        document.body.removeChild(ta);
      } catch {}
    };
    try {
      const orig = window.__finopsOrigWriteText;
      if (typeof orig === 'function') {
        return Promise.resolve(orig(str)).catch(() => { fallback(); });
      }
    } catch {}
    fallback();
    return Promise.resolve();
  };

  // Protect all inline Copy buttons across all 111 pages from unhandled Clipboard NotAllowedError
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && !window.__finopsOrigWriteText) {
      window.__finopsOrigWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
      navigator.clipboard.writeText = function (text) {
        return window.finopsSafeCopy(text);
      };
    }
  } catch {}

  window.getFinOpsPassKey = function () {
    try {
      const k = (localStorage.getItem(LS_PASS) || '').trim();
      return k.startsWith('fop_') ? k : '';
    } catch {
      return '';
    }
  };

  window.startFinOpsCheckout = async function (plan = 'batch24h', opts = {}) {
    try {
      if (typeof window.__finopsTrackCheckout === 'function') window.__finopsTrackCheckout(plan);
    } catch {}
    const btn = opts.btn || null;
    const origText = btn ? btn.textContent : '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Opening Checkout...';
    }
    try {
      const returnUrl = opts.returnUrl || location.href.split('#')[0];
      const res = await fetch(`${API_BASE}/v1/checkout/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: ['pro30d', 'batch24h'].includes(plan) ? plan : 'batch24h',
          provider: opts.provider || 'auto',
          returnUrl,
          payerEmail: opts.customerEmail || opts.payerEmail || undefined
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.checkoutUrl) {
        throw new Error(data.error || 'Checkout unavailable right now.');
      }
      try { localStorage.setItem('finops_pending_pass', data.passKey); } catch {}
      window.location.href = data.checkoutUrl;
    } catch (err) {
      if (btn) {
        btn.disabled = false;
        btn.textContent = origText;
      }
      alert(`Checkout notice: ${err.message}`);
    }
  };

  const getOrCreateId = (key, prefix) => {
    try {
      let val = localStorage.getItem(key);
      if (!val) {
        val = `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem(key, val);
      }
      return val;
    } catch {
      return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
    }
  };

  let sessionNum = 1;
  try {
    if (!sessionStorage.getItem('finops_sup_sess_counted')) {
      sessionNum = Math.max(1, Number(localStorage.getItem(LS_SESS) || 0) + 1);
      localStorage.setItem(LS_SESS, String(sessionNum));
      sessionStorage.setItem('finops_sup_sess_counted', '1');
    } else {
      sessionNum = Math.max(1, Number(localStorage.getItem(LS_SESS) || 1));
    }
  } catch {}

  const visitorId = getOrCreateId(LS_VIS, 'v');
  const convId = getOrCreateId(LS_CONV, 'c');

  const loadTickets = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(LS_TKTS) || '[]');
      return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
    } catch {
      return [];
    }
  };
  const saveTicket = (ticketId, ticketSecret, category) => {
    try {
      const list = loadTickets().filter((t) => t.ticketId !== ticketId);
      list.unshift({ ticketId, ticketSecret, category, createdAt: new Date().toISOString() });
      localStorage.setItem(LS_TKTS, JSON.stringify(list.slice(0, 8)));
    } catch {}
  };

  const track = (evt) => {
    try {
      if (typeof window.__finopsTrackSupport === 'function') window.__finopsTrackSupport(evt);
    } catch {}
  };

  function getActiveToolContext() {
    const activeTab = document.querySelector('.tab-btn.active');
    const selectFmt = document.getElementById('targetFormat');
    return (activeTab?.textContent || selectFmt?.value || document.title || '').trim().slice(0, 90);
  }

  async function compressImageToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Could not read selected image.'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Invalid image file. Please select a PNG, JPG, or WebP screenshot.'));
        img.onload = () => {
          const maxDim = 1280;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w >= h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          let quality = 0.78;
          let out = canvas.toDataURL('image/jpeg', quality);
          while (out.length > 440000 && quality > 0.35) {
            quality -= 0.12;
            out = canvas.toDataURL('image/jpeg', quality);
          }
          if (out.length > 470000) {
            reject(new Error('Screenshot is still too large after compression. Try cropping to the issue area.'));
            return;
          }
          resolve(out);
        };
        img.src = String(reader.result || '');
      };
      reader.readAsDataURL(file);
    });
  }

  function mountWidget() {
    if (!document.body || document.getElementById('finops-vip-host')) return;

    const host = document.createElement('div');
    host.id = 'finops-vip-host';
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        * { box-sizing: border-box; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .fab {
          position: fixed; right: 18px; bottom: 18px; z-index: 2147483000;
          background: linear-gradient(135deg, #10b981, #0ea5e9);
          color: #031510; border: 2px solid rgba(255,255,255,0.28);
          padding: 12px 18px; border-radius: 999px; font-weight: 800; font-size: 14px;
          cursor: pointer; box-shadow: 0 10px 28px rgba(14,165,233,0.42);
          display: inline-flex; align-items: center; gap: 8px; transition: transform 0.15s ease;
        }
        .fab:hover { transform: translateY(-2px); }
        .badge {
          background: #ef4444; color: #fff; font-size: 11px; font-weight: 800;
          padding: 2px 7px; border-radius: 99px; display: none;
        }
        .drawer {
          position: fixed; right: 18px; bottom: 76px; z-index: 2147483001;
          width: 410px; max-width: calc(100vw - 24px); max-height: min(82vh, 690px);
          background: #0b1120; color: #f8fafc; border: 1px solid #334155;
          border-radius: 16px; box-shadow: 0 22px 55px rgba(0,0,0,0.65);
          display: none; flex-direction: column; overflow: hidden;
        }
        .drawer.open { display: flex; }
        .head {
          padding: 14px 16px; background: linear-gradient(135deg, #0f172a, #064e3b);
          border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; gap: 8px;
        }
        .head-title { font-size: 14.5px; font-weight: 800; color: #f8fafc; margin: 0; }
        .head-sub { font-size: 11.5px; color: #a7f3d0; margin-top: 2px; }
        .close-btn {
          background: rgba(255,255,255,0.1); color: #f8fafc; border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px; width: 30px; height: 30px; font-size: 16px; font-weight: 700; cursor: pointer;
        }
        .tabs { display: grid; grid-template-columns: 1fr 1fr; background: #111827; border-bottom: 1px solid #1e293b; }
        .tab {
          padding: 10px 8px; border: none; background: transparent; color: #94a3b8;
          font-size: 12.5px; font-weight: 700; cursor: pointer; border-bottom: 2px solid transparent;
        }
        .tab.active { color: #34d399; border-bottom-color: #10b981; background: rgba(16,185,129,0.08); }
        .pane { display: none; flex: 1; flex-direction: column; min-height: 0; overflow-y: auto; }
        .pane.active { display: flex; }
        .vip-bar {
          padding: 8px 12px; background: #0f172a; border-bottom: 1px solid #1e293b;
          font-size: 11.5px; color: #94a3b8; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
        }
        .vip-bar input {
          background: #1e293b; border: 1px solid #334155; color: #f8fafc; border-radius: 6px;
          padding: 4px 8px; font-size: 11.5px; flex: 1; min-width: 120px;
        }
        .chips { padding: 8px 12px 4px; display: flex; gap: 6px; flex-wrap: wrap; }
        .chip {
          background: #1e293b; color: #38bdf8; border: 1px solid #334155; border-radius: 99px;
          padding: 4px 9px; font-size: 11px; font-weight: 600; cursor: pointer;
        }
        .chip:hover { border-color: #38bdf8; }
        .msgs {
          flex: 1; padding: 10px 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;
          min-height: 190px; max-height: 295px;
        }
        .msg {
          padding: 9px 11px; border-radius: 10px; font-size: 12.5px; line-height: 1.45; max-width: 92%;
          white-space: pre-wrap; word-break: break-word;
        }
        .msg.bot { background: #1e293b; color: #e2e8f0; align-self: flex-start; border: 1px solid #334155; }
        .msg.user { background: #065f46; color: #ecfdf5; align-self: flex-end; }
        .msg.blocked { background: #451a03; color: #fde68a; border: 1px solid #d97706; align-self: flex-start; }
        .chat-foot { padding: 10px 12px; border-top: 1px solid #1e293b; background: #0f172a; }
        .chat-row { display: flex; gap: 6px; }
        .chat-row input {
          flex: 1; padding: 9px 11px; border-radius: 8px; border: 1px solid #334155;
          background: #111827; color: #f8fafc; font-size: 13px;
        }
        .btn-send {
          background: #10b981; color: #04130d; border: none; border-radius: 8px;
          padding: 0 14px; font-weight: 800; font-size: 13px; cursor: pointer;
        }
        .btn-send:disabled { opacity: 0.5; cursor: wait; }
        .escalate-btn {
          margin-top: 7px; width: 100%; background: rgba(56,189,248,0.12); color: #38bdf8;
          border: 1px solid rgba(56,189,248,0.35); border-radius: 7px; padding: 6px 10px;
          font-size: 12px; font-weight: 700; cursor: pointer;
        }
        .form { padding: 12px; display: flex; flex-direction: column; gap: 9px; }
        .form label { font-size: 11.5px; font-weight: 700; color: #cbd5e1; display: block; margin-bottom: 3px; }
        .form input, .form select, .form textarea {
          width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid #334155;
          background: #111827; color: #f8fafc; font-size: 12.5px;
        }
        .form textarea { min-height: 76px; resize: vertical; }
        .paid-row {
          display: flex; align-items: center; gap: 8px; font-size: 12px; color: #fde68a;
          background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); padding: 7px 10px; border-radius: 8px;
        }
        .paid-row input { width: auto; }
        .dropzone {
          border: 2px dashed #38bdf8; border-radius: 10px; padding: 10px; text-align: center;
          background: rgba(56,189,248,0.06); cursor: pointer; font-size: 12px; color: #bae6fd;
        }
        .dropzone.drag { background: rgba(16,185,129,0.18); border-color: #10b981; }
        .shot-preview { display: none; margin-top: 6px; position: relative; }
        .shot-preview img { max-width: 100%; max-height: 130px; border-radius: 8px; border: 1px solid #334155; }
        .shot-remove {
          position: absolute; top: 4px; right: 4px; background: #ef4444; color: #fff;
          border: none; border-radius: 6px; padding: 3px 8px; font-size: 11px; font-weight: 700; cursor: pointer;
        }
        .submit-btn {
          background: linear-gradient(135deg, #10b981, #0ea5e9); color: #031510; border: none;
          border-radius: 8px; padding: 10px 14px; font-weight: 800; font-size: 13px; cursor: pointer;
        }
        .status-box { font-size: 12px; border-radius: 8px; padding: 8px 10px; display: none; }
        .status-ok { background: rgba(16,185,129,0.14); border: 1px solid #10b981; color: #a7f3d0; }
        .status-err { background: rgba(239,68,68,0.14); border: 1px solid #ef4444; color: #fecaca; }
        .tkt-list { margin-top: 4px; border-top: 1px solid #1e293b; padding-top: 8px; }
        .tkt-item {
          background: #111827; border: 1px solid #334155; border-radius: 8px;
          padding: 8px 10px; font-size: 11.5px; margin-bottom: 6px;
        }
        .tkt-reply {
          margin-top: 5px; padding: 6px 8px; border-radius: 6px; background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.4); color: #ecfdf5;
        }
        .pass-strip {
          padding: 8px 12px; background: rgba(245,158,11,0.1); border-bottom: 1px solid rgba(245,158,11,0.3);
          display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap;
        }
        .pass-btns { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
        .pass-btn {
          border: none; border-radius: 7px; padding: 5px 9px; font-size: 11px; font-weight: 800; cursor: pointer;
          background: linear-gradient(135deg, #f59e0b, #eab308); color: #111827;
        }
        .pass-btn.pro { background: #1e293b; color: #fde68a; border: 1px solid rgba(245,158,11,0.55); }
        .pass-btn:disabled { opacity: 0.6; cursor: wait; }
        .pass-active-chip {
          font-size: 11px; color: #34d399; font-weight: 700; display: none; width: 100%;
        }
      </style>

      <button id="fabBtn" class="fab" type="button" aria-label="Live Help and Report Issue with Screenshot">
        <span>💬 Live Help &bull; Report Issue 📸</span>
        <span id="unreadBadge" class="badge">1</span>
      </button>

      <section id="drawer" class="drawer" aria-label="FinOps Studio VIP Customer Support">
        <div class="head">
          <div>
            <h2 class="head-title">FinOps Studio VIP Support &amp; Bug Reporter</h2>
            <div class="head-sub">Instant FinOps Q&amp;A &bull; Screenshot Help &bull; Fast Email Reply</div>
          </div>
          <button id="closeBtn" class="close-btn" type="button" aria-label="Close">&times;</button>
        </div>

        <div class="pass-strip">
          <div style="font-size:11px;font-weight:700;color:#fde68a;">&#9889; Instant Pass (No Signup):</div>
          <div class="pass-btns">
            <button id="wBuy9" class="pass-btn" type="button">&#128179; $9 / 24h Batch</button>
            <button id="wBuy29" class="pass-btn pro" type="button">&#128640; $29 / 30d Pro</button>
          </div>
          <div id="wPassActiveChip" class="pass-active-chip"></div>
        </div>

        <div class="tabs">
          <button id="tabAi" class="tab active" type="button">⚡ Ask FinOps AI</button>
          <button id="tabBug" class="tab" type="button">📸 Report Issue / Message Us</button>
        </div>

        <div id="paneAi" class="pane active">
          <div class="vip-bar">
            <span>⭐ Paid Customer?</span>
            <input id="aiPaidRef" type="text" placeholder="Optional email or order # for VIP" />
          </div>
          <div class="chips">
            <button class="chip" type="button" data-q="Which countries and banking formats are supported?">Which countries work?</button>
            <button class="chip" type="button" data-q="Why did my SEPA BE04 or NACHA ACH file fail?">SEPA BE04 / ACH help</button>
            <button class="chip" type="button" data-q="How do I convert an Excel or QuickBooks CSV?">Excel / CSV guide</button>
            <button class="chip" type="button" data-q="What is your pricing and free tier?">Pricing &amp; free tier</button>
          </div>
          <div id="chatMsgs" class="msgs">
            <div class="msg bot">Hi! I'm the <strong>FinOps Studio Support Assistant</strong>. Ask me about any of our 12 banking &amp; tax tools, supported countries, rejection codes (<code>BE04</code>, <code>R01</code>), or paste an IBAN / routing code to test live!</div>
          </div>
          <div class="chat-foot">
            <form id="chatForm" class="chat-row">
              <input id="chatInput" type="text" maxlength="600" placeholder="Ask about FinOps tools, countries, errors..." required />
              <button id="chatSendBtn" class="btn-send" type="submit">Ask</button>
            </form>
            <button id="escalateBtn" class="escalate-btn" type="button">📸 Attach Screenshot or Message Human Support &rarr;</button>
          </div>
        </div>

        <div id="paneBug" class="pane">
          <form id="bugForm" class="form">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div>
                <label for="bugCat">Type</label>
                <select id="bugCat">
                  <option value="bug">📸 Report Bug / Issue</option>
                  <option value="paid_help">⭐ Paid Customer Help</option>
                  <option value="question">💬 Quick Question</option>
                </select>
              </div>
              <div>
                <label for="bugName">Your Name</label>
                <input id="bugName" type="text" maxlength="80" placeholder="Optional" />
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div>
                <label for="bugEmail">Your Email (for fast reply)</label>
                <input id="bugEmail" type="email" maxlength="120" placeholder="you@company.com" />
              </div>
              <div>
                <label for="bugOrderRef">Order / Account #</label>
                <input id="bugOrderRef" type="text" maxlength="80" placeholder="If paid customer" />
              </div>
            </div>

            <label class="paid-row">
              <input id="bugPaidChk" type="checkbox" />
              <span><strong>I'm a Paid Customer</strong> — flag this as VIP urgent priority</span>
            </label>

            <div>
              <label for="bugMsg">What happened or how can we help? (Ctrl+V anywhere to paste screenshot)</label>
              <textarea id="bugMsg" maxlength="3000" placeholder="Describe the issue or question. You can paste (Ctrl+V) or upload any screenshot or photo below..." required></textarea>
            </div>

            <div>
              <input id="shotFile" type="file" accept="image/*" style="display:none;" />
              <div id="dropzone" class="dropzone" tabindex="0">
                📸 <strong>Click to Upload Screenshot / Picture</strong>, Drop Image Here, or Press <strong>Ctrl+V</strong>
              </div>
              <div id="shotPreviewWrap" class="shot-preview">
                <img id="shotPreviewImg" alt="Attached screenshot preview" />
                <button id="shotRemoveBtn" class="shot-remove" type="button">Remove</button>
              </div>
            </div>

            <div id="bugStatus" class="status-box"></div>
            <button id="bugSubmitBtn" class="submit-btn" type="submit">Send Report &amp; Alert Support Immediately &rarr;</button>

            <div id="myTicketsWrap" class="tkt-list" style="display:none;">
              <label>Your Submitted Issues &amp; Support Replies</label>
              <div id="myTicketsList"></div>
            </div>
          </form>
        </div>
      </section>
    `;

    const fabBtn = shadow.getElementById('fabBtn');
    const unreadBadge = shadow.getElementById('unreadBadge');
    const drawer = shadow.getElementById('drawer');
    const closeBtn = shadow.getElementById('closeBtn');
    const tabAi = shadow.getElementById('tabAi');
    const tabBug = shadow.getElementById('tabBug');
    const paneAi = shadow.getElementById('paneAi');
    const paneBug = shadow.getElementById('paneBug');
    const chatMsgs = shadow.getElementById('chatMsgs');
    const chatForm = shadow.getElementById('chatForm');
    const chatInput = shadow.getElementById('chatInput');
    const chatSendBtn = shadow.getElementById('chatSendBtn');
    const aiPaidRef = shadow.getElementById('aiPaidRef');
    const escalateBtn = shadow.getElementById('escalateBtn');
    const wBuy9 = shadow.getElementById('wBuy9');
    const wBuy29 = shadow.getElementById('wBuy29');
    const wPassActiveChip = shadow.getElementById('wPassActiveChip');

    wBuy9?.addEventListener('click', () => window.startFinOpsCheckout('batch24h', { btn: wBuy9, customerEmail: bugEmail.value.trim() || undefined }));
    wBuy29?.addEventListener('click', () => window.startFinOpsCheckout('pro30d', { btn: wBuy29, customerEmail: bugEmail.value.trim() || undefined }));

    const savedPassKey = window.getFinOpsPassKey();
    if (savedPassKey) {
      if (!aiPaidRef.value) aiPaidRef.value = savedPassKey;
      if (!bugOrderRef.value) bugOrderRef.value = savedPassKey;
      wPassActiveChip.style.display = 'block';
      wPassActiveChip.textContent = `Checking pass ${savedPassKey.slice(0, 12)}...`;
      let attempts = 0;
      const pollWidgetPass = () => {
        attempts++;
        fetch(`${API_BASE}/v1/checkout/pass-status?passKey=${encodeURIComponent(savedPassKey)}`)
          .then((r) => r.json())
          .then((j) => {
            if (j.ok && j.active) {
              window.__finopsVerifiedActivePass = true;
              try { window.dispatchEvent(new CustomEvent('finops-pass-active')); } catch {}
              const label = j.plan === 'pro30d' ? '30d Pro' : j.plan === 'test1usd' ? '$1 Live Test' : '24h Unlimited';
              wPassActiveChip.textContent = `🟢 ACTIVE PASS: ${savedPassKey} (${label})`;
              wPassActiveChip.style.color = '#34d399';
            } else if (j.ok) {
              wPassActiveChip.textContent = `🟡 Pass ${savedPassKey.slice(0, 12)}... (${j.status}) — waiting for PayPal confirmation...`;
              wPassActiveChip.style.color = '#fbbf24';
              if (j.status === 'pending' && attempts < 25) setTimeout(pollWidgetPass, 3000);
            }
          })
          .catch(() => {
            wPassActiveChip.textContent = `Key saved: ${savedPassKey}`;
          });
      };
      pollWidgetPass();
    }

    const bugForm = shadow.getElementById('bugForm');
    const bugCat = shadow.getElementById('bugCat');
    const bugName = shadow.getElementById('bugName');
    const bugEmail = shadow.getElementById('bugEmail');
    const bugOrderRef = shadow.getElementById('bugOrderRef');
    const bugPaidChk = shadow.getElementById('bugPaidChk');
    const bugMsg = shadow.getElementById('bugMsg');
    const shotFile = shadow.getElementById('shotFile');
    const dropzone = shadow.getElementById('dropzone');
    const shotPreviewWrap = shadow.getElementById('shotPreviewWrap');
    const shotPreviewImg = shadow.getElementById('shotPreviewImg');
    const shotRemoveBtn = shadow.getElementById('shotRemoveBtn');
    const bugStatus = shadow.getElementById('bugStatus');
    const bugSubmitBtn = shadow.getElementById('bugSubmitBtn');
    const myTicketsWrap = shadow.getElementById('myTicketsWrap');
    const myTicketsList = shadow.getElementById('myTicketsList');

    let attachedScreenshot = '';

    function switchTab(mode) {
      const isBug = mode === 'bug';
      tabAi.classList.toggle('active', !isBug);
      paneAi.classList.toggle('active', !isBug);
      tabBug.classList.toggle('active', isBug);
      paneBug.classList.toggle('active', isBug);
      if (isBug) refreshMyTickets();
    }

    function openDrawer(mode = 'ai') {
      drawer.classList.add('open');
      unreadBadge.style.display = 'none';
      switchTab(mode);
      track('open');
    }

    window.openFinOpsConciergeFix = function (opts = {}) {
      openDrawer('bug');
      if (bugCat) bugCat.value = 'paid_help';
      if (bugMsg && !bugMsg.value.trim()) {
        bugMsg.value =
          opts.prefill ||
          'Bank / ERP Rejection Help:\n1) Format & Bank Portal (e.g. Chase NACHA, SEPA pain.001, CommBiz .ABA, Barclays BACS):\n2) Rejection error code or message:\n3) Redacted sample line or header (no real account numbers needed):\n';
      }
      setTimeout(() => {
        if (bugEmail && !bugEmail.value.trim()) bugEmail.focus();
        else if (bugMsg) bugMsg.focus();
      }, 80);
    };

    fabBtn.addEventListener('click', () => {
      if (drawer.classList.contains('open')) drawer.classList.remove('open');
      else openDrawer('ai');
    });
    closeBtn.addEventListener('click', () => drawer.classList.remove('open'));
    tabAi.addEventListener('click', () => switchTab('ai'));
    tabBug.addEventListener('click', () => switchTab('bug'));

    escalateBtn.addEventListener('click', () => {
      const lastUserMsg = [...chatMsgs.querySelectorAll('.msg.user')].pop()?.textContent || '';
      if (lastUserMsg && !bugMsg.value) bugMsg.value = `Need human help with: ${lastUserMsg}\n\nDetails: `;
      if (aiPaidRef.value.trim()) {
        if (aiPaidRef.value.includes('@') && !bugEmail.value) bugEmail.value = aiPaidRef.value.trim();
        else if (!bugOrderRef.value) bugOrderRef.value = aiPaidRef.value.trim();
        bugPaidChk.checked = true;
      }
      switchTab('bug');
    });

    // Inject crisp topbar CTA button if .topbar .nav-links exists
    const navLinks = document.querySelector('.topbar .nav-links');
    if (navLinks && !document.getElementById('finops-nav-help-btn')) {
      const navBtn = document.createElement('button');
      navBtn.id = 'finops-nav-help-btn';
      navBtn.type = 'button';
      navBtn.className = 'btn btn-outline';
      navBtn.style.cssText = 'border-color:#38bdf8;color:#38bdf8;font-weight:700;padding:7px 12px;font-size:0.84rem;';
      navBtn.textContent = '📸 Report Issue / Live Help';
      navBtn.addEventListener('click', () => openDrawer('bug'));
      const primaryStoreBtn = navLinks.querySelector('.btn-primary');
      if (primaryStoreBtn) navLinks.insertBefore(navBtn, primaryStoreBtn);
      else navLinks.appendChild(navBtn);
    }

    function appendChatMsg(text, cls) {
      const div = document.createElement('div');
      div.className = `msg ${cls}`;
      div.textContent = text;
      chatMsgs.appendChild(div);
      chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }

    async function sendChatQuestion(questionText) {
      const text = questionText.trim();
      if (!text) return;
      appendChatMsg(text, 'user');
      chatInput.value = '';
      chatSendBtn.disabled = true;
      track('chat');

      const paidVal = aiPaidRef.value.trim();
      try {
        const res = await fetch(`${API_BASE}/v1/support/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            convId,
            sessionNum,
            message: text,
            pageUrl: location.href,
            toolContext: getActiveToolContext(),
            customerEmail: paidVal.includes('@') ? paidVal : '',
            orderRef: !paidVal.includes('@') ? paidVal : '',
            isPaid: Boolean(paidVal)
          })
        });
        const data = await res.json();
        appendChatMsg(data.reply || 'Please use the Report Issue tab if you need more help.', data.scopeBlocked ? 'blocked' : 'bot');
      } catch {
        appendChatMsg('Connection hiccup — please switch to the 📸 Report Issue / Message Us tab to send us a direct message!', 'bot');
      } finally {
        chatSendBtn.disabled = false;
      }
    }

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendChatQuestion(chatInput.value);
    });

    shadow.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => sendChatQuestion(btn.getAttribute('data-q') || btn.textContent));
    });

    async function handleImageFile(file) {
      if (!file || !file.type.startsWith('image/')) return;
      bugStatus.style.display = 'none';
      try {
        attachedScreenshot = await compressImageToDataUrl(file);
        shotPreviewImg.src = attachedScreenshot;
        shotPreviewWrap.style.display = 'block';
      } catch (err) {
        bugStatus.className = 'status-box status-err';
        bugStatus.textContent = err.message || 'Could not process screenshot.';
        bugStatus.style.display = 'block';
      }
    }

    dropzone.addEventListener('click', () => shotFile.click());
    shotFile.addEventListener('change', () => {
      if (shotFile.files?.[0]) handleImageFile(shotFile.files[0]);
    });
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag');
      if (e.dataTransfer?.files?.[0]) handleImageFile(e.dataTransfer.files[0]);
    });
    shadow.addEventListener('paste', (e) => {
      const items = e.clipboardData?.items || [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          if (blob) handleImageFile(blob);
          break;
        }
      }
    });
    shotRemoveBtn.addEventListener('click', () => {
      attachedScreenshot = '';
      shotFile.value = '';
      shotPreviewImg.src = '';
      shotPreviewWrap.style.display = 'none';
    });

    async function refreshMyTickets() {
      const saved = loadTickets();
      if (!saved.length) {
        myTicketsWrap.style.display = 'none';
        return;
      }
      myTicketsWrap.style.display = 'block';
      let hasNewReply = false;
      const htmlRows = await Promise.all(
        saved.slice(0, 4).map(async (t) => {
          try {
            const res = await fetch(`${API_BASE}/v1/support/ticket-status?ticketId=${encodeURIComponent(t.ticketId)}&secret=${encodeURIComponent(t.ticketSecret)}`);
            const j = await res.json();
            if (!j.ok) return '';
            const tk = j.ticket;
            if (tk.agentReply) hasNewReply = true;
            return `
              <div class="tkt-item">
                <div><strong>${tk.ticketId}</strong> &bull; <span>${tk.status.toUpperCase()}</span></div>
                <div style="color:#94a3b8;margin-top:2px;">${String(tk.message).slice(0, 90).replace(/</g, '&lt;')}</div>
                ${tk.agentReply ? `<div class="tkt-reply"><strong>Support Reply:</strong> ${String(tk.agentReply).replace(/</g, '&lt;')}</div>` : ''}
              </div>`;
          } catch {
            return '';
          }
        })
      );
      myTicketsList.innerHTML = htmlRows.filter(Boolean).join('') || '<div style="color:#64748b;font-size:11.5px;">Checking tickets...</div>';
      if (hasNewReply && !drawer.classList.contains('open')) unreadBadge.style.display = 'inline-block';
    }

    bugForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      bugSubmitBtn.disabled = true;
      bugStatus.style.display = 'none';
      track('ticket');

      try {
        const res = await fetch(`${API_BASE}/v1/support/ticket`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            convId,
            category: bugCat.value,
            isPaid: bugPaidChk.checked || bugCat.value === 'paid_help' || Boolean(bugOrderRef.value.trim()),
            orderRef: bugOrderRef.value.trim(),
            customerName: bugName.value.trim(),
            customerEmail: bugEmail.value.trim(),
            message: bugMsg.value.trim(),
            pageUrl: location.href,
            toolContext: getActiveToolContext(),
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            screenshotData: attachedScreenshot
          })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || 'Could not submit issue.');
        }
        saveTicket(data.ticketId, data.ticketSecret, bugCat.value);
        bugStatus.className = 'status-box status-ok';
        bugStatus.textContent = `✅ Received! Ticket ${data.ticketId} (${data.priority === 'vip_paid' ? 'VIP Paid Priority' : 'Support Alerted'}). We just notified our engineer and will reply right here or by email shortly!`;
        bugStatus.style.display = 'block';
        bugMsg.value = '';
        attachedScreenshot = '';
        shotPreviewWrap.style.display = 'none';
        await refreshMyTickets();
      } catch (err) {
        bugStatus.className = 'status-box status-err';
        bugStatus.textContent = `❌ ${err.message}`;
        bugStatus.style.display = 'block';
      } finally {
        bugSubmitBtn.disabled = false;
      }
    });

    // Check quietly on load if any customer ticket received a new human/AI reply
    if (loadTickets().length) {
      setTimeout(refreshMyTickets, 2000);
    }

    // Inject Universal Direct Conversion Bar on all 79+ SEO / Validator / Country Pages lacking top checkout buttons
    try {
      const hasTopCheckout = Boolean(document.getElementById('directCheckoutBar') || document.getElementById('btn-hero-pass-24h'));
      if (!hasTopCheckout && !document.getElementById('finops-global-pass-strip')) {
        const strip = document.createElement('div');
        strip.id = 'finops-global-pass-strip';
        strip.style.cssText = 'background:linear-gradient(90deg,rgba(15,23,42,0.97),rgba(30,41,59,0.97));border-bottom:1px solid rgba(245,158,11,0.4);padding:9px 16px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';
        strip.innerHTML =
          '<div style="max-width:1160px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;font-size:0.82rem;color:#e2e8f0;">' +
            '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
              '<span id="fopStripBadge" style="font-weight:800;color:#fbbf24;">&#9889; Instant No-Signup Bank File Pass:</span>' +
              '<span id="fopStripSub" style="color:#cbd5e1;">Generate unlimited SEPA, NACHA, Peppol, DATEV, BACS, ABA &amp; CPA-005 batches right in your browser.</span>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;">' +
              '<a href="./free-csv-to-sepa-nacha-bacs-aba-cpa005-json-mapper.html" style="padding:6px 11px;border-radius:7px;border:1px solid rgba(56,189,248,0.55);color:#7dd3fc;text-decoration:none;font-weight:700;font-size:0.78rem;">&#127379; Free 2-Row Live Test</a>' +
              '<button type="button" id="fopStripConcierge" style="padding:6px 10px;border-radius:7px;border:1px solid rgba(52,211,153,0.55);background:rgba(16,185,129,0.12);color:#6ee7b7;font-weight:700;font-size:0.77rem;cursor:pointer;">&#128736;&#65039; Rejected File? Free Diagnosis</button>' +
              '<button type="button" id="fopStripBuy9" style="padding:6px 12px;border-radius:7px;border:none;background:linear-gradient(135deg,#f59e0b,#eab308);color:#111827;font-weight:800;font-size:0.79rem;cursor:pointer;">&#9889; 24h Unlimited ($9)</button>' +
              '<button type="button" id="fopStripBuy29" style="padding:6px 11px;border-radius:7px;border:1px solid #fbbf24;background:transparent;color:#fde68a;font-weight:700;font-size:0.78rem;cursor:pointer;">&#128640; 30d Pro + API ($29)</button>' +
              '<button type="button" id="fopStripPayPal" style="display:none;padding:6px 10px;border-radius:7px;border:1px solid #60a5fa;background:transparent;color:#93c5fd;font-weight:700;font-size:0.76rem;cursor:pointer;">PayPal</button>' +
              '<button type="button" id="fopStripCfo" title="Copy a summary + payment link to send to your manager or finance cardholder" style="padding:6px 10px;border-radius:7px;border:1px solid #475569;background:#0f172a;color:#cbd5e1;font-weight:600;font-size:0.76rem;cursor:pointer;">&#128203; Send to Boss/CFO</button>' +
            '</div>' +
          '</div>';

        const topbar = document.querySelector('header.topbar') || document.querySelector('header');
        if (topbar && topbar.parentNode) {
          topbar.parentNode.insertBefore(strip, topbar.nextSibling);
        } else if (document.body.firstChild) {
          document.body.insertBefore(strip, document.body.firstChild);
        }

        const b9 = document.getElementById('fopStripBuy9');
        const b29 = document.getElementById('fopStripBuy29');
        const bPP = document.getElementById('fopStripPayPal');
        const bCfo = document.getElementById('fopStripCfo');
        const bConc = document.getElementById('fopStripConcierge');
        const badgeEl = document.getElementById('fopStripBadge');
        const subEl = document.getElementById('fopStripSub');

        bConc?.addEventListener('click', () => window.openFinOpsConciergeFix());
        b9?.addEventListener('click', () => window.startFinOpsCheckout('batch24h', { btn: b9 }));
        b29?.addEventListener('click', () => window.startFinOpsCheckout('pro30d', { btn: b29 }));
        bPP?.addEventListener('click', () => window.startFinOpsCheckout('batch24h', { btn: bPP, provider: 'paypal' }));
        bCfo?.addEventListener('click', () => {
          const shareText = 'FinOps Studio — Deterministic Bank & E-Invoice File Generator ($9 24h Unlimited Pass or $29 30-Day Pro API/MCP Pass, zero subscription): https://geornaden.github.io/finops-studio/free-csv-to-sepa-nacha-bacs-aba-cpa005-json-mapper.html';
          window.finopsSafeCopy(shareText);
          if (bCfo) {
            const old = bCfo.textContent;
            bCfo.textContent = 'Copied CFO Link!';
            setTimeout(() => { bCfo.textContent = old; }, 2000);
          }
        });

        const activeK = window.getFinOpsPassKey();
        if (activeK && badgeEl && subEl) {
          badgeEl.style.color = '#34d399';
          badgeEl.textContent = 'PASS SAVED: ' + activeK.slice(0, 14) + '...';
          subEl.innerHTML = 'Open the <a href="./free-csv-to-sepa-nacha-bacs-aba-cpa005-json-mapper.html" style="color:#38bdf8;font-weight:700;">1-Click CSV/JSON Runner</a> to generate unlimited bank files.';
        }
      }

      // Sync real-time payment provider capabilities across the page so labels are 100% accurate
      fetch(`${API_BASE}/v1/checkout/config`)
        .then((r) => r.json())
        .then((cfg) => {
          if (!cfg || !cfg.ok) return;
          window.__finopsStripeReady = Boolean(cfg.stripeCardReady);
          const mapperTitle = document.getElementById('directCheckoutTitle');
          const stripB9 = document.getElementById('fopStripBuy9');
          const stripPP = document.getElementById('fopStripPayPal');
          const mapperPP = document.getElementById('btnBuyPayPalAlt');
          if (cfg.stripeCardReady) {
            if (mapperTitle) mapperTitle.innerHTML = '&#128179; Instant No-Signup Access (Credit/Debit Card, Apple Pay, Google Pay &amp; PayPal)';
            if (stripB9) stripB9.innerHTML = '&#128179; Card / Apple Pay ($9)';
            if (stripPP) stripPP.style.display = 'inline-block';
            if (mapperPP) mapperPP.style.display = 'inline-flex';
          } else {
            if (mapperTitle) mapperTitle.innerHTML = '&#127359;&#65039; Instant No-Signup Production Access ($9 24h Unlimited Pass &bull; $29 30-Day Pro)';
          }
        })
        .catch(() => {});
    } catch {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountWidget);
  else mountWidget();
})();
