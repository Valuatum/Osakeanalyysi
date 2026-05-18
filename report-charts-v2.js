/* =================================================================
   Valuatum Equity Research — lightweight SVG chart library
   No dependencies. All charts inline SVG so they print cleanly.
   ================================================================= */

(function (global) {
'use strict';

const NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function fmt(n, opts) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  const o = opts || {};
  if (o.pct) return (n * 100).toFixed(o.dp ?? 1) + '%';
  if (o.dp != null) return n.toFixed(o.dp);
  if (Math.abs(n) >= 1000) return Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
  return n.toLocaleString('en-US');
}

// Nice round tick step for a given numeric range
function niceStep(range, target) {
  target = target || 5;
  const rough = range / target;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  let step;
  if (norm < 1.5) step = 1;
  else if (norm < 3) step = 2;
  else if (norm < 4) step = 2.5;
  else if (norm < 7) step = 5;
  else step = 10;
  return step * mag;
}
function niceTicks(min, max, target) {
  if (min === max) { min -= 1; max += 1; }
  const step = niceStep(max - min, target);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = niceMin; v <= niceMax + step * 0.5; v += step) ticks.push(Number(v.toFixed(10)));
  return { min: niceMin, max: niceMax, ticks, step };
}

// ----------------------------------------------------------------
//  Donut chart — Market cap allocation
// ----------------------------------------------------------------
function donut(container, items, opts) {
  opts = opts || {};
  const w = opts.w || 360, h = opts.h || 360;
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) / 2 - 14;
  const rIn = r * 0.62;
  const total = items.reduce((s, it) => s + it.value, 0);
  const palette = opts.palette || ['#12352b', '#1a4a3b', '#3b6b58', '#6b8a7e', '#9bb3a8', '#cfdcd4'];

  // Clear
  container.innerHTML = '';
  const legendW = opts.legendW || 320;
  const svg = el('svg', { viewBox: `0 0 ${w + legendW} ${h}` , preserveAspectRatio: 'xMidYMid meet' }, container);

  let a0 = -Math.PI / 2;
  items.forEach((it, i) => {
    const frac = it.value / total;
    const a1 = a0 + frac * 2 * Math.PI;
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi0 = cx + rIn * Math.cos(a1), yi0 = cy + rIn * Math.sin(a1);
    const xi1 = cx + rIn * Math.cos(a0), yi1 = cy + rIn * Math.sin(a0);
    const d = [
      `M ${x0} ${y0}`,
      `A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`,
      `L ${xi0} ${yi0}`,
      `A ${rIn} ${rIn} 0 ${large} 0 ${xi1} ${yi1}`,
      'Z'
    ].join(' ');
    el('path', { d, fill: palette[i % palette.length] }, svg);
    a0 = a1;
  });

  // Center label
  el('text', {
    x: cx, y: cy - 8, 'text-anchor': 'middle',
    'font-family': 'Inter, sans-serif', 'font-size': 11, fill: '#6b7470',
    'letter-spacing': '0.18em'
  }, svg).textContent = 'TOTAL';
  el('text', {
    x: cx, y: cy + 16, 'text-anchor': 'middle',
    'font-family': 'Inter, sans-serif', 'font-size': 18, 'font-weight': 600, fill: '#12352b'
  }, svg).textContent = (opts.totalLabel || (fmt(total) + ' M'));

  // Legend on right
  const legX = w + 20;
  let legY = 20;
  items.forEach((it, i) => {
    el('rect', { x: legX, y: legY, width: 12, height: 12, fill: palette[i % palette.length] }, svg);
    const t1 = el('text', { x: legX + 20, y: legY + 11, 'font-family': 'Inter, sans-serif', 'font-size': 12, fill: '#1c2523' }, svg);
    t1.textContent = it.label;
    const valTxt = fmt(it.value) + ' M';
    const pctTxt = ((it.value / total) * 100).toFixed(1) + '%';
    const t2 = el('text', { x: w + legendW - 6, y: legY + 11, 'text-anchor': 'end',
      'font-family': 'Inter, sans-serif', 'font-size': 12, fill: '#12352b', 'font-weight': 600 }, svg);
    t2.setAttribute('font-variant-numeric', 'tabular-nums');
    t2.textContent = pctTxt;
    const t3 = el('text', { x: w + legendW - 6, y: legY + 25, 'text-anchor': 'end',
      'font-family': 'Inter, sans-serif', 'font-size': 9.5, fill: '#6b7470' }, svg);
    t3.setAttribute('font-variant-numeric', 'tabular-nums');
    t3.textContent = valTxt;
    legY += 36;
  });
}

