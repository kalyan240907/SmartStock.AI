// SmartStock AI - Robust Storage Service with Sector Privacy & Multi-Language Support
window.SmartStock = window.SmartStock || {};

(function() {
  const STORAGE_KEYS = {
    PRODUCTS: 'smartstock_products_v2',
    TRANSACTIONS: 'smartstock_transactions_v2',
    TRADE_REQUESTS: 'smartstock_trade_requests_v2',
    PROFILE: 'smartstock_profile_v2',
    ACTIVE_SECTOR: 'smartstock_active_sector_v2',
    LANGUAGE: 'smartstock_language_v2',
    SUBSCRIPTION: 'smartstock_subscription_v2',
    ADMIN_MODE: 'smartstock_admin_mode_v2',
    CHECKLIST: 'smartstock_checklist_v2',
    BILLS: 'smartstock_bills_v2',
    USER_EMAIL: 'smartstock_user_email_v2',
    IS_LOGGED_IN: 'smartstock_is_logged_in_v2',
    REGISTERED_USERS: 'smartstock_registered_users_v2'
  };

  const listeners = [];

  function notifyChange(event, payload) {
    listeners.forEach(fn => {
      try { fn(event, payload); } catch (e) { console.error('Storage listener error', e); }
    });
  }

  const StorageService = {
    subscribe(callback) {
      listeners.push(callback);
      return () => {
        const idx = listeners.indexOf(callback);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    },

    // --- Language Preference ---
    getLanguage() {
      try {
        const val = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
        if (val) return val;
      } catch (e) {}
      // Check profile preferred language
      const prof = this.getProfile();
      return prof?.language || 'en';
    },

    setLanguage(langCode) {
      try {
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, langCode);
        const prof = this.getProfile();
        if (prof) {
          prof.language = langCode;
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(prof));
        }
        notifyChange('language_changed', langCode);
      } catch (e) {
        console.error('Error saving language', e);
      }
    },

    // --- Subscription Tier ---
    getSubscription() {
      try {
        const val = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
        if (val) return val;
      } catch (e) {}
      const prof = this.getProfile();
      return prof?.subscriptionPlan || 'free';
    },

    setSubscription(planId) {
      try {
        localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, planId);
        const prof = this.getProfile();
        if (prof) {
          prof.subscriptionPlan = planId;
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(prof));
        }
        notifyChange('subscription_changed', planId);
      } catch (e) {
        console.error('Error saving subscription', e);
      }
    },

    setSubscriptionPlan(planId) {
      return this.setSubscription(planId);
    },

    // --- Sector Privacy & Admin Mode ---
    isAdminMode() {
      try {
        return localStorage.getItem(STORAGE_KEYS.ADMIN_MODE) === 'true';
      } catch (e) {
        return false;
      }
    },

    setAdminMode(isAdmin) {
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, isAdmin ? 'true' : 'false');
        notifyChange('admin_mode_changed', isAdmin);
      } catch (e) {}
    },

    getActiveSector() {
      // If user profile exists, user's sector is strictly locked to their profile
      const profile = this.getProfile();
      if (profile && profile.sector && !this.isAdminMode()) {
        return profile.sector;
      }
      try {
        const val = localStorage.getItem(STORAGE_KEYS.ACTIVE_SECTOR);
        return val || 'grocery'; // Default to Grocery & Retail
      } catch (e) {
        return 'grocery';
      }
    },

    setActiveSector(sectorId, force = false) {
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_SECTOR, sectorId);
        const profile = this.getProfile();
        if (profile) {
          profile.sector = sectorId;
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
        }
        notifyChange('sector_changed', sectorId);
        notifyChange('products_updated', this.getProducts(sectorId));
        notifyChange('profile_updated', profile);
      } catch (e) {
        console.error('Error saving active sector', e);
      }
    },

    // --- User Session & Persistent Email Login ---
    getRegisteredUsers() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
        if (data) return JSON.parse(data);
      } catch (e) {}
      // Fallback: if a profile was already saved with an email
      const savedProf = this.getSavedProfile();
      const savedMail = this.getSavedEmail();
      if (savedProf && savedProf.businessName && savedMail) {
        return { [savedMail.toLowerCase()]: { ...savedProf, email: savedMail.toLowerCase() } };
      }
      return {};
    },

    registerUser(email, profile) {
      try {
        const cleanEmail = (email || '').trim().toLowerCase();
        if (!cleanEmail) return null;
        const users = this.getRegisteredUsers();
        const fullProfile = { ...profile, email: cleanEmail };
        users[cleanEmail] = fullProfile;
        localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
        this.setProfile(fullProfile);
        return fullProfile;
      } catch (e) {
        console.error('Error registering user', e);
        return profile;
      }
    },

    getUserByEmail(email) {
      if (!email) return null;
      const cleanEmail = email.trim().toLowerCase();
      const users = this.getRegisteredUsers();
      if (users[cleanEmail]) return users[cleanEmail];
      const savedProf = this.getSavedProfile();
      const savedMail = this.getSavedEmail();
      if (savedProf && savedProf.businessName && (savedMail.toLowerCase() === cleanEmail || savedProf.email?.toLowerCase() === cleanEmail)) {
        return savedProf;
      }
      return null;
    },

    isEmailRegistered(email) {
      return !!this.getUserByEmail(email);
    },

    isLoggedIn() {
      try {
        const logged = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
        const email = this.getSavedEmail();
        const prof = this.getSavedProfile();
        return logged === 'true' && !!email && !!prof?.businessName;
      } catch (e) {
        return false;
      }
    },

    getSavedEmail() {
      try {
        return localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || '';
      } catch (e) {
        return '';
      }
    },

    setSession(email, profile = null) {
      try {
        const cleanEmail = (email || '').trim().toLowerCase();
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, cleanEmail);
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
        const activeProfile = profile || this.getUserByEmail(cleanEmail);
        if (activeProfile) {
          activeProfile.email = cleanEmail;
          this.setProfile(activeProfile);
        }
        notifyChange('session_changed', cleanEmail);
      } catch (e) {
        console.error('Error saving session', e);
      }
    },

    logout() {
      try {
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
        notifyChange('session_changed', null);
      } catch (e) {
        console.error('Error logging out', e);
      }
    },

    getSavedProfile() {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return null;
    },

    // --- Profile Management ---
    getProfile() {
      const saved = this.getSavedProfile();
      if (saved) return saved;
      return window.SmartStock.DEMO_PROFILES ? window.SmartStock.DEMO_PROFILES.grocery : { businessName: 'My Business Store', sector: 'grocery' };
    },

    setProfile(profile) {
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
        if (profile.sector) {
          localStorage.setItem(STORAGE_KEYS.ACTIVE_SECTOR, profile.sector);
        }
        if (profile.language) {
          localStorage.setItem(STORAGE_KEYS.LANGUAGE, profile.language);
        }
        if (profile.subscriptionPlan) {
          localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, profile.subscriptionPlan);
        }
        notifyChange('profile_updated', profile);
      } catch (e) {
        console.error('Error saving profile', e);
      }
    },

    // --- Products CRUD with Sector Isolation ---
    getRawAllProducts() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            let changed = false;

            // 1. Sanitize any contaminated items: Ensure food/grocery items are NEVER marked electronics
            const cleaned = parsed.map(p => {
              const nameLower = (p.name || '').toLowerCase();
              const sku = p.sku || '';

              if (p.sector === 'electronics') {
                if (sku.startsWith('FOOD-') || nameLower.includes('paneer') || nameLower.includes('onion') || nameLower.includes('milk') || nameLower.includes('chicken') || nameLower.includes('tomato') || nameLower.includes('ghee')) {
                  changed = true;
                  return { ...p, sector: 'food' };
                }
                if (sku.startsWith('GROC-') || nameLower.includes('rice') || nameLower.includes('atta') || nameLower.includes('toor dal') || nameLower.includes('sunflower oil') || nameLower.includes('sugar')) {
                  changed = true;
                  return { ...p, sector: 'grocery' };
                }
              }
              return p;
            });

            // 2. Upgrade check: replace old industrial electronics with consumer Smart TVs & Appliances
            const hasOldElec = cleaned.some(p => p.sku === 'ELEC-CU-120');
            const hasNewElec = cleaned.some(p => p.sku === 'ELEC-TV-43UHD');
            let workingList = cleaned;
            if (hasOldElec || !hasNewElec) {
              const nonElec = cleaned.filter(p => p.sector !== 'electronics');
              const newElec = (window.SmartStock.INITIAL_PRODUCTS || []).filter(p => p.sector === 'electronics');
              workingList = [...newElec, ...nonElec];
              changed = true;
            }

            // 3. Ensure all 12 sectors from INITIAL_PRODUCTS have their items present
            const existingSkus = new Set(workingList.map(p => p.sku));
            const missing = (window.SmartStock.INITIAL_PRODUCTS || []).filter(p => !existingSkus.has(p.sku));
            if (missing.length > 0) {
              workingList = [...workingList, ...missing];
              changed = true;
            }

            if (changed) {
              this.saveProducts(workingList, false);
            }
            return workingList;
          }
        }
      } catch (e) {}
      const initial = window.SmartStock.INITIAL_PRODUCTS || [];
      this.saveProducts(initial, false);
      return initial;
    },

    getProducts(overrideSector = null) {
      const all = this.getRawAllProducts();
      const targetSector = overrideSector || this.getActiveSector();

      // Strict sector isolation: return strictly products of this targetSector
      const sectorProducts = all.filter(p => p.sector === targetSector);
      if (sectorProducts.length === 0) {
        const defaults = (window.SmartStock.INITIAL_PRODUCTS || []).filter(p => p.sector === targetSector);
        if (defaults.length > 0) {
          const merged = [...all, ...defaults];
          this.saveProducts(merged, false);
          return defaults;
        }
      }
      return sectorProducts;
    },

    saveProducts(products, notify = true) {
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        if (notify) notifyChange('products_updated', products);
      } catch (e) {
        console.error('Error saving products', e);
      }
    },

    addProduct(newProduct) {
      const all = this.getRawAllProducts();
      const currentSector = this.getActiveSector();
      const id = 'prod-' + Date.now();

      const product = {
        ...newProduct,
        id,
        sector: newProduct.sector || currentSector, // Always assign to current active sector
        quantity: Math.max(0, parseFloat(newProduct.quantity) || 0),
        minStockLevel: Math.max(0, parseFloat(newProduct.minStockLevel) || 0),
        purchasePrice: Math.max(0, parseFloat(newProduct.purchasePrice) || 0),
        sellingPrice: Math.max(0, parseFloat(newProduct.sellingPrice) || 0),
        dailyUsage: Math.max(0.1, parseFloat(newProduct.dailyUsage) || 1),
        leadTimeDays: Math.max(1, parseInt(newProduct.leadTimeDays, 10) || 1)
      };

      all.unshift(product);
      this.saveProducts(all);

      this.recordTransaction({
        type: 'STOCK_IN',
        sku: product.sku,
        productName: product.name,
        quantity: product.quantity,
        unit: product.unit,
        reference: 'INIT-' + product.sku,
        reason: 'New product entry to shop inventory',
        performedBy: 'Shop Owner'
      });

      return product;
    },

    updateProduct(updatedProduct) {
      const all = this.getRawAllProducts();
      const index = all.findIndex(p => p.id === updatedProduct.id || p.sku === updatedProduct.sku);
      if (index !== -1) {
        all[index] = {
          ...all[index],
          ...updatedProduct,
          quantity: Math.max(0, parseFloat(updatedProduct.quantity) || 0),
          minStockLevel: Math.max(0, parseFloat(updatedProduct.minStockLevel) || 0),
          purchasePrice: Math.max(0, parseFloat(updatedProduct.purchasePrice) || 0),
          sellingPrice: Math.max(0, parseFloat(updatedProduct.sellingPrice) || 0),
          dailyUsage: Math.max(0.1, parseFloat(updatedProduct.dailyUsage) || 1),
          leadTimeDays: Math.max(1, parseInt(updatedProduct.leadTimeDays, 10) || 1)
        };
        this.saveProducts(all);
        return all[index];
      }
      return null;
    },

    deleteProduct(productId) {
      const all = this.getRawAllProducts();
      const filtered = all.filter(p => p.id !== productId);
      this.saveProducts(filtered);
      return true;
    },

    // --- Stock Movements ---
    recordStockMovement({ productId, type, quantity, reason, reference, performedBy }) {
      const all = this.getRawAllProducts();
      const product = all.find(p => p.id === productId || p.sku === productId);
      if (!product) throw new Error('Product not found in inventory');

      const qty = parseFloat(quantity);
      if (isNaN(qty) || qty <= 0) throw new Error('Quantity must be greater than zero');

      if (type === 'STOCK_OUT') {
        if (product.quantity < qty) {
          throw new Error(`Cannot sell ${qty} ${product.unit}. You only have ${product.quantity} ${product.unit} on hand.`);
        }
        product.quantity = parseFloat((product.quantity - qty).toFixed(2));
      } else if (type === 'STOCK_IN') {
        product.quantity = parseFloat((product.quantity + qty).toFixed(2));
      }

      this.saveProducts(all);

      const txn = {
        id: 'txn-' + Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type,
        sku: product.sku,
        productName: product.name,
        quantity: qty,
        unit: product.unit,
        reference: reference || ('TXN-' + Math.floor(1000 + Math.random() * 9000)),
        reason: reason || (type === 'STOCK_IN' ? 'Stock received' : 'Sold to customer'),
        performedBy: performedBy || 'Shop Counter'
      };

      this.recordTransaction(txn);
      return { product, transaction: txn };
    },

    // --- Transactions History ---
    getRawAllTransactions() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
      const initial = window.SmartStock.INITIAL_TRANSACTIONS || [];
      this.saveTransactions(initial, false);
      return initial;
    },

    getTransactions(overrideSector = null) {
      const all = this.getRawAllTransactions();
      const targetSector = overrideSector || this.getActiveSector();
      const filtered = all.filter(t => !targetSector || !t.sector || t.sector === targetSector);
      return filtered;
    },

    saveTransactions(txns, notify = true) {
      try {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
        if (notify) notifyChange('transactions_updated', txns);
      } catch (e) {}
    },

    recordTransaction(txn) {
      const all = this.getRawAllTransactions();
      const newTxn = {
        ...txn,
        sector: txn.sector || this.getActiveSector()
      };
      all.unshift(newTxn);
      if (all.length > 150) all.length = 150;
      this.saveTransactions(all);
    },

    // --- Customer Bills, Invoices & Direct POS Stock Reduction ---
    getRawAllBills() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.BILLS);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const existingIds = new Set(parsed.map(b => b.id));
            const missing = (window.SmartStock.INITIAL_BILLS || []).filter(b => !existingIds.has(b.id));
            if (missing.length > 0) {
              const merged = [...parsed, ...missing];
              this.saveBills(merged, false);
              return merged;
            }
            return parsed;
          }
        }
      } catch (e) {}
      const initial = window.SmartStock.INITIAL_BILLS || [];
      this.saveBills(initial, false);
      return initial;
    },

    getBills(overrideSector = null) {
      const all = this.getRawAllBills();
      const targetSector = overrideSector || this.getActiveSector();
      const filtered = all.filter(b => !targetSector || b.sector === targetSector);
      if (filtered.length === 0) {
        const defaults = (window.SmartStock.INITIAL_BILLS || []).filter(b => b.sector === targetSector);
        if (defaults.length > 0) return defaults;
      }
      return filtered;
    },

    getCustomerBills(overrideSector = null) {
      return this.getBills(overrideSector);
    },

    saveBills(bills, notify = true) {
      try {
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
        if (notify) notifyChange('bills_updated', bills);
      } catch (e) {}
    },

    /**
     * Record a customer bill: atomically reduces inventory on hand,
     * logs stock movements, creates invoice receipt, and emits real-time event.
     */
    recordCustomerBill({ customerName, customerPhone, items, paymentMethod = 'Cash', notes = '' }) {
      const all = this.getRawAllProducts();
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Please add at least one product to the bill.');
      }

      // Step 1: Pre-validate all items before making any modifications
      for (const item of items) {
        const prod = all.find(p => p.id === item.productId || p.sku === item.productId);
        if (!prod) throw new Error(`Product not found in store catalog: ${item.productId}`);
        const qty = parseFloat(item.quantity);
        if (isNaN(qty) || qty <= 0) {
          throw new Error(`Invalid quantity for ${prod.name}`);
        }
        if (prod.quantity < qty) {
          throw new Error(`Cannot bill ${qty} ${prod.unit} of ${prod.name}. Only ${prod.quantity} ${prod.unit} currently on hand.`);
        }
      }

      // Step 2: Atomic stock deduction and transaction recording
      const invoiceNo = 'INV-' + (1000 + Math.floor(Math.random() * 9000));
      const billedItems = [];
      let subtotal = 0;

      for (const item of items) {
        const prod = all.find(p => p.id === item.productId || p.sku === item.productId);
        const qty = parseFloat(item.quantity);
        prod.quantity = parseFloat((prod.quantity - qty).toFixed(2));
        const price = item.unitPrice || prod.purchasePrice || 0;
        const lineTotal = parseFloat((qty * price).toFixed(2));
        subtotal += lineTotal;

        billedItems.push({
          productId: prod.id,
          sku: prod.sku,
          name: prod.name,
          quantity: qty,
          unit: prod.unit,
          unitPrice: price,
          lineTotal
        });

        // Record stock movement transaction
        this.recordTransaction({
          id: 'txn-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          type: 'STOCK_OUT',
          sku: prod.sku,
          productName: prod.name,
          quantity: qty,
          unit: prod.unit,
          reference: invoiceNo,
          reason: `Customer Bill #${invoiceNo} (${customerName || 'Walk-in Consumer'})`,
          performedBy: 'Billing Counter'
        });
      }

      this.saveProducts(all);

      const billRecord = {
        id: 'bill-' + Date.now(),
        invoiceNo,
        date: new Date().toLocaleDateString('en-IN'),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        customerName: customerName || 'Walk-in Consumer',
        customerPhone: customerPhone || 'N/A',
        items: billedItems,
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat((subtotal * 0.05).toFixed(2)), // 5% GST
        grandTotal: parseFloat((subtotal * 1.05).toFixed(2)),
        paymentMethod: paymentMethod || 'Cash',
        notes: notes || '',
        sector: this.getActiveSector()
      };

      const bills = this.getBills();
      bills.unshift(billRecord);
      if (bills.length > 200) bills.length = 200;
      this.saveBills(bills);
      notifyChange('bills_updated', billRecord);
      return billRecord;
    },

    getTodayBillingSummary() {
      const bills = this.getBills();
      const todayStr = new Date().toLocaleDateString('en-IN');
      const todayBills = bills.filter(b => b.date === todayStr);
      const totalAmount = todayBills.reduce((acc, b) => acc + (b.grandTotal || 0), 0);
      const totalItemsSold = todayBills.reduce((acc, b) => acc + (b.items || []).reduce((sum, i) => sum + i.quantity, 0), 0);
      return {
        count: todayBills.length,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        totalItemsSold,
        recentBills: bills.slice(0, 6)
      };
    },

    // --- Trade Requests with Sector Isolation ---
    getRawAllTradeRequests() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.TRADE_REQUESTS);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const existingIds = new Set(parsed.map(r => r.id));
            const missing = (window.SmartStock.INITIAL_TRADE_REQUESTS || []).filter(r => !existingIds.has(r.id));
            if (missing.length > 0) {
              const merged = [...parsed, ...missing];
              this.saveTradeRequests(merged, false);
              return merged;
            }
            return parsed;
          }
        }
      } catch (e) {}
      const initial = window.SmartStock.INITIAL_TRADE_REQUESTS || [];
      this.saveTradeRequests(initial, false);
      return initial;
    },

    getTradeRequests(overrideSector = null) {
      const all = this.getRawAllTradeRequests();
      const targetSector = overrideSector || this.getActiveSector();
      return all.filter(r => !targetSector || r.sector === targetSector);
    },

    saveTradeRequests(requests) {
      try {
        localStorage.setItem(STORAGE_KEYS.TRADE_REQUESTS, JSON.stringify(requests));
        notifyChange('trade_requests_updated', requests);
      } catch (e) {}
    },

    createTradeRequest(req) {
      const all = this.getRawAllTradeRequests();
      const currentSector = this.getActiveSector();

      const newRequest = {
        id: 'ORD-' + (req.direction === 'incoming' ? 'SUP' : 'BUY') + '-' + Date.now().toString().slice(-5),
        direction: req.direction || 'outgoing',
        productName: req.productName,
        sku: req.sku || 'N/A',
        sector: req.sector || currentSector,
        peerBusinessName: req.peerBusinessName,
        peerContact: req.peerContact || 'Manager',
        peerLocation: req.peerLocation || 'Local Area',
        requestedQuantity: parseFloat(req.requestedQuantity) || 1,
        unit: req.unit || 'units',
        offeredPrice: parseFloat(req.offeredPrice) || 0,
        totalValue: parseFloat(((parseFloat(req.requestedQuantity) || 1) * (parseFloat(req.offeredPrice) || 0)).toFixed(2)),
        urgency: req.urgency || 'Normal',
        deliveryNeededBy: req.deliveryNeededBy || new Date(Date.now() + 2*86400000).toISOString().split('T')[0],
        status: 'Pending',
        dateCreated: new Date().toISOString().replace('T', ' ').substring(0, 16),
        notes: req.notes || 'Smart Trade Request',
        specificationsChecked: true
      };

      all.unshift(newRequest);
      this.saveTradeRequests(all);
      return newRequest;
    },

    updateTradeRequestStatus(requestId, newStatus, deductStock = false) {
      const all = this.getRawAllTradeRequests();
      const req = all.find(r => r.id === requestId);
      if (!req) throw new Error('Order request not found');

      req.status = newStatus;
      this.saveTradeRequests(all);

      if (newStatus === 'Completed' && req.direction === 'incoming' && deductStock) {
        try {
          const products = this.getRawAllProducts();
          const prod = products.find(p => p.sku === req.sku || p.name === req.productName);
          if (prod && prod.quantity >= req.requestedQuantity) {
            this.recordStockMovement({
              productId: prod.id,
              type: 'STOCK_OUT',
              quantity: req.requestedQuantity,
              reason: `Order fulfilled to ${req.peerBusinessName}`,
              reference: req.id,
              performedBy: 'Trade Dispatch'
            });
          }
        } catch (e) {
          console.warn('Auto stock deduct note:', e);
        }
      }

      return req;
    },

    // --- Checklist & Setup ---
    getChecklist() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
        if (data) return JSON.parse(data);
      } catch (e) {}
      return window.SmartStock.STARTUP_CHECKLIST || [];
    },

    toggleChecklistItem(id) {
      const list = this.getChecklist();
      const item = list.find(i => i.id === id);
      if (item) {
        item.completed = !item.completed;
        try {
          localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(list));
          notifyChange('checklist_updated', list);
        } catch (e) {}
      }
      return list;
    },

    // --- Demo Data Reset ---
    resetToDemoData() {
      try {
        localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
        localStorage.removeItem(STORAGE_KEYS.TRADE_REQUESTS);
        localStorage.removeItem(STORAGE_KEYS.PROFILE);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_SECTOR);
        localStorage.removeItem(STORAGE_KEYS.CHECKLIST);

        this.saveProducts(window.SmartStock.INITIAL_PRODUCTS, false);
        this.saveTransactions(window.SmartStock.INITIAL_TRANSACTIONS);
        this.saveTradeRequests(window.SmartStock.INITIAL_TRADE_REQUESTS);
        this.setProfile(window.SmartStock.DEMO_PROFILES.grocery);
        this.setSubscription('free');
        this.setAdminMode(false);

        notifyChange('data_reset', true);
        return true;
      } catch (e) {
        console.error('Reset error', e);
        return false;
      }
    },

    // --- CSV Export ---
    exportInventoryCSV() {
      const products = this.getProducts();
      const headers = [
        'Product Name', 'SKU', 'Sector', 'Category', 'Quantity Available', 'Unit',
        'Purchase Price (INR)', 'Selling Price (INR)', 'Total Value (INR)',
        'Safety Minimum Level', 'Daily Usage', 'Days Left (Coverage)', 'Status', 'Supplier'
      ];

      const rows = products.map(p => {
        const qty = p.quantity || 0;
        const price = p.purchasePrice || 0;
        const val = (qty * price).toFixed(2);
        const dailyUse = p.dailyUsage || 1;
        const coverage = (qty / dailyUse).toFixed(1);
        let status = 'In Stock';
        if (qty === 0) status = 'Out of Stock';
        else if (qty <= (p.minStockLevel || 0)) status = 'Low Stock';

        return [
          `"${(p.name || '').replace(/"/g, '""')}"`,
          `"${p.sku || ''}"`,
          `"${p.sector || ''}"`,
          `"${p.category || ''}"`,
          qty,
          `"${p.unit || ''}"`,
          price.toFixed(2),
          (p.sellingPrice || 0).toFixed(2),
          val,
          p.minStockLevel || 0,
          dailyUse,
          coverage,
          `"${status}"`,
          `"${(p.supplier || '').replace(/"/g, '""')}"`
        ];
      });

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `smartstock_inventory_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    }
  };

  window.SmartStock.StorageService = StorageService;
})();
