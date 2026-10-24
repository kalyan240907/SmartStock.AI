// SmartStock AI - High-Visibility Scalable SVG Icons
window.SmartStock = window.SmartStock || {};
window.SmartStock.Icons = window.SmartStock.Icons || {};

(function() {
  const h = React.createElement;

  function svg(pathElements, className = 'w-5 h-5', viewBox = '0 0 24 24') {
    return h('svg', {
      className,
      viewBox,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }, pathElements);
  }

  const Icons = {
    // Microphone for Voice
    Mic: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z' }),
      h('path', { key: 2, d: 'M19 10v2a7 7 0 0 1-14 0v-2' }),
      h('line', { key: 3, x1: '12', y1: '19', x2: '12', y2: '22' })
    ], className),

    // Speaker / Read Aloud
    Volume2: ({ className = 'w-5 h-5' }) => svg([
      h('polygon', { key: 1, points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' }),
      h('path', { key: 2, d: 'M15.54 8.46a5 5 0 0 1 0 7.07' }),
      h('path', { key: 3, d: 'M19.07 4.93a10 10 0 0 1 0 14.14' })
    ], className),

    // Globe for Language selector
    Globe: ({ className = 'w-5 h-5' }) => svg([
      h('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
      h('line', { key: 2, x1: '2', y1: '12', x2: '22', y2: '12' }),
      h('path', { key: 3, d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
    ], className),

    // Subscription Sparkles
    Sparkles: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'm12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z' })
    ], className),

    CreditCard: ({ className = 'w-5 h-5' }) => svg([
      h('rect', { key: 1, x: '2', y: '5', width: '20', height: '14', rx: '2' }),
      h('line', { key: 2, x1: '2', y1: '10', x2: '22', y2: '10' })
    ], className),

    Cpu: ({ className = 'w-5 h-5' }) => svg([
      h('rect', { key: 1, x: '4', y: '4', width: '16', height: '16', rx: '2' }),
      h('rect', { key: 2, x: '9', y: '9', width: '6', height: '6' }),
      h('path', { key: 3, d: 'M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2' })
    ], className),

    Utensils: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2' }),
      h('path', { key: 2, d: 'M15 2v14a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2' }),
      h('path', { key: 3, d: 'M12 21v-4' }),
      h('path', { key: 4, d: 'M6 2v20' })
    ], className),

    ShoppingBag: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z' }),
      h('path', { key: 2, d: 'M3 6h18' }),
      h('path', { key: 3, d: 'M16 10a4 4 0 0 1-8 0' })
    ], className),

    Sprout: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M7 20h10' }),
      h('path', { key: 2, d: 'M10 20c0-4.5 2-8 7-8' }),
      h('path', { key: 3, d: 'M17 12c-4 0-7-3-7-7 0 4-3 7-7 7 4 0 7 3 7 7' })
    ], className),

    Shirt: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z' })
    ], className),

    Box: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' }),
      h('polyline', { key: 2, points: '3.29 7 12 12 20.71 7' }),
      h('line', { key: 3, x1: '12', y1: '22', x2: '12', y2: '12' })
    ], className),

    TrendingUp: ({ className = 'w-5 h-5' }) => svg([
      h('polyline', { key: 1, points: '22 7 13.5 15.5 8.5 10.5 2 17' }),
      h('polyline', { key: 2, points: '16 7 22 7 22 13' })
    ], className),

    AlertTriangle: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' }),
      h('line', { key: 2, x1: '12', y1: '9', x2: '12', y2: '13' }),
      h('line', { key: 3, x1: '12', y1: '17', x2: '12.01', y2: '17' })
    ], className),

    CheckCircle: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
      h('polyline', { key: 2, points: '22 4 12 14.01 9 11.01' })
    ], className),

    XCircle: ({ className = 'w-5 h-5' }) => svg([
      h('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
      h('line', { key: 2, x1: '15', y1: '9', x2: '9', y2: '15' }),
      h('line', { key: 3, x1: '9', y1: '9', x2: '15', y2: '15' })
    ], className),

    ArrowRightLeft: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'm16 3 4 4-4 4' }),
      h('path', { key: 2, d: 'M20 7H4' }),
      h('path', { key: 3, d: 'm8 21-4-4 4-4' }),
      h('path', { key: 4, d: 'M4 17h16' })
    ], className),

    Plus: ({ className = 'w-5 h-5' }) => svg([
      h('line', { key: 1, x1: '12', y1: '5', x2: '12', y2: '19' }),
      h('line', { key: 2, x1: '5', y1: '12', x2: '19', y2: '12' })
    ], className),

    Edit: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' }),
      h('path', { key: 2, d: 'm15 5 4 4' })
    ], className),

    Trash: ({ className = 'w-5 h-5' }) => svg([
      h('polyline', { key: 1, points: '3 6 5 6 21 6' }),
      h('path', { key: 2, d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' })
    ], className),

    Search: ({ className = 'w-5 h-5' }) => svg([
      h('circle', { key: 1, cx: '11', cy: '11', r: '8' }),
      h('line', { key: 2, x1: '21', y1: '21', x2: '16.65', y2: '16.65' })
    ], className),

    Filter: ({ className = 'w-5 h-5' }) => svg([
      h('polygon', { key: 1, points: '22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' })
    ], className),

    Download: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
      h('polyline', { key: 2, points: '7 10 12 15 17 10' }),
      h('line', { key: 3, x1: '12', y1: '15', x2: '12', y2: '3' })
    ], className),

    Upload: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
      h('polyline', { key: 2, points: '17 8 12 3 7 8' }),
      h('line', { key: 3, x1: '12', y1: '3', x2: '12', y2: '15' })
    ], className),

    FileText: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { key: 2, points: '14 2 14 8 20 8' }),
      h('line', { key: 3, x1: '16', y1: '13', x2: '8', y2: '13' }),
      h('line', { key: 4, x1: '16', y1: '17', x2: '8', y2: '17' }),
      h('line', { key: 5, x1: '10', y1: '9', x2: '8', y2: '9' })
    ], className),

    RefreshCw: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' }),
      h('path', { key: 2, d: 'M3 3v5h5' }),
      h('path', { key: 3, d: 'M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16' }),
      h('path', { key: 4, d: 'M16 16h5v5' })
    ], className),

    Truck: ({ className = 'w-5 h-5' }) => svg([
      h('rect', { key: 1, x: '1', y: '3', width: '15', height: '13' }),
      h('polygon', { key: 2, points: '16 8 20 8 23 11 23 16 16 16 16 8' }),
      h('circle', { key: 3, cx: '5.5', cy: '18.5', r: '2.5' }),
      h('circle', { key: 4, cx: '18.5', cy: '18.5', r: '2.5' })
    ], className),

    Building: ({ className = 'w-5 h-5' }) => svg([
      h('rect', { key: 1, x: '4', y: '2', width: '16', height: '20', rx: '2', ry: '2' }),
      h('path', { key: 2, d: 'M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01' })
    ], className),

    Sliders: ({ className = 'w-5 h-5' }) => svg([
      h('line', { key: 1, x1: '4', y1: '21', x2: '4', y2: '14' }),
      h('line', { key: 2, x1: '4', y1: '10', x2: '4', y2: '3' }),
      h('line', { key: 3, x1: '12', y1: '21', x2: '12', y2: '12' }),
      h('line', { key: 4, x1: '12', y1: '8', x2: '12', y2: '3' }),
      h('line', { key: 5, x1: '20', y1: '21', x2: '20', y2: '16' }),
      h('line', { key: 6, x1: '20', y1: '12', x2: '20', y2: '3' }),
      h('line', { key: 7, x1: '1', y1: '14', x2: '7', y2: '14' }),
      h('line', { key: 8, x1: '9', y1: '8', x2: '15', y2: '8' }),
      h('line', { key: 9, x1: '17', y1: '16', x2: '23', y2: '16' })
    ], className),

    Clock: ({ className = 'w-5 h-5' }) => svg([
      h('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
      h('polyline', { key: 2, points: '12 6 12 12 16 14' })
    ], className),

    ShieldCheck: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }),
      h('path', { key: 2, d: 'm9 12 2 2 4-4' })
    ], className),

    BarChart3: ({ className = 'w-5 h-5' }) => svg([
      h('line', { key: 1, x1: '18', y1: '20', x2: '18', y2: '10' }),
      h('line', { key: 2, x1: '12', y1: '20', x2: '12', y2: '4' }),
      h('line', { key: 3, x1: '6', y1: '20', x2: '6', y2: '14' })
    ], className),

    Award: ({ className = 'w-5 h-5' }) => svg([
      h('circle', { key: 1, cx: '12', cy: '8', r: '7' }),
      h('polyline', { key: 2, points: '8.21 13.89 7 23 12 20 17 23 15.79 13.88' })
    ], className),

    ArrowLeft: ({ className = 'w-5 h-5' }) => svg([
      h('line', { key: 1, x1: '19', y1: '12', x2: '5', y2: '12' }),
      h('polyline', { key: 2, points: '12 19 5 12 12 5' })
    ], className),

    HelpCircle: ({ className = 'w-5 h-5' }) => svg([
      h('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
      h('path', { key: 2, d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' }),
      h('line', { key: 3, x1: '12', y1: '17', x2: '12.01', y2: '17' })
    ], className),

    Settings: ({ className = 'w-5 h-5' }) => svg([
      h('circle', { key: 1, cx: '12', cy: '12', r: '3' }),
      h('path', { key: 2, d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })
    ], className),

    Bell: ({ className = 'w-5 h-5' }) => svg([
      h('path', { key: 1, d: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' }),
      h('path', { key: 2, d: 'M10.3 21a1.94 1.94 0 0 0 3.4 0' })
    ], className),

    Check: ({ className = 'w-5 h-5' }) => svg([
      h('polyline', { key: 1, points: '20 6 9 17 4 12' })
    ], className),

    X: ({ className = 'w-5 h-5' }) => svg([
      h('line', { key: 1, x1: '18', y1: '6', x2: '6', y2: '18' }),
      h('line', { key: 2, x1: '6', y1: '6', x2: '18', y2: '18' })
    ], className),

    ChevronRight: ({ className = 'w-5 h-5' }) => svg([
      h('polyline', { key: 1, points: '9 18 15 12 9 6' })
    ], className),

    ChevronDown: ({ className = 'w-5 h-5' }) => svg([
      h('polyline', { key: 1, points: '6 9 12 15 18 9' })
    ], className),

    Info: ({ className = 'w-5 h-5' }) => svg([
      h('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
      h('line', { key: 2, x1: '12', y1: '16', x2: '12', y2: '12' }),
      h('line', { key: 3, x1: '12', y1: '8', x2: '12.01', y2: '8' })
    ], className),

    Layers: ({ className = 'w-5 h-5' }) => svg([
      h('polygon', { key: 1, points: '12 2 2 7 12 12 22 7 12 2' }),
      h('polyline', { key: 2, points: '2 17 12 22 22 17' }),
      h('polyline', { key: 3, points: '2 12 12 17 22 12' })
    ], className),

    Lock: ({ className = 'w-5 h-5' }) => svg([
      h('rect', { key: 1, x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' }),
      h('path', { key: 2, d: 'M7 11V7a5 5 0 0 1 10 0v4' })
    ], className),

    Zap: ({ className = 'w-5 h-5' }) => svg([
      h('polygon', { key: 1, points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
    ], className),

    Tv: ({ className = 'w-5 h-5' }) => svg([
      h('rect', { key: 1, x: '2', y: '7', width: '20', height: '15', rx: '2', ry: '2' }),
      h('polyline', { key: 2, points: '17 2 12 7 7 2' })
    ], className),

    Copy: ({ className = 'w-5 h-5' }) => svg([
      h('rect', { key: 1, x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' }),
      h('path', { key: 2, d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' })
    ], className),

    QrCode: ({ className = 'w-5 h-5' }) => svg([
      h('rect', { key: 1, x: '3', y: '3', width: '7', height: '7' }),
      h('rect', { key: 2, x: '14', y: '3', width: '7', height: '7' }),
      h('rect', { key: 3, x: '14', y: '14', width: '7', height: '7' }),
      h('rect', { key: 4, x: '3', y: '14', width: '7', height: '7' })
    ], className)
  };

  window.SmartStock.Icons = Icons;
})();