// ----------------------------------------------------------------
//  Horizontal bar chart — segment EBIT / Net sales
// ----------------------------------------------------------------
function hbar(container, items, opts) {
  opts = opts || {};
  const w = opts.w || 520, h = opts.h || 320;
  const padL = 110, padR = 90, padT = 14, padB = 18;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const max = Math.max(...items.map(i => Math.abs(i.value))) * 1.05 || 1;
  const rowH = innerH / items.length;

  container.innerHTML = '';
  const svg = el('svg', { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: 'xMidYMid meet' }, container);

  // Axis line
  el('line', { x1: padL, x2: padL, y1: padT, y2: padT + innerH, stroke: '#dfe5e1' }, svg);

  items.forEach((it, i) => {
    const y = padT + i * rowH + 4;
    const barH = rowH - 10;
    const len = (Math.abs(it.value) / max) * innerW;
    const color = it.color || (opts.palette && opts.palette[i % opts.palette.length]) || '#12352b';
    // Label
    const tl = el('text', { x: padL - 8, y: y + barH / 2 + 4, 'text-anchor': 'end',
      'font-family': 'Inter, sans-serif', 'font-size': 11, fill: '#1c2523' }, svg);
    tl.textContent = it.label;
    // Bar
    el('rect', { x: padL, y, width: len, height: barH, fill: color }, svg);
    // Value
    const tv = el('text', { x: padL + len + 8, y: y + barH / 2 + 4,
      'font-family': 'Inter, sans-serif', 'font-size': 11, fill: '#12352b', 'font-weight': 600 }, svg);
    tv.setAttribute('font-variant-numeric', 'tabular-nums');
    tv.textContent = (it.format ? it.format(it.value) : fmt(it.value));
  });
}

