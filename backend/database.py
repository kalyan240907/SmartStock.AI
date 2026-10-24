# SmartStock AI - SQLite Database Handler with Strict Sector Isolation
import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "smartstock.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Products Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        sku TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        sector TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity REAL NOT NULL DEFAULT 0,
        unit TEXT NOT NULL DEFAULT 'units',
        purchase_price REAL NOT NULL DEFAULT 0,
        selling_price REAL NOT NULL DEFAULT 0,
        supplier TEXT NOT NULL,
        min_stock_level REAL NOT NULL DEFAULT 0,
        daily_usage REAL NOT NULL DEFAULT 1.0,
        lead_time_days INTEGER NOT NULL DEFAULT 1,
        location TEXT,
        notes TEXT,
        custom_attributes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Transactions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        type TEXT NOT NULL,
        sku TEXT NOT NULL,
        product_name TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        reference TEXT,
        reason TEXT,
        performed_by TEXT
    )
    """)

    # Trade Requests Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trade_requests (
        id TEXT PRIMARY KEY,
        direction TEXT NOT NULL,
        product_name TEXT NOT NULL,
        sku TEXT NOT NULL,
        sector TEXT NOT NULL,
        peer_business_name TEXT NOT NULL,
        peer_contact TEXT,
        peer_location TEXT,
        requested_quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        offered_price REAL NOT NULL,
        total_value REAL NOT NULL,
        urgency TEXT NOT NULL,
        delivery_needed_by TEXT,
        status TEXT NOT NULL DEFAULT 'Pending',
        date_created TEXT NOT NULL,
        notes TEXT
    )
    """)

    # Seed initial Grocery and Electronics sample products if empty
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO products (
            id, sku, name, sector, category, quantity, unit,
            purchase_price, selling_price, supplier, min_stock_level,
            daily_usage, lead_time_days, location, notes, custom_attributes
        ) VALUES (
            'prod-groc-01', 'GROC-RICE-25KG', 'Sona Masoori Rice (25kg Bag)',
            'grocery', 'Grains & Staples', 18.0, 'bags',
            1150.0, 1350.0, 'Cauvery Grain Wholesalers', 25.0,
            6.0, 2, 'Main Shelf Rack 1', 'Fastest selling staple. High daily household demand.',
            '{"velocityTier": "Fast Moving (A-Rank)", "shelfLifeDays": 180}'
        )
        """)
        cursor.execute("""
        INSERT INTO products (
            id, sku, name, sector, category, quantity, unit,
            purchase_price, selling_price, supplier, min_stock_level,
            daily_usage, lead_time_days, location, notes, custom_attributes
        ) VALUES (
            'prod-elec-01', 'ELEC-CU-120', 'High-Purity Copper Wire Coil (0.8mm)',
            'electronics', 'Conductors & Wiring', 120.0, 'kg',
            750.0, 1100.0, 'National Metals & Wire Corp', 200.0,
            50.0, 4, 'Warehouse Bay 4A', 'Covers 2.4 days at 50kg/day. Leaves a 1.6-day supply gap!',
            '{"modelNumber": "CU-999-08MM", "warrantyMonths": 24}'
        )
        """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized.")
