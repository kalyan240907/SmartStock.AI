// SmartStock AI - Detailed Subscription Packages & Specification Matrix
// Enforcing exact 3-tier access rules:
// 1. Free Plan: Access ONLY to Gemini AI Stock Prediction & core inventory management.
// 2. Upgrade Plan (₹499/mo): Access to Other Businesses (B2B Trade Network & Peer Sourcing) + Current Market Trends & Approach Suggestions.
// 3. Premium Plan (₹1,499/mo): Full Market Leadership Guidelines (How to improve similar products to reach #1 Top Rank) + Gemini Chief Advisory.

window.SmartStock = window.SmartStock || {};

window.SmartStock.PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    nameKey: 'plan_free',
    badge: 'Starter (AI Stock Prediction)',
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceLabelMonthly: '₹0',
    priceLabelYearly: '₹0',
    periodMonthly: '/ forever',
    periodYearly: '/ forever',
    description: 'Free access exclusively to Gemini AI Stock Prediction and core single-store inventory management.',
    popular: false,
    color: 'sky',
    tagline: 'Stock Prediction & Core Tracking at Zero Cost',
    accessSummary: 'Access ONLY to Stock Prediction & Basic Inventory',
    specs: {
      stockPrediction: 'Full Gemini AI Stockout & Depletion Forecast',
      inventoryCatalog: 'Up to 50 Products (Single Store)',
      posBilling: 'Included (Atomic Stock Deduction)',
      otherBusinesses: 'Not Included (Requires Upgrade Plan)',
      marketTrends: 'Not Included (Requires Upgrade Plan)',
      topRankGuidelines: 'Not Included (Requires Premium Plan)',
      staffLogins: '1 Owner Account',
      voiceControl: 'Standard (All 6 Languages)',
      support: 'Self-Service & Community Voice'
    },
    features: [
      { text: 'Gemini AI Stock Prediction & Coverage Forecast', included: true },
      { text: 'Single Store Inventory Tracking (Up to 50 SKUs)', included: true },
      { text: 'POS Customer Billing & Real-Time Stock Depletion', included: true },
      { text: 'Dedicated Low-Stock Horizon & Coverage Calculator', included: true },
      { text: 'All 6 Languages (Tamil, Hindi, English, etc.)', included: true },
      { text: 'Access Other Businesses (B2B Trade Network)', included: false, requiresPlan: 'growth' },
      { text: 'Current Market Trends & Strategic Approach Suggestions', included: false, requiresPlan: 'growth' },
      { text: 'Market Guidelines: How to Improve Similar Products to Top Rank', included: false, requiresPlan: 'pro' },
      { text: 'Gemini Chief Supply Chain & Pricing Advisory', included: false, requiresPlan: 'pro' }
    ],
    limits: {
      maxProducts: 50,
      monthlyTradeRequests: 0,
      hasTradeNetworkAccess: false,
      hasMarketTrendsAccess: false,
      hasTopRankGuidelinesAccess: false,
      staffAccounts: 1,
      supportLevel: 'Community & Voice Help'
    }
  },
  {
    id: 'growth',
    name: 'Upgrade Plan',
    nameKey: 'plan_growth',
    badge: 'Most Popular (Growth)',
    monthlyPrice: 499,
    yearlyPrice: 4790, // ~20% discount
    priceLabelMonthly: '₹499',
    priceLabelYearly: '₹4,790',
    periodMonthly: '/ month',
    periodYearly: '/ year (Save 20%)',
    description: 'Unlock Other Businesses (B2B Trade Network) for direct sourcing & trading, plus Current Market Trends and strategic approach suggestions.',
    popular: true,
    color: 'sky',
    tagline: 'Other Businesses Access + Market Trend Strategies',
    accessSummary: 'Stock Prediction + Other Businesses + Market Trends',
    specs: {
      stockPrediction: 'Full Gemini AI Shortage & Lead-Time Gap Forecasting',
      inventoryCatalog: 'Up to 500 Products',
      posBilling: 'Included with Velocity Impact Analytics',
      otherBusinesses: 'Full Access to B2B Peer Trade Network & Direct Sourcing',
      marketTrends: 'Current Market Trends & Specific Approach Strategies',
      topRankGuidelines: 'Not Included (Requires Premium Plan)',
      staffLogins: '3 Staff Logins (Manager & Cashier)',
      voiceControl: 'Priority High-Speed Voice Engine',
      support: 'Priority WhatsApp & Chat Support'
    },
    features: [
      { text: 'Everything in Free Plan (Stock Prediction & Core Tracking)', included: true },
      { text: 'Access Other Businesses (B2B Smart Trade Network)', included: true },
      { text: 'Direct Peer Sourcing & Inter-Store Surplus Trading', included: true },
      { text: 'Current Market Trends & Consumer Demand Velocity Shifts', included: true },
      { text: 'Specific Approach Suggestions (How to Approach Current Market)', included: true },
      { text: 'Inventory Catalog Up to 500 Products', included: true },
      { text: 'Interactive What-If Scenario Demand Simulator', included: true },
      { text: 'Monthly Stock Ledger CSV Audit Export', included: true },
      { text: 'Market Guidelines: How to Improve Similar Products to Top Rank', included: false, requiresPlan: 'pro' },
      { text: 'Gemini Chief Supply Chain & Product Leadership Advisory', included: false, requiresPlan: 'pro' }
    ],
    limits: {
      maxProducts: 500,
      monthlyTradeRequests: 9999,
      hasTradeNetworkAccess: true,
      hasMarketTrendsAccess: true,
      hasTopRankGuidelinesAccess: false,
      staffAccounts: 3,
      supportLevel: 'Priority WhatsApp & Chat'
    }
  },
  {
    id: 'pro',
    name: 'Premium Plan',
    nameKey: 'plan_pro',
    badge: 'Enterprise Leadership',
    monthlyPrice: 1499,
    yearlyPrice: 14390, // ~20% discount
    priceLabelMonthly: '₹1,499',
    priceLabelYearly: '₹14,390',
    periodMonthly: '/ month',
    periodYearly: '/ year (Save 20%)',
    description: 'Full market mastery: Step-by-step guidelines on how to conquer your market, beat competitor products, and reach the #1 top rank in sales.',
    popular: false,
    color: 'sky',
    tagline: 'Market Guidelines: Improve Similar Products to Reach #1 Top Rank',
    accessSummary: 'All Features + Top-Rank Market Guidelines + Gemini Advisory',
    specs: {
      stockPrediction: 'Enterprise Predictive AI with Multi-Variable Demand Spikes',
      inventoryCatalog: 'Unlimited Inventory SKUs',
      posBilling: 'Multi-Terminal Enterprise POS Sync',
      otherBusinesses: 'Priority Elite Trade Network & Direct Sourcing',
      marketTrends: 'Full Market Trends & Predictive Industry Reports',
      topRankGuidelines: 'Full Actionable Dossier: Beat Competitors to #1 Rank',
      staffLogins: 'Up to 10 Staff Accounts (Full RBAC)',
      voiceControl: 'Priority Voice + Quick Action Macros',
      support: 'Dedicated Account Manager (2-Hour SLA)'
    },
    features: [
      { text: 'Everything in Upgrade Plan (Stock Prediction, Other Businesses, Market Trends)', included: true },
      { text: 'Market Guidelines: How to Improve Similar Products to Reach #1 Top Rank', included: true },
      { text: 'Competitor Benchmarking & Under-Pricing / Quality Positioning Matrix', included: true },
      { text: 'Gemini Chief Supply Chain & Product Strategy Advisory', included: true },
      { text: 'Priority Verified Elite Supplier Badge in Trade Network', included: true },
      { text: 'Unlimited Products & Store SKUs', included: true },
      { text: 'Up to 10 Staff Accounts with Role Permissions', included: true },
      { text: 'One-Click GST-Ready Audit Ledgers & Export', included: true },
      { text: 'Dedicated Account Manager & Phone SLA', included: true }
    ],
    limits: {
      maxProducts: 99999,
      monthlyTradeRequests: 9999,
      hasTradeNetworkAccess: true,
      hasMarketTrendsAccess: true,
      hasTopRankGuidelinesAccess: true,
      staffAccounts: 10,
      supportLevel: 'Dedicated Manager (2hr SLA)'
    }
  }
];