// ----------------------------------------------------------------
//  Combo bar/line — Revenue & EBITDA
// ----------------------------------------------------------------
function comboBars(container, opts) {
  /* opts: { labels:[], series:[{name,values,kind:'bar'|'line',color,estStart:idx}], yLabel, yFmt } */
  const w = opts.w || 700, h = opts.h || 320;
  const padL = 50, padR = 14, padT = 18, padB = 30;
  const iw = w - padL - padR, ih = h - padT - padB;

  container.innerHTML = '';
  const svg = el('svg', { viewBox: `0 0 ${w} ${h}` , preserveAspectRatio: 'xMidYMid meet'}, container);

  const allVals = opts.series.flatMap(s => s.values.filter(v => v != null));
  const dataMax = Math.max(...allVals);
  const dataMin = Math.min(0, ...allVals);
  const { min, max, ticks } = niceTicks(dataMin, dataMax, 5);
  const yScale = (v) => padT + ih - ((v - min) / (max - min)) * ih;

  const n = opts.labels.length;
  const colW = iw / n;

  // Estimate band (shaded background for forecast years)
  if (opts.estStart != null) {
    const x = padL + opts.estStart * colW;
    el('rect', { x, y: padT, width: padL + iw - x, height: ih,
      fill: '#f6f8f6' }, svg);
    el('line', { x1: x, x2: x, y1: padT, y2: padT + ih, stroke: '#dfe5e1', 'stroke-dasharray': '2 2' }, svg);
    const t = el('text', { x: x + 5, y: padT + 11,
      'font-family': 'Inter, sans-serif', 'font-size': 8.5, fill: '#6b7470',
      'letter-spacing': '0.10em', 'text-transform': 'uppercase', 'font-weight': 600 }, svg);
    t.textContent = opts.estLabel || 'Forecast';
  }

  // Gridlines from nice ticks
  const yFmt = opts.yFmt || (v => fmt(v));
  ticks.forEach((v) => {
    const y = yScale(v);
    el('line', { x1: padL, x2: padL + iw, y1: y, y2: y, stroke: '#eef1ee' }, svg);
    const t = el('text', { x: padL - 6, y: y + 3.5, 'text-anchor': 'end',
      'font-family': 'Inter, sans-serif', 'font-size': 9, fill: '#9aa19e' }, svg);
    t.setAttribute('font-variant-numeric', 'tabular-nums');
    t.textContent = yFmt(v);
  });

  // Zero baseline (when min < 0)
  if (min < 0) {
    const y0 = yScale(0);
    el('line', { x1: padL, x2: padL + iw, y1: y0, y2: y0, stroke: '#6b7470', 'stroke-width': 1 }, svg);
  }

  // X labels
  opts.labels.forEach((lab, i) => {
    const t = el('text', {
      x: padL + (i + 0.5) * colW, y: padT + ih + 16,
      'text-anchor': 'middle', 'font-family': 'Inter, sans-serif',
      'font-size': 9, fill: '#6b7470' }, svg);
    t.textContent = lab;
  });

  // Bars
  opts.series.forEach((s) => {
    if (s.kind !== 'bar') return;
    const barSlots = opts.series.filter(x => x.kind === 'bar').length;
    const slot = opts.series.filter(x => x.kind === 'bar').indexOf(s);
    const barW = (colW - 10) / barSlots;
    s.values.forEach((v, i) => {
      if (v == null) return;
      const isEst = (opts.estStart != null && i >= opts.estStart);
      const x = padL + i * colW + 5 + slot * barW;
      const y = yScale(Math.max(v, 0));
      const hgt = Math.abs(yScale(v) - yScale(0));
      el('rect', { x, y, width: barW * 0.86, height: hgt,
        fill: s.color || '#12352b',
        'fill-opacity': isEst ? 0.5 : 1,
        stroke: isEst ? (s.color || '#12352b') : 'none',
        'stroke-dasharray': isEst ? '2 2' : '',
        'stroke-width': isEst ? 1 : 0 }, svg);
      // Optional value labels above bars
      if (s.showLabels) {
        const lt = el('text', {
          x: x + barW * 0.43, y: y - 3,
          'text-anchor': 'middle', 'font-family': 'Inter, sans-serif',
          'font-size': 8, fill: '#1c2523' }, svg);
        lt.setAttribute('font-variant-numeric', 'tabular-nums');
        lt.textContent = (s.labelFmt || fmt)(v);
      }
    });
  });

  // Lines
  opts.series.forEach((s) => {
    if (s.kind !== 'line') return;
    let dActual = '', dEst = '';
    const pts = s.values.map((v, i) => v == null ? null : {
      x: padL + (i + 0.5) * colW, y: yScale(v), est: opts.estStart != null && i >= opts.estStart
    });
    let lastActualPt = null;
    pts.forEach((p) => {
      if (!p) return;
      if (!p.est) {
        dActual += (dActual ? ' L ' : 'M ') + p.x + ' ' + p.y;
        lastActualPt = p;
      } else {
        if (lastActualPt && !dEst) dEst = 'M ' + lastActualPt.x + ' ' + lastActualPt.y + ' L ' + p.x + ' ' + p.y;
        else dEst += (dEst ? ' L ' : 'M ') + p.x + ' ' + p.y;
      }
    });
    const seriesDash = s.dashed ? '5 3' : '';
    const seriesOpacity = s.dashed ? '0.72' : '1';
    if (dActual) el('path', { d: dActual, fill: 'none', stroke: s.color || '#12352b', 'stroke-width': 2,
      'stroke-dasharray': seriesDash, 'stroke-opacity': seriesOpacity }, svg);
    if (dEst) el('path', { d: dEst, fill: 'none', stroke: s.color || '#12352b', 'stroke-width': 2,
      'stroke-dasharray': '5 3', 'stroke-opacity': 0.85 }, svg);
    pts.forEach((p) => { if (p) el('circle', { cx: p.x, cy: p.y, r: 2.8, fill: s.color || '#12352b',
      'fill-opacity': s.dashed ? '0.72' : '1' }, svg); });
  });
}

// ----------------------------------------------------------------
//  Reverse valuation bridge — horizontal bars
// ----------------------------------------------------------------
function bridge(container, items, opts) {
  opts = opts || {};
  const w = opts.w || 620, h = opts.h || 360;
  const padL = 150, padR = 80, padT = 14, padB = 18;
  const iw = w - padL - padR, ih = h - padT - padB;
  const max = Math.max(...items.map(i => i.value)) * 1.1;
  const rowH = ih / items.length;

  container.innerHTML = '';
  const svg = el('svg', { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: 'xMidYMid meet' }, container);
  el('line', { x1: padL, x2: padL, y1: padT, y2: padT + ih, stroke: '#dfe5e1' }, svg);

  items.forEach((it, i) => {
    const y = padT + i * rowH + 5;
    const barH = rowH - 12;
    const len = (it.value / max) * iw;
    const color = it.color || '#12352b';
    const t1 = el('text', { x: padL - 8, y: y + barH / 2 + 4, 'text-anchor': 'end',
      'font-family': 'Inter, sans-serif', 'font-size': 10.5, fill: '#1c2523' }, svg);
    t1.textContent = it.label;
    el('rect', { x: padL, y, width: len, height: barH, fill: color, 'fill-opacity': it.alt ? 0.5 : 1,
      stroke: it.alt ? color : 'none', 'stroke-dasharray': it.alt ? '2 2' : '', 'stroke-width': it.alt ? 1 : 0 }, svg);
    const t2 = el('text', { x: padL + len + 8, y: y + barH / 2 + 4,
      'font-family': 'Inter, sans-serif', 'font-size': 10.5, fill: '#12352b', 'font-weight': 600 }, svg);
    t2.setAttribute('font-variant-numeric', 'tabular-nums');
    t2.textContent = fmt(it.value) + ' M';
  });
}

