/* =================================================================
   Valuatum Equity Research v2 — prose-first render
   - Share price development page added (page 3)
   - Reverse valuation: market-implied growth and profitability path (pages 13–14)
   - All other pages shifted +1 in section numbering
   ================================================================= */

(function () {
'use strict';

const D = window.reportData;
const F = window.VC.fmt;

// ----------------------------------------------------------------
//  Drop 2029E from the displayed year range (forecasts now 2026E–2028E)
// ----------------------------------------------------------------
D.years = D.years.slice(0, 8);
for (const k of Object.keys(D.financials)) {
  if (Array.isArray(D.financials[k]) && D.financials[k].length >= 9) {
    D.financials[k] = D.financials[k].slice(0, 8);
  }
}

// ----------------------------------------------------------------
//  Derived metrics
// ----------------------------------------------------------------
const shares        = D.company.sharesOutM;
const price         = D.quote.price;
const ccy           = D.quote.currency;
const netDebtLatest = D.quote.netDebtLatest;
const target        = D.reco.target;

const mcap      = D.quote.marketCap != null ? D.quote.marketCap : (price * shares);
const ev        = D.quote.ev        != null ? D.quote.ev        : (mcap + netDebtLatest);
const upsidePct = (target - price) / price;
D.quote.marketCap = mcap;
D.quote.ev = ev;

const i2025    = D.years.findIndex(y => y.y === 2025);
const i2026    = D.years.findIndex(y => y.y === 2026);
const ebitda2025 = D.financials.ebitda[i2025];
const ebitda2026 = D.financials.ebitda[i2026];
const fcf2026    = D.financials.fcf[i2026];
const dps2026    = D.financials.dps[i2026];
const fcfYield   = fcf2026 / mcap;

// ----------------------------------------------------------------
//  Format helpers
// ----------------------------------------------------------------
function fmtMoney(v, currency) {
  if (v == null) return '—';
  const c = currency || ccy;
  if (Math.abs(v) >= 1000) return c + ' ' + (v / 1000).toFixed(1) + ' bn';
  return c + ' ' + F(v, { dp: 0 }) + ' m';
}

// ----------------------------------------------------------------
//  Bind helpers
// ----------------------------------------------------------------
function setVal(sel, val) {
  document.querySelectorAll('[data-bind="' + sel + '"]').forEach(n => { n.textContent = val; });
}
function setHTML(sel, html) {
  document.querySelectorAll('[data-bind-html="' + sel + '"]').forEach(n => { n.innerHTML = html; });
}

// ----------------------------------------------------------------
//  Bindings — cover + snapshot
// ----------------------------------------------------------------
setVal('meta.reportDateLong', D.meta.reportDateLong);
setVal('meta.priceAsOf', D.meta.priceAsOf);
setVal('company.name', D.company.name);
setVal('company.ticker', D.company.ticker);
setVal('company.exchange', D.company.exchange);
setVal('company.sector', D.company.sector);
setVal('company.country', D.company.country);
setVal('company.fy', D.company.fy);
setVal('quote.price', F(price, { dp: 2 }));
setVal('quote.currency', ccy);
setVal('quote.marketCap', fmtMoney(mcap));
setVal('quote.ev', fmtMoney(ev));
setVal('reco.rating', D.reco.rating);
setVal('reco.prevRating', D.reco.prevRating);
setVal('reco.target', F(target, { dp: 2 }));
setVal('reco.upsidePct', (upsidePct >= 0 ? '+' : '') + (upsidePct * 100).toFixed(1) + '%');
setVal('reco.horizonView', D.reco.horizonView);
setVal('reco.mainDriver', D.reco.mainDriver);
setVal('reco.mainRisk', D.reco.mainRisk);
setVal('reco.lead', D.reco.lead);
setHTML('reco.body', D.reco.body);

if (upsidePct < 0) {
  document.querySelectorAll('.cover-card--upside').forEach(n => n.classList.add('is-neg'));
}

setVal('mult.pe',       F(D.multiples.pe.y2026,       { dp: 1 }) + '×');
setVal('mult.evEbitda', F(D.multiples.evEbitda.y2026, { dp: 1 }) + '×');
setVal('mult.fcfYield', (fcfYield * 100).toFixed(1) + '%');
setVal('mult.divYield', (D.multiples.divYield.y2026 * 100).toFixed(1) + '%');
setVal('mult.divDps',   'DPS ' + F(dps2026, { dp: 2 }) + ' ' + ccy);
setVal('mult.ndEbitda', F(D.multiples.ndEbitda.y2026, { dp: 2 }) + '×');

// Thesis list (snapshot page)
(function () {
  const ul = document.querySelector('[data-list="thesis.reasons"]');
  if (!ul) return;
  D.thesis.reasons.forEach((r, i) => {
    const li = document.createElement('li');
    li.innerHTML =
      '<span class="num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="ttl">' + r.title + '</span>' +
      '<span class="bod">' + r.body + '</span>' +
      '<span class="fig">' + r.figure + '</span>';
    ul.appendChild(li);
  });
})();
setVal('thesis.breaker', D.thesis.breaker);

function renderReasons() {
  const grid = document.getElementById('reasons-grid');
  if (!grid) return;
  D.thesis.reasons.forEach((r, i) => {
    const c = document.createElement('div');
    c.className = 'reason';
    c.innerHTML =
      '<div class="reason__num">' + String(i + 1).padStart(2, '0') + ' /</div>' +
      '<div class="reason__title">' + r.title + '</div>' +
      '<div class="reason__body">' + r.body + '</div>' +
      '<div class="reason__fig">' + r.figure + '</div>';
    grid.appendChild(c);
  });
}

// ----------------------------------------------------------------
//  Segment totals
// ----------------------------------------------------------------
const totals = {
  revenue: D.valuePools.reduce((s, p) => s + p.revenue, 0),
  ebit:    D.valuePools.reduce((s, p) => s + p.ebit, 0),
  mcap:    D.valuePools.reduce((s, p) => s + p.mcap, 0)
};

function renderSegmentTable() {
  const tbody = document.getElementById('tbody-segment-econ');
  if (!tbody) return;
  D.valuePools.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td><b>' + p.name + '</b></td>' +
      '<td class="num">' + F(p.revenue) + '</td>' +
      '<td class="num dim">' + (p.revenue / totals.revenue * 100).toFixed(1) + '%</td>' +
      '<td class="num">' + F(p.ebit) + '</td>' +
      '<td class="num dim">' + (p.ebit / totals.ebit * 100).toFixed(1) + '%</td>' +
      '<td class="num">' + F(p.mcap) + '</td>' +
      '<td class="num dim">' + (p.mcap / totals.mcap * 100).toFixed(1) + '%</td>' +
      '<td>' + p.archetype + '</td>';
    tbody.appendChild(tr);
  });
  const tot = document.createElement('tr');
  tot.className = 'is-total';
  tot.innerHTML =
    '<td>Segment subtotal</td>' +
    '<td class="num">' + F(totals.revenue) + '</td><td class="num dim">100.0%</td>' +
    '<td class="num">' + F(totals.ebit) + '</td><td class="num dim">—</td>' +
    '<td class="num">' + F(totals.mcap) + '</td><td class="num dim">100.0%</td>' +
    '<td></td>';
  tbody.appendChild(tot);
}

// ----------------------------------------------------------------
//  Page builder
// ----------------------------------------------------------------
const dyn = document.getElementById('dynamic-pages');

function makePage(opts) {
  const sec = document.createElement('section');
  sec.className = 'page';
  sec.dataset.section = opts.section;
  sec.innerHTML = `
    <header class="page-header">
      <div class="page-header__left">VALUATUM</div>
      <div class="page-header__center">${D.company.name} · ${D.company.ticker}</div>
      <div class="page-header__right">${opts.section.toUpperCase()}</div>
    </header>
    <div class="page-body">
      ${opts.head === false ? '' : `
      <div class="section-head">
        <div class="section-head__num">${opts.num}</div>
        <div>
          <div class="section-head__kicker">${opts.kicker}</div>
          <h2 class="section-head__title">${opts.title}</h2>
          ${opts.lead ? `<p class="section-head__lead">${opts.lead}</p>` : ''}
        </div>
      </div>`}
      ${opts.bodyHTML}
    </div>
    <footer class="page-footer">
      <span>Valuatum  |  Equity Research  |  ${D.company.name}</span>
      <span class="page-num"></span>
    </footer>
  `;
  dyn.appendChild(sec);
  return sec;
}

