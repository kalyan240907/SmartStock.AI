# SmartStock AI — Simple Business Management for Everyone

**Tagline:** *Manage Stock Easily. Grow Your Business Smarter.*  
**Theme:** Simple business management for shops, restaurants, farmers, wholesalers, distributors, and factories.

---

## 🌟 What is SmartStock AI?

SmartStock AI is an easy-to-use inventory management and B2B business networking website. It is designed so that **both educated and less-educated shopkeepers, traders, and farmers** can easily manage their daily stock, identify shortages before running out, receive simple advice, and discover other local businesses who have the items they need.

---

## 💡 Key Highlights

### 1. Simple, High-Contrast Dashboard with Large Buttons
Designed with large icons, readable text, and clear buttons:
- 📦 **My Stock** — View current stock in simple units (bags, kg, packets, liters, pieces).
- ➕ **Add Products** — Add new items using text or voice input.
- 🛒 **Sell or Use Stock** — Record items going out with automatic stock reduction and negative-stock prevention.
- ⚠️ **Low Stock Alerts** — Immediate warnings when items fall below safety levels.
- 💡 **Smart Suggestions** — Clear estimates of how many days stock will last and when to buy more.
- 🤝 **Find Other Businesses** — Connect with other shops in your sector (e.g. *“You need 50 bags of rice. Another registered business has 100 bags available”*).
- 📋 **My Orders & Requests** — Track purchase requests sent and received.
- 📊 **Simple Reports** — Download clean Excel/CSV spreadsheets with one click.
- 🎙️ **Voice Assistant** — Speak commands in your regional language.
- ❓ **Help & Audio Guide** — Spoken and written instructions for every page.
- ⭐ **Subscription Plans** — Free Plan (₹0), Growth Plan (₹499/mo), and Business Pro (₹1,499/mo).

### 2. Multi-Language Support (6 Languages)
Easily switch languages at any time from the top bar on the landing page, login page, and inside the dashboard:
1. **English**
2. **Tamil (தமிழ்)**
3. **Hindi (हिन्दी)**
4. **Telugu (తెలుగు)**
5. **Malayalam (മലയാളം)**
6. **Kannada (ಕನ್ನಡ)**

All menus, buttons, alerts, status messages, voice transcriptions, and help instructions adapt to the selected language.

### 3. Voice Control ("Speak to SmartStock")
Tap the microphone button and speak commands in supported languages:
- *“Add 20 bags of rice”* / *“20 மூட்டை அரிசி சேர்க்கவும்”*
- *“Show my low-stock products”* / *“குறைந்த இருப்பு காட்டு”*
- *“How much stock is available?”* / *“இருப்பு எவ்வளவு”*
- *“Find a supplier”* / *“வியாபாரிகளை தேடு”*
- *“Change language to Tamil”* / *“மொழி தமிழ் மாற்று”*
- *“Explain this page”* / *“இந்த பக்கத்தை விளக்கு”*

**Features:**
- Recognizes spoken speech and displays transcription text before saving changes.
- **Audio Read-Aloud (Text-to-Speech)**: Tap the speaker icon (🔊) next to any message or alert to hear it read aloud in your language.
- Asks for confirmation before important actions.
- Includes a manual text command box if microphone permission is not available.

### 4. Important Privacy & Sector Protection Rule (4 Core Business Sectors)
- **Sector Selection at Registration**: Users select their business sector during signup:
  1. *Grocery & Retail*
  2. *Food & Restaurants*
  3. *Electronics*
  4. *Textiles & Fashion*
- **Strict Sector Isolation**: Once logged in, users **only** see their chosen sector’s dashboard, products, and trade network. No leaking of other sectors’ data or products.
- **Admin Access Mode**: Authorized evaluators or administrators can toggle *Admin Mode* in Settings to review all 4 sectors.

### 5. Mandatory KYC Document Verification
To protect business security and ensure trustworthy B2B trading, SmartStock AI incorporates mandatory KYC verification at login / registration:
- **Supported KYC Types**:
  - **GSTIN / Tax ID** (15 alphanumeric characters)
  - **Business PAN Card** (10 alphanumeric characters)
  - **Aadhaar Merchant Card** (12 digits)
  - **Udyam / MSME Registration**
- **Features**:
  - Real-time format validation for document numbers.
  - Simulated certificate upload scanner (PDF / Image preview).
  - **1-Click "⚡ Use Sample Valid KYC"** button for instant evaluation without typing long IDs.
  - **Strict Navigation Gating**: Users *cannot* proceed to the store dashboard until their KYC is verified and approved.
  - Active verified badge (`✓ KYC Verified`) rendered across the app header and profile settings.

### 6. Smart Trade Network
Helps shops bridge inventory gaps by finding peer businesses with spare stock:
- **Example:** *“You need 50 bags of rice. Another registered business (Thanjavur Delta Rice Mills) has 100 bags available.”*
- View matching businesses in your sector with verified sample inventory, indicative prices, and estimated delivery times.
- Send purchase requests and track status (`Pending` $\rightarrow$ `Accepted` $\rightarrow$ `Completed`).
- Suppliers can accept, reject, or fulfill incoming requests with automated stock deduction.

### 7. Three Subscription Packages
- **Free Plan — ₹0**:
  - 1 business account, 1 selected sector, basic inventory up to 50 products, basic low-stock alerts, 3 trade requests/month, multi-language & voice features.
- **Growth Plan — ₹499 / month** (or ₹4,790 / year, save 20%):
  - Up to 500 products, unlimited trade requests, advanced stockout alerts, detailed reorder suggestions, interactive What-If simulator, priority support.
- **Business Pro — ₹1,499 / month** (or ₹14,390 / year, save 20%):
  - Unlimited products, multi-staff accounts (up to 10 staff), role-based permissions, supplier price comparisons, exportable audit reports, dedicated support.
- **Demo Mode**: Free plan requires no payment details. Upgrading in demo mode is instant and free for evaluation.

---

## 🏃 How to Run the Prototype

### Option 1: Native Windows Launcher (Recommended)
Double-click `start-app.bat` or run in PowerShell:
```powershell
.\run-server.ps1
```
The app opens in your default browser at `http://localhost:3000/`. Zero extra software or installations needed!

### Option 2: Direct File Open
Double click `index.html` to open directly in Google Chrome, Microsoft Edge, Opera, or Firefox.

### Option 3: Python FastAPI Backend (Optional)
```bash
cd backend
pip install -r requirements.txt
python database.py
uvicorn main:app --reload --port 8000
```

---

## 🧪 7 Verification Workflows

1. **Register a grocery business**: Register a shop under Grocery & Retail or use the 1-click Grocery demo login.
2. **Confirm sector privacy**: Confirm that only grocery items (Rice, Wheat, Dal, Oil) and grocery trade peers appear. No electronics or textile leaks.
3. **Add a product and view low-stock warning**: Add Sona Masoori Rice or test stock movements.
4. **Change language to Tamil (தமிழ்)**: Switch language from the top bar to see buttons, menus, and messages translate instantly.
5. **Use voice commands**: Click “Speak to SmartStock” and say *“Show low stock”* or *“Add 20 bags of rice”*.
6. **Find another business**: Open “Find Other Businesses” to see the 100 bags of rice listing and submit a demo trade request.
7. **View Subscription Packages**: Open Subscription Plans to toggle Monthly/Yearly and activate a demo upgrade.
