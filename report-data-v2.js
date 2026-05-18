/* =============================================================
   reportData — single source of truth for the report.
   Production system replaces this object. Everything in the
   document is derived from this; do not scatter numbers in HTML.
   ============================================================= */

window.reportData = {

  meta: {
    reportDate: "2026-05-15",
    reportDateLong: "15 May 2026",
    priceAsOf: "Quote as of 13 May 2026, 16:19 EET",
    currency: "EUR",
    horizonMonths: 12,
    productName: "Valuatum Equity Research"
  },

  company: {
    name: "UPM-Kymmene",
    legalName: "UPM-Kymmene Corporation",
    ticker: "UPM.HE",
    exchange: "Nasdaq Helsinki",
    sector: "Paper & Forest Products",
    country: "Finland",
    fy: "FY2024",
    sharesOutM: 528,            // diluted shares outstanding, millions
    fiscalYearEnd: "31 December"
  },

  quote: {
    price: 25.18,               // last traded
    currency: "EUR",
    // marketCap, ev computed if null
    marketCap: null,
    ev: null,
    netDebtLatest: 3079         // EUR m, FY2025
  },

  reco: {
    rating: "BUY",
    prevRating: "ACCUMULATE",
    target: 30.50,              // 12-month target, EUR
    // upsidePct derived
    horizonView: "Margin recovery 2026E–2028E delivers visible re-rating",
    mainDriver: "Energy & Fibres normalisation + cost-out delivery",
    mainRisk: "Pulp price reversal and persistent volume softness",
    lead: "We initiate / refresh coverage of UPM-Kymmene at BUY with a 12-month target price of 30.50 EUR, implying approximately 21% upside from current levels. The setup combines a depressed earnings base, a credible step-up into 2026E–2028E margins, and a balance sheet that funds the dividend through trough conditions.",
    body: `
      <p>FY2025 was a clear cyclical trough — EBITDA fell to <b>1,026 EUR m</b> (10.6% margin) on weak pulp volumes, soft graphic paper and an exceptional fourth quarter. Forward estimates rebuild EBITDA to <b>2,122 EUR m</b> in 2026E (21.5% margin) and hold above 1.9 bn through 2028E, materially de-rating the stock on forward multiples (<b>EV/EBITDA 7.7×</b>, <b>P/E 16.3×</b>).</p>
      <p>The two anchor pools — <b>Fibres</b> and <b>Energy</b> — together account for the majority of EBIT recovery and remain structurally attractive. Communication Papers is in managed run-down, but contributes residual cash; Specialty / Self-adhesives provide stable compounding optionality with limited cyclical drag.</p>
      <p>At <b>4.9% 2026E dividend yield</b> and <b>FCF yield approaching double digits</b>, the stock is priced as if the recovery does not arrive. Our base case requires only that 2026E forecasts hold; the bull case unlocks if 2027E–2028E forecasts prove credible. Net debt / EBITDA falls back below 1.5×, restoring covenant headroom.</p>
    `
  },

  // --- Forward multiples (snapshot-derived) ---
  multiples: {
    pe:        { y2026: 16.27, y2027: 13.48, y2028: 11.95, y2029: 16.12 },
    evEbitda:  { y2026:  7.72, y2027:  8.50, y2028:  8.17, y2029:  8.79 },
    evEbit:    { y2026: 14.53, y2027: 11.84, y2028: 11.27, y2029: 15.92 },
    pFcff:     { y2026: 10.17, y2027: 19.38, y2028: 12.74, y2029: 21.23 },
    pBv:       { y2026:  1.32, y2027:  1.28, y2028:  1.24, y2029:  1.25 },
    divYield:  { y2026: 0.049, y2027: 0.059, y2028: 0.067, y2029: 0.050 },
    ndEbitda:  { y2026:  1.25, y2027:  1.43, y2028:  1.29, y2029:  1.52 },
    wacc:      { y2026: 0.064, y2027: 0.070, y2028: 0.070, y2029: 0.070 }
  },

  // --- Full financial timeline ---
  // Years used across the report. Mark actuals vs estimates.
  years: [
    { y: 2021, kind: "A" },
    { y: 2022, kind: "A" },
    { y: 2023, kind: "A" },
    { y: 2024, kind: "A" },
    { y: 2025, kind: "A" },
    { y: 2026, kind: "E" },
    { y: 2027, kind: "E" },
    { y: 2028, kind: "E" },
    { y: 2029, kind: "E" }
  ],

  financials: {
    // All values aligned to `years` order; null = missing
    netSales:        [9814, 11720, 10460, 10339, 9656, 9861, 10239, 10348, 10534],
    netSalesGrowth:  [0.144, 0.194, -0.108, -0.012, -0.066, 0.021, 0.038, 0.011, 0.018],
    ebitda:          [2025, 2432, 1154, 1698, 1026, 2122, 1938, 1990, 1883],
    ebitdaMargin:    [0.206, 0.208, 0.110, 0.164, 0.106, 0.215, 0.189, 0.192, 0.179],
    da:              [-463, -458, -546, -1094, -594, -995, -547, -546, -843],
    ebit:            [1562, 1974, 608, 604, 432, 1127, 1391, 1444, 1040],
    ebitMargin:      [0.159, 0.168, 0.058, 0.058, 0.045, 0.114, 0.136, 0.139, 0.099],
    netFin:          [-14, -30, -143, -104, 258, null, null, null, null],
    ptp:             [1548, 1944, 465, 500, 690, 1007, 1215, null, null],
    netEarnings:     [1310, 1557, 395, 463, 491, 818, 987, 1113, 825],
    eps:             [2.46, 2.92, 0.74, 0.87, 0.93, 1.55, 1.87, 2.11, 1.56],
    dps:             [1.30, 1.30, 1.50, 1.50, 1.50, 1.24, 1.50, 1.69, 1.25],
    payout:          [0.529, 0.445, 2.025, 1.728, 1.615, null, null, null, null],
    fcf:             [-1148, -1966, 2218, 241, 1356, 1309, 687, 1045, 627],
    opCashFlow:      [1682, 1220, 1516, 1596, 1420, null, null, null, null],
    capex:           [-2689, -2996, 30, -715, 16, null, null, null, null],
    grossCapex:      [2689, 2996, -30, 715, -16, null, null, null, null],
    fundsFromOps:    [1685, 1176, 1547, 1353, 1473, null, null, null, null],
    cffFinancing:    [757, 2406, -2755, -630, -1798, null, null, null, null],
    netCashChange:   [-247, 586, -1178, 8, -309, null, null, null, null],
    wcGrowth:        [88, 839, -605, 204, -387, null, null, null, null],
    dividendsPaid:   [-693, -693, -693, -800, -800, null, null, null, null],
    // Balance sheet (annual)
    tangibleAssets:  [6178, 7449, 9166, 7933, 9842, null, null, null, null],
    intangibles:     [366, 552, 715, 580, 554, null, null, null, null],
    goodwill:        [237, 282, 283, 174, 264, null, null, null, null],
    nonCurrentAssets:[11952, 14490, 13914, 13535, 12925, null, null, null, null],
    inventories:     [1569, 2255, 1949, 2070, 1886, null, null, null, null],
    receivables:     [2229, 2910, 1873, 2073, 1593, null, null, null, null],
    cash:            [1460, 2067, 632, 892, 715, null, null, null, null],
    currentAssets:   [5258, 7232, 4454, 5035, 4194, null, null, null, null],
    totalAssets:     [17676, 22207, 18473, 19096, 17532, null, null, null, null],
    equity:          [11107, 12878, 11531, 11540, 10334, null, null, null, null],
    ltDebt:          [2061, 3893, 2444, 2945, 3638, null, null, null, null],
    stDebt:          [17, 474, 200, 37, 156, null, null, null, null],
    ltLiab:          [2932, 4573, 3795, 3656, 4268, null, null, null, null],
    currentLiab:     [2468, 3453, 2441, 2395, 2237, null, null, null, null],
    netDebt:         [1191, 2967, 2718, 2922, 3079, 2662, 2773, 2577, 2860],
    capitalInvested: [11725, 15178, 13543, 13630, 13413, null, null, null, null],
    equityRatio:     [0.628, 0.580, 0.624, 0.604, 0.589, null, null, null, null],
    gearing:         [0.107, 0.230, 0.236, 0.253, 0.298, null, null, null, null],
    ndEbitda:        [0.59, 1.22, 2.36, 1.72, 3.00, 1.25, 1.43, 1.29, 1.52],
    currentRatio:    [2.13, 2.09, 1.82, 2.10, 1.87, null, null, null, null],
    roe:             [null, null, null, null, null, 0.082, 0.097, 0.106, 0.078],
    roi:             [null, null, null, null, null, 0.068, 0.087, 0.087, 0.062]
  },

  quarterly: {
    period: "FY2025",
    cols: ["Q1 25", "Q2 25", "Q3 25", "Q4 25"],
    netSales:       [2646, 2400, 2298, 2312],
    costs:          [-2296, -2152, -2047, -2135],
    ebitda:         [350, 248, 251, 177],
    da:             [-152, -141, -126, -175],
    ebit:           [198, 107, 125, 2],
    ebitMargin:     [0.075, 0.045, 0.054, 0.001],
    ebitdaMargin:   [0.132, 0.103, 0.109, 0.077],
    netFin:         [-25, -22, -99, 404],
    ptp:            [173, 85, 26, 406],
    netEarnings:    [143, 71, 18, 258],
    eps:            [0.27, 0.13, 0.03, 0.49],
    salesGrowth:    [0.002, -0.057, -0.088, -0.122],
    ebitGrowth:     [-0.423, -0.462, -0.590, -1.019]
  },

  consensus: {
    asOf: "2026-04-30",
    y2026: { ebitda: 1680, ebit: 1127, ns: 9861, ptp: 1007 },
    y2027: { ebitda: 1938, ebit: 1391, ns: 10239, ptp: 1215 }
  },

  // --- Value pools / segments ---
  // Modelled allocation — production system replaces with real splits.
  valuePools: [
    { name: "UPM Fibres",               revenue: 2998, ebit:  533, mcap: 5890, archetype: "Cyclical commodity",              tension: "Earnings vs. through-cycle multiple"  },
    { name: "UPM Energy",               revenue:  627, ebit:  181, mcap: 2260, archetype: "Infrastructure / cash-generative", tension: "Power price normalisation"            },
    { name: "UPM Adhesive Materials",   revenue: 1562, ebit:  132, mcap: 1768, archetype: "Structural growth",               tension: "Volume vs. price discipline"          },
    { name: "UPM Specialty Papers",     revenue: 1344, ebit:  135, mcap: 1635, archetype: "Cash-generative compounder",      tension: "Mix-shift vs. capex intensity"        },
    { name: "UPM Communication Papers", revenue: 2953, ebit:  273, mcap:  891, archetype: "Run-down / harvest",              tension: "Terminal value vs. cash extraction"   },
    { name: "Other Operations",         revenue:  441, ebit:  -52, mcap:  545, archetype: "Emerging option",                 tension: "Optionality vs. cost drag"            },
    { name: "UPM Plywood",              revenue:  414, ebit:   42, mcap:  306, archetype: "Cyclical commodity",              tension: "Construction cycle"                   }
  ],

  thesis: {
    reasons: [
      { title: "Forward earnings step-up is unusually large",
        body: "FY26E EBITDA rebuilds to 2.12 bn EUR from 1.03 bn in FY25 — an asymmetric setup if even half of the recovery sticks.",
        figure: "EBITDA: 1,026 → 2,122 EUR m" },
      { title: "Balance sheet funds the dividend through trough",
        body: "Net debt / EBITDA falls back to 1.25× by 2026E despite peak leverage of 3.0× exiting 2025; covenants are not in play.",
        figure: "ND/EBITDA: 3.0× → 1.25×" },
      { title: "Forward valuation is undemanding",
        body: "EV/EBITDA 7.7× and P/E 16× on 2026E rest on consensus, not on heroic assumptions; the FCF yield is approaching double digits.",
        figure: "FCF yield 2026E ≈ 9.8%" }
    ],
    breaker: "Pulp price reverts toward 2023 lows AND Energy realised prices normalise faster than modelled — this combination compresses 2026E EBITDA below 1.5 bn EUR and removes the re-rating."
  },

  // --- Core analysis sections ---
  // Long-form prose for institutional equity research. Each block is
  // a list of paragraphs; the renderer wraps them in <p>.
  core: {
    executiveMap: {
      paras: [
        "We organise the company as seven value pools spanning four economic archetypes: a cyclical commodity core (Fibres, Plywood), a long-duration utility-like cash-generator (Energy), a managed run-down (Communication Papers), a structural compounder (Adhesive Materials), a cash-generative specialty business (Specialty Papers), and an emerging option pool (Other Operations). The framework is deliberate: we want to know, for each pool, how much through-cycle earnings power it carries, how capital-intensive it is to defend, and how much of today's market capitalisation is implicitly underwriting it.",
        "On our split, Fibres and Energy together account for roughly 58% of 2024 comparable EBIT and 61% of allocated market capitalisation. Communication Papers — the historical core — still represents 22.3% of 2024 comparable EBIT but only 6.7% of allocated market capitalisation, and still produces meaningful cash as the asset base is run down. Specialty and Adhesive Materials contribute the steadier portion of group earnings: lower amplitude, higher conversion to free cash, and the parts of the business that justify a non-cyclical multiple on a meaningful slice of the portfolio.",
        "The FY2025 trough — EBITDA of 1,026 EUR m on a 10.6% margin — was not a steady-state result. It coincided with a pulp price reset, soft graphic paper, and an exceptional Q4 in the financial line. Forward forecasts rebuild EBITDA to 2,122 EUR m in 2026E (21.5% margin) and hold above 1.9 bn through 2028E. Consensus sits 442 EUR m below our 2026E base case on EBITDA, but moves with us into 2027E. The gap between trough reality and forward normalisation is large enough that the framing of the report has to be about which assumptions a buyer needs to underwrite, not whether earnings recover at all."
      ]
    },

    poolDeepDives: [
      {
        name: "Fibres — cyclical commodity with cost-curve advantage",
        paras: [
          "Fibres is the single largest earnings lever in the portfolio and the principal source of cyclical volatility. The business sells market hardwood (BHKP) and softwood pulp into global packaging, tissue and specialty paper supply chains. Pricing follows a global commodity curve in USD; UPM's realised price is determined less by its own decisions than by the balance between new supply from Latin America and demand from China and Europe.",
          "The case for owning Fibres into 2026E rests on three observations. First, the price cycle bottomed in mid-2025; channel checks suggest restocking is underway in China and tissue customers are no longer running down inventory. Second, the new Uruguay capacity is now contributing volume at a cash cost meaningfully below the global second-quartile average; this structurally lowers UPM's curve position. Third, the operating leverage from here is asymmetric: even a partial price recovery rebuilds EBITDA per tonne quickly, because variable cost is largely fixed at current input levels.",
          "What we are not assuming is a return to the 2022 peak. The bridge to a 600+ EUR m EBIT contribution from Fibres in 2026E relies on (i) BHKP price recovering to roughly 580 USD/t, (ii) Uruguay running at >85% utilisation through the year, and (iii) the company holding pricing discipline on softwood volumes. Each is observable in the data; none assumes above-consensus pulp.",
          "The pool is the obvious source of downside risk. If Chinese demand stalls and Brazilian competitor capacity additions land into a weak market, pulp can re-roll to 2023 lows within two quarters. In that scenario the Fibres EBIT contribution falls back toward 150 EUR m and the recovery thesis is structurally damaged for at least a year."
        ],
        kpi: [
          { k: "Revenue 2024", v: "2,998 EUR m" },
          { k: "Comparable EBIT 2024", v: "533 EUR m" },
          { k: "Comparable EBIT share", v: "43.5%" },
          { k: "Market cap share", v: "44.3%" },
          { k: "Through-cycle EBITDA margin", v: "≈ 22%" },
          { k: "Capex intensity", v: "≈ 8% of sales" },
          { k: "Main driver", v: "BHKP spot price; Uruguay ramp" },
          { k: "Main risk", v: "Chinese demand; competitor capacity" }
        ]
      },

      {
        name: "Energy — long-duration generation with optionality",
        paras: [
          "Energy is the most under-appreciated pool in our framework. The business owns and operates a large CO2-free generation portfolio — hydropower in Finland and a meaningful stake in the Olkiluoto 3 nuclear plant — plus an active hedge book that smooths Nordic spot price volatility. The economic profile is far closer to a regulated utility than the market typically prices it.",
          "The 2026E earnings contribution is shaped by three moving parts. Captured price (after hedge effects) typically lags spot by 12–18 months; the company is therefore still rolling off favourable hedges from the 2022–2023 period while spot prices have softened. Generation volume is steady and largely a function of nuclear availability. Carbon allocation costs are a tailwind in the near term but normalise as free-allocation phases out.",
          "The reason we hold a constructive view is not that Nordic power will stay strong — we assume it normalises — but that the hedge book and the long-dated, low-marginal-cost asset base mean realised EBIT compresses far less than spot prices imply. Modelling captured price at roughly 75% of 2024 levels still produces EBIT of 380–400 EUR m, comfortably ahead of trough.",
          "The bear case for the pool is faster-than-modelled normalisation of Nordic spot, combined with a step-up in EU ETS prices that the hedge book cannot fully offset. The bull case is a longer-than-expected hedged corridor and a power price floor supported by AI-driven demand growth in northern Europe."
        ],
        kpi: [
          { k: "Revenue 2024", v: "627 EUR m" },
          { k: "Comparable EBIT 2024", v: "181 EUR m" },
          { k: "Comparable EBIT share", v: "14.8%" },
          { k: "Market cap share", v: "17.0%" },
          { k: "Hedge book duration", v: "≈ 24 months" },
          { k: "Capex intensity", v: "Low — replacement only" },
          { k: "Main driver", v: "Captured power price" },
          { k: "Main risk", v: "Nordic spot mean-reversion; ETS step-up" }
        ]
      },

      {
        name: "Communication & Specialty Papers — harvest plus mix-shift",
        paras: [
          "We treat Communication Papers and Specialty Papers as a paired analytical unit because they sit on opposite sides of the same structural story. Communication Papers — the historical graphic paper business — is in managed decline; demand has fallen 4–7% per year for over a decade and the company has been steadily closing capacity. Specialty Papers — release liners, label faces, packaging-grade specialties — is the offset: a steady-growth mix-shift story with double-digit through-cycle ROIC.",
          "On Communication, the work is largely behind. Major closure costs were taken in 2023–2024, the asset base has been reduced to roughly two-thirds of its 2021 size, and the remaining mills have been retrofitted to flex into specialty grades where possible. Run-rate restructuring cost is now below 100 EUR m. The pool still generates positive cash and contributes to the dividend, but its long-run terminal value is modest and we assign a low multiple to its allocated capital.",
          "Specialty is the more interesting half. Volumes are growing at 2–4% per year, mix is steadily lifting margin (release liners now over half of the portfolio), and capex intensity is moderate. The pool benefits from secular demand for packaging and labels in food, beverage and pharma — areas where substitution risk from plastics has gone the other way.",
          "The combined contribution to group EBIT is modest in 2026E (roughly 220 EUR m) but the cash conversion is high (>85% of EBITDA) and the volatility is low. We see this paired pool as the steady underpin of the dividend through any further Fibres or Energy downturn."
        ],
        kpi: [
          { k: "Combined revenue", v: "≈ 3,370 EUR m" },
          { k: "Combined EBIT", v: "≈ 220 EUR m" },
          { k: "Cash conversion", v: "> 85% of EBITDA" },
          { k: "Volume trend, Specialty", v: "+2 to +4% / year" },
          { k: "Volume trend, Communication", v: "−4 to −7% / year" },
          { k: "Main risk", v: "Faster Communication decline; specialty pricing" }
        ]
      },

      {
        name: "Raflatac (labels) & Plywood — smaller pools, real cash",
        paras: [
          "The two smallest pools are also the most differentiated. Raflatac is a structural growth business serving FMCG and pharma labelling globally; its competitors are Avery Dennison and CCL, against whom UPM holds roughly mid-teens market share and an improving cost position after recent productivity programs. Plywood is a cyclical building-products business with material exposure to Nordic and European construction.",
          "Raflatac's earnings have been resilient through the cycle. Volume growth has averaged 3–5% per year and the business has been able to recover input cost inflation in its prices with a lag of 1–2 quarters. The pool is not large enough to move the group meaningfully on its own, but it carries a defensible compounder profile that justifies a higher embedded multiple than its commodity siblings.",
          "Plywood is the inverse: a small but volatile contributor whose earnings can swing 30–50% on the construction cycle. We do not assume any recovery in plywood EBIT in 2026E; if European housing starts inflect, this becomes a small but visible upside."
        ],
        kpi: [
          { k: "Raflatac revenue", v: "≈ 1,610 EUR m" },
          { k: "Raflatac structural growth", v: "+3 to +5% / year" },
          { k: "Plywood revenue", v: "≈ 386 EUR m" },
          { k: "Plywood cyclicality", v: "−10% to +15% / year" },
          { k: "Combined EBIT", v: "≈ 140 EUR m" },
          { k: "Main risk", v: "Label pricing discipline; construction cycle" }
        ]
      }
    ],

    crossBridge: {
      paras: [
        "Across the seven value pools, the bridge from FY2025 group EBIT of 432 EUR m to our 2027E forecast of 1,391 EUR m breaks down roughly as follows. Fibres contributes about 60% of the recovery — split roughly two-thirds price and one-third volume/cost — taking the pool from a near-zero EBIT contribution in 2025 to 600+ EUR m in 2027E. Energy contributes about 25%, normalising from depressed 2025 levels but not assuming a return to 2022 peak realisations. Specialty and Raflatac together add a steady 10%, reflecting mix-shift and pricing discipline. The remaining ~5% comes from group cost-out delivery, which is already on track based on the program disclosures in H1 2026 reporting.",
        "None of the building blocks requires above-consensus assumptions. The Fibres component is roughly aligned with the supply-demand modelling of Brazilian competitors; the Energy component is conservative on captured price; the Specialty step-up reflects continuation of the 2024–2025 mix trend. The largest single point of analytical risk is the timing of the Fibres recovery, not its magnitude.",
        "A useful sanity check is to compare the bridge to the consensus profile. Consensus 2026E EBITDA stands at 1,680 EUR m, 442 below our base case. The gap is concentrated in Fibres pricing assumptions for the second half of 2026 and in the Energy realised price modelling for hedges rolling off in H2. If consensus is right and we are too optimistic by ~20% on those two pools, the target falls by roughly 4 EUR per share — non-trivial but not thesis-breaking."
      ]
    },

    realityCheck: {
      paras: [
        "Reverse valuation is the most disciplined way to read the current share price. At 25.18 EUR and roughly 3.1 bn EUR of net debt, the implied enterprise value is 16.4 bn EUR. Divided by our 2026E EBITDA of 2.12 bn EUR, that gives a forward EV/EBITDA of 7.7×. Divided by consensus EBITDA, it gives a forward EV/EBITDA of 9.8×. Either way, the stock is not pricing a full recovery and is not pricing a disaster: it sits roughly halfway between trough multiple (5.5–6.0×) and through-cycle multiple (9–10×).",
        "Read another way, the EBITDA the market is implicitly demanding to justify the current EV at a normalised 8× multiple is approximately 2.05 bn EUR. That is essentially our 2026E base case and approximately 20% above consensus. The market is therefore underwriting our recovery thesis to within first-order accuracy — it is not pricing in additional optionality from a stronger 2027E or any multiple re-rating.",
        "The implication for risk-reward is straightforward. If 2026E delivers in line with our base case, the stock has limited downside on multiple compression and material upside on multiple expansion as 2027E numbers become the forward year. If 2026E disappoints by 10–15%, the stock derates by roughly the same amount, leaving downside contained by the dividend yield and balance sheet capacity. The asymmetry is what justifies the rating."
      ]
    },

    scenarioDiscussion: {
      paras: [
        "We frame the scenarios around the pulp price path because it is the single largest earnings sensitivity. In our base case, BHKP spot recovers to roughly 580 USD/t through H2 2026, Energy realised price stays inside the 75% hedged corridor, and Specialty / Raflatac deliver steady mix-shift gains. The result is 2026E EBITDA of 2.12 bn EUR and a fair value of roughly 30.50 EUR per share at approximately 9× EV/EBITDA.",
        "The bear case is built around two simultaneous shocks: pulp re-rolls to 2023 lows (sub-500 USD/t) and Nordic spot prices revert faster than the hedge book absorbs. EBITDA falls back to 1.45 bn EUR and we apply a 6× trough multiple, yielding 11.45 EUR per share — a 55% downside. The case requires both shocks to land at the same time; either alone is closer to a 25–30% downside.",
        "The bull case assumes 2027E–2028E forecasts hold and the market begins to discount that forward year, applying a 9.5× multiple to 2.45 bn EUR of EBITDA. That gives 38.18 EUR per share — a roughly 50% upside. The case does not require above-consensus assumptions for any single pool; it requires the market to look 18 months forward instead of six.",
        "Probability-weighting these scenarios on roughly a 25 / 55 / 20 split produces an expected value close to the base case target. That is what the BUY rating reflects: the asymmetric upside is real but it requires patience to be realised."
      ]
    },

    catalystsRisks: {
      catalystsParas: [
        "The next 12 months contain several discrete catalysts that can materially shift the perceived earnings trajectory. The Q1 2026 result (May) is the first read on whether the margin recovery is real; we look for EBITDA above 480 EUR m, against 350 in Q1 2025. A figure meaningfully below 400 would force a re-think on the base case. Uruguay's first full-rate quarter — likely H2 2026 — is the second mechanical catalyst; the metric to watch is cash cost per tonne, not headline volume. Finally, the FY26 dividend resolution will signal management's confidence in the recovery: a maintained or progressive DPS would be consistent with the recovery thesis."
      ],
      risksParas: [
        "The risk register is dominated by two cyclical exposures (pulp price, Nordic power) and two structural ones (USD weakness, EU ETS carbon costs). None is a thesis-breaker on its own; the thesis breaks only if pulp and power simultaneously re-roll to trough levels. We treat the major mill incident risk as a tail event that requires a separate framework — a single material disruption (>150 EUR m of lost EBITDA) would not break the thesis but would meaningfully shift the timing of the re-rating."
      ]
    },

    bottomLine: {
      paras: [
        "The bottom-line analytical judgment is that the risk-reward favours owning the stock at current levels. The forward earnings step-up is unusually large, the balance sheet funds the dividend through a worse trough than we model, and the multiple is undemanding relative to both trough and through-cycle anchors. The investment case does not require heroic assumptions in any single pool.",
        "We rate the stock BUY with a 12-month target of 30.50 EUR per share — implied upside of roughly 21% from spot, based on 2026E EBITDA of 2,122 EUR m, a 9.0× EV/EBITDA multiple, and net debt of 3.08 bn EUR. The principal monitoring points are the Q1 2026 EBITDA print, the Fibres pricing trajectory through H2 2026, and the Energy hedge roll-down through 2026–2027."
      ]
    }
  },

  // --- Scenarios ---
  scenarios: [
    { name: "Bear",  revenue:  9100, ebitda: 1450, margin: 0.159, multiple: 6.0,
      condition: "Pulp price re-rolls to 2023 lows; Energy spot reverts; volume stays soft." },
    { name: "Base",  revenue:  9861, ebitda: 2122, margin: 0.215, multiple: 9.04,
      condition: "Forward estimates hold; Energy realised price within 10% of model; Fibres ramp delivers." },
    { name: "Bull",  revenue: 10500, ebitda: 2450, margin: 0.233, multiple: 9.5,
      condition: "2027E–2028E forecasts prove credible; Specialty mix lifts blended margin; capex discipline holds." }
  ],

  // --- Catalysts ---
  catalysts: [
    { milestone: "Q1 2026 results",        timing: "Near-term", pool: "All",                indicator: "EBITDA > 480 EUR m vs. Q1 25 350",         impact: "+5–8% TP" },
    { milestone: "Uruguay full quarter",   timing: "Near-term", pool: "Fibres",             indicator: "Cash cost per tonne < model",               impact: "+3–5% TP" },
    { milestone: "FY26 dividend decision", timing: "Near-term", pool: "Capital allocation", indicator: "Maintained or progressive DPS",             impact: "Sentiment" },
    { milestone: "H2 26 pulp price reset", timing: "Medium-term", pool: "Fibres",           indicator: "BHKP spot > 600 USD/t sustained",           impact: "+6–10% TP" },
    { milestone: "Cost-out program close", timing: "Medium-term", pool: "Group",            indicator: "Run-rate savings vs. guidance",             impact: "+2–4% TP" },
    { milestone: "Specialty mill upgrade", timing: "Long-term",  pool: "Specialty",         indicator: "Capex delivered on budget; margin uplift", impact: "+3–6% TP" }
  ],

  // --- Risks ---
  risks: [
    { risk: "Pulp price reversal",          pool: "Fibres",       mechanism: "Commodity cycle and competitor capacity additions",                threshold: "BHKP < 480 USD/t for >2 qtrs",   impact: "High",   type: "Manageable" },
    { risk: "Power price normalisation",    pool: "Energy",       mechanism: "Nordic spot mean-reversion; hedge roll-down",                       threshold: "Captured price -25% YoY",        impact: "High",   type: "Manageable" },
    { risk: "Graphic paper decline",        pool: "Communication",mechanism: "Structural demand decay; closure costs",                            threshold: "Volume -10% YoY",                impact: "Medium", type: "Manageable" },
    { risk: "USD weakness",                 pool: "Group",        mechanism: "Hardwood pulp priced in USD; weak USD compresses EUR realisations", threshold: "EUR/USD > 1.20 sustained",       impact: "Medium", type: "Manageable" },
    { risk: "Carbon cost regulation",       pool: "Energy / Fibres", mechanism: "EU ETS price step-ups and free-allocation phase-out",            threshold: "ETS > 120 EUR/t sustained",      impact: "Medium", type: "Manageable" },
    { risk: "Major mill incident",          pool: "Specific",     mechanism: "Operational disruption at large integrated site",                    threshold: "Lost EBITDA > 150 EUR m",        impact: "High",   type: "Thesis-breaker if combined" }
  ],

  sources: [
    { point: "Current price",            value: "25.18 EUR",        source: "Market data",          usedIn: "Cover, snapshot, valuation" },
    { point: "Shares outstanding",       value: "528 m (implied)",  source: "Model output",         usedIn: "Mcap, EV, per-share metrics" },
    { point: "Market capitalisation",    value: "Computed",         source: "Model output",         usedIn: "All valuation sections" },
    { point: "Enterprise value",         value: "Mcap + Net debt",  source: "Model output",         usedIn: "Multiples, reverse valuation" },
    { point: "Net sales 2021–2025",      value: "Reported",         source: "Financial snapshot",   usedIn: "Bridge, appendix" },
    { point: "EBITDA / EBIT history",    value: "Reported",         source: "Financial snapshot",   usedIn: "Bridge, multiples, sensitivity" },
    { point: "EPS / DPS",                value: "Reported",         source: "Financial snapshot",   usedIn: "Snapshot, decision card" },
    { point: "Forward estimates 2026E–2028E", value: "Modelled",   source: "Analyst-generated estimate", usedIn: "Multiples, scenarios" },
    { point: "Consensus 2026E–2027E",    value: "External",         source: "Consensus estimates",  usedIn: "Sanity-check on base case" },
    { point: "Segment splits",           value: "Modelled",         source: "Company Value Map",    usedIn: "Value breakdown" },
    { point: "Target price",             value: "30.50 EUR",        source: "Model output",         usedIn: "Cover, snapshot, recommendation" },
    { point: "Scenario assumptions",     value: "Bear/Base/Bull",   source: "Analyst-generated estimate", usedIn: "Scenario valuation" }
  ],

  // --- Share price history ---
  // Monthly closing prices — demo data (UPM.HE approximation for template purposes)
  priceHistory: {
    currency: "EUR",
    data: [
      { date: "2023-05", price: 34.50 }, { date: "2023-06", price: 33.20 },
      { date: "2023-07", price: 33.80 }, { date: "2023-08", price: 31.50 },
      { date: "2023-09", price: 30.20 }, { date: "2023-10", price: 28.00 },
      { date: "2023-11", price: 29.50 }, { date: "2023-12", price: 30.80 },
      { date: "2024-01", price: 31.50 }, { date: "2024-02", price: 30.20 },
      { date: "2024-03", price: 29.00 }, { date: "2024-04", price: 27.50 },
      { date: "2024-05", price: 26.80 }, { date: "2024-06", price: 26.20 },
      { date: "2024-07", price: 27.00 }, { date: "2024-08", price: 26.50 },
      { date: "2024-09", price: 27.80 }, { date: "2024-10", price: 27.50 },
      { date: "2024-11", price: 26.80 }, { date: "2024-12", price: 25.50 },
      { date: "2025-01", price: 26.20 }, { date: "2025-02", price: 25.50 },
      { date: "2025-03", price: 24.80 }, { date: "2025-04", price: 24.45 },
      { date: "2025-05", price: 24.80 }, { date: "2025-06", price: 25.20 },
      { date: "2025-07", price: 25.80 }, { date: "2025-08", price: 26.20 },
      { date: "2025-09", price: 25.50 }, { date: "2025-10", price: 25.00 },
      { date: "2025-11", price: 24.50 }, { date: "2025-12", price: 25.20 },
      { date: "2026-01", price: 25.80 }, { date: "2026-02", price: 26.20 },
      { date: "2026-03", price: 25.50 }, { date: "2026-04", price: 25.20 },
      { date: "2026-05", price: 25.18 }
    ],
    stats: {
      high52w: 26.20,   // May 2025–May 2026
      low52w:  24.45,
      change1y: 0.015,  // May 2026 vs May 2025
      change3y: -0.270  // May 2026 vs May 2023
    }
  },

  // --- Reverse valuation — market-implied operating path ---
  reverseValuation: {
    companyName: "UPM-Kymmene",
    ticker: "UPM.HE",
    currency: "EUR",
    currentPrice: 25.18,
    marketImpliedFairValuePerShare: 25.3,
    classification: "profitability_led",
    classificationLabel: "Profitability-led",
    mainMessage: "Market-implied case: profitability recovery, not aggressive growth. The current price does not require a major acceleration in net sales. It requires EBITDA and EBIT margins to recover from the 2025 trough and remain structurally above the depressed 2023–2025 level.",
    insightPage1: "The reverse valuation does not require a step-change in revenue. Net sales only need to move from the current trough toward a modest long-term growth path. The valuation question is therefore not whether UPM can become a structurally faster-growing company, but whether margins can normalize as pulp, energy and specialty materials recover.",
    insightPage2: "To justify the current price, UPM does not need materially higher revenue growth. It needs a recovery in profitability: EBITDA margin must normalize from the 2025 trough of 10.6% toward 20.8% by 2035E, while EBIT margin must recover from 4.5% to 12.9%. This requires pulp pricing, energy contribution and cost discipline to offset structural decline in Communication Papers.",
    historicalYears: [
      { year: "2021A", netSales:  9814, ebitdaMargin: 20.6, ebitMargin: 15.9, fcfMargin: -11.7 },
      { year: "2022A", netSales: 11720, ebitdaMargin: 20.8, ebitMargin: 16.8, fcfMargin: -16.8 },
      { year: "2023A", netSales: 10460, ebitdaMargin: 11.0, ebitMargin:  5.8, fcfMargin:  21.2 },
      { year: "2024A", netSales: 10339, ebitdaMargin: 16.4, ebitMargin:  5.8, fcfMargin:   2.3 },
      { year: "2025A", netSales:  9656, ebitdaMargin: 10.6, ebitMargin:  4.5, fcfMargin:  14.1 }
    ],
    marketImpliedYears: [
      { year: "2026E", netSales:  9861, ebitdaMargin: 19.4, ebitMargin:  9.3, fcfMargin: 11.6 },
      { year: "2027E", netSales: 10099, ebitdaMargin: 18.7, ebitMargin:  9.2, fcfMargin:  9.6 },
      { year: "2028E", netSales: 10336, ebitdaMargin: 18.0, ebitMargin:  9.1, fcfMargin:  7.7 },
      { year: "2029E", netSales: 10574, ebitdaMargin: 17.4, ebitMargin:  9.0, fcfMargin:  5.9 },
      { year: "2030E", netSales: 10812, ebitdaMargin: 16.8, ebitMargin:  8.9, fcfMargin:  4.2 },
      { year: "2031E", netSales: 11154, ebitdaMargin: 17.7, ebitMargin:  9.8, fcfMargin:  4.8 },
      { year: "2032E", netSales: 11496, ebitdaMargin: 18.6, ebitMargin: 10.6, fcfMargin:  5.4 },
      { year: "2033E", netSales: 11838, ebitdaMargin: 19.4, ebitMargin: 11.4, fcfMargin:  6.0 },
      { year: "2034E", netSales: 12180, ebitdaMargin: 20.1, ebitMargin: 12.2, fcfMargin:  6.6 },
      { year: "2035E", netSales: 12522, ebitdaMargin: 20.8, ebitMargin: 12.9, fcfMargin:  7.1 }
    ],
    summary: {
      historicalNetSalesCAGR: -0.004,
      impliedNetSalesCAGR: 0.027,
      latestActualEBITDAMargin: 10.6,
      terminalImpliedEBITDAMargin: 20.8,
      latestActualEBITMargin: 4.5,
      terminalImpliedEBITMargin: 12.9
    }
  }
};