// Specification Comparison Categories matching exact plan access
window.SmartStock.SPECIFICATION_MATRIX = [
  {
    category: 'Core Feature Access',
    specs: [
      { name: 'Gemini AI Stock Prediction', free: '✓ Full Access', growth: '✓ Full Access', pro: '✓ Full Access' },
      { name: 'Core Stock Inventory List', free: '✓ Up to 50 SKUs', growth: '✓ Up to 500 SKUs', pro: '✓ Unlimited SKUs' },
      { name: 'Access Other Businesses (B2B Network)', free: '✕ Locked (Upgrade Req)', growth: '✓ Full Access', pro: '✓ Priority Elite Access' },
      { name: 'Current Market Trends & Suggestions', free: '✕ Locked (Upgrade Req)', growth: '✓ Full Access', pro: '✓ Full Access' },
      { name: 'Market Guidelines (Top Rank Product)', free: '✕ Locked (Premium Req)', growth: '✕ Locked (Premium Req)', pro: '✓ Full Actionable Dossier' }
    ]
  },
  {
    category: 'Capacity & Operations',
    specs: [
      { name: 'Max Inventory Products', free: '50 SKUs', growth: '500 SKUs', pro: 'Unlimited SKUs' },
      { name: 'Customer POS Billing & Depletion', free: '✓ Real-Time', growth: '✓ Real-Time + Velocity', pro: '✓ Real-Time + Multi-Counter' },
      { name: 'Staff Account Logins', free: '1 Owner Only', growth: 'Up to 3 Staff', pro: 'Up to 10 Staff' },
      { name: 'Trade Requests to Other Businesses', free: '✕ None', growth: '✓ Unlimited', pro: '✓ Unlimited + Priority' }
    ]
  },
  {
    category: 'Market Intelligence & Guidelines',
    specs: [
      { name: 'Consumer Buying Trends Forecast', free: '✕ No', growth: '✓ Included', pro: '✓ In-Depth Predictive' },
      { name: 'Approach Current Market Suggestions', free: '✕ No', growth: '✓ Actionable Tips', pro: '✓ Chief Advisory' },
      { name: 'Beat Competitor Products to #1 Rank', free: '✕ No', growth: '✕ No', pro: '✓ Complete 30-Day Blueprint' },
      { name: 'Audit Reports & Ledgers', free: 'Screen View Only', growth: '✓ Monthly CSV', pro: '✓ GST CSV & PDF Ledgers' }
    ]
  }
];

// Official UPI Billing & Payment Configuration for Plan Upgrades
window.SmartStock.UPI_CONFIG = {
  upiId: 'gandhiraman031-3@oksbi',
  payeeName: 'SmartStock AI / Gandhi Raman',
  bankName: 'State Bank of India (OKSBI)',
  acceptedApps: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Cred', 'Amazon Pay'],
  instructions: 'Scan QR code or transfer to official UPI ID. Enter UTR reference number to activate plan instantly.'
};
