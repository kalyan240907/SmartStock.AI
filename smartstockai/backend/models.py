# SmartStock AI - FastAPI Pydantic Models with Subscriptions & Sector Isolation
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ProductBase(BaseModel):
    sku: str
    name: str
    sector: str = "grocery"
    category: str
    quantity: float = Field(default=0, ge=0)
    unit: str = "units"
    purchasePrice: float = Field(default=0, ge=0)
    sellingPrice: float = Field(default=0, ge=0)
    supplier: str
    minStockLevel: float = Field(default=0, ge=0)
    dailyUsage: float = Field(default=1.0, gt=0)
    leadTimeDays: int = Field(default=1, ge=1)
    location: Optional[str] = None
    notes: Optional[str] = None
    customAttributes: Optional[Dict[str, Any]] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: str

class StockMovementRequest(BaseModel):
    productId: str
    type: str  # "STOCK_IN" or "STOCK_OUT"
    quantity: float = Field(..., gt=0)
    reason: Optional[str] = None
    reference: Optional[str] = None
    performedBy: Optional[str] = "Shop Counter"

class VoiceCommandRequest(BaseModel):
    transcript: str
    language: str = "en"
    sector: str = "grocery"

class UserProfile(BaseModel):
    businessName: str
    businessType: str
    sector: str
    contactPerson: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    language: str = "en"
    subscriptionPlan: str = "free"

class SubscriptionUpgradeRequest(BaseModel):
    planId: str  # "free", "growth", "pro"
    billingCycle: str = "monthly"  # "monthly" or "yearly"
    isDemo: bool = True

class TradeRequestCreate(BaseModel):
    direction: str = "outgoing"
    productName: str
    sku: str
    sector: str
    peerBusinessName: str
    peerContact: Optional[str] = None
    peerLocation: Optional[str] = None
    requestedQuantity: float = Field(..., gt=0)
    unit: str = "units"
    offeredPrice: float = Field(..., ge=0)
    urgency: str = "Normal"
    deliveryNeededBy: Optional[str] = None
    notes: Optional[str] = None
