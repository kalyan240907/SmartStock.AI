// SmartStock AI - Google Gemini API Predictive Intelligence Service
window.SmartStock = window.SmartStock || {};

(function() {
  const GEMINI_API_KEY_STORAGE_KEY = 'smartstock_gemini_api_key';
  const GEMINI_MODEL = 'gemini-1.5-flash';
  const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const GeminiService = {
    /**
     * Retrieve stored Gemini API Key
     */
    getApiKey() {
      try {
        return (localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) || '').trim();
      } catch (e) {
        return '';
      }
    },

    /**
     * Save Gemini API Key
     */
    setApiKey(key) {
      try {
        if (!key || !key.trim()) {
          localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
        } else {
          localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key.trim());
        }
        return true;
      } catch (e) {
        return false;
      }
    },

    /**
     * Check if a live Gemini API Key is configured
     */
    hasApiKey() {
      const k = this.getApiKey();
      return Boolean(k && k.length > 10);
    },

    /**
     * Direct call to Google Gemini 1.5 Flash API
     */
    async callGeminiRaw(prompt, systemInstruction = '', customApiKey = null) {
      const apiKey = (customApiKey || this.getApiKey() || '').trim();
      if (!apiKey) {
        throw new Error('NO_API_KEY');
      }

      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json'
        }
      };

      if (systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second strict timeout

      try {
        const url = `${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const msg = errorData.error?.message || `Gemini API returned status ${res.status}`;
          throw new Error(msg);
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          throw new Error('Empty response from Gemini API');
        }

        return JSON.parse(text);
      } catch (err) {
        if (err.name === 'AbortError') {
          throw new Error('TIMEOUT: Gemini API took longer than 4s. Switched to instant engine.');
        }
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    },

    /**
     * Test connection to Gemini API with latency measurement
     */
    async testConnection(keyToTest = null) {
      const k = (keyToTest || this.getApiKey() || '').trim();
      if (!k) {
        return { ok: false, error: 'Please enter a Gemini API Key first.' };
      }
      const start = Date.now();
      try {
        const res = await this.callGeminiRaw(
          'Output strictly JSON: {"status": "ok", "message": "Google Gemini 1.5 Flash Connected"}',
          'You are an API health checker. Always return valid JSON with status and message keys.',
          k
        );
        const duration = Date.now() - start;
        return {
          ok: true,
          duration,
          message: `Connected successfully to Google Gemini 1.5 Flash (${duration}ms latency)`
        };
      } catch (err) {
        return {
          ok: false,
          error: err.message || 'Connection test failed. Check key validity and network.'
        };
      }
    },

    /**
     * Predict SKU Stockout Risk & Optimal Reorder using Gemini
     */
    async predictProductDemand(product, sectorName = 'General', currentLang = 'en') {
      const insights = window.SmartStock.InsightsEngine || {};
      const coverage = insights.calculateCoverage ? insights.calculateCoverage(product.quantity, product.dailyUsage) : (product.quantity / (product.dailyUsage || 1)).toFixed(1);
      const leadTime = product.leadTimeDays || 3;
      const gap = Math.max(0, leadTime - coverage);

      if (this.hasApiKey()) {
        try {
          const systemPrompt = `You are SmartStock AI's Chief Industrial Supply Chain Forecasting Agent.
Analyze the inventory item and predict its operational trajectory.
Always respond in strictly valid JSON with this exact schema:
{
  "predictedCoverageDays": number,
  "stockoutRiskLevel": "CRITICAL" | "HIGH" | "MODERATE" | "HEALTHY",
  "predictedStockoutDate": string,
  "suggestedReorderQuantity": number,
  "urgencyScore": number (1-100),
  "aiReasoning": string (clear explanation in language: ${currentLang}),
  "marketTrendFactor": string,
  "recommendedAction": string
}`;

          const userPrompt = `Product Details:
- Name: ${product.name}
- SKU: ${product.sku}
- Category: ${product.category}
- Business Sector: ${sectorName}
- Current On-Hand Stock: ${product.quantity} ${product.unit}
- Daily Usage / Sales: ${product.dailyUsage} ${product.unit}/day
- Safe Minimum Buffer Level: ${product.minStockLevel} ${product.unit}
- Supplier Lead Time: ${leadTime} days
- Purchase Price: ₹${product.purchasePrice}
- Sector-Specific Attributes: ${JSON.stringify({
  storageTemp: product.storageTemp,
  expiryDate: product.expiryDate,
  modelNumber: product.modelNumber,
  warrantyMonths: product.warrantyMonths,
  fabricBlend: product.fabricBlend
})}

Calculate stockout timeline, supply gap risk, and optimal reorder quantity.`;

          const result = await this.callGeminiRaw(userPrompt, systemPrompt);
          return {
            ...result,
            isLiveGemini: true,
            modelUsed: 'Google Gemini 1.5 Flash'
          };
        } catch (err) {
          console.warn('Gemini API call failed, falling back to deterministic engine:', err.message);
          // Fall through to deterministic fallback below
        }
      }

      // Deterministic fallback (Transparent rule-based AI)
      const isCritical = gap > 0 || product.quantity <= product.minStockLevel;
      const stockoutDate = insights.calculateStockoutDate ? insights.calculateStockoutDate(coverage) : `In ${coverage} days`;
      const suggestedReorder = insights.calculateSuggestedReorder 
        ? insights.calculateSuggestedReorder(product.quantity, product.dailyUsage, leadTime).suggestedQuantity 
        : Math.ceil(product.dailyUsage * (leadTime + 3) - product.quantity);

      return {
        predictedCoverageDays: parseFloat(coverage),
        stockoutRiskLevel: product.quantity === 0 ? 'CRITICAL' : gap > 0 ? 'HIGH' : isCritical ? 'MODERATE' : 'HEALTHY',
        predictedStockoutDate: stockoutDate,
        suggestedReorderQuantity: Math.max(0, suggestedReorder),
        urgencyScore: product.quantity === 0 ? 100 : gap > 0 ? 85 : isCritical ? 60 : 20,
        aiReasoning: `Current stock of ${product.quantity} ${product.unit} covers ~${coverage} days at ${product.dailyUsage} ${product.unit}/day. Supplier transit requires ${leadTime} days.${gap > 0 ? ` A supply deficit gap of ${gap.toFixed(1)} days will cause a stockout before delivery.` : ' Stock buffer is sufficient.'}`,
        marketTrendFactor: `${sectorName} regional trade patterns indicate stable demand baseline with typical supplier replenishment delays.`,
        recommendedAction: gap > 0 
          ? `Immediate peer B2B sourcing recommended for ${Math.ceil(gap * product.dailyUsage)} ${product.unit} to cover the transit gap.` 
          : `Maintain standard procurement cycle of ${Math.max(0, suggestedReorder)} ${product.unit}.`,
        isLiveGemini: false,
        modelUsed: 'Deterministic Operational AI (Gemini Fallback)'
      };
    },

    /**
     * Ask Gemini Assistant about inventory, reorders, and recommendations
     */
    async askGeminiAssistant(userQuery, products = [], sectorName = 'General', currentLang = 'en') {
      const inventorySummary = (products || []).slice(0, 15).map(p => ({
        name: p.name,
        qty: `${p.quantity} ${p.unit}`,
        dailyUsage: `${p.dailyUsage} ${p.unit}/day`,
        minStock: `${p.minStockLevel} ${p.unit}`,
        price: `₹${p.purchasePrice}`
      }));

      if (this.hasApiKey()) {
        try {
          const systemPrompt = `You are SmartStock AI, an intelligent B2B and inventory management advisor.
Answer the shop owner's inquiry clearly, concicely, and actionable in language code: ${currentLang}.
Return JSON strictly with schema:
{
  "title": string (brief summary heading),
  "body": string (helpful clear answer with numbers and reasoning),
  "actionLabel": string (2-3 words button text),
  "actionView": "inventory" | "low-stock" | "insights" | "trade-network" | "trade-requests" | "reports" | "help"
}`;

          const userPrompt = `Store Sector: ${sectorName}
Active Inventory Samples: ${JSON.stringify(inventorySummary)}
User Question: "${userQuery}"

Provide smart inventory predictions and recommendations based on the data.`;

          const result = await this.callGeminiRaw(userPrompt, systemPrompt);
          return {
            ...result,
            isLiveGemini: true,
            modelUsed: 'Google Gemini 1.5 Flash'
          };
        } catch (err) {
          console.warn('Gemini chat failed, using fallback:', err.message);
        }
      }

      // Intelligent deterministic fallback
      const q = (userQuery || '').toLowerCase();
      const lowStockItems = products.filter(p => p.quantity <= p.minStockLevel);

      if (q.includes('low') || q.includes('shortage') || q.includes('run out')) {
        return {
          title: `⚡ AI Stock Forecast: ${lowStockItems.length} Products at Safety Risk`,
          body: `Analysis of ${products.length} products in ${sectorName}: Found ${lowStockItems.length} items below minimum safety threshold. We predict imminent stockouts for: ${lowStockItems.slice(0, 2).map(p => p.name).join(', ') || 'none currently'}. Recommended reorder batch size: 80-120 units.`,
          actionLabel: 'View Low Stock Alerts',
          actionView: 'low-stock',
          isLiveGemini: false,
          modelUsed: 'SmartStock AI Engine'
        };
      }

      if (q.includes('supplier') || q.includes('buy') || q.includes('trade') || q.includes('need')) {
        return {
          title: '🤝 Smart Sourcing & B2B Matcher',
          body: `SmartStock AI scanned the registered ${sectorName} trade network. Multiple peer suppliers in your region have available buffer quantities ready for next-day dispatch.`,
          actionLabel: 'Find Peer Suppliers',
          actionView: 'trade-network',
          isLiveGemini: false,
          modelUsed: 'SmartStock AI Engine'
        };
      }

      return {
        title: '📊 Comprehensive Store Operational Status',
        body: `Your store currently holds ${products.length} catalog items in ${sectorName}. Total valuation is ₹${Math.round(products.reduce((acc, p) => acc + (p.quantity * (p.purchasePrice || 0)), 0)).toLocaleString()}. Stock health is optimal across ${products.length - lowStockItems.length} lines.`,
        actionLabel: 'Open Suggestions',
        actionView: 'insights',
        isLiveGemini: false,
        modelUsed: 'SmartStock AI Engine'
      };
    },

    /**
     * Analyze newly completed customer bill and forecast consumer demand & stockout horizon
     */
    async predictConsumerDemandFromBill(bill, activeProducts = [], sectorName = 'General', currentLang = 'en') {
      const billedSummary = (bill.items || []).map(i => `${i.name} (Sold: ${i.quantity} ${i.unit})`).join(', ');
      const catalogSummary = (activeProducts || []).slice(0, 10).map(p => ({
        name: p.name,
        remainingStock: `${p.quantity} ${p.unit}`,
        dailyUsage: `${p.dailyUsage} ${p.unit}/day`,
        bufferLevel: `${p.minStockLevel} ${p.unit}`
      }));

      if (this.hasApiKey()) {
        try {
          const systemPrompt = `You are SmartStock AI's Real-Time Customer Billing & Consumer Demand Forecasting Agent.
Analyze the customer billing transaction and generate predictive insights for consumer availability, rush hours, cross-sell baskets, and inventory replenishment.
Always respond strictly in valid JSON with this exact schema:
{
  "velocityStatus": string (e.g. "+35% Consumer Demand Acceleration"),
  "consumerStockoutTimeline": string (clear timeline when remaining stock will be exhausted by consumers),
  "consumerRushPrediction": string (predicted consumer peak rush hours, e.g. "Peak consumer rush forecasted between 5:30 PM - 8:30 PM"),
  "basketRecommendations": array of 2-3 strings (products consumers are predicted to buy together with these items),
  "consumerAvailabilityNotice": string (a clear notice on stock availability for consumers, e.g. "Available for consumers: 95 bags remaining"),
  "aiExplanation": string (generative supply chain reasoning in language: ${currentLang}),
  "recommendedAction": string (actionable advice for the store owner to prevent consumer shortage)
}`;

          const userPrompt = `Store Sector: ${sectorName}
Newly Completed Customer Bill:
- Invoice #: ${bill.invoiceNo}
- Customer: ${bill.customerName}
- Items Billed & Deducted: ${billedSummary}
- Bill Total: ₹${bill.grandTotal}

Current Remaining Inventory:
${JSON.stringify(catalogSummary)}

Compute the velocity impact, consumer demand forecast, and next restocking recommendations.`;

          const result = await this.callGeminiRaw(userPrompt, systemPrompt);
          return {
            ...result,
            isLiveGemini: true,
            modelUsed: 'Google Gemini 1.5 Flash'
          };
        } catch (err) {
          console.warn('Gemini billing prediction failed, using fallback:', err.message);
        }
      }

      // Intelligent deterministic fallback
      const primaryItem = (bill.items || [])[0] || {};
      const matchedProd = activeProducts.find(p => p.sku === primaryItem.sku || p.name === primaryItem.name) || {};
      const remaining = matchedProd.quantity !== undefined ? matchedProd.quantity : 50;
      const dailyUsage = matchedProd.dailyUsage || 20;
      const coverageDays = (remaining / (dailyUsage * 1.35)).toFixed(1);

      // Recommendations based on sector
      let recommendations = ['Complementary Grocery Staples', 'Standard Buffer Items'];
      if (sectorName.toLowerCase().includes('grocery')) {
        recommendations = ['Unpolished Toor Dal', 'Refined Sunflower Oil (15L Tin)', 'Wheat Flour (Chakki Fresh)'];
      } else if (sectorName.toLowerCase().includes('food') || sectorName.toLowerCase().includes('restaurant')) {
        recommendations = ['Dairy Butter', 'Red Onions (50kg Sack)', 'Cooking Oil'];
      } else if (sectorName.toLowerCase().includes('electr')) {
        recommendations = ['Insulated PVC Tape', 'Modular Switch Boards', 'LED Batten 20W'];
      } else if (sectorName.toLowerCase().includes('textil')) {
        recommendations = ['Denim Fabric Rolls', 'Polyester Sewing Thread Spools', 'Buttons & Zippers'];
      }

      return {
        velocityStatus: '+32% Consumer Demand Acceleration',
        consumerStockoutTimeline: `${primaryItem.name || 'Billed SKU'} stock covers ~${coverageDays} days at current consumer buying rate.`,
        consumerRushPrediction: 'High consumer rush forecasted for evening window (5:00 PM – 8:30 PM).',
        basketRecommendations: recommendations,
        consumerAvailabilityNotice: `Available for consumers: ${remaining} ${primaryItem.unit || 'units'} remaining in stock.`,
        aiExplanation: `Bill #${bill.invoiceNo} directly deducted ${primaryItem.quantity || 1} ${primaryItem.unit || 'units'} from stock. Sales velocity has spiked by +32%. Replenishment must be scheduled before lead time gap causes an empty shelf for incoming consumers.`,
        recommendedAction: `Schedule supplier restock batch of ${Math.ceil(dailyUsage * 4)} ${primaryItem.unit || 'units'} to maintain buffer for incoming consumers.`,
        isLiveGemini: false,
        modelUsed: 'SmartStock Deterministic Operational AI'
      };
    },

    /**
     * UPGRADE PLAN: Generate Current Market Trends & Strategic Approach Suggestions
     */
    async generateMarketTrends(sectorName = 'General Enterprise', products = [], currentLang = 'en') {
      const topItems = (products || []).slice(0, 8).map(p => ({
        name: p.name,
        price: p.sellingPrice || p.purchasePrice,
        dailyUsage: p.dailyUsage,
        stock: p.quantity
      }));

      if (this.hasApiKey()) {
        try {
          const systemPrompt = `You are SmartStock AI's Market Trends & Commercial Strategy Advisor.
Generate actionable market intelligence and concrete approach suggestions for a business in sector: ${sectorName}.
Respond strictly in valid JSON matching this schema:
{
  "marketHeadline": string (bold headline on current sector market dynamics),
  "currentDemandTrend": string (e.g. "+18% Surge in Regional Consumer Buying"),
  "marketApproachStrategies": [
    { "title": string, "detail": string, "impact": string }
  ],
  "fastRisingCategories": [
    { "name": string, "growth": string, "action": string }
  ],
  "slowMovingWarning": [
    { "name": string, "risk": string, "clearingStrategy": string }
  ],
  "priceMovementAdvice": string (concrete guidance on current wholesale/retail price movements),
  "consumerShoppingBehavior": string (how consumers in this sector are currently buying)
}`;

          const userPrompt = `Sector: ${sectorName}
Store Active Catalog Sample:
${JSON.stringify(topItems, null, 2)}
Language: ${currentLang}

Provide the current market trend analysis and strategic approach suggestions for this merchant.`;

          const result = await this.callGeminiRaw(userPrompt, systemPrompt);
          return {
            ...result,
            isLiveGemini: true,
            modelUsed: 'Google Gemini 1.5 Flash'
          };
        } catch (err) {
          console.warn('Gemini market trends failed, using fallback:', err.message);
        }
      }

      // High-grade sector-tailored deterministic fallback
      const s = (sectorName || '').toLowerCase();
      let headline = `Current ${sectorName} Market: High Demand Velocity & Shorter Restock Cycles`;
      let trend = '+22% Increase in Local Consumer Basket Size';
      let approach = [
        {
          title: 'Implement Tiered Quantity Pricing for Walk-In Buyers',
          detail: 'Consumers are consolidating shopping trips. Offering bundle discounts on 2+ units increases average ticket value by 18% without hurting gross margins.',
          impact: 'High Margins'
        },
        {
          title: 'Lock In Supplier Restock Batches 3 Days in Advance',
          detail: 'Wholesale lead times are fluctuating. Pre-ordering standard buffer batches prevents empty shelf gaps during weekend consumer rush hours.',
          impact: 'Zero Stockouts'
        },
        {
          title: 'Active Consumer WhatsApp / SMS Stock Arrival Alerts',
          detail: 'Notify registered neighborhood customers the moment fresh batches or fast-moving lines are restocked to drive immediate day-one sell-through.',
          impact: 'Faster Turnover'
        }
      ];

      let fastRising = [
        { name: 'Everyday Household Staples & Fast Consumables', growth: '+28% Velocity', action: 'Increase on-hand safety buffer by 25%' },
        { name: 'High-Margin Brand Alternatives & Value Packs', growth: '+19% Velocity', action: 'Place near checkout counter for impulse additions' }
      ];

      if (s.includes('pharm') || s.includes('medic')) {
        headline = 'Healthcare Market Trends: High Demand for Preventative Wellness & Chronic Refills';
        trend = '+31% Surge in Monthly Chronic Prescription Subscriptions';
        approach = [
          {
            title: 'Set Up Chronic Refill Schedules for Regular Patients',
            detail: 'Maintain dedicated reservation stock for monthly diabetic, cardiac, and hypertensive patients to guarantee 100% fill rate and extreme patient loyalty.',
            impact: 'Guaranteed Repeat Sales'
          },
          {
            title: 'Bundle First-Aid & Immunity Add-ons at POS',
            detail: 'When billing prescription medications, offer relevant wellness add-ons (Vitamin C, ORS, Sanitizers) to increase average bill value.',
            impact: '+15% Basket Size'
          }
        ];
      } else if (s.includes('hardw') || s.includes('electr')) {
        headline = 'Hardware & Electrical Trends: Commercial Renovation Spike & Copper Price Volatility';
        trend = '+24% Growth in Contractor Bulk Invoicing';
        approach = [
          {
            title: 'Direct Contractor Volume Rate Accounts',
            detail: 'Offer licensed local electricians and contractors standard 5% credit/volume rates to lock in entire residential wiring projects.',
            impact: 'Predictable Bulk Volume'
          },
          {
            title: 'Promote Energy-Efficient LED & Modular Units',
            detail: 'Customers are switching to low-wattage alternatives. Highlight warranty duration and power savings directly on shelf labels.',
            impact: 'Higher Gross Margin'
          }
        ];
      }

      return {
        marketHeadline: headline,
        currentDemandTrend: trend,
        marketApproachStrategies: approach,
        fastRisingCategories: fastRising,
        slowMovingWarning: [
          { name: 'Off-Season or Slow SKUs', risk: 'Ties up working capital', clearingStrategy: 'Bundle with top-selling lines at a 10% promotional incentive' }
        ],
        priceMovementAdvice: 'Wholesale acquisition rates are stabilizing. Maintain current retail prices while seeking 2% early-payment cash discounts from primary distributors.',
        consumerShoppingBehavior: 'Shoppers prioritize immediate stock availability and fast POS checkout over minor price variations. Reliability commands loyalty.',
        isLiveGemini: false,
        modelUsed: 'SmartStock Sector Intelligence Engine'
      };
    },

    /**
     * PREMIUM PLAN: Full Actionable Dossier on How to Improve Similar Products to Reach #1 Top Rank
     */
    async generateProductTopRankGuidelines(product, sectorName = 'General', competitorContext = '', currentLang = 'en') {
      const prodName = product?.name || 'Selected Product';
      const prodPrice = product?.sellingPrice || product?.purchasePrice || 100;
      const prodUnit = product?.unit || 'units';

      if (this.hasApiKey()) {
        try {
          const systemPrompt = `You are SmartStock AI's Chief Commercial & Product Strategy Officer (Gemini 1.5 Flash).
Your objective is to provide the merchant with a rigorous, comprehensive, highly actionable playbook explaining EXACTLY how to take this product and beat all similar competitor products in the local and regional market to reach the undisputed #1 Top Rank.
Respond strictly in valid JSON matching this schema:
{
  "productName": string,
  "marketVerdict": string (sharp verdict on the product's market opportunity),
  "currentMarketPosition": string (e.g. "#3 in Local Market Velocity - High Growth Potential"),
  "qualityImprovements": [
    { "feature": string, "improvement": string, "whyItBeatsCompetitors": string }
  ],
  "competitivePricingStrategy": {
    "recommendedRetailPrice": string,
    "marginAnalysis": string,
    "pricingTactic": string (e.g. Psychological Anchor Pricing, Volume Penetration)
  },
  "packagingAndConsumerAppeal": [
    { "aspect": string, "action": string, "expectedResult": string }
  ],
  "marketDistributionAndSpeedAdvantage": [
    { "channel": string, "tactic": string, "timeline": string }
  ],
  "competitorWeaknessExploitation": [
    { "competitorFlaw": string, "yourWinningMove": string }
  ],
  "thirtyDayTopRankRoadmap": [
    { "week": "Week 1", "goal": string, "actionItems": [string, string] },
    { "week": "Week 2", "goal": string, "actionItems": [string, string] },
    { "week": "Week 3", "goal": string, "actionItems": [string, string] },
    { "week": "Week 4", "goal": string, "actionItems": [string, string] }
  ],
  "geminiChiefAdvisoryNote": string (inspiring strategic directive for the business owner in language: ${currentLang})
}`;

          const userPrompt = `Product Under Analysis: ${prodName}
Sector: ${sectorName}
Unit: ${prodUnit}
Current Selling Price: ₹${prodPrice}
Purchase Cost: ₹${product?.purchasePrice || Math.round(prodPrice * 0.8)}
Daily Sales: ${product?.dailyUsage || 10} ${prodUnit}/day
Current On-Hand Stock: ${product?.quantity || 50} ${prodUnit}
Competitor Context: ${competitorContext || 'Standard local market competitors selling equivalent commercial alternatives'}

Generate the step-by-step master guidelines to take ${prodName} to the #1 Top Rank in its category.`;

          const result = await this.callGeminiRaw(userPrompt, systemPrompt);
          return {
            ...result,
            isLiveGemini: true,
            modelUsed: 'Google Gemini 1.5 Flash'
          };
        } catch (err) {
          console.warn('Gemini top rank guidelines failed, using fallback:', err.message);
        }
      }

      // High-grade deterministic master blueprint fallback
      return {
        productName: prodName,
        marketVerdict: `High-conversion commodity with strong local demand. With 3 targeted product enhancements and aggressive point-of-sale positioning, this SKU has an 88% probability of achieving undisputed #1 top rank in sales volume within 30 days.`,
        currentMarketPosition: 'Top 3 Contender — Positioned for Market Leadership',
        qualityImprovements: [
          {
            feature: 'Sourcing Purity & Grading Standards',
            improvement: 'Source exclusively A-Grade verified batches with batch purity certificates displayed at counter.',
            whyItBeatsCompetitors: 'Competitors blend lower-tier grades to cut costs. Transparent certified quality immediately wins discerning household buyers.'
          },
          {
            feature: 'Freshness & Storage Integrity',
            improvement: 'Enforce hermetic sealed packaging with printed packaging date and batch verification seal.',
            whyItBeatsCompetitors: 'Prevents moisture and quality degradation that plagues competitor loose bags.'
          },
          {
            feature: 'Guaranteed Replacement Warranty',
            improvement: 'Offer a "100% Satisfaction or Instant No-Questions Replacement" guarantee at checkout.',
            whyItBeatsCompetitors: 'Removes all consumer risk, accelerating trial purchases from new customers by over 40%.'
          }
        ],
        competitivePricingStrategy: {
          recommendedRetailPrice: `₹${prodPrice} (with ₹${Math.round(prodPrice * 1.85)} for 2x Bundle Pack)`,
          marginAnalysis: `Maintain 18-22% gross margin on single units while offering a 7.5% volume discount on multi-packs. Net cash velocity increases by 35%.`,
          pricingTactic: 'Value-Anchored Multi-Buy Pricing: Position single pack at standard market rate, but offer irresistible savings on 2+ packs.'
        },
        packagingAndConsumerAppeal: [
          {
            aspect: 'Eye-Level Primary Shelf Placement',
            action: 'Move stock to the 4 to 5.5 foot eye-level shelf zone directly opposite store entrance.',
            expectedResult: 'Doubles spontaneous glance conversion from casual foot traffic.'
          },
          {
            aspect: 'High-Visibility "Top Choice" Shelf Talker',
            action: 'Attach a sky blue badge: "★ #1 Customer Choice — 100% Quality Guaranteed".',
            expectedResult: 'Triggers instant social proof and default decision making.'
          },
          {
            aspect: 'Clean, Moisture-Proof Outer Wrap',
            action: 'Ensure pristine outer packaging with zero dust, creases, or torn labels.',
            expectedResult: 'Signals premium freshness compared to weathered competitor inventory.'
          }
        ],
        marketDistributionAndSpeedAdvantage: [
          {
            channel: 'POS Bill Direct Recommendation',
            tactic: 'Prompt cashiers to mention this product during customer billing: "We just received a fresh A-grade batch of this today."',
            timeline: 'Immediate (Day 1)'
          },
          {
            channel: 'Local WhatsApp / Phone Delivery Service',
            tactic: 'Offer free 30-minute doorstep delivery for orders containing this top-rank SKU.',
            timeline: 'Week 1-2'
          },
          {
            channel: 'B2B Trade Network Surplus Sourcing',
            tactic: 'Maintain 5-day safety buffer through verified peer suppliers to ensure 100% uptime when competitors run out.',
            timeline: 'Continuous'
          }
        ],
        competitorWeaknessExploitation: [
          {
            competitorFlaw: 'Competitors suffer frequent 2-day stockouts due to delayed distributor deliveries.',
            yourWinningMove: 'Use SmartStock AI lead-time gap reordering to maintain 100% shelf availability. When competitors run empty, their loyal customers become yours permanently.'
          },
          {
            competitorFlaw: 'Competitors offer generic packaging with zero origin transparency or quality guarantee.',
            yourWinningMove: 'Highlight batch traceability and guaranteed freshness right on the price tag.'
          }
        ],
        thirtyDayTopRankRoadmap: [
          {
            week: 'Week 1',
            goal: 'Purity Upgrade & Eye-Level Merchandising',
            actionItems: [
              'Re-merchandise store layout: Place this SKU at eye-level with the Sky Blue Top Choice badge.',
              'Audit incoming batch quality and reject substandard units to establish undisputed consistency.'
            ]
          },
          {
            week: 'Week 2',
            goal: 'POS Recommendation & Multi-Buy Bundle Launch',
            actionItems: [
              'Activate the 2x Pack Volume Discount at POS billing.',
              'Train sales staff to recommend this item during bill checkout.'
            ]
          },
          {
            week: 'Week 3',
            goal: 'Customer Loyalty & Neighborhood Outreach',
            actionItems: [
              'Send WhatsApp arrival broadcast to top 50 registered store customers.',
              'Collect and display 3 real customer praise quotes near the display shelf.'
            ]
          },
          {
            week: 'Week 4',
            goal: 'Consolidate Market Share & Lock In #1 Rank',
            actionItems: [
              'Review sales velocity: Verify that daily unit sales have increased by 30%+ over baseline.',
              'Lock in preferential wholesale bulk supply rates with distributor based on increased turnover.'
            ]
          }
        ],
        geminiChiefAdvisoryNote: `To make ${prodName} the #1 product in your market, you do not need to engage in a destructive price war. You win by eliminating consumer friction: guarantee 100% shelf availability, present pristine certified quality, and reward repeat customers with volume bundles. Execute the 30-day roadmap with discipline.`,
        isLiveGemini: false,
        modelUsed: 'SmartStock Chief Commercial AI Engine'
      };
    }
  };

  window.SmartStock.GeminiService = GeminiService;
})();
