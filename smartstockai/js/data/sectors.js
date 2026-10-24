// SmartStock AI - Universal Business Sectors & Specification Engine
// Works for ANY business: Pharmacy, Supermarket, Hardware, FMCG, Textiles, Food, Auto Spares, Wholesale, etc.
// The inventory specification (Stock, Sales Rate, Lead Time, POS Billing, Reorder Buffer) is identical across all businesses.
// Gemini AI dynamically operates the intelligent role tailored to any sector.

window.SmartStock = window.SmartStock || {};

window.SmartStock.SECTORS = [
  {
    id: 'grocery',
    name: 'Grocery & Supermarket',
    simpleName: 'Supermarket / Provision Store',
    tagline: 'Rice, Grains, Edible Oil, Spices, Dairy & Daily Household Staples',
    badge: 'Supermarket & Retail',
    icon: 'ShoppingBag',
    color: 'sky',
    sampleItems: 'Sona Masoori Rice, Wheat Atta, Toor Dal, Sunflower Oil, Sugar',
    description: 'Track fast-moving daily groceries, shelf-life, bags, and packets. Prevent stockouts before daily customer rush hours.',
    customFields: [
      { key: 'velocityTier', label: 'Sales Speed', type: 'select', options: ['Fast Moving (Daily)', 'Moderate Moving (Weekly)', 'Slow Moving (Monthly)'], required: true },
      { key: 'shelfLifeDays', label: 'Shelf Life (Days remaining)', type: 'number', placeholder: 'e.g. 180', min: 1 },
      { key: 'reorderBatchQty', label: 'Pack / Bag Size for Reorder', type: 'number', placeholder: 'e.g. 25 bags', min: 1 }
    ],
    sampleAlert: 'Sona Masoori Rice (25kg) is down to 18 bags. Daily sales: 6 bags. Stock covers 3 days. Reorder now.'
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy & Healthcare',
    simpleName: 'Medical Store & Pharmacy',
    tagline: 'Tablets, Syrups, First Aid, Injections, Diagnostic Strips & Wellness',
    badge: 'Medical & Health',
    icon: 'ShieldCheck',
    color: 'sky',
    sampleItems: 'Paracetamol 650mg, Azithromycin 500mg, Cough Syrup, Surgical Masks, Cotton',
    description: 'Track critical medicines, strip counts, batch expiry dates, and supplier lead times to guarantee zero patient medicine shortages.',
    customFields: [
      { key: 'batchNo', label: 'Batch / Lot Number', type: 'text', placeholder: 'e.g. BATCH-2026-X', required: true },
      { key: 'expiryDate', label: 'Medicine Expiry Date', type: 'date', required: true },
      { key: 'scheduleDrug', label: 'Prescription Category', type: 'select', options: ['OTC (Over the Counter)', 'Schedule H (Prescription)', 'Schedule X'] }
    ],
    sampleAlert: 'Paracetamol 650mg strips down to 35 strips. Daily patient demand is 20 strips. Stock covers 1.7 days.'
  },
  {
    id: 'fmcg',
    name: 'FMCG & Consumer Goods',
    simpleName: 'FMCG & Daily Goods Store',
    tagline: 'Soaps, Shampoos, Detergents, Biscuits, Beverages & Personal Hygiene',
    badge: 'Consumer Goods',
    icon: 'Package',
    color: 'sky',
    sampleItems: 'Bathing Soaps, Detergent Powder, Tea Packets, Biscuits, Shampoos',
    description: 'Manage high-frequency packaged goods, distributor case packs, FMCG trade schemes, and turn over inventory rapidly.',
    customFields: [
      { key: 'casePackQty', label: 'Units Per Master Carton', type: 'number', placeholder: 'e.g. 48 units', min: 1 },
      { key: 'distributorMargin', label: 'Trade Margin (%)', type: 'number', placeholder: 'e.g. 15%', min: 0 },
      { key: 'schemeOffer', label: 'Active Promotional Scheme', type: 'text', placeholder: 'e.g. Buy 10 Get 1 Free' }
    ],
    sampleAlert: 'Detergent 1kg packs down to 24 units. Reorder distributor master carton before weekend rush.'
  },
  {
    id: 'hardware',
    name: 'Hardware, Electrical & Sanitary',
    simpleName: 'Hardware & Electrical Shop',
    tagline: 'Wires, Switches, PVC Pipes, Paint, Taps, Tools, Screws & Cement',
    badge: 'Building & Tools',
    icon: 'Wrench',
    color: 'sky',
    sampleItems: 'Copper Wires (90m), PVC Conduits, LED Battens, MCB Breakers, Water Taps',
    description: 'Maintain building supplies, heavy materials, standard metric wire gauges, and prevent project work site delays.',
    customFields: [
      { key: 'gaugeStandard', label: 'Gauge / Size Specification', type: 'text', placeholder: 'e.g. 2.5 sq mm / 1 inch' },
      { key: 'brandTier', label: 'Brand Classification', type: 'select', options: ['Premium National Brand', 'Standard Commercial', 'Economy'] },
      { key: 'bundleSize', label: 'Bundle / Box Units', type: 'number', placeholder: 'e.g. 10 coils' }
    ],
    sampleAlert: '2.5 sq mm Copper Cable coils down to 8 rolls. Weekly contractor consumption is 15 rolls.'
  },
  {
    id: 'food',
    name: 'Food & Restaurants',
    simpleName: 'Restaurant, Cafe & Kitchen',
    tagline: 'Fresh Paneer, Vegetables, Milk, Meat, Cooking Oil & Spices',
    badge: 'Food & Dining',
    icon: 'Utensils',
    color: 'sky',
    sampleItems: 'Paneer, Onions, Milk Cans, Cooking Oil, Basmati Rice, Spices',
    description: 'Manage fresh kitchen ingredients, storage temperatures (Chilled vs Dry), expiration dates, and stop food spoilage.',
    customFields: [
      { key: 'storageTemp', label: 'Storage Temperature', type: 'select', options: ['Chilled (2°C to 4°C)', 'Deep Frozen (-18°C)', 'Dry Storeroom'], required: true },
      { key: 'expiryDate', label: 'Expiration Date', type: 'date', required: true },
      { key: 'dailyConsumptionRate', label: 'Daily Kitchen Usage', type: 'number', placeholder: 'e.g. 5 kg/day', min: 0 }
    ],
    sampleAlert: 'Fresh Paneer (12 blocks) expires in 4 days. Prioritize kitchen prep to prevent spoilage.'
  },
  {
    id: 'electronics',
    name: 'Electronics, Smart TVs & Appliances',
    simpleName: 'Electronics, TV & Home Appliances',
    tagline: 'Smart TVs (43"/55" 4K), 5G Mobiles, Inverter ACs, Refrigerators, Soundbars & Washing Machines',
    badge: 'Electronics & Appliances',
    icon: 'Tv',
    color: 'sky',
    sampleItems: '43" 4K Smart TV, 32" Smart LED TV, 1.5T Inverter AC, Frost-Free Refrigerator, 5G Smartphone',
    description: 'Track high-value consumer electronics, Smart TVs, home appliances, smartphones, serial numbers, warranty terms, and festival seasonal spikes.',
    customFields: [
      { key: 'screenSizeSpec', label: 'Screen / Capacity Spec', type: 'text', placeholder: 'e.g. 43" 4K UHD / 1.5 Ton / 260L', required: true },
      { key: 'energyRating', label: 'Energy Star Rating', type: 'select', options: ['5-Star Inverter', '4-Star', '3-Star', 'Standard'] },
      { key: 'warrantyMonths', label: 'Warranty (Months)', type: 'number', placeholder: '24', min: 0 },
      { key: 'modelNumber', label: 'Model / Part Number', type: 'text', placeholder: 'e.g. BRAVIA-43-4K' }
    ],
    sampleAlert: '43" 4K Smart LED TV down to 5 units (min 8). Daily customer demand is 1 unit. Reorder before weekend rush.'
  },
  {
    id: 'textiles',
    name: 'Textiles & Apparel',
    simpleName: 'Garments, Fabrics & Clothing',
    tagline: 'Cotton Rolls, Denim Fabric, Readymade Shirts, Sarees, Sewing Thread & Zippers',
    badge: 'Textiles & Fashion',
    icon: 'Shirt',
    color: 'sky',
    sampleItems: '100% Cotton Fabric Rolls, Denim Rolls, Formal Shirts, Sewing Thread Spools',
    description: 'Manage fabric rolls, colors, meters, sizes, and stock up ahead of regional festivals and wedding seasons.',
    customFields: [
      { key: 'fabricBlend', label: 'Fabric Material', type: 'text', placeholder: 'e.g. 100% Cotton, Poly-Cotton, Silk', required: true },
      { key: 'colorPantone', label: 'Color / Shade', type: 'text', placeholder: 'e.g. Bleached White, Indigo Blue' },
      { key: 'rollSizeMeters', label: 'Roll Length (Meters)', type: 'number', placeholder: '100', min: 1 }
    ],
    sampleAlert: 'Raw Denim Fabric roll has only 9 rolls left. Reorder before upcoming tailoring season.'
  },
  {
    id: 'autospares',
    name: 'Auto Spares & Machinery',
    simpleName: 'Auto Parts & Two-Wheeler Shop',
    tagline: 'Brake Pads, Engine Oil, Spark Plugs, Drive Belts, Filters, Bearings & Batteries',
    badge: 'Automotive & Parts',
    icon: 'Truck',
    color: 'sky',
    sampleItems: '4T Engine Oil 1L, Front Brake Pads, Spark Plugs, Oil Filters, Drive Chains',
    description: 'Keep crucial vehicle replacement parts on hand for mechanics and fleet operators with zero repair bay downtime.',
    customFields: [
      { key: 'oemPartNumber', label: 'OEM Part Number', type: 'text', placeholder: 'e.g. OEM-48291-BA' },
      { key: 'vehicleCompatibility', label: 'Vehicle Model Compatibility', type: 'text', placeholder: 'e.g. Hero Splendor, Honda Activa' },
      { key: 'leadTimeDays', label: 'Distributor Delivery Days', type: 'number', placeholder: '2' }
    ],
    sampleAlert: 'Synthetic 4T Engine Oil down to 14 bottles. Fast-moving weekend servicing rush anticipated.'
  },
  {
    id: 'wholesale',
    name: 'Wholesale & Distribution',
    simpleName: 'Wholesale Trader & Distributor',
    tagline: 'Bulk Pallets, Master Cartons, Multi-Retailer Distribution & Transit Logistics',
    badge: 'Wholesale & B2B',
    icon: 'Layers',
    color: 'sky',
    sampleItems: 'Bulk Sugar Sacks (50kg), Wholesale Oil Tins (15L), Master Carton Goods',
    description: 'Handle bulk truckloads, wholesale rate tiers, credit ledgers, and fast inter-store distribution dispatch.',
    customFields: [
      { key: 'palletCapacity', label: 'Units Per Pallet', type: 'number', placeholder: 'e.g. 100' },
      { key: 'minOrderQty', label: 'Minimum Order Quantity (MOQ)', type: 'number', placeholder: 'e.g. 10' },
      { key: 'creditDays', label: 'Customer Credit Terms (Days)', type: 'number', placeholder: '15' }
    ],
    sampleAlert: 'Wholesale Oil Tins (15L) down to 30 tins. Dispatch order of 40 tins pending.'
  },
  {
    id: 'stationery',
    name: 'Stationery & Books',
    simpleName: 'Stationery & Office Supplies',
    tagline: 'Notebooks, Pens, Printing Paper A4, Inks, Binders, Envelopes & Craft Items',
    badge: 'Office & Books',
    icon: 'FileText',
    color: 'sky',
    sampleItems: 'A4 Copier Paper Reams (75 GSM), Ballpoint Pens (Box of 50), Hardbound Ledgers',
    description: 'Maintain paper reams, office stationery, school reopen stock surges, and institutional supplies.',
    customFields: [
      { key: 'gsmWeight', label: 'Paper GSM / Grade', type: 'text', placeholder: 'e.g. 75 GSM' },
      { key: 'packCount', label: 'Units Per Pack', type: 'number', placeholder: 'e.g. 500 sheets' }
    ],
    sampleAlert: 'A4 Copier Paper down to 12 reams. Regular office consumption is 6 reams/week.'
  },
  {
    id: 'cosmetics',
    name: 'Cosmetics & Beauty',
    simpleName: 'Cosmetics & Personal Care',
    tagline: 'Skincare Creams, Perfumes, Hair Colors, Lipsticks, Soaps & Salon Products',
    badge: 'Beauty & Wellness',
    icon: 'Sparkles',
    color: 'sky',
    sampleItems: 'Moisturizing Cream 100ml, Herbal Hair Color, Body Mist, Face Wash',
    description: 'Track high-margin personal care, batch codes, skin shade varieties, and seasonal festive cosmetics demand.',
    customFields: [
      { key: 'shadeVariant', label: 'Shade / Fragrance', type: 'text', placeholder: 'e.g. Natural Ivory / Lavender' },
      { key: 'expiryDate', label: 'Product Expiry Date', type: 'date' }
    ],
    sampleAlert: 'Herbal Hair Color boxes down to 10 units. High margin line. Reorder from distributor.'
  },
  {
    id: 'custom',
    name: 'General Enterprise / Other',
    simpleName: 'Custom Business / Enterprise',
    tagline: 'Universal Stock Specification Tailored to Any Custom Industry or Trade',
    badge: 'Universal Business',
    icon: 'Box',
    color: 'sky',
    sampleItems: 'Custom Inventory Items, Raw Materials, Finished Goods, Spare Parts',
    description: 'Universal inventory mathematics and Gemini AI intelligence adapted dynamically for any specialized commerce sector.',
    customFields: [
      { key: 'itemIdentifier', label: 'Custom Code / Identifier', type: 'text', placeholder: 'e.g. SKU-CUSTOM-01' },
      { key: 'customCategory', label: 'Product Category', type: 'text', placeholder: 'e.g. Industrial Consumables' }
    ],
    sampleAlert: 'Inventory stock covers 2.5 days. Lead time is 4 days. Operational reorder required.'
  }
];

window.SmartStock.BUSINESS_TYPES = [
  { id: 'retailer', label: 'Single Store / Retailer (சில்லறை கடை)', desc: 'Local storefront, grocery, pharmacy, hardware or boutique.' },
  { id: 'supermarket', label: 'Supermarket / Multi-Counter Retail', desc: 'High-footfall consumer store with POS barcode checkout.' },
  { id: 'wholesaler', label: 'Wholesale Trader (மொத்த வியாபாரி)', desc: 'Bulk stock dealer, regional master stockist & distribution point.' },
  { id: 'distributor', label: 'Authorized Distributor / Logistics (விநியோகஸ்தர்)', desc: 'Direct brand supply chain & territory logistics.' },
  { id: 'manufacturer', label: 'Factory / Manufacturer (உற்பத்தியாளர்)', desc: 'Production unit, workshop, processing plant & bulk creator.' },
  { id: 'startup', label: 'New Startup / Modern Merchant (புதிய தொழில்)', desc: 'Newly launched enterprise, D2C brand or multi-sector shop.' }
];