function proseHtml(paras) {
  return paras.map(p => '<p>' + p + '</p>').join('');
}

// ===============================================================
// Page 3 — Share Price Development
// ===============================================================
(function () {
  const ph    = D.priceHistory || {};
  const hasData = ph.data && ph.data.length > 0;
  const stats = ph.stats || {};
  const c     = ph.currency || ccy;

  function fmtPct(v) {
    if (v == null) return '—';
    return (v >= 0 ? '+' : '') + (v * 100).toFixed(1) + '%';
  }
  function fmtPr(v) {
    if (v == null) return '—';
    return F(v, { dp: 2 }) + ' ' + c;
  }

  const summaryItems = [
    { label: 'Current price',  value: fmtPr(price),  note: D.meta.priceAsOf },
    { label: 'Target price',   value: fmtPr(target), note: '12-month fundamental' },
    { label: 'Implied upside', value: (upsidePct >= 0 ? '+' : '') + (upsidePct * 100).toFixed(1) + '%', note: 'vs. current price' },
    { label: '52-week high',   value: fmtPr(stats.high52w),   note: '' },
    { label: '52-week low',    value: fmtPr(stats.low52w),    note: '' },
    { label: '1-year change',  value: fmtPct(stats.change1y), note: '' },
    { label: '3-year change',  value: fmtPct(stats.change3y), note: '' },
    { label: 'Report date',    value: D.meta.reportDateLong,  note: '' }
  ];

  const summaryHtml = summaryItems.map(s => `
    <div class="price-stat">
      <div class="price-stat__label">${s.label}</div>
      <div class="price-stat__value">${s.value}</div>
      ${s.note ? `<div class="price-stat__note">${s.note}</div>` : ''}
    </div>
  `).join('');

  const chartHtml = hasData
    ? `<div id="chart-price-line" style="width:100%;height:148mm;"></div>`
    : `<div style="display:flex;align-items:center;justify-content:center;height:120mm;border:1px solid var(--c-border);background:var(--c-card);color:var(--c-muted);font-size:10pt;">Historical share price data unavailable</div>`;

  makePage({
    section: 'Share price development', num: '03',
    kicker: 'Share price development',
    title: 'Price history, target price and valuation context',
    bodyHTML: `
      ${chartHtml}
      <div class="price-summary" style="margin-top:4mm;">${summaryHtml}</div>
      <div class="callout" style="margin-top:4mm;">
        <div class="callout__label">Context</div>
        The share price chart shows whether the current recommendation is being made after a recovery, a drawdown, or a sideways period. It helps the reader understand the entry point before reading the valuation and reverse valuation sections.
      </div>
    `
  });

  if (hasData) {
    setTimeout(() => {
      const el = document.getElementById('chart-price-line');
      if (el && window.VC.priceLine) {
        window.VC.priceLine(el, ph.data, { target, currency: c, w: 900, h: 440 });
      }
    }, 0);
  }
})();

// ===============================================================
// Page 4 — Value breakdown I: Market cap allocation
// ===============================================================
makePage({
  section: 'Value breakdown', num: '04',
  kicker: 'Value breakdown · 1 of 2',
  title: 'How the market is paying for each part of the business',
  lead: 'We attribute current market capitalisation across six value pools. The split is analyst-modelled and reflects relative through-cycle earnings power and cash-conversion, not headline revenue weight.',
  bodyHTML: `
    <div class="vbreak-charts">
      <div class="chart-card">
        <div class="chart-card__title">Market cap allocation by value pool</div>
        <div class="chart-card__sub">EUR million · ${fmtMoney(totals.mcap)} total allocated</div>
        <div id="chart-mcap-donut" class="chart-card__body"></div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-card__title">Segment economics</div>
      <table class="dtable dtable--segments">
        <thead>
          <tr>
            <th>Value pool</th>
            <th class="num">Revenue</th>
            <th class="num">Rev. %</th>
            <th class="num">Comp. EBIT</th>
            <th class="num">EBIT %</th>
            <th class="num">Mcap</th>
            <th class="num">Mcap %</th>
            <th>Archetype</th>
          </tr>
        </thead>
        <tbody id="tbody-segment-econ"></tbody>
      </table>
      <div class="table-card__note">FY2024 segment data. Revenue and Comparable EBIT in EUR million. Mcap allocation is analyst-modelled and sums to 100%. Sources: financial snapshot, company value map, model output.</div>
    </div>
  `
});

// ===============================================================
// Page 5 — Value breakdown II: EBIT & Net sales by segment
// ===============================================================
makePage({
  section: 'Value breakdown', num: '05',
  kicker: 'Value breakdown · 2 of 2',
  title: 'Revenue versus profit contribution by value pool',
  lead: 'Revenue weight and comparable EBIT contribution are deliberately not aligned: Energy carries an outsized EBIT share (14.8%) relative to its revenue share (6.1%), while UPM Communication Papers contributes 22.3% of comparable EBIT despite only 6.7% of allocated market capitalisation.',
  bodyHTML: `
    <div class="vbreak-pair">
      <div class="chart-card">
        <div class="chart-card__title">Net sales by value pool</div>
        <div class="chart-card__sub">${D.company.fy} · EUR million</div>
        <div id="chart-sales-bar" class="chart-card__body"></div>
      </div>
      <div class="chart-card">
        <div class="chart-card__title">EBIT by value pool</div>
        <div class="chart-card__sub">${D.company.fy} · EUR million</div>
        <div id="chart-ebit-bar" class="chart-card__body"></div>
      </div>
    </div>

    <div class="callout" style="margin-top: 6mm;">
      <div class="callout__label">Interpretation</div>
      The economic engine of the group is concentrated. Fibres carries the largest single share of comparable EBIT (43.5%) and the largest cyclical swing; Energy is disproportionately profitable relative to its revenue (14.8% EBIT on 6.1% revenue). Communication Papers still contributes 22.3% of comparable EBIT but commands only 6.7% of allocated market capitalisation — a clear signal that the market discounts its structural decline more than its near-term cash generation.
    </div>
  `
});

// ===============================================================
// Page 6 — Recommendation & Investment Summary
// ===============================================================
makePage({
  section: 'Recommendation', num: '06',
  kicker: 'Recommendation &amp; investment summary',
  title: 'A 30-second view of the call',
  bodyHTML: `
    <div class="reco-grid">
      <div class="reco-text">
        <p class="lead">${D.reco.lead}</p>
        ${D.reco.body}
      </div>
      <aside class="decision-card">
        <div class="decision-card__rating">
          <div class="decision-card__rating-label">Rating</div>
          <div class="decision-card__rating-value">${D.reco.rating}</div>
          <div class="decision-card__rating-prev">prev. ${D.reco.prevRating}</div>
        </div>
        <dl class="decision-card__rows">
          <div><dt>Target price</dt><dd>${target.toFixed(2)} ${ccy}</dd></div>
          <div><dt>Current price</dt><dd>${price.toFixed(2)} ${ccy}</dd></div>
          <div><dt>Implied upside</dt><dd>${(upsidePct >= 0 ? '+' : '') + (upsidePct * 100).toFixed(1)}%</dd></div>
          <div><dt>12-month view</dt><dd>${D.reco.horizonView}</dd></div>
          <div><dt>Main driver</dt><dd>${D.reco.mainDriver}</dd></div>
          <div><dt>Main risk</dt><dd>${D.reco.mainRisk}</dd></div>
        </dl>
      </aside>
    </div>

    <div class="reasons">
      <div class="reasons__title">Three reasons to own the stock</div>
      <div class="reasons__grid" id="reasons-grid"></div>
    </div>
  `
});
renderReasons();

// ===============================================================
// Pages 7–12 — Core Analysis (6 pages, prose-first)
// ===============================================================

// 7. Executive Economic Map
makePage({
  section: 'Core analysis', num: '07',
  kicker: 'Core analysis · 1 of 6',
  title: 'Executive economic map — how the parts add up',
  bodyHTML: `
    <div class="analysis analysis--full">
      <div class="analysis__prose prose--lead">
        ${proseHtml(D.core.executiveMap.paras)}
      </div>
    </div>

    <div class="callout" style="margin-top: 8mm;">
      <div class="callout__label">Analytical anchor</div>
      The investment case is not "is there a recovery?" — forecasts and consensus agree there is. The investment case is "how much of that recovery is in the price?" Reverse valuation puts the market at roughly halfway between trough and through-cycle. The asymmetry favours owning the stock if the recovery delivers in line with consensus, with limited downside if it disappoints by 10–15%.
    </div>
  `
});

