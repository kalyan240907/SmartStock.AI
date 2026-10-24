// SmartStock AI - Sector Intelligence & Trend Analytics Data (Transparent Sample Benchmarks)
window.SmartStock = window.SmartStock || {};

window.SmartStock.SECTOR_TRENDS = {
  electronics: {
    title: 'Consumer Electronics, Smart TV & Home Appliance Market Trends',
    disclaimer: 'Market indicators are based on quarterly retail consumer electronics sell-through reports and regional festival demand models.',
    metrics: [
      { label: '43" & 55" Smart 4K TV Market Growth', value: '+34.2% YoY', change: '+5.4% this quarter', status: 'increasing' },
      { label: '5-Star Inverter AC Pre-Summer Sales', value: 'High Demand', change: 'Early dealer bookings peak', status: 'improving' },
      { label: 'Mid-Tier 5G Smartphone Velocity', value: '4.2 Days Turnover', change: 'Fast moving stock', status: 'stable' },
      { label: 'Smart TV Soundbar Attach Rate', value: '42.8%', change: 'Cross-selling opportunity', status: 'improving' }
    ],
    trendInsights: [
      {
        topic: 'OTT Streaming Driving 4K Smart TV Upgrades',
        description: 'Households are rapidly shifting from legacy 32" screens to 43" and 55" 4K Google TVs. Display panels with Dolby Atmos audio are capturing over 65% of television category revenues.',
        recommendation: 'Maintain minimum buffer of 8-10 units of 43" 4K TVs and bundle with 160W Soundbars for maximum margin.'
      },
      {
        topic: 'Inverter AC & Eco Refrigerant Shifts',
        description: '5-Star Inverter split air conditioners are out-selling non-inverter models 4:1. Energy efficiency label upgrades are causing customers to prefer BLDC motor models.',
        recommendation: 'Pre-order 1.5 Ton 5-Star cooling units 2 weeks ahead of peak summer heatwaves to secure distributor tier pricing.'
      }
    ],
    leadTimeBreakdown: [
      { category: 'Smart LED & 4K TVs (43" / 55")', currentDays: 3, benchmarkDays: 2, risk: 'Moderate' },
      { category: 'Inverter Split Air Conditioners', currentDays: 3, benchmarkDays: 3, risk: 'Low' },
      { category: '5G Mobile Handsets', currentDays: 2, benchmarkDays: 2, risk: 'Low' },
      { category: 'Frost-Free Refrigerators & Washers', currentDays: 4, benchmarkDays: 3, risk: 'Moderate' }
    ]
  },

  food: {
    title: 'Culinary Intelligence, Expiry Horizons & Spoilage Prevention',
    disclaimer: 'Calculations derived from internal FIFO records and cold-chain compliance data.',
    metrics: [
      { label: 'Current Food Waste Prevention Rate', value: '94.2%', change: '+3.8% vs last month', status: 'improving' },
      { label: 'Monthly Financial Loss Avoided', value: '$2,340', change: '180 kg rescued from spoilage', status: 'positive' },
      { label: 'Avg Perishable Turnover Cycle', value: '3.4 Days', change: 'Optimal kitchen cadence', status: 'stable' },
      { label: 'Critical Shelf-Life Items (< 72h)', value: '2 SKUs', change: 'Mozzarella & Ripe Avocados', status: 'warning' }
    ],
    trendInsights: [
      {
        topic: 'Dynamic Chef Daily Specials to Prevent Spoilage',
        description: 'By pairing items within 96 hours of expiration (such as Fresh Mozzarella and Hass Avocados) into high-margin appetizers, restaurant kitchens can convert 90%+ of potential food waste into net profit.',
        recommendation: 'Trigger kitchen staff notification 4 days prior to expiration date.'
      },
      {
        topic: 'Local Cold-Chain Sourcing Advantage',
        description: 'Sourcing dairy and soft produce within a 50-mile radius improves post-delivery shelf life by an average of 48 hours compared to national consolidated distributors.',
        recommendation: 'Connect with local artisanal creameries via SmartStock B2B trade network for on-demand top-ups.'
      }
    ],
    expiryHorizons: [
      { item: 'Artisan Mozzarella Curd', remainingDays: 4, quantity: '50 kg', dailyUse: '8 kg/day', projectedWaste: '18 kg surplus', action: 'Promote Caprese & Wood-Fired Pizza Special' },
      { item: 'Hass Avocados (Ripe)', remainingDays: 5, quantity: '85 kg', dailyUse: '14 kg/day', projectedWaste: '15 kg surplus', action: 'Feature Table-Side Guacamole Feature' },
      { item: 'Organic Whole Milk 3.8%', remainingDays: 7, quantity: '120 L', dailyUse: '25 L/day', projectedWaste: '0 L (Balanced)', action: 'Normal Barista Consumption' },
      { item: 'Tipo 00 Pizza Flour', remainingDays: 175, quantity: '35 bags', dailyUse: '3 bags/day', projectedWaste: '0 bags (Stable)', action: 'Dry Storage Safe' }
    ]
  },

  grocery: {
    title: 'Retail Sales Velocity & Automated Replenishment Intelligence',
    disclaimer: 'Sales velocity classifications are derived from point-of-sale volume and shelf turnover logs.',
    metrics: [
      { label: 'Fast-Moving (A-Rank) Volume Share', value: '64.8%', change: 'Top 20% SKUs generating 65% volume', status: 'positive' },
      { label: 'Out-of-Stock Shelf Incidents', value: '0.4%', change: 'Benchmark < 2.0%', status: 'improving' },
      { label: 'Average Inventory Holding Days', value: '14.2 Days', change: '-1.5 days turnover speed', status: 'positive' },
      { label: 'Dead-Stock Capital Tied Up', value: '$1,420', change: 'Down 12% MoM', status: 'improving' }
    ],
    trendInsights: [
      {
        topic: 'Staple Flour & Grains High-Velocity Velocity Surge',
        description: 'Pantry staple categories (stone-ground flour, cooking oils) show a consistent 15% weekend volume surge. Retailers maintaining a 4-day reorder buffer prevent frequent empty-shelf lost revenue.',
        recommendation: 'Automate purchase orders when pantry staples dip below 3.5 days of daily velocity.'
      },
      {
        topic: 'Bundle Merchandising for Moderate Velocity Goods',
        description: 'Pairing B-Rank items (e.g., California Almonds) with fast-moving pantry items boosts B-rank velocity by up to 24% without discounting retail unit price.',
        recommendation: 'Set up endcap displays pairing related high-margin and fast-moving SKUs.'
      }
    ],
    velocityMatrix: [
      { rank: 'A-Rank (Fast Moving)', share: '25% of SKUs', revenueContrib: '65%', turnover: 'Every 3-5 days', strategy: 'Strict safety buffers & automated daily replenishment' },
      { rank: 'B-Rank (Moderate)', share: '50% of SKUs', revenueContrib: '28%', turnover: 'Every 14-21 days', strategy: 'Weekly order batches and cross-promotions' },
      { rank: 'C-Rank (Slow Moving)', share: '25% of SKUs', revenueContrib: '7%', turnover: 'Every 45-60 days', strategy: 'Minimal safety stock; on-demand B2B trade sourcing' }
    ]
  },

  textiles: {
    title: 'Apparel Material Trends & Fabric Roll Optimization',
    disclaimer: 'Illustrative trend forecasts for fashion seasonality and fabric cutting utilization.',
    metrics: [
      { label: 'Raw Fabric Roll Cutting Yield', value: '95.8%', change: 'Wastage contained at 4.2%', status: 'positive' },
      { label: 'Denim & Indigo Material Demand', value: '+18% Seasonality', change: 'Autumn collection runway ramp', status: 'positive' },
      { label: 'Avg Yarn-to-Fabric Cycle Time', value: '24 Days', change: '-3 days via regional spinning mills', status: 'improving' },
      { label: 'Combed Cotton Spot Price', value: '$4.20 / kg', change: 'Stable within ±2% band', status: 'stable' }
    ],
    trendInsights: [
      {
        topic: 'Selvage Denim & Heritage Workwear Resurgence',
        description: 'Heavyweight (12oz to 14oz) shuttle-loom selvage denim maintains strong designer adoption for upcoming autumn outerwear collections. Premium brands are pre-purchasing roll allocations.',
        recommendation: 'Reserve minimum 500 meters of raw selvage rolls 6 weeks ahead of sewing runs.'
      },
      {
        topic: 'Computerized Roll Nesting to Reduce Cut Scraps',
        description: 'Automated digital CAD pattern nesting reduces fabric edge scraps from 8.5% down to under 4.5%, saving an estimated $12,000 annually per 10,000 meters cut.',
        recommendation: 'Group garment pattern sizes dynamically during cutting layout.'
      }
    ],
    trendPalette: [
      { name: 'Indigo Deep (Pantone 19-4028 TCX)', category: 'Core Heavyweight Denim', trendDemand: 'High (Runway Staple)', velocity: '40 meters/day' },
      { name: 'Natural Ecru Greige (Pantone 11-0103 TCX)', category: 'Sustainable Undyed Cotton', trendDemand: 'Surging (+28%)', velocity: '55 kg/day' },
      { name: 'Terracotta Earth (Pantone 18-1442 TCX)', category: 'Autumn Outerwear & Chinos', trendDemand: 'Seasonal Spike', velocity: '22 meters/day' },
      { name: 'Sage Green (Pantone 16-0213 TCX)', category: 'Organic Knitted Apparel', trendDemand: 'Moderate Growth', velocity: '18 meters/day' }
    ]
  }
};
