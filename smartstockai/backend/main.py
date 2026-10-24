# SmartStock AI - FastAPI REST API with Sector Privacy & Voice Endpoints
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import json

from models import (
    Product, ProductCreate, StockMovementRequest,
    TradeRequestCreate, VoiceCommandRequest, SubscriptionUpgradeRequest
)
from database import get_connection, init_db

app = FastAPI(
    title="SmartStock AI API",
    description="Simple Business Management & B2B Trade API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SmartStock AI Backend",
        "tagline": "Manage Stock Easily. Grow Your Business Smarter."
    }

# --- Products CRUD with Sector Isolation ---
@app.get("/api/products")
def get_products(sector: Optional[str] = None, admin_mode: bool = False):
    conn = get_connection()
    cursor = conn.cursor()

    # STRICT SECTOR PRIVACY RULE: If admin_mode is False, sector MUST be matched!
    if not admin_mode and sector:
        cursor.execute("SELECT * FROM products WHERE sector = ?", (sector,))
    elif admin_mode and sector and sector != "all":
        cursor.execute("SELECT * FROM products WHERE sector = ?", (sector,))
    elif admin_mode:
        cursor.execute("SELECT * FROM products ORDER BY created_at DESC")
    else:
        # Default safety: require sector specification
        cursor.execute("SELECT * FROM products WHERE sector = ?", (sector or 'grocery',))

    rows = cursor.fetchall()
    conn.close()

    products = []
    for r in rows:
        p = dict(r)
        p["purchasePrice"] = p.pop("purchase_price")
        p["sellingPrice"] = p.pop("selling_price")
        p["minStockLevel"] = p.pop("min_stock_level")
        p["dailyUsage"] = p.pop("daily_usage")
        p["leadTimeDays"] = p.pop("lead_time_days")
        if p.get("custom_attributes"):
            try:
                p["customAttributes"] = json.loads(p.pop("custom_attributes"))
            except Exception:
                p["customAttributes"] = {}
        products.append(p)
    return products

@app.post("/api/products", status_code=201)
def create_product(product: ProductCreate):
    conn = get_connection()
    cursor = conn.cursor()
    product_id = f"prod-{uuid.uuid4().hex[:8]}"

    try:
        cursor.execute("""
        INSERT INTO products (
            id, sku, name, sector, category, quantity, unit,
            purchase_price, selling_price, supplier, min_stock_level,
            daily_usage, lead_time_days, location, notes, custom_attributes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            product_id, product.sku, product.name, product.sector,
            product.category, product.quantity, product.unit,
            product.purchasePrice, product.sellingPrice, product.supplier,
            product.minStockLevel, product.dailyUsage, product.leadTimeDays,
            product.location, product.notes, json.dumps(product.customAttributes or {})
        ))
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Failed to create product: {str(e)}")

    conn.close()
    return {"id": product_id, **product.dict()}

@app.post("/api/inventory/movement")
def record_movement(req: StockMovementRequest):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, sku, name, quantity, unit FROM products WHERE id = ? OR sku = ?", (req.productId, req.productId))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")

    current_qty = row["quantity"]
    sku = row["sku"]
    name = row["name"]
    unit = row["unit"]

    if req.type == "STOCK_OUT":
        if current_qty < req.quantity:
            conn.close()
            raise HTTPException(status_code=400, detail=f"Cannot deduct {req.quantity} {unit}. Available: {current_qty} {unit}.")
        new_qty = current_qty - req.quantity
    elif req.type == "STOCK_IN":
        new_qty = current_qty + req.quantity
    else:
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid type")

    cursor.execute("UPDATE products SET quantity = ? WHERE id = ?", (new_qty, row["id"]))

    txn_id = f"txn-{uuid.uuid4().hex[:8]}"
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    cursor.execute("""
    INSERT INTO transactions (
        id, timestamp, type, sku, product_name, quantity, unit, reference, reason, performed_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        txn_id, now_str, req.type, sku, name, req.quantity, unit,
        req.reference or f"REF-{uuid.uuid4().hex[:6]}", req.reason or "Stock movement update", req.performedBy
    ))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "productId": row["id"],
        "sku": sku,
        "newQuantity": new_qty,
        "transactionId": txn_id
    }

# --- Demo Subscription Upgrade Endpoint ---
@app.post("/api/subscriptions/upgrade")
def upgrade_subscription(req: SubscriptionUpgradeRequest):
    return {
        "success": True,
        "planId": req.planId,
        "billingCycle": req.billingCycle,
        "message": f"Demo Upgrade successful: Switched to {req.planId.upper()} plan without charge.",
        "isDemo": True
    }