// 8. Fibres deep dive
(function () {
  const p = D.core.poolDeepDives[0];
  makePage({
    section: 'Core analysis · Fibres', num: '08',
    kicker: 'Core analysis · 2 of 6',
    title: p.name,
    bodyHTML: `
      <div class="analysis">
        <div class="analysis__prose">
          ${proseHtml(p.paras)}
        </div>
        <aside class="pool-kpi">
          <div class="pool-kpi__title">Pool fact sheet</div>
          <dl>${p.kpi.map(k => `<div><dt>${k.k}</dt><dd>${k.v}</dd></div>`).join('')}</dl>
        </aside>
      </div>
    `
  });
})();

// 9. Energy deep dive
(function () {
  const p = D.core.poolDeepDives[1];
  makePage({
    section: 'Core analysis · Energy', num: '09',
    kicker: 'Core analysis · 3 of 6',
    title: p.name,
    bodyHTML: `
      <div class="analysis">
        <div class="analysis__prose">
          ${proseHtml(p.paras)}
        </div>
        <aside class="pool-kpi">
          <div class="pool-kpi__title">Pool fact sheet</div>
          <dl>${p.kpi.map(k => `<div><dt>${k.k}</dt><dd>${k.v}</dd></div>`).join('')}</dl>
        </aside>
      </div>
    `
  });
})();

// 10. Communication & Specialty + Raflatac/Plywood
(function () {
  const a = D.core.poolDeepDives[2];
  const b = D.core.poolDeepDives[3];
  makePage({
    section: 'Core analysis · Other pools', num: '10',
    kicker: 'Core analysis · 4 of 6',
    title: 'Communication, Specialty, Raflatac and Plywood',
    bodyHTML: `
      <div class="pool-head">
        <div class="pool-head__num">/ A</div>
        <div class="pool-head__title">${a.name}</div>
      </div>
      <div class="analysis__prose" style="margin-bottom: 6mm;">
        ${proseHtml(a.paras)}
      </div>

      <div class="pool-head">
        <div class="pool-head__num">/ B</div>
        <div class="pool-head__title">${b.name}</div>
      </div>
      <div class="analysis__prose">
        ${proseHtml(b.paras)}
      </div>
    `
  });
})();

// 11. Cross-Pool Bridge & Reality Check
makePage({
  section: 'Core analysis · Bridge', num: '11',
  kicker: 'Core analysis · 5 of 6',
  title: 'Cross-pool financial bridge and valuation reality check',
  bodyHTML: `
    <div class="subhead">Cross-pool financial bridge</div>
    <div class="analysis__prose">
      ${proseHtml(D.core.crossBridge.paras)}
    </div>

    <div class="callout" style="margin: 6mm 0;">
      <div class="callout__label">Bridge mechanics</div>
      EBIT 432 EUR m (2025A) → 1,391 EUR m (2027E). Roughly 60% Fibres, 25% Energy, 10% Specialty/Raflatac, 5% group cost-out. None requires above-consensus assumptions.
    </div>

    <div class="subhead">Valuation reality check</div>
    <div class="analysis__prose">
      ${proseHtml(D.core.realityCheck.paras)}
    </div>
  `
});

// 12. Scenarios, Catalysts, Risks, Bottom Line
makePage({
  section: 'Core analysis · Bottom line', num: '12',
  kicker: 'Core analysis · 6 of 6',
  title: 'Scenarios, key risks and bottom-line analytical judgment',
  bodyHTML: `
    <div class="subhead">Scenario logic and thesis breakers</div>
    <div class="analysis__prose">
      ${proseHtml(D.core.scenarioDiscussion.paras)}
    </div>

    <div class="subhead" style="margin-top: 6mm;">Catalysts and key risks</div>
    <div class="analysis__prose">
      ${proseHtml(D.core.catalystsRisks.catalystsParas.concat(D.core.catalystsRisks.risksParas))}
    </div>

    <div class="callout" style="margin-top: 6mm; border-left-color: #12352b;">
      <div class="callout__label" style="color:#12352b;">Bottom-line analytical judgment</div>
      ${D.core.bottomLine.paras.map(p => '<p style="margin:0 0 2mm 0;">' + p + '</p>').join('')}
    </div>
  `
});

// ===============================================================
// Page 13 — Reverse Valuation I: Market-implied growth path
// ===============================================================
(function () {
  const rv   = D.reverseValuation      || {};
  const hist = rv.historicalYears      || [];
  const impl = rv.marketImpliedYears   || [];
  const sum  = rv.summary              || {};

  const allYears = [...hist, ...impl];
  const labels   = allYears.map(y => y.year);
  const netSales = allYears.map(y => y.netSales);
  const estStart = hist.length;

  function fmtCAGR(v) {
    const pct = (v * 100);
    return (pct >= 0 ? '+' : '') + pct.toFixed(1) + '% p.a.';
  }

  const lastActual = hist[hist.length - 1] || {};
  const sum_histCAGR = sum.historicalNetSalesCAGR || 0;
  const sum_implCAGR = sum.impliedNetSalesCAGR    || 0;

  makePage({
    section: 'Reverse valuation', num: '13',
    kicker: 'Reverse valuation · 1 of 3',
    title: 'Reverse valuation — what the current price requires',
    lead: 'The current share price is translated into an implied operating path. The focus is not on the original DCF model, but on the growth and profitability required for the current valuation to hold.',
    bodyHTML: `
      <div class="rv-callout-card" style="margin-bottom:3.5mm;">
        <div class="rv-callout-card__label">Market insight</div>
        <div class="rv-callout-card__title">${rv.mainMessage || ''}</div>
      </div>

      <div class="rv-kpi-strip">
        <div class="kpi">
          <div class="kpi__label">Current share price</div>
          <div class="kpi__value">${rv.currentPrice || '—'}<span class="kpi__unit">${rv.currency || ''}</span></div>
        </div>
        <div class="kpi">
          <div class="kpi__label">Price-implied value anchor</div>
          <div class="kpi__value">${rv.marketImpliedFairValuePerShare || '—'}<span class="kpi__unit">${rv.currency || ''}</span></div>
        </div>
        <div class="kpi">
          <div class="kpi__label">Historical net sales CAGR 2021–2025</div>
          <div class="kpi__value">${fmtCAGR(sum_histCAGR)}</div>
        </div>
        <div class="kpi">
          <div class="kpi__label">Implied net sales CAGR 2026–2035</div>
          <div class="kpi__value">${fmtCAGR(sum_implCAGR)}</div>
        </div>
        <div class="kpi">
          <div class="kpi__label">Terminal implied EBIT margin 2035E</div>
          <div class="kpi__value">${(sum.terminalImpliedEBITMargin || 0).toFixed(1)}<span class="kpi__unit">%</span></div>
        </div>
      </div>
      <div class="rv-strip-note">This is not Valuatum's target price. It is the operating path implied by the current share price in the reverse valuation model.</div>

      <div class="bridge-single" style="margin-bottom:0;">
        <div class="chart-card" style="height:112mm;margin-bottom:0;">
          <div class="chart-card__title">Net sales — historical and market-implied</div>
          <div class="chart-card__sub">EUR million · 2021A–2025A actual, 2026E–2035E market-implied</div>
          <div id="chart-rv-netsales" class="chart-card__body"></div>
          <div class="rv-cagr-labels">
            <div class="rv-cagr-labels__item">
              <span class="rv-cagr-labels__period">Historical CAGR 2021–2025</span>
              <span class="rv-cagr-labels__value">${fmtCAGR(sum_histCAGR)}</span>
            </div>
            <div class="rv-cagr-labels__divider">vs.</div>
            <div class="rv-cagr-labels__item rv-cagr-labels__item--implied">
              <span class="rv-cagr-labels__period">Market-implied CAGR 2026–2035</span>
              <span class="rv-cagr-labels__value rv-cagr-labels__value--accent">${fmtCAGR(sum_implCAGR)}</span>
            </div>
          </div>
          <div class="legend">
            <span><span class="legend__sw legend__sw--primary"></span>Net sales — Actual</span>
            <span><span class="legend__sw legend__sw--est"></span>Net sales — Market-implied (dashed)</span>
          </div>
        </div>
      </div>

      <div class="rv-insight-para">${rv.insightPage1 || ''}</div>

      <div class="rv-classification-badge">
        Reverse valuation type: <b>${rv.classificationLabel || '—'}</b>
      </div>
    `
  });

  setTimeout(() => {
    const c = document.getElementById('chart-rv-netsales');
    if (!c) return;
    window.VC.comboBars(c, {
      labels,
      w: 900, h: 340,
      estStart,
      estLabel: 'Market-implied',
      yFmt: v => window.VC.fmt(v),
      series: [
        { name: 'Net sales', kind: 'line', color: '#12352b', values: netSales }
      ]
    });
  }, 0);
})();

