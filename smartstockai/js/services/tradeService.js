// SmartStock AI - B2B Trade Service with Sector Privacy Enforcement
window.SmartStock = window.SmartStock || {};

(function() {
  const TradeService = {
    /**
     * Find matching businesses with stock.
     * Enforces sector isolation: users only see peers in their registered sector.
     */
    findMatches({ query = '', sector = '', minQuantity = 0, location = '' } = {}) {
      const catalog = window.SmartStock.TRADE_NETWORK || [];
      const cleanQuery = query.trim().toLowerCase();
      const reqQty = parseFloat(minQuantity) || 0;

      // Determine active sector boundary
      const userSector = sector || window.SmartStock.StorageService.getActiveSector();
      const isAdmin = window.SmartStock.StorageService.isAdminMode();

      return catalog.filter(supplier => {
        // Strict sector isolation: only allow suppliers in the same sector (unless admin mode is active)
        if (!isAdmin && supplier.sector !== userSector) {
          return false;
        }

        if (isAdmin && sector && sector !== 'all' && supplier.sector !== sector) {
          return false;
        }

        // Available quantity check
        if (reqQty > 0 && supplier.availableQuantity < reqQty) {
          return false;
        }

        // Location text filter
        if (location && !supplier.location.toLowerCase().includes(location.toLowerCase())) {
          return false;
        }

        // Search text matching
        if (cleanQuery) {
          const matchTarget = `${supplier.productName} ${supplier.sku} ${supplier.businessName} ${supplier.specifications} ${supplier.category}`.toLowerCase();
          if (!matchTarget.includes(cleanQuery)) {
            return false;
          }
        }

        return true;
      }).sort((a, b) => a.leadTimeDays - b.leadTimeDays);
    },

    submitTradeRequest({ supplierId, requestedQuantity, offeredPrice, urgency, deliveryNeededBy, notes }) {
      const catalog = window.SmartStock.TRADE_NETWORK || [];
      const supplier = catalog.find(s => s.id === supplierId);
      if (!supplier) throw new Error('Supplying business not found.');

      const qty = parseFloat(requestedQuantity);
      if (isNaN(qty) || qty <= 0) throw new Error('Please enter a valid quantity.');
      if (qty > supplier.availableQuantity) {
        throw new Error(`Requested quantity (${qty} ${supplier.unit}) exceeds supplier's available stock (${supplier.availableQuantity} ${supplier.unit}).`);
      }
      if (qty < supplier.minOrderQty) {
        throw new Error(`Requested quantity (${qty} ${supplier.unit}) is below supplier's minimum order requirement (${supplier.minOrderQty} ${supplier.unit}).`);
      }

      const price = parseFloat(offeredPrice) || supplier.indicativePrice;

      return window.SmartStock.StorageService.createTradeRequest({
        direction: 'outgoing',
        productName: supplier.productName,
        sku: supplier.sku,
        sector: supplier.sector,
        peerBusinessName: supplier.businessName,
        peerContact: `${supplier.contactPerson} (${supplier.phone})`,
        peerLocation: supplier.location,
        requestedQuantity: qty,
        unit: supplier.unit,
        offeredPrice: price,
        urgency: urgency || 'Normal',
        deliveryNeededBy,
        notes: notes || `Direct purchase request for ${qty} ${supplier.unit} of ${supplier.productName}.`
      });
    },

    updateStatus(requestId, newStatus, deductStock = false) {
      return window.SmartStock.StorageService.updateTradeRequestStatus(requestId, newStatus, deductStock);
    }
  };

  window.SmartStock.TradeService = TradeService;
})();
