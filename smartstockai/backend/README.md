# SmartStock AI - Python FastAPI & SQLite Backend

This directory contains the Python FastAPI backend for SmartStock AI.
The frontend is already configured with an intelligent client-side storage and simulation engine with local demo-state persistence, making it 100% self-contained. When you run this FastAPI backend, you can connect the frontend directly to live REST endpoints.

## Features
- **Products CRUD**: Full REST operations for managing multi-sector inventory.
- **Stock Movement Transactions**: Audit trail recording with negative-stock prevention.
- **Industrial Shortage Simulator**: Real-time What-If calculations with step-by-step formula explanations.
- **B2B Trade Network**: Trade request dispatch and status lifecycle management.
- **SQLite Database**: Lightweight zero-configuration persistent storage.

## How to Run

1. **Install Dependencies**:
```bash
pip install -r requirements.txt
```

2. **Initialize SQLite Database**:
```bash
python database.py
```

3. **Start the FastAPI Server**:
```bash
uvicorn main:app --reload --port 8000
```

4. **Interactive API Documentation**:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