// ===============================================================
// Page 14 — Reverse Valuation II: Market-implied profitability path
// ===============================================================
(function () {
  const rv   = D.reverseValuation      || {};
  const hist = rv.historicalYears      || [];
  const impl = rv.marketImpliedYears   || [];
  const sum  = rv.summary              || {};

  const allYears   = [...hist, ...impl];
  const labels     = allYears.map(y => y.year);
  const ebitdaMarg = allYears.map(y => y.ebitdaMargin);
  const ebitMarg   = allYears.map(y => y.ebitMargin);
  const estStart   = hist.length;

  const lastActual = hist[hist.length - 1] || {};
  const year1      = impl[0]               || {};
  const year5      = impl[4]               || {};
  const year10     = impl[impl.length - 1] || {};

  function fmtP(v) { return v != null ? v.toFixed(1) + '%' : '—'; }
  function fmtM(v) { return v != null ? F(v) : '—'; }

  const hasFCF = lastActual.fcfMargin != null && year1.fcfMargin != null;

  makePage({
    section: 'Reverse valuation', num: '14',
    kicker: 'Reverse valuation · 2 of 3',
    title: 'Market-implied profitability path',
    lead: 'Reverse valuation translates the current share price into the EBITDA and EBIT margins the company must achieve over the next decade.',
    bodyHTML: `
      <div class="bridge-single" style="margin-bottom:0;">
        <div class="chart-card" style="height:118mm;margin-bottom:3mm;">
          <div class="chart-card__title">EBITDA margin and EBIT margin — historical and market-implied</div>
          <div class="chart-card__sub">% of net sales · 2021A–2025A actual, 2026E–2035E market-implied · actual = solid, market-implied = dashed</div>
          <div id="chart-rv-margins" class="chart-card__body"></div>
          <div class="legend">
            <span><span class="legend__sw legend__sw--primary"></span>EBITDA margin — Actual</span>
            <span><span class="legend__sw legend__sw--alt"></span>EBIT margin — Actual</span>
            <span><span class="legend__sw" style="background:rgba(18,53,43,0.40);border:1px dashed #12352b;display:inline-block;width:10px;height:10px;margin-right:4px;vertical-align:-1px;"></span>EBITDA margin — Market-implied</span>
            <span><span class="legend__sw" style="background:rgba(138,163,154,0.40);border:1px dashed #8aa39a;display:inline-block;width:10px;height:10px;margin-right:4px;vertical-align:-1px;"></span>EBIT margin — Market-implied</span>
          </div>
        </div>
      </div>

      <div class="rv-path-note">Reverse valuation path, not base forecast. These figures show what the current price requires, not Valuatum's base case forecast.</div>

      <div class="table-card" style="margin-bottom:3.5mm;">
        <div class="table-card__title">Required operating path</div>
        <table class="dtable dtable--rv-path">
          <thead>
            <tr>
              <th>Metric</th>
              <th class="num">${lastActual.year || '2025A'}<br><span style="font-weight:400;font-size:7.5pt;opacity:0.75;">Last actual</span></th>
              <th class="num">${year1.year || '2026E'}<br><span style="font-weight:400;font-size:7.5pt;opacity:0.75;">Year 1</span></th>
              <th class="num">${year5.year || '2030E'}<br><span style="font-weight:400;font-size:7.5pt;opacity:0.75;">Year 5</span></th>
              <th class="num">${year10.year || '2035E'}<br><span style="font-weight:400;font-size:7.5pt;opacity:0.75;">Year 10</span></th>
              <th>Interpretation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>Net sales (EURm)</b></td>
              <td class="num">${fmtM(lastActual.netSales)}</td>
              <td class="num">${fmtM(year1.netSales)}</td>
              <td class="num">${fmtM(year5.netSales)}</td>
              <td class="num">${fmtM(year10.netSales)}</td>
              <td class="dim">Modest long-term recovery</td>
            </tr>
            <tr>
              <td><b>Net sales CAGR</b></td>
              <td class="num">${((sum.historicalNetSalesCAGR || 0) * 100).toFixed(1)}%<br><span style="font-size:7.5pt;color:var(--c-muted);">2021–25</span></td>
              <td class="num" colspan="3" style="text-align:right;">${((sum.impliedNetSalesCAGR || 0) * 100 >= 0 ? '+' : '') + ((sum.impliedNetSalesCAGR || 0) * 100).toFixed(1)}% p.a.<br><span style="font-size:7.5pt;color:var(--c-muted);">2026–2035</span></td>
              <td class="dim">Well below 2022 peak</td>
            </tr>
            <tr>
              <td><b>EBITDA margin</b></td>
              <td class="num">${fmtP(lastActual.ebitdaMargin)}</td>
              <td class="num">${fmtP(year1.ebitdaMargin)}</td>
              <td class="num">${fmtP(year5.ebitdaMargin)}</td>
              <td class="num">${fmtP(year10.ebitdaMargin)}</td>
              <td class="dim">Material profitability recovery</td>
            </tr>
            <tr>
              <td><b>EBIT margin</b></td>
              <td class="num">${fmtP(lastActual.ebitMargin)}</td>
              <td class="num">${fmtP(year1.ebitMargin)}</td>
              <td class="num">${fmtP(year5.ebitMargin)}</td>
              <td class="num">${fmtP(year10.ebitMargin)}</td>
              <td class="dim">Recovery from 2025 trough</td>
            </tr>
            ${hasFCF ? `
            <tr>
              <td><b>FCF margin</b></td>
              <td class="num">${fmtP(lastActual.fcfMargin)}</td>
              <td class="num">${fmtP(year1.fcfMargin)}</td>
              <td class="num">${fmtP(year5.fcfMargin)}</td>
              <td class="num">${fmtP(year10.fcfMargin)}</td>
              <td class="dim">Supported by capex discipline</td>
            </tr>` : ''}
          </tbody>
        </table>
      </div>

      <div class="rv-path-note" style="margin-top:1.5mm;">The 2030 margin dip reflects the modelled market-implied path and should not be read as a separate strategic forecast. The key message is the required recovery from 2025 trough profitability toward a low-teens EBIT margin by 2035.</div>
    `
  });

  setTimeout(() => {
    const c = document.getElementById('chart-rv-margins');
    if (!c) return;
    window.VC.comboBars(c, {
      labels,
      w: 900, h: 350,
      estStart,
      estLabel: 'Market-implied',
      yFmt: v => v.toFixed(0) + '%',
      series: [
        { name: 'EBITDA margin', kind: 'line', color: '#12352b', values: ebitdaMarg },
        { name: 'EBIT margin',   kind: 'line', color: '#8aa39a', values: ebitMarg   }
      ]
    });
  }, 0);
})();

