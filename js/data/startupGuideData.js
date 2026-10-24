// SmartStock AI - Startup Business Guide Data
window.SmartStock = window.SmartStock || {};

window.SmartStock.STARTUP_CHECKLIST = [
  { id: 'chk-1', title: 'Define Legal Structure & Tax Registrations', desc: 'Register business entity (LLC/Corp/Proprietorship), obtain Tax ID / GSTIN, and open business bank account.', category: 'Legal & Foundation', completed: true },
  { id: 'chk-2', title: 'Establish Primary & Secondary Suppliers', desc: 'Secure at least two vetted suppliers for critical materials to eliminate single-point-of-failure risks.', category: 'Sourcing & Supply', completed: true },
  { id: 'chk-3', title: 'Determine Safety Stock Thresholds & Lead Times', desc: 'Calculate daily usage rate and lead times for top 20% high-revenue SKUs (Pareto 80/20 rule).', category: 'Inventory Planning', completed: false },
  { id: 'chk-4', title: 'Configure Warehouse & Storage Zoning', desc: 'Set up clear bin locations, cold-chain monitoring if perishable, and FIFO (First In First Out) workflows.', category: 'Operations & Storage', completed: false },
  { id: 'chk-5', title: 'Establish Working Capital Reserve (90 Days)', desc: 'Maintain liquid operational capital to finance inventory cycles without emergency debt.', category: 'Finance & Capital', completed: false },
  { id: 'chk-6', title: 'Configure SmartStock AI Inventory & Alert Cadence', desc: 'Upload catalog, set minimum reorder thresholds, and link B2B trade network preferences.', category: 'Digital Systems', completed: true },
  { id: 'chk-7', title: 'Test Emergency B2B Stock-Share Protocol', desc: 'Simulate a supplier lead-time delay and practice issuing a peer-to-peer trade request.', category: 'Risk Mitigation', completed: false },
  { id: 'chk-8', title: 'Review Margin & Unit Economics Against Overhead', desc: 'Run pricing simulator to guarantee minimum 35%+ gross margin after packaging, freight, and shrinkage.', category: 'Financial Viability', completed: false }
];

window.SmartStock.ACTION_PLAN_30_DAYS = [
  {
    week: 'Week 1',
    theme: 'Foundation & Baseline Audit',
    focus: 'Catalog audit, supplier vetting, and foundational inventory setup.',
    tasks: [
      'Conduct complete physical count of existing stock and reconcile SKUs.',
      'Record exact supplier delivery lead times and Minimum Order Quantities (MOQs).',
      'Categorize all items into Fast, Medium, and Slow velocity tiers.',
      'Document storage constraints (temperature, shelf space, security).'
    ]
  },
  {
    week: 'Week 2',
    theme: 'Buffer Math & Threshold Calibration',
    focus: 'Mathematical calibration of reorder points and safety stock.',
    tasks: [
      'Calculate average daily usage across recent sales or manufacturing runs.',
      'Set Safety Stock = (Max Daily Usage × Max Lead Time) - (Avg Daily Usage × Avg Lead Time).',
      'Configure SmartStock AI shortage alerts for items with < 5 days coverage.',
      'Identify single-supplier bottlenecks and find alternative peer sources on B2B network.'
    ]
  },
  {
    week: 'Week 3',
    theme: 'Operational Workflow & Pilot Transactions',
    focus: 'Standardizing daily stock-in and stock-out recording.',
    tasks: [
      'Train floor staff or kitchen prep on immediate stock-movement logging.',
      'Enforce FIFO rotation labels on all incoming crates or bins.',
      'Perform mid-week discrepancy cycle counts on top 5 critical SKUs.',
      'Review daily coverage gauges to preempt upcoming weekend or holiday surges.'
    ]
  },
  {
    week: 'Week 4',
    theme: 'B2B Trade Readiness & Financial Review',
    focus: 'Reviewing cash conversion cycle and community trade integration.',
    tasks: [
      'Calculate Cash Conversion Cycle (CCC = Days Inventory + Days Receivables - Days Payables).',
      'List excess non-critical buffer items on SmartStock B2B Trade Network.',
      'Conduct monthly margin review: identify high-cost low-turnover dead weight.',
      'Finalize next month rolling procurement plan based on AI suggested reorders.'
    ]
  }
];

window.SmartStock.FINANCIAL_FORMULAS = [
  {
    name: 'Stock Coverage Days',
    formula: 'Coverage = Current On-Hand Stock / Daily Usage Rate',
    meaning: 'Tells you precisely how many days of operation remain before zero inventory is reached if no deliveries arrive.',
    tip: 'If Coverage < Supplier Lead Time, you have an active supply gap that will halt operations unless expedited.'
  },
  {
    name: 'Reorder Point (ROP)',
    formula: 'ROP = (Average Daily Usage × Supplier Lead Time) + Safety Stock',
    meaning: 'The inventory level that triggers a purchase order so fresh stock arrives exactly as safety stock is touched.',
    tip: 'Add a 15-20% buffer if your supplier has seasonal delivery variability.'
  },
  {
    name: 'Gross Profit Margin %',
    formula: 'Gross Margin = ((Selling Price - Purchase Cost) / Selling Price) × 100',
    meaning: 'The percentage of revenue retained after paying the direct Cost of Goods Sold (COGS).',
    tip: 'Early-stage startups should target 40-50% gross margin to absorb unforeseen fixed operating overhead.'
  },
  {
    name: 'Break-Even Sales Volume',
    formula: 'Break-Even Units = Total Monthly Fixed Overhead / (Unit Price - Unit Cost)',
    meaning: 'The exact unit quantity that must be sold each month just to pay rent, salaries, utilities, and software.',
    tip: 'Every unit sold above break-even contributes directly to operating net profit.'
  }
];

window.SmartStock.SECTOR_STARTUP_STRATEGIES = {
  electronics: [
    'Order high-lead-time ICs and microcontrollers 3 to 6 months in advance with staggered shipping dates.',
    'Standardize on widely available generic passives (e.g., standard 0805/1206 packages) to avoid sole-source chips.',
    'Keep 30 days of safety stock for high-value passive components whose stockout halts entire surface-mount lines.',
    'Leverage local B2B peer trading to borrow reels of passives during global semiconductor shipment customs delays.'
  ],
  food: [
    'Design dynamic "Special of the Day" menu items to liquidate ingredients with < 72 hours of shelf life remaining.',
    'Never exceed 4 days of refrigerated dairy or produce stock without confirmed weekend event catering bookings.',
    'Implement digital temperature logging twice daily: refrigeration failure is the #1 cause of catastrophic startup loss.',
    'Sell or trade excess sealed bulk stock to neighboring cafes or bakeries before expiration dates approach.'
  ],
  grocery: [
    'Prioritize high-turnover staple items (bread, milk, eggs, flour) to establish customer foot traffic consistency.',
    'Enforce strict supplier minimum order delivery windows to prevent stock delivery jams at receiving docks.',
    'Negotiate return-to-vendor (RTV) credit terms with distributors for damaged packaging or near-expiry goods.',
    'Audit shrinkage (theft, damage, scanning errors) weekly to maintain shrinkage below 1.5% of gross revenue.'
  ],
  textiles: [
    'Buy base un-dyed greige fabric in bulk, and dye small production batches to align precisely with emergent fashion colors.',
    'Use computerized fabric roll nesting patterns to keep cut-piece fabric waste strictly under 5%.',
    'Launch seasonal collections with limited pre-orders to validate demand before committing to 1,000+ meter roll orders.',
    'Trade dead-stock rolls with independent designers or fashion schools through regional B2B material networks.'
  ]
};
