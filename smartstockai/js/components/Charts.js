// SmartStock AI - Interactive SVG Analytics & Gauge Charts (White & Sky Blue Theme)
window.SmartStock = window.SmartStock || {};
window.SmartStock.Charts = window.SmartStock.Charts || {};

(function() {
  const h = React.createElement;

  /**
   * Donut Valuation Chart
   */
  function DonutValuationChart({ products = [] }) {
    // Group products by category
    const catMap = {};
    let totalVal = 0;

    products.forEach(p => {
      const cat = p.category || 'General';
      const val = (p.quantity || 0) * (p.purchasePrice || 0);
      catMap[cat] = (catMap[cat] || 0) + val;
      totalVal += val;
    });

    const entries = Object.entries(catMap).map(([cat, val]) => ({
      category: cat,
      value: val,
      percent: totalVal > 0 ? (val / totalVal) * 100 : 0
    })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5 categories

    const colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#0369a1', '#075985'];

    // Calculate SVG circle arcs
    const radius = 68;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercent = 0;

    return h('div', { className: 'flex flex-col md:flex-row items-center justify-between gap-6' }, [
      // SVG Graphic
      h('div', { key: 'svg-wrapper', className: 'relative w-48 h-48 flex-shrink-0 flex items-center justify-center' }, [
        h('svg', { key: 'donut-svg', viewBox: '0 0 180 180', className: 'w-full h-full transform -rotate-90' }, [
          h('circle', {
            key: 'bg-track',
            cx: '90',
            cy: '90',
            r: radius,
            fill: 'none',
            stroke: '#f0f9ff',
            strokeWidth: '22'
          }),
          entries.map((item, idx) => {
            const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += item.percent;

            return h('circle', {
              key: item.category,
              cx: '90',
              cy: '90',
              r: radius,
              fill: 'none',
              stroke: colors[idx % colors.length],
              strokeWidth: '22',
              strokeDasharray,
              strokeDashoffset,
              className: 'transition-all duration-700 ease-out hover:opacity-90'
            });
          })
        ]),
        // Centered total label
        h('div', { key: 'center-label', className: 'absolute inset-0 flex flex-col items-center justify-center pointer-events-none' }, [
          h('span', { className: 'text-xs font-medium text-sky-600 uppercase tracking-wider' }, 'Total Value'),
          h('span', { className: 'text-xl font-bold text-sky-950' }, `₹${Math.round(totalVal).toLocaleString()}`),
          h('span', { className: 'text-xs text-sky-600 font-semibold' }, `${products.length} SKUs`)
        ])
      ]),

      // Legend
      h('div', { key: 'legend', className: 'flex-1 space-y-2 w-full' },
        entries.map((item, idx) =>
          h('div', { key: item.category, className: 'flex items-center justify-between p-2 rounded-xl hover:bg-sky-50 transition' }, [
            h('div', { className: 'flex items-center gap-2.5 truncate' }, [
              h('span', {
                className: 'w-3 h-3 rounded-full flex-shrink-0',
                style: { backgroundColor: colors[idx % colors.length] }
              }),
              h('span', { className: 'text-sm font-medium text-sky-900 truncate' }, item.category)
            ]),
            h('div', { className: 'text-right' }, [
              h('span', { className: 'text-sm font-bold text-sky-950' }, `₹${Math.round(item.value).toLocaleString()}`),
              h('span', { className: 'text-xs text-sky-600 ml-2 font-mono' }, `${item.percent.toFixed(1)}%`)
            ])
          ])
        )
      )
    ]);
  }

  /**
   * Bar Chart: Current Stock vs Minimum Safety Level
   */
  function StockLevelBarChart({ products = [] }) {
    // Select top 6 products by valuation or risk
    const displayProds = products.slice(0, 6);
    const maxVal = Math.max(1, ...displayProds.map(p => Math.max(p.quantity || 0, p.minStockLevel || 0)));

    return h('div', { className: 'space-y-4' },
      displayProds.map(p => {
        const qty = p.quantity || 0;
        const min = p.minStockLevel || 0;
        const qtyPct = Math.min(100, (qty / maxVal) * 100);
        const minPct = Math.min(100, (min / maxVal) * 100);

        const isLow = qty > 0 && qty <= min;
        const isOut = qty === 0;

        let barColor = 'bg-sky-500';
        let badgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
        let statusText = 'In Stock';

        if (isOut) {
          barColor = 'bg-sky-300';
          badgeColor = 'bg-sky-100 text-sky-900 border-sky-300';
          statusText = 'Out of Stock';
        } else if (isLow) {
          barColor = 'bg-sky-600';
          badgeColor = 'bg-sky-100 text-sky-800 border-sky-300';
          statusText = 'Low Stock';
        }

        return h('div', { key: p.id, className: 'space-y-1.5' }, [
          h('div', { className: 'flex justify-between items-center text-xs' }, [
            h('div', { className: 'flex items-center gap-2 truncate' }, [
              h('span', { className: 'font-semibold text-sky-950 truncate' }, p.name),
              h('span', { className: 'text-sky-500 font-mono text-[11px]' }, `(${p.sku})`)
            ]),
            h('div', { className: 'flex items-center gap-2' }, [
              h('span', { className: 'font-bold text-sky-950' }, `${qty} / ${min} ${p.unit} min`),
              h('span', { className: `px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeColor}` }, statusText)
            ])
          ]),
          h('div', { className: 'relative w-full h-3 bg-sky-100 rounded-full overflow-hidden' }, [
            h('div', {
              className: `h-full rounded-full transition-all duration-500 ${barColor}`,
              style: { width: `${qtyPct}%` }
            }),
            // Safety threshold marker
            h('div', {
              className: 'absolute top-0 bottom-0 w-0.5 bg-sky-950 z-10 opacity-70',
              style: { left: `${minPct}%` },
              title: `Minimum Safety Level: ${min} ${p.unit}`
            })
          ])
        ]);
      })
    );
  }

  /**
   * Monthly Stock In vs Stock Out Area Movement Trend
   */
  function MovementTrendChart() {
    // 6-month sample trend points
    const months = [
      { month: 'May', in: 34000, out: 28000 },
      { month: 'Jun', in: 42000, out: 38000 },
      { month: 'Jul', in: 39000, out: 41000 },
      { month: 'Aug', in: 51000, out: 46000 },
      { month: 'Sep', in: 48000, out: 49000 },
      { month: 'Oct', in: 58000, out: 44000 }
    ];

    const maxVal = 65000;
    const height = 140;
    const width = 450;
    const stepX = width / (months.length - 1);

    // Coordinates for Stock-In
    const inPoints = months.map((m, i) => `${i * stepX},${height - (m.in / maxVal) * (height - 20)}`).join(' ');
    const inArea = `0,${height} ${inPoints} ${width},${height}`;

    // Coordinates for Stock-Out
    const outPoints = months.map((m, i) => `${i * stepX},${height - (m.out / maxVal) * (height - 20)}`).join(' ');
    const outArea = `0,${height} ${outPoints} ${width},${height}`;

    return h('div', { className: 'space-y-4' }, [
      h('div', { className: 'flex items-center justify-between text-xs text-sky-600' }, [
        h('div', { className: 'flex items-center gap-4' }, [
          h('div', { className: 'flex items-center gap-1.5' }, [
            h('span', { className: 'w-3 h-3 rounded-sm bg-sky-500' }),
            h('span', { className: 'font-medium text-sky-800' }, 'Stock-In (Restock / Sourced)')
          ]),
          h('div', { className: 'flex items-center gap-1.5' }, [
            h('span', { className: 'w-3 h-3 rounded-sm bg-sky-300' }),
            h('span', { className: 'font-medium text-sky-800' }, 'Stock-Out (Dispatched / Consumed)')
          ])
        ]),
        h('span', { className: 'font-mono text-sky-500' }, 'Valuation Volume (₹)')
      ]),

      h('div', { className: 'w-full h-36 relative overflow-hidden' }, [
        h('svg', { viewBox: `0 0 ${width} ${height}`, className: 'w-full h-full' }, [
          // Grid lines
          [0.25, 0.5, 0.75, 1].map(r =>
            h('line', {
              key: r,
              x1: '0',
              y1: height * (1 - r),
              x2: width,
              y2: height * (1 - r),
              stroke: '#e0f2fe',
              strokeDasharray: '4 4'
            })
          ),
          // Stock-In Area
          h('polygon', {
            points: inArea,
            fill: 'rgba(14, 165, 233, 0.15)'
          }),
          // Stock-In Line
          h('polyline', {
            points: inPoints,
            fill: 'none',
            stroke: '#0284c7',
            strokeWidth: '3',
            strokeLinecap: 'round'
          }),
          // Stock-Out Area
          h('polygon', {
            points: outArea,
            fill: 'rgba(2, 132, 199, 0.08)'
          }),
          // Stock-Out Line
          h('polyline', {
            points: outPoints,
            fill: 'none',
            stroke: '#38bdf8',
            strokeWidth: '3',
            strokeLinecap: 'round'
          })
        ])
      ]),

      // Month labels
      h('div', { className: 'flex justify-between text-xs font-medium text-sky-600' },
        months.map(m => h('span', { key: m.month }, m.month))
      )
    ]);
  }

  /**
   * Coverage Radial Gauge for What-If Simulator
   */
  function CoverageGauge({ coverageDays = 2.4, leadTimeDays = 4.0, hasGap = true }) {
    const maxScale = Math.max(10, leadTimeDays * 2);
    const pct = Math.min(100, Math.max(5, (coverageDays / maxScale) * 100));

    const gaugeColor = '#0284c7'; // pure sky blue
    let statusText = 'Adequate Coverage';

    if (coverageDays < leadTimeDays) {
      statusText = 'Critical Supply Gap';
    } else if (coverageDays < leadTimeDays * 1.5) {
      statusText = 'Tight Buffer';
    }

    return h('div', { className: 'flex flex-col items-center justify-center p-5 bg-white border-2 border-sky-300 rounded-2xl text-sky-950 relative overflow-hidden shadow-sm' }, [
      h('div', { className: 'text-xs uppercase tracking-wider text-sky-600 font-semibold mb-1' }, 'Stock Coverage Gauge'),
      h('div', { className: 'text-4xl font-black tracking-tight text-sky-950' }, `${coverageDays} Days`),
      h('div', { className: 'text-xs text-sky-600 mt-1 font-medium' }, `Supplier Lead Time: ${leadTimeDays} Days`),

      // Horizontal Bar Meter
      h('div', { className: 'w-full max-w-xs mt-4 relative' }, [
        h('div', { className: 'h-3 bg-sky-100 rounded-full overflow-hidden' }, [
          h('div', {
            className: 'h-full transition-all duration-500 rounded-full bg-sky-500',
            style: { width: `${pct}%` }
          })
        ]),
        // Marker for supplier lead time
        h('div', {
          className: 'absolute -top-1 bottom-0 w-0.5 bg-sky-950 z-10 shadow',
          style: { left: `${Math.min(100, (leadTimeDays / maxScale) * 100)}%` },
          title: `Delivery Day Marker (${leadTimeDays}d)`
        })
      ]),

      h('div', { className: 'flex justify-between w-full max-w-xs text-[10px] text-sky-600 mt-1 font-mono' }, [
        h('span', null, '0d'),
        h('span', { className: 'text-sky-950 font-bold' }, `Lead Time (${leadTimeDays}d)`),
        h('span', null, `${maxScale}d+`)
      ]),

      h('div', {
        className: 'mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-300'
      }, statusText)
    ]);
  }

  window.SmartStock.Charts = {
    DonutValuationChart,
    StockLevelBarChart,
    MovementTrendChart,
    CoverageGauge
  };
})();