// ===============================================================
// Page 15 — Reverse Valuation III: What must happen
// ===============================================================
(function () {
  const rv   = D.reverseValuation      || {};
  const hist = rv.historicalYears      || [];
  const impl = rv.marketImpliedYears   || [];
  const sum  = rv.summary              || {};

  const lastActual = hist[hist.length - 1] || {};
  const year1      = impl[0]               || {};
  const year5      = impl[4]               || {};
  const year10     = impl[impl.length - 1] || {};

  function fmtP(v) { return v != null ? v.toFixed(1) + '%' : '—'; }
  function fmtM(v) { return v != null ? F(v) : '—'; }

  const implCagr = '+' + ((sum.impliedNetSalesCAGR || 0) * 100).toFixed(1);

  makePage({
    section: 'Reverse valuation', num: '15',
    kicker: 'Reverse valuation · 3 of 3',
    title: 'What must happen for the current price to be justified',
    lead: 'The reverse valuation result is not a high-growth case. For UPM, the current price is justified mainly if profitability normalizes. Net sales only need to grow modestly, but margins must recover materially from the 2025 trough and cash conversion must remain disciplined.',
    bodyHTML: `
      <div class="rv-req-cards">

        <div class="rv-req-card">
          <div class="rv-req-card__label">Growth requirement</div>
          <div class="rv-req-card__accent">Modest</div>
          <div class="rv-req-card__number">Net sales: 9.7bn EUR → 12.5bn EUR</div>
          <div class="rv-req-card__body">Market-implied net sales CAGR is only +2.7%&nbsp;p.a. from 2026E to 2035E. The current price does not require a structural growth acceleration or a return to 2022 peak revenue. Growth only needs to normalize gradually from the trough.</div>
          <div class="rv-req-card__dataline">2025A: ${fmtM(lastActual.netSales)}&nbsp;EURm &nbsp;·&nbsp; 2035E: ${fmtM(year10.netSales)}&nbsp;EURm &nbsp;·&nbsp; CAGR 2026–2035: ${implCagr}%&nbsp;p.a.</div>
        </div>

        <div class="rv-req-card rv-req-card--highlight">
          <div class="rv-req-card__label">Profitability requirement</div>
          <div class="rv-req-card__accent">The main hurdle</div>
          <div class="rv-req-card__number">EBIT margin: ${fmtP(lastActual.ebitMargin)} → ${fmtP(year10.ebitMargin)}</div>
          <div class="rv-req-card__body">The key requirement is margin recovery. EBITDA margin must recover from ${fmtP(lastActual.ebitdaMargin)} in 2025A to ${fmtP(year10.ebitdaMargin)} by 2035E, while EBIT margin must recover from ${fmtP(lastActual.ebitMargin)} to ${fmtP(year10.ebitMargin)}. This requires normalized pulp profitability, stable Energy earnings and no permanent deterioration in specialty materials margins.</div>
          <div class="rv-req-card__dataline">EBITDA margin: ${fmtP(lastActual.ebitdaMargin)} → ${fmtP(year10.ebitdaMargin)} &nbsp;·&nbsp; EBIT margin: ${fmtP(lastActual.ebitMargin)} → ${fmtP(year10.ebitMargin)}</div>
        </div>

        <div class="rv-req-card">
          <div class="rv-req-card__label">Cash discipline requirement</div>
          <div class="rv-req-card__accent">No new capex shock</div>
          <div class="rv-req-card__number">FCF margin remains positive</div>
          <div class="rv-req-card__body">The implied path assumes that free cash flow remains positive through the forecast period. The market is not only underwriting higher EBIT; it is also assuming that capex, working capital and balance sheet discipline do not absorb the profitability recovery.</div>
          <div class="rv-req-card__dataline">FCF margin: 2025A ${fmtP(lastActual.fcfMargin)} &nbsp;·&nbsp; 2026E ${fmtP(year1.fcfMargin)} &nbsp;·&nbsp; 2035E ${fmtP(year10.fcfMargin)}</div>
        </div>

      </div>

      <div class="rv-interp-box">
        <div class="rv-interp-box__label">Reverse valuation type: profitability-led</div>
        <div class="rv-interp-box__body">For UPM, reverse valuation says the market is not asking for a new growth story. It is asking for a recovery in operating margins. If net sales follow the modest implied growth path but EBIT margin fails to recover toward low-teens levels, the current price is not supported. If margins normalize broadly in line with the implied path, the current price is defensible even without aggressive revenue growth.</div>
      </div>

      <div class="table-card">
        <div class="table-card__title">Summary: what the current price requires</div>
        <table class="dtable dtable--rv-summary">
          <thead>
            <tr>
              <th>Metric</th>
              <th class="num">Current / trough</th>
              <th class="num">Required by 2035E</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>Net sales</b></td>
              <td class="num">${fmtM(lastActual.netSales)} EURm in 2025A</td>
              <td class="num">${fmtM(year10.netSales)} EURm by 2035E</td>
              <td class="dim">Growth requirement is modest</td>
            </tr>
            <tr>
              <td><b>EBITDA margin</b></td>
              <td class="num">${fmtP(lastActual.ebitdaMargin)} in 2025A</td>
              <td class="num">${fmtP(year10.ebitdaMargin)} by 2035E</td>
              <td class="dim">Main operating recovery requirement</td>
            </tr>
            <tr>
              <td><b>EBIT margin</b></td>
              <td class="num">${fmtP(lastActual.ebitMargin)} in 2025A</td>
              <td class="num">${fmtP(year10.ebitMargin)} by 2035E</td>
              <td class="dim">Core profitability test</td>
            </tr>
            <tr>
              <td><b>FCF margin</b></td>
              <td class="num">${fmtP(lastActual.fcfMargin)} in 2025A</td>
              <td class="num">${fmtP(year10.fcfMargin)} by 2035E</td>
              <td class="dim">Cash discipline must remain positive</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  });
})();

// ===============================================================
// 16. Financial bridge I — revenue, EBITDA/EBIT, margin
// ===============================================================
(function () {
  const labels   = D.years.map(y => y.y + (y.kind === 'E' ? 'E' : ''));
  const estStart = D.years.findIndex(y => y.kind === 'E');

  makePage({
    section: 'Financial bridge', num: '16',
    kicker: 'Financial bridge · 1 of 2',
    title: 'Revenue, EBITDA / EBIT and margin development',
    lead: 'Net sales held above 9.5 bn EUR through the trough. EBITDA fell more than 50% to FY25 lows then rebuilds to a normalised 2.0–2.1 bn EUR range from 2026E onward. EBIT margin recovers to low-teens, in line with the through-cycle band.',
    bodyHTML: `
      <div class="bridge-single">
        <div class="chart-card">
          <div class="chart-card__title">Net sales</div>
          <div class="chart-card__sub">EUR million · actual 2021–2025, forecast 2026E–2028E</div>
          <div id="ch-revenue" class="chart-card__body"></div>
          <div class="legend"><span><span class="legend__sw legend__sw--primary"></span>Net sales (actual)</span><span><span class="legend__sw legend__sw--est"></span>Net sales (forecast)</span></div>
        </div>
      </div>

      <div class="bridge-pair">
        <div class="chart-card">
          <div class="chart-card__title">EBITDA &amp; EBIT</div>
          <div class="chart-card__sub">EUR million</div>
          <div id="ch-eb" class="chart-card__body"></div>
          <div class="legend"><span><span class="legend__sw legend__sw--primary"></span>EBITDA</span><span><span class="legend__sw legend__sw--alt"></span>EBIT</span></div>
        </div>
        <div class="chart-card">
          <div class="chart-card__title">EBIT margin</div>
          <div class="chart-card__sub">% of net sales</div>
          <div id="ch-margin" class="chart-card__body"></div>
          <div class="legend"><span><span class="legend__sw legend__sw--primary"></span>EBIT %</span><span><span class="legend__sw legend__sw--alt"></span>EBITDA %</span></div>
        </div>
      </div>
    `
  });

  setTimeout(() => {
    window.VC.comboBars(document.getElementById('ch-revenue'), {
      labels, estStart, w: 900, h: 320,
      series: [{ name: 'Net sales', kind: 'bar', color: '#12352b', values: D.financials.netSales }]
    });
    window.VC.comboBars(document.getElementById('ch-eb'), {
      labels, estStart, w: 700, h: 360,
      series: [
        { name: 'EBITDA', kind: 'bar',  color: '#12352b', values: D.financials.ebitda },
        { name: 'EBIT',   kind: 'line', color: '#8aa39a', values: D.financials.ebit }
      ]
    });
    window.VC.comboBars(document.getElementById('ch-margin'), {
      labels, estStart, w: 700, h: 360,
      yFmt: v => v.toFixed(0) + '%',
      series: [
        { name: 'EBIT margin',   kind: 'line', color: '#12352b', values: D.financials.ebitMargin.map(v => v == null ? null : v * 100) },
        { name: 'EBITDA margin', kind: 'line', color: '#8aa39a', values: D.financials.ebitdaMargin.map(v => v == null ? null : v * 100) }
      ]
    });
  }, 0);
})();

// ===============================================================
// 17. Financial bridge II — FCF, leverage + summary table
// ===============================================================
(function () {
  const labels   = D.years.map(y => y.y + (y.kind === 'E' ? 'E' : ''));
  const estStart = D.years.findIndex(y => y.kind === 'E');

  makePage({
    section: 'Financial bridge', num: '17',
    kicker: 'Financial bridge · 2 of 2',
    title: 'Free cash flow, leverage and key financials',
    lead: 'Free cash flow oscillated through the capex cycle and stabilises at 600–1,300 EUR m from 2026E. Net debt / EBITDA peaks at 3.0× exiting 2025 and falls back below 1.5× across the forecast, restoring balance-sheet flexibility.',
    bodyHTML: `
      <div class="bridge-pair">
        <div class="chart-card">
          <div class="chart-card__title">Free cash flow</div>
          <div class="chart-card__sub">EUR million · pre-financing</div>
          <div id="ch-fcf" class="chart-card__body"></div>
        </div>
        <div class="chart-card">
          <div class="chart-card__title">Net debt / EBITDA</div>
          <div class="chart-card__sub">× · leverage path through the cycle</div>
          <div id="ch-leverage" class="chart-card__body"></div>
        </div>
      </div>

      <div class="table-card" id="bridge-table-anchor">
        <div class="table-card__title">Key financials · EUR million unless noted</div>
        <table class="dtable">
          <thead><tr id="bt-head"></tr></thead>
          <tbody id="bt-body"></tbody>
        </table>
        <div class="table-card__note">Forecasts 2026E–2028E are model output. Consensus 2026E EBITDA stands at 1,680 M, 442 M below our base case — gap reflects pulp price &amp; Energy realised price assumptions.</div>
      </div>
    `
  });

  setTimeout(() => {
    window.VC.comboBars(document.getElementById('ch-fcf'), {
      labels, estStart, w: 700, h: 340,
      series: [{ name: 'FCF', kind: 'bar', color: '#1a4a3b', values: D.financials.fcf }]
    });
    window.VC.comboBars(document.getElementById('ch-leverage'), {
      labels, estStart, w: 700, h: 340,
      yFmt: v => v.toFixed(1) + '×',
      series: [{ name: 'ND/EBITDA', kind: 'line', color: '#12352b', values: D.financials.ndEbitda }]
    });

    const cols = [2024, 2025, 2026, 2027, 2028];
    const idx  = cols.map(y => D.years.findIndex(yr => yr.y === y));
    const lab  = cols.map((y, i) => y + (D.years[idx[i]].kind === 'E' ? 'E' : 'A'));
    const head = document.getElementById('bt-head');
    head.innerHTML = '<th>Metric</th>' + lab.map(l => '<th class="num">' + l + '</th>').join('');
    const tbody = document.getElementById('bt-body');
    function row(name, key, fmtFn) {
      const cells = idx.map(i => '<td class="num">' + fmtFn(D.financials[key][i]) + '</td>').join('');
      tbody.insertAdjacentHTML('beforeend', '<tr><td><b>' + name + '</b></td>' + cells + '</tr>');
    }
    row('Net sales',         'netSales',     v => F(v));
    row('EBITDA',            'ebitda',       v => F(v));
    row('EBITDA margin',     'ebitdaMargin', v => v == null ? '—' : (v * 100).toFixed(1) + '%');
    row('EBIT',              'ebit',         v => F(v));
    row('EBIT margin',       'ebitMargin',   v => v == null ? '—' : (v * 100).toFixed(1) + '%');
    row('Net earnings',      'netEarnings',  v => F(v));
    row('EPS (EUR)',         'eps',          v => v == null ? '—' : v.toFixed(2));
    row('DPS (EUR)',         'dps',          v => v == null ? '—' : v.toFixed(2));
    row('Free cash flow',    'fcf',          v => F(v));
    row('Net debt',          'netDebt',      v => F(v));
    row('Net debt / EBITDA', 'ndEbitda',     v => v == null ? '—' : v.toFixed(2) + '×');
  }, 0);
})();

// ===============================================================
// 18. Multiples + Sensitivity
// ===============================================================
(function () {
  const m    = D.multiples;
  const cols = [2026, 2027, 2028];
  function r(name, vals, fmtFn) {
    const cells = vals.map(v => '<td class="num">' + fmtFn(v) + '</td>').join('');
    return '<tr><td><b>' + name + '</b></td>' + cells + '</tr>';
  }
  const fmt1   = v => v == null ? '—' : v.toFixed(2) + '×';
  const fmtPct = v => v == null ? '—' : (v * 100).toFixed(1) + '%';
  const mrows = [
    r('P/E',               cols.map(y => m.pe['y' + y]),       fmt1),
    r('EV/EBITDA',         cols.map(y => m.evEbitda['y' + y]), fmt1),
    r('EV/EBIT',           cols.map(y => m.evEbit['y' + y]),   fmt1),
    r('P/FCFF',            cols.map(y => m.pFcff['y' + y]),    fmt1),
    r('P/BV',              cols.map(y => m.pBv['y' + y]),      fmt1),
    r('Dividend yield',    cols.map(y => m.divYield['y' + y]), fmtPct),
    r('Net debt / EBITDA', cols.map(y => m.ndEbitda['y' + y]), fmt1),
    r('WACC',              cols.map(y => m.wacc['y' + y]),     fmtPct)
  ].join('');

  const baseEbitda  = ebitda2026;
  const ebitdaMods  = [-0.2, -0.1, 0, 0.1, 0.2];
  const mults       = [6, 7, 8, 9, 10];
  function sensCells(modIdx) {
    const eb = baseEbitda * (1 + ebitdaMods[modIdx]);
    return mults.map(mu => {
      const evCell = eb * mu;
      const eqCell = evCell - netDebtLatest;
      const ps     = eqCell / shares;
      const isBase = (mu === 8 && modIdx === 2);
      return `<td class="${isBase ? 'is-base' : ''}">${F(evCell, { dp: 0 })}<span class="sub">${ps > 0 ? ps.toFixed(2) + ' / sh' : '—'}</span></td>`;
    }).join('');
  }
  const sensRows = ebitdaMods.map((mod, i) => {
    const eb  = baseEbitda * (1 + mod);
    const lbl = (mod > 0 ? '+' : (mod < 0 ? '' : '')) + (mod * 100).toFixed(0) + '% EBITDA';
    const sub = '(' + F(eb, { dp: 0 }) + ' M)';
    const cls = mod === 0 ? 'is-base' : '';
    return `<tr class="${cls}"><td><b>${lbl}</b><br><span style="font-size:8pt;color:#6b7470;font-weight:400;">${sub}</span></td>${sensCells(i)}</tr>`;
  }).join('');

  makePage({
    section: 'Multiples & sensitivity', num: '18',
    kicker: 'Valuation multiples &amp; sensitivity',
    title: 'Forward multiples and EBITDA × EV/EBITDA sensitivity',
    lead: 'Forward multiples normalise from 2027E onward as forecasts move closer to through-cycle. The sensitivity matrix tests valuation against the two biggest assumptions — operating earnings and the multiple applied.',
    bodyHTML: `
      <div class="table-card" style="margin-bottom: 5mm;">
        <div class="table-card__title">Forward valuation multiples</div>
        <table class="dtable dtable--multiples">
          <thead>
            <tr><th>Metric</th>${cols.map(c => '<th class="num">' + c + 'E</th>').join('')}</tr>
          </thead>
          <tbody>${mrows}</tbody>
        </table>
        <div class="table-card__note">Computed on current price ${price.toFixed(2)} EUR and net debt ${F(netDebtLatest)} EUR m. WACC is analyst-modelled.</div>
      </div>

      <div class="table-card">
        <div class="table-card__title">EBITDA × EV/EBITDA sensitivity — implied enterprise value (EUR m)</div>
        <div style="padding: 4mm 5mm;">
          <table class="sensitivity">
            <thead>
              <tr><th></th>${mults.map(mu => '<th>' + mu + '×</th>').join('')}</tr>
            </thead>
            <tbody>${sensRows}</tbody>
          </table>
        </div>
        <div class="table-card__note">Each cell shows implied EV; sub-figure shows implied equity value per share, computed as (EV − net debt) / shares outstanding (${shares} m). Base case shaded. This generic sensitivity is intended to show valuation sensitivity to earnings and multiple assumptions.</div>
      </div>
    `
  });
})();

// ===============================================================
// 19. Scenario Valuation
// ===============================================================
(function () {
  const rows = D.scenarios.map(s => {
    const evC = s.ebitda * s.multiple;
    const eqC = evC - netDebtLatest;
    const ps  = eqC / shares;
    const up  = (ps - price) / price;
    const cls = 'scenario-row--' + s.name.toLowerCase();
    return `
      <tr class="${cls}">
        <td><b>${s.name}</b></td>
        <td class="num">${F(s.revenue)}</td>
        <td class="num">${F(s.ebitda)}</td>
        <td class="num">${(s.margin * 100).toFixed(1)}%</td>
        <td class="num">${s.multiple.toFixed(1)}×</td>
        <td class="num">${F(evC, { dp: 0 })}</td>
        <td class="num">${F(eqC, { dp: 0 })}</td>
        <td class="num"><b>${ps.toFixed(2)}</b></td>
        <td class="num ${up >= 0 ? 'pos' : 'neg'}"><b>${up >= 0 ? '+' : ''}${(up * 100).toFixed(1)}%</b></td>
      </tr>
    `;
  }).join('');

  makePage({
    section: 'Scenario valuation', num: '19',
    kicker: 'Scenario valuation',
    title: 'Bear / Base / Bull — implied equity value per share',
    lead: 'We frame the scenarios around the pulp price path. Probability-weighting them on roughly 25/55/20 produces an expected value close to the base case target.',
    bodyHTML: `
      <div class="table-card" style="margin-bottom: 5mm;">
        <div class="table-card__title">Scenario valuation — full bridge to per-share value</div>
        <table class="dtable dtable--scenarios">
          <thead>
            <tr>
              <th>Scenario</th>
              <th class="num">Revenue</th>
              <th class="num">EBITDA</th>
              <th class="num">Margin</th>
              <th class="num">Mult.</th>
              <th class="num">EV</th>
              <th class="num">Equity</th>
              <th class="num">Val/sh</th>
              <th class="num">Upside</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="table-card__note">Revenue, EBITDA, EV and Equity in EUR million. Value/sh and current price in EUR. Net debt held at latest reported (${F(netDebtLatest)} M); ${shares} m shares outstanding.</div>
      </div>

      <div class="prose">
        <p><b>Key conditions.</b> Bear requires simultaneous pulp re-roll to 2023 lows and faster-than-modelled Nordic power normalisation — either alone is closer to a 25–30% downside, not 55%. Base requires forward forecasts to hold within ±10% on EBITDA. Bull requires the market to look 18 months forward to 2027E–2028E and apply a 9.5× through-cycle multiple. None of the three scenarios assumes a structural break in the cyclical model.</p>
        <p><b>What breaks the thesis.</b> ${D.thesis.breaker}</p>
      </div>
    `
  });
})();

// ===============================================================
// 20. Catalysts page
// ===============================================================
(function () {
  const timingTag = t => {
    const cls = t.includes('Near') ? 'tag--near' : t.includes('Medium') ? 'tag--mid' : 'tag--long';
    return `<span class="tag ${cls}">${t}</span>`;
  };
  const catRows = D.catalysts.map(c => `
    <tr>
      <td><b>${c.milestone}</b></td>
      <td>${timingTag(c.timing)}</td>
      <td class="dim">${c.pool}</td>
      <td class="dim">${c.indicator}</td>
      <td><b>${c.impact}</b></td>
    </tr>
  `).join('');

  makePage({
    section: 'Catalysts', num: '20',
    kicker: 'Catalysts',
    title: 'Monitoring checklist for the next 12 months',
    lead: 'Catalysts are ordered by timing. We treat near-term events (Q1 print, dividend resolution) as the highest-information moments for the recovery thesis.',
    bodyHTML: `
      <div class="table-card">
        <div class="table-card__title">Catalysts</div>
        <table class="dtable dtable--catalysts">
          <thead>
            <tr><th>Milestone</th><th>Timing</th><th>Pool</th><th>Indicator of success</th><th>Valuation<br>impact</th></tr>
          </thead>
          <tbody>${catRows}</tbody>
        </table>
      </div>

      <div class="prose" style="margin-top: 6mm;">
        ${proseHtml(D.core.catalystsRisks.catalystsParas)}
      </div>
    `
  });
})();

// ===============================================================
// 21. Risks page
// ===============================================================
(function () {
  const impactTag = i => {
    const cls = i === 'High' ? 'tag--high' : i === 'Medium' ? 'tag--med' : 'tag--low';
    return `<span class="tag ${cls}">${i}</span>`;
  };
  const typeTag = t => {
    const cls = t.includes('Manageable') ? 'tag--manage' : 'tag--break';
    return `<span class="tag ${cls}">${t}</span>`;
  };
  const riskRows = D.risks.map(r => `
    <tr>
      <td><b>${r.risk}</b></td>
      <td class="dim">${r.pool}</td>
      <td class="dim">${r.mechanism}</td>
      <td class="dim">${r.threshold}</td>
      <td>${impactTag(r.impact)}</td>
      <td>${typeTag(r.type)}</td>
    </tr>
  `).join('');

  makePage({
    section: 'Risks', num: '21',
    kicker: 'Key risks',
    title: 'Risk register with thresholds and severity',
    lead: 'Each risk has a quantitative trip-wire. Reaching one alone does not break the thesis but should trigger a review; the thesis breaks only on simultaneous pulp price and Nordic power downside shocks.',
    bodyHTML: `
      <div class="table-card">
        <div class="table-card__title">Risks</div>
        <table class="dtable dtable--risks">
          <thead>
            <tr><th>Risk</th><th>Pool</th><th>Mechanism</th><th>Early warning</th><th>Impact</th><th>Type</th></tr>
          </thead>
          <tbody>${riskRows}</tbody>
        </table>
      </div>

      <div class="prose" style="margin-top: 6mm;">
        ${proseHtml(D.core.catalystsRisks.risksParas)}
      </div>
    `
  });
})();

// ===============================================================
// 21–24. Appendix
// ===============================================================
(function () {
  const allCols = D.years.map((y, i) => ({ idx: i, label: y.y + (y.kind === 'E' ? 'E' : '') }));
  const apCols  = allCols.slice(1); // drop 2021 — oldest historical

  function headRow() {
    return '<tr><th>Metric</th>' + apCols.map(c => '<th class="num">' + c.label + '</th>').join('') + '</tr>';
  }
  function dataRow(name, key, fmtFn) {
    const cells = apCols.map(c => '<td class="num">' + fmtFn(D.financials[key][c.idx]) + '</td>').join('');
    return '<tr><td><b>' + name + '</b></td>' + cells + '</tr>';
  }
  function groupRow(label) {
    return '<tr class="is-group"><td colspan="' + (apCols.length + 1) + '">' + label + '</td></tr>';
  }
  const fE = v => F(v);
  const fP = v => v == null ? '—' : (v * 100).toFixed(1) + '%';
  const fX = v => v == null ? '—' : v.toFixed(2) + '×';
  const fD = v => v == null ? '—' : v.toFixed(2);

  const isHtml = `
    <table class="dtable dtable--appendix dtable--narrow">
      <thead>${headRow()}</thead>
      <tbody>
        ${groupRow('Profit & loss')}
        ${dataRow('Net sales',           'netSales',     fE)}
        ${dataRow('Net sales growth',    'netSalesGrowth', fP)}
        ${dataRow('EBITDA',              'ebitda',       fE)}
        ${dataRow('EBITDA margin',       'ebitdaMargin', fP)}
        ${dataRow('D&A',                 'da',           fE)}
        ${dataRow('EBIT',                'ebit',         fE)}
        ${dataRow('EBIT margin',         'ebitMargin',   fP)}
        ${dataRow('Net financial items', 'netFin',       fE)}
        ${dataRow('Pre-tax profit',      'ptp',          fE)}
        ${dataRow('Net earnings',        'netEarnings',  fE)}
        ${groupRow('Per share')}
        ${dataRow('EPS',                 'eps',          fD)}
        ${dataRow('DPS',                 'dps',          fD)}
        ${dataRow('Payout ratio',        'payout',       fP)}
      </tbody>
    </table>
  `;

  const bsHtml = `
    <table class="dtable dtable--appendix dtable--narrow">
      <thead>${headRow()}</thead>
      <tbody>
        ${groupRow('Assets')}
        ${dataRow('Tangible assets',      'tangibleAssets',   fE)}
        ${dataRow('Intangibles',          'intangibles',      fE)}
        ${dataRow('Goodwill',             'goodwill',         fE)}
        ${dataRow('Non-current assets',   'nonCurrentAssets', fE)}
        ${dataRow('Inventories',          'inventories',      fE)}
        ${dataRow('Receivables',          'receivables',      fE)}
        ${dataRow('Cash & equiv.',        'cash',             fE)}
        ${dataRow('Current assets',       'currentAssets',    fE)}
        ${dataRow('Total assets',         'totalAssets',      fE)}
        ${groupRow('Equity & liabilities')}
        ${dataRow('Equity',               'equity',           fE)}
        ${dataRow('Long-term debt',       'ltDebt',           fE)}
        ${dataRow('Short-term debt',      'stDebt',           fE)}
        ${dataRow('Current liabilities',  'currentLiab',      fE)}
        ${groupRow('Capital structure & ratios')}
        ${dataRow('Net debt',             'netDebt',          fE)}
        ${dataRow('Capital invested',     'capitalInvested',  fE)}
        ${dataRow('Equity ratio',         'equityRatio',      fP)}
        ${dataRow('Gearing',              'gearing',          fP)}
        ${dataRow('Net debt / EBITDA',    'ndEbitda',         fX)}
        ${dataRow('Current ratio',        'currentRatio',     fD)}
      </tbody>
    </table>
  `;

  const cfHtml = `
    <table class="dtable dtable--appendix dtable--narrow">
      <thead>${headRow()}</thead>
      <tbody>
        ${groupRow('Operations')}
        ${dataRow('Funds from operations', 'fundsFromOps', fE)}
        ${dataRow('Operating cash flow',   'opCashFlow',   fE)}
        ${dataRow('Working capital growth','wcGrowth',     fE)}
        ${groupRow('Investing & free cash')}
        ${dataRow('Gross capex',           'grossCapex',   fE)}
        ${dataRow('Free cash flow',        'fcf',          fE)}
        ${groupRow('Financing')}
        ${dataRow('CFF from financing',    'cffFinancing', fE)}
        ${dataRow('Dividends paid',        'dividendsPaid', fE)}
        ${dataRow('Net change in cash',    'netCashChange', fE)}
      </tbody>
    </table>
  `;

  makePage({
    section: 'Appendix · Income statement', num: '22',
    kicker: 'Financial statements appendix',
    title: 'Income statement — annual 2022A–2028E',
    bodyHTML: `<div class="table-card">${isHtml}<div class="table-card__note">Values in EUR million unless noted. Per-share values in EUR.</div></div>`
  });
  makePage({
    section: 'Appendix · Balance sheet', num: '23',
    kicker: 'Financial statements appendix',
    title: 'Balance sheet — annual 2022A–2025A',
    bodyHTML: `<div class="table-card">${bsHtml}<div class="table-card__note">Forward years not modelled for full balance sheet; only Net debt and Net debt / EBITDA forecasts shown.</div></div>`
  });
  makePage({
    section: 'Appendix · Cash flow', num: '24',
    kicker: 'Financial statements appendix',
    title: 'Cash flow statement — annual 2022A–2028E',
    bodyHTML: `<div class="table-card">${cfHtml}<div class="table-card__note">Forward free cash flow is modelled; other lines are reported actuals.</div></div>`
  });

  // Quarterly
  const q = D.quarterly;
  function qRow(label, vals, fmtFn) {
    return '<tr><td><b>' + label + '</b></td>' +
      vals.map(v => '<td class="num">' + fmtFn(v) + '</td>').join('') + '</tr>';
  }
  const qHtml = `
    <table class="dtable dtable--appendix dtable--narrow">
      <thead>
        <tr><th>Metric</th>${q.cols.map(c => '<th class="num">' + c + '</th>').join('')}</tr>
      </thead>
      <tbody>
        ${qRow('Net sales',        q.netSales,     fE)}
        ${qRow('EBITDA',           q.ebitda,       fE)}
        ${qRow('EBITDA margin',    q.ebitdaMargin, fP)}
        ${qRow('EBIT',             q.ebit,         fE)}
        ${qRow('EBIT margin',      q.ebitMargin,   fP)}
        ${qRow('Net earnings',     q.netEarnings,  fE)}
        ${qRow('EPS',              q.eps,          fD)}
        ${qRow('Net sales growth', q.salesGrowth,  fP)}
        ${qRow('EBIT growth',      q.ebitGrowth,   fP)}
      </tbody>
    </table>
  `;
  makePage({
    section: 'Appendix · Quarterly', num: '25',
    kicker: 'Financial statements appendix',
    title: 'Quarterly snapshot — ' + q.period,
    bodyHTML: `<div class="table-card">${qHtml}<div class="table-card__note">Q4 25 includes exceptional financial income of 360 EUR m and exceptionally weak operating contribution.</div></div>`
  });
})();

// ===============================================================
// 26. Sources + Disclaimer
// ===============================================================
(function () {
  const rows = D.sources.map(s => `
    <tr>
      <td><b>${s.point}</b></td>
      <td>${s.value}</td>
      <td><span class="tag tag--manage">${s.source}</span></td>
      <td class="dim">${s.usedIn}</td>
    </tr>
  `).join('');

  makePage({
    section: 'Sources & disclaimer', num: '26',
    kicker: 'Sources, assumptions and disclaimer',
    title: 'Provenance of figures and important caveats',
    bodyHTML: `
      <div class="table-card" style="margin-bottom: 4mm;">
        <div class="table-card__title">Sources &amp; assumptions register</div>
        <table class="dtable dtable--sources">
          <thead>
            <tr><th>Data point</th><th>Value</th><th>Source category</th><th>Used in</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>

      <div class="disclaimer">
        <div class="disclaimer__title">Disclaimer</div>
        <p style="margin: 0 0 2.5mm 0;">This report is automatically generated by Valuatum. It is not investment advice,
        not a solicitation to buy or sell securities, and should not be relied on as the sole basis for an
        investment decision. Forecasts, target prices, and valuations are model outputs and may be inaccurate.
        Users must verify all figures and assumptions independently.</p>
        <p style="margin: 0; color: #6b7470;">© ${new Date().getFullYear()} Valuatum · Equity Research · ${D.company.name}
        · Report generated ${D.meta.reportDateLong}. All rights reserved.</p>
      </div>
    `
  });
})();

// ----------------------------------------------------------------
//  Render: donut + segment table (page 4)
// ----------------------------------------------------------------
renderSegmentTable();
window.VC.donut(
  document.getElementById('chart-mcap-donut'),
  D.valuePools.map(p => ({ label: p.name, value: p.mcap })),
  { totalLabel: fmtMoney(totals.mcap), w: 360, h: 360, legendW: 360 }
);

// EBIT and Sales bars (page 5)
{
  const ebitEl = document.getElementById('chart-ebit-bar');
  if (ebitEl) {
    const sorted = [...D.valuePools].sort((a, b) => b.ebit - a.ebit);
    window.VC.hbar(ebitEl, sorted.map(p => ({ label: p.name, value: p.ebit })), { w: 560, h: 360 });
  }
  const salesEl = document.getElementById('chart-sales-bar');
  if (salesEl) {
    const sorted = [...D.valuePools].sort((a, b) => b.revenue - a.revenue);
    window.VC.hbar(salesEl, sorted.map(p => ({ label: p.name, value: p.revenue, color: '#1a4a3b' })), { w: 560, h: 360 });
  }
}

// ----------------------------------------------------------------
//  Page numbering
// ----------------------------------------------------------------
(function () {
  const pages = document.querySelectorAll('.page');
  const total = pages.length;
  pages.forEach((p, i) => {
    const n = i + 1;
    p.querySelectorAll('[data-page]').forEach(s => s.textContent = n);
    p.querySelectorAll('[data-page-total]').forEach(s => s.textContent = total);
    p.querySelectorAll('.page-num').forEach(s => { if (!s.textContent.trim()) s.textContent = n + ' / ' + total; });
  });
})();

})();