// ----------------------------------------------------------------
//  Share price line chart
// ----------------------------------------------------------------
function priceLine(container, data, opts) {
  // data: [{date:"YYYY-MM", price:number}, ...]
  opts = opts || {};
  const w = opts.w || 900, h = opts.h || 440;
  const padL = 52, padR = 100, padT = 20, padB = 34;
  const iw = w - padL - padR, ih = h - padT - padB;

  if (!data || data.length === 0) {
    container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#6b7470;font-size:10pt;">Historical share price data unavailable</div>';
    return;
  }

  container.innerHTML = '';
  const svg = el('svg', { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: 'xMidYMid meet',
    width: '100%', height: '100%' }, container);

  const prices = data.map(d => d.price);
  const allVals = opts.target != null ? [...prices, opts.target] : prices;
  const { min, max, ticks } = niceTicks(Math.min(...allVals) * 0.97, Math.max(...allVals) * 1.03, 6);
  const n = data.length;
  const xScale = i => padL + (i / (n - 1)) * iw;
  const yScale = v => padT + ih - ((v - min) / (max - min)) * ih;

  // Y gridlines
  ticks.forEach(v => {
    const y = yScale(v);
    el('line', { x1: padL, x2: padL + iw, y1: y, y2: y, stroke: '#eef1ee' }, svg);
    const t = el('text', { x: padL - 6, y: y + 3.5, 'text-anchor': 'end',
      'font-family': 'Inter, sans-serif', 'font-size': 9, fill: '#9aa19e' }, svg);
    t.setAttribute('font-variant-numeric', 'tabular-nums');
    t.textContent = v.toFixed(0);
  });

  // Target price horizontal line
  if (opts.target != null) {
    const ty = yScale(opts.target);
    el('line', { x1: padL, x2: padL + iw, y1: ty, y2: ty,
      stroke: '#b7f23a', 'stroke-width': 1.5, 'stroke-dasharray': '6 3' }, svg);
    const tt = el('text', { x: padL + iw + 7, y: ty + 4,
      'font-family': 'Inter, sans-serif', 'font-size': 9, fill: '#12352b', 'font-weight': 700 }, svg);
    tt.textContent = 'Target ' + opts.target.toFixed(2) + (opts.currency ? ' ' + opts.currency : '');
  }

  // Price line
  let d = '';
  data.forEach((pt, i) => { d += (i === 0 ? 'M ' : ' L ') + xScale(i) + ' ' + yScale(pt.price); });
  el('path', { d, fill: 'none', stroke: '#12352b', 'stroke-width': 2 }, svg);

  // Current price dot + label
  const lx = xScale(n - 1), ly = yScale(data[n - 1].price);
  el('circle', { cx: lx, cy: ly, r: 4.5, fill: '#12352b' }, svg);
  const lt = el('text', { x: lx + 9, y: ly + 4,
    'font-family': 'Inter, sans-serif', 'font-size': 9.5, fill: '#12352b', 'font-weight': 700 }, svg);
  lt.setAttribute('font-variant-numeric', 'tabular-nums');
  lt.textContent = data[n - 1].price.toFixed(2) + (opts.currency ? ' ' + opts.currency : '');

  // X-axis: quarterly labels
  data.forEach((pt, i) => {
    const [y, m] = pt.date.split('-').map(Number);
    if (m === 1 || m === 4 || m === 7 || m === 10) {
      const x = xScale(i);
      el('line', { x1: x, x2: x, y1: padT + ih, y2: padT + ih + 4, stroke: '#dfe5e1' }, svg);
      const label = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1] + ' ' + String(y).slice(2);
      const t = el('text', { x, y: padT + ih + 16, 'text-anchor': 'middle',
        'font-family': 'Inter, sans-serif', 'font-size': 8.5, fill: '#6b7470' }, svg);
      t.textContent = label;
    }
  });

  // Y-axis rule
  el('line', { x1: padL, x2: padL, y1: padT, y2: padT + ih, stroke: '#dfe5e1' }, svg);
}

global.VC = { donut, hbar, comboBars, bridge, priceLine, fmt };

})(window);
