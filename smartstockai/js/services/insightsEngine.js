// SmartStock AI - Industrial Intelligence & Shortage Calculation Engine
window.SmartStock = window.SmartStock || {};

(function() {
  const InsightsEngine = {
    /**
     * Calculate stock coverage in days
     * Formula: Coverage Days = Available Stock / Daily Usage
     */
    calculateCoverage(currentStock, dailyUsage) {
      const stock = Math.max(0, parseFloat(currentStock) || 0);
      const usage = Math.max(0.01, parseFloat(dailyUsage) || 1);
      return parseFloat((stock / usage).toFixed(1));
    },

    /**
     * Calculate stockout date from today + coverage days
     */
    calculateStockoutDate(coverageDays) {
      if (!isFinite(coverageDays) || coverageDays <= 0) return 'Immediate / Today';
      if (coverageDays > 365) return '> 1 Year';
      const d = new Date();
      d.setDate(d.getDate() + Math.floor(coverageDays));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    /**
     * Calculate shortage risk and delivery gap
     * Supply Gap = Supplier Lead Time - Coverage Days
     */
    calculateShortageRisk(currentStock, dailyUsage, leadTimeDays) {
      const stock = Math.max(0, parseFloat(currentStock) || 0);
      const usage = Math.max(0.01, parseFloat(dailyUsage) || 1);
      const leadTime = Math.max(1, parseFloat(leadTimeDays) || 1);

      const coverageDays = parseFloat((stock / usage).toFixed(1));
      const supplyGapDays = parseFloat((leadTime - coverageDays).toFixed(1));

      let riskLevel = 'HEALTHY';
      let statusColor = 'emerald';
      let title = 'Sufficient Inventory Coverage';
      let explanation = '';

      if (stock === 0) {
        riskLevel = 'STOCKOUT';
        statusColor = 'red';
        title = 'Active Stockout - Zero On-Hand Inventory';
        explanation = `Current stock is 0. Operation is halted until supplier delivery in ${leadTime} days. Immediate B2B sourcing required.`;
      } else if (supplyGapDays > 0) {
        riskLevel = 'CRITICAL_GAP';
        statusColor = 'red';
        title = `Critical Shortage: ${supplyGapDays} Days Supply Gap`;
        explanation = `Current stock covers ${coverageDays} days at ${usage}/day, but supplier delivery takes ${leadTime} days. This leaves a ${supplyGapDays}-day production/fulfillment halt gap.`;
      } else if (coverageDays <= leadTime * 1.5) {
        riskLevel = 'WARNING_BUFFER';
        statusColor = 'amber';
        title = `Low Buffer: ${Math.abs(supplyGapDays)} Days Safety Margin`;
        explanation = `Current stock covers ${coverageDays} days against ${leadTime} days lead time. Buffer margin is narrow; any unexpected demand spike or transit delay will trigger a stockout.`;
      } else {
        riskLevel = 'HEALTHY';
        statusColor = 'emerald';
        title = `Healthy Coverage (${coverageDays} Days)`;
        explanation = `Current inventory covers ${coverageDays} days of operations, exceeding supplier delivery lead time of ${leadTime} days with a safe buffer.`;
      }

      return {
        coverageDays,
        supplyGapDays: Math.max(0, supplyGapDays),
        leadTimeDays: leadTime,
        riskLevel,
        statusColor,
        title,
        explanation,
        stockoutDate: this.calculateStockoutDate(coverageDays)
      };
    },

    /**
     * Calculate suggested reorder quantity
     * Suggested Reorder = (Daily Usage * (Lead Time + Safety Buffer Days)) - Current Stock
     */
    calculateSuggestedReorder(currentStock, dailyUsage, leadTimeDays, safetyBufferDays = 3) {
      const stock = Math.max(0, parseFloat(currentStock) || 0);
      const usage = Math.max(0.01, parseFloat(dailyUsage) || 1);
      const leadTime = Math.max(1, parseFloat(leadTimeDays) || 1);
      const buffer = Math.max(1, parseFloat(safetyBufferDays) || 3);

      const targetStock = usage * (leadTime + buffer);
      const deficit = targetStock - stock;

      return {
        targetStock: Math.ceil(targetStock),
        suggestedQuantity: deficit > 0 ? Math.ceil(deficit) : 0,
        explanation: `Target stock level is ${Math.ceil(targetStock)} units to safely cover ${leadTime} delivery days plus ${buffer} days safety buffer at ${usage} units/day.`
      };
    },

    /**
     * Full What-If Disruption Simulator
     */
    simulateWhatIf({ currentStock, dailyDemand, leadTimeDays, surgePercentage = 0, safetyBuffer = 3 }) {
      const stock = Math.max(0, parseFloat(currentStock) || 0);
      const baseDemand = Math.max(0.1, parseFloat(dailyDemand) || 1);
      const surge = Math.max(0, parseFloat(surgePercentage) || 0);
      const adjustedDemand = parseFloat((baseDemand * (1 + surge / 100)).toFixed(2));
      const leadTime = Math.max(1, parseFloat(leadTimeDays) || 1);

      const coverageDays = parseFloat((stock / adjustedDemand).toFixed(1));
      const gap = parseFloat((leadTime - coverageDays).toFixed(1));
      const hasGap = gap > 0;

      const targetStock = Math.ceil(adjustedDemand * (leadTime + safetyBuffer));
      const neededOrder = Math.max(0, targetStock - stock);

      // Determine recommended action
      let action = '';
      let actionSeverity = 'info';

      if (hasGap) {
        action = `URGENT: Initiate B2B trade request for at least ${Math.ceil(gap * adjustedDemand)} units to bridge the ${gap}-day delivery gap.`;
        actionSeverity = 'critical';
      } else if (coverageDays <= leadTime + 1) {
        action = `CAUTION: Expedite purchase order of ${neededOrder} units. Current stock barely meets the lead-time window.`;
        actionSeverity = 'warning';
      } else {
        action = `OPTIMAL: Stock is well-buffered. Normal replenishment schedule of ${neededOrder > 0 ? neededOrder : 'standard batch'} units suffices.`;
        actionSeverity = 'success';
      }

      return {
        stock,
        baseDemand,
        surgePercentage: surge,
        adjustedDemand,
        leadTimeDays: leadTime,
        coverageDays,
        gapDays: hasGap ? gap : 0,
        surplusDays: hasGap ? 0 : parseFloat(Math.abs(gap).toFixed(1)),
        hasGap,
        stockoutDate: this.calculateStockoutDate(coverageDays),
        suggestedOrderQty: neededOrder,
        action,
        actionSeverity,
        formulaTrace: {
          step1: `Adjusted Demand = ${baseDemand} × (1 + ${surge}%) = ${adjustedDemand} units/day`,
          step2: `Coverage = ${stock} / ${adjustedDemand} = ${coverageDays} days`,
          step3: hasGap 
            ? `Supply Gap = ${leadTime} days lead time - ${coverageDays} days coverage = ${gap} days disruption`
            : `Surplus Buffer = ${coverageDays} days coverage - ${leadTime} days lead time = ${Math.abs(gap)} days buffer`
        }
      };
    },

    /**
     * Analyze full inventory list and generate prioritized risk matrix
     */
    analyzeInventoryRisks(products) {
      if (!Array.isArray(products) || products.length === 0) return [];

      return products.map(prod => {
        const risk = this.calculateShortageRisk(prod.quantity, prod.dailyUsage, prod.leadTimeDays);
        const reorder = this.calculateSuggestedReorder(prod.quantity, prod.dailyUsage, prod.leadTimeDays);

        let priorityScore = 0;
        if (risk.riskLevel === 'STOCKOUT') priorityScore = 100;
        else if (risk.riskLevel === 'CRITICAL_GAP') priorityScore = 80 + risk.supplyGapDays * 2;
        else if (risk.riskLevel === 'WARNING_BUFFER') priorityScore = 40;
        else priorityScore = 10;

        return {
          product: prod,
          risk,
          reorder,
          priorityScore
        };
      }).sort((a, b) => b.priorityScore - a.priorityScore);
    },

    /**
     * Compute overall inventory health KPIs
     */
    getInventoryHealthMetrics(products) {
      const prods = Array.isArray(products) ? products : [];
      let totalValue = 0;
      let totalUnits = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;
      let criticalGaps = 0;
      let totalCoverageDays = 0;

      prods.forEach(p => {
        const qty = p.quantity || 0;
        const price = p.purchasePrice || 0;
        totalValue += qty * price;
        totalUnits += qty;

        if (qty === 0) outOfStockCount++;
        else if (qty <= (p.minStockLevel || 0)) lowStockCount++;

        const risk = this.calculateShortageRisk(qty, p.dailyUsage, p.leadTimeDays);
        if (risk.riskLevel === 'CRITICAL_GAP' || risk.riskLevel === 'STOCKOUT') {
          criticalGaps++;
        }
        totalCoverageDays += risk.coverageDays;
      });

      const avgCoverage = prods.length > 0 ? parseFloat((totalCoverageDays / prods.length).toFixed(1)) : 0;

      return {
        totalProducts: prods.length,
        totalUnits,
        totalValuation: totalValue,
        lowStockCount,
        outOfStockCount,
        criticalGaps,
        avgCoverageDays: avgCoverage,
        healthScore: prods.length > 0 ? Math.max(0, Math.round(100 - (criticalGaps * 25 + lowStockCount * 8 + outOfStockCount * 30) / prods.length * 10)) : 100
      };
    },

    /**
     * Compare primary supplier with sample alternative suppliers
     */
    getSupplierComparison(product) {
      if (!product) return null;

      const primary = {
        name: product.supplier || 'Primary Contract Supplier',
        type: 'Contracted Primary',
        unitPrice: product.purchasePrice || 10,
        leadTimeDays: product.leadTimeDays || 4,
        moq: Math.round((product.minStockLevel || 50) * 0.5),
        reliabilityScore: 92,
        distance: 'Direct Factory (3-5 days delivery)'
      };

      const alternative1 = {
        name: 'Regional Express Industrial Hub',
        type: 'B2B Trade Network Node',
        unitPrice: parseFloat((primary.unitPrice * 1.06).toFixed(2)), // slightly higher spot price
        leadTimeDays: Math.max(1, Math.round(primary.leadTimeDays * 0.35)), // 65% faster!
        moq: 10,
        reliabilityScore: 97,
        distance: 'Local Warehouse (Same/Next Day)'
      };

      const alternative2 = {
        name: 'Global Consolidated Freight Co',
        type: 'Wholesale Bulk Importer',
        unitPrice: parseFloat((primary.unitPrice * 0.88).toFixed(2)), // 12% cheaper in high volume
        leadTimeDays: primary.leadTimeDays * 2 + 5,
        moq: Math.round((product.minStockLevel || 50) * 2),
        reliabilityScore: 84,
        distance: 'Overseas Container Freight (14-21 days)'
      };

      return {
        productName: product.name,
        sku: product.sku,
        unit: product.unit,
        suppliers: [primary, alternative1, alternative2]
      };
    }
  };

  window.SmartStock.InsightsEngine = InsightsEngine;
})();
