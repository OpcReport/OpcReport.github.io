/* WeChat share: QR code + poster generator for OPC Report
 * Triggered from the WeChat icon in the article share box.
 * Poster = canvas image (long-press to save in WeChat).
 */
(function () {
  'use strict';

  var BRAND_DARK = '#262a30';
  var BRAND_BLUE = '#258fb8';
  var BRAND_BLUE_DARK = '#1d7492';
  var TXT_MAIN = '#2c313a';
  var TXT_GREY = '#7a838f';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function openModal(url, title) {
    closeModal();
    var overlay = document.createElement('div');
    overlay.id = 'wechat-share-overlay';
    overlay.innerHTML =
      '<div class="wechat-share-modal" role="dialog" aria-label="Share to WeChat">' +
        '<button type="button" class="wechat-share-close" aria-label="Close">&times;</button>' +
        '<h3 class="wechat-share-title">Share to WeChat</h3>' +
        '<p class="wechat-share-url" title="' + esc(url) + '">' + esc(url) + '</p>' +
        '<div class="wechat-share-actions">' +
          '<button type="button" class="wechat-btn wechat-btn-copy"><span class="fa fa-link"></span> Copy Link</button>' +
          '<button type="button" class="wechat-btn wechat-btn-poster"><span class="fa fa-image"></span> Make Poster</button>' +
        '</div>' +
        '<div class="wechat-share-qr" id="wechat-share-qr"></div>' +
        '<p class="wechat-share-qr-tip">Scan in WeChat to open this article</p>' +
        '<div class="wechat-share-poster-wrap" id="wechat-share-poster-wrap" hidden></div>' +
        '<p class="wechat-share-poster-tip" id="wechat-share-poster-tip" hidden>Long-press the poster to save, then post it to Moments</p>' +
      '</div>';
    document.body.appendChild(overlay);
    document.body.classList.add('wechat-share-lock');

    // QR code (qrcode.min.js, loaded site-wide)
    if (typeof QRCode !== 'undefined') {
      new QRCode(document.getElementById('wechat-share-qr'), {
        text: url,
        width: 180,
        height: 180,
        colorDark: BRAND_DARK,
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
      if (e.target.closest('.wechat-share-close')) closeModal();
      if (e.target.closest('.wechat-btn-copy')) copyLink(url, e.target.closest('.wechat-btn-copy'));
      if (e.target.closest('.wechat-btn-poster')) makePoster(url, title);
    });
    document.addEventListener('keydown', onEsc);
  }

  function onEsc(e) { if (e.key === 'Escape') closeModal(); }

  function closeModal() {
    var ov = document.getElementById('wechat-share-overlay');
    if (ov) ov.remove();
    document.body.classList.remove('wechat-share-lock');
    document.removeEventListener('keydown', onEsc);
  }

  function copyLink(url, btn) {
    function done(ok) {
      if (!btn) return;
      var old = btn.innerHTML;
      btn.innerHTML = ok ? '<span class="fa fa-check"></span> Copied!' : '<span class="fa fa-times"></span> Failed';
      setTimeout(function () { btn.innerHTML = old; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { done(true); }, function () { legacyCopy(url) ? done(true) : done(false); });
    } else {
      done(legacyCopy(url));
    }
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  /* ---------- Poster ---------- */

  function wrapText(ctx, text, maxWidth, maxLines) {
    var lines = [], line = '', words = String(text).split(/\s+/), i, w;
    for (i = 0; i < words.length; i++) {
      w = words[i];
      var test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width <= maxWidth) {
        line = test;
      } else {
        if (line) lines.push(line);
        line = w;
        if (lines.length === maxLines) return lines;
        // single word longer than a line: hard-break it
        while (ctx.measureText(line).width > maxWidth) {
          var cut = line.length;
          while (cut > 1 && ctx.measureText(line.substring(0, cut)).width > maxWidth) cut--;
          lines.push(line.substring(0, cut));
          line = line.substring(cut);
          if (lines.length === maxLines) return lines;
        }
      }
    }
    if (line && lines.length < maxLines) lines.push(line);
    if (lines.length === maxLines && words.length && lines[lines.length - 1] !== line) {
      lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…';
    }
    return lines;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function makePoster(url, title) {
    var wrap = document.getElementById('wechat-share-poster-wrap');
    var tip = document.getElementById('wechat-share-poster-tip');
    if (!wrap) return;
    if (wrap.firstElementChild) { wrap.hidden = false; if (tip) tip.hidden = false; return; } // already made

    var desc = (document.querySelector('meta[name="description"]') || {}).content || '';
    var dateStr = (document.querySelector('meta[property="article:published_time"]') || {}).content || '';
    if (dateStr) dateStr = dateStr.substring(0, 10);
    var dateTxt = dateStr ? 'Daily Briefing · ' + dateStr : 'OPC Report · Daily Briefing';

    // measure with a scratch canvas first
    var W = 750, PAD = 64, QR_SIZE = 150;
    var m = document.createElement('canvas').getContext('2d');

    // title lines (bold 46px, max 5 lines)
    m.font = '700 46px -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    var titleLines = wrapText(m, title, W - PAD * 2, 5);
    // desc lines (28px grey, max 6 lines)
    m.font = '400 28px -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    var descLines = desc ? wrapText(m, desc, W - PAD * 2, 6) : [];

    var HEAD = 170, FOOT = 250;
    var bodyTop = HEAD + 56;
    var titleH = titleLines.length * 62;
    var descTop = bodyTop + titleH + (descLines.length ? 56 : 0);
    var descH = descLines.length * 44;
    var bodyBottom = Math.max(descTop + descH + 30, bodyTop + 300);
    var H = Math.round(bodyBottom + FOOT);

    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d');

    // background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // header band
    ctx.fillStyle = BRAND_DARK;
    ctx.fillRect(0, 0, W, HEAD);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 44px -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('OPC REPORT', PAD, 78);
    ctx.fillStyle = BRAND_BLUE;
    ctx.fillRect(PAD, 100, 88, 6);
    ctx.fillStyle = 'rgba(255,255,255,.72)';
    ctx.font = '400 26px -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.fillText(dateTxt, PAD, 142);

    // title
    ctx.fillStyle = TXT_MAIN;
    ctx.font = '700 46px -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.textBaseline = 'alphabetic';
    titleLines.forEach(function (ln, i) { ctx.fillText(ln, PAD, bodyTop + i * 62); });

    // divider + desc
    if (descLines.length) {
      ctx.fillStyle = '#e8eaee';
      ctx.fillRect(PAD, descTop - 38, W - PAD * 2, 2);
      ctx.fillStyle = TXT_GREY;
      ctx.font = '400 28px -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      descLines.forEach(function (ln, i) { ctx.fillText(ln, PAD, descTop + i * 44); });
    }

    // footer
    ctx.fillStyle = '#f4f6f8';
    ctx.fillRect(0, H - FOOT, W, FOOT);
    // QR: reuse the on-screen QR canvas if present
    var qrEl = document.querySelector('#wechat-share-qr canvas') || document.querySelector('#wechat-share-qr img');
    var qrDrawn = false;
    if (qrEl) {
      try {
        ctx.fillStyle = '#ffffff';
        roundRect(ctx, PAD - 10, H - FOOT + 34, QR_SIZE + 20, QR_SIZE + 20, 12);
        ctx.fill();
        ctx.drawImage(qrEl, PAD, H - FOOT + 44, QR_SIZE, QR_SIZE);
        qrDrawn = true;
      } catch (e) { qrDrawn = false; }
    }
    var tx = qrDrawn ? PAD + QR_SIZE + 44 : PAD;
    var ty = H - FOOT + 92;
    ctx.fillStyle = TXT_MAIN;
    ctx.font = '700 34px -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('Scan to read', tx, ty);
    ctx.fillStyle = BRAND_BLUE_DARK;
    ctx.font = '600 34px -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('opcreport.cn', tx, ty + 52);
    ctx.fillStyle = TXT_GREY;
    ctx.font = '400 24px -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('Daily intelligence for solo founders', tx, ty + 96);

    // render as <img> so WeChat long-press save works
    var img = new Image();
    img.className = 'wechat-share-poster';
    img.alt = title;
    img.src = cv.toDataURL('image/png');
    wrap.appendChild(img);
    wrap.hidden = false;
    if (tip) tip.hidden = false;
  }

  /* ---------- wire up ---------- */

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.article-share-wechat-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var url = btn.getAttribute('data-url') || location.href;
    var title = btn.getAttribute('data-title');
    try { title = decodeURIComponent(title || ''); } catch (err) { title = title || ''; }
    if (!title) title = document.title;
    openModal(url, title);
  });
})();
