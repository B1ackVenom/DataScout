# ⚽ Football Analytics App

A full-stack football analytics dashboard to compare player performance using advanced metrics and percentile-based visualization.

---

## 🚀 Features

* 🔍 Player search with real-time suggestions
* 📊 Radar, Bar Chart & Table views
* 📈 Percentile-based comparison (CUME_DIST)
* ⚡ Hybrid data system (event + fallback stats)
* 🎯 Role-aware comparisons (Defender / Midfielder / Forward)

---

## 🛠️ Tech Stack

### Backend

* FastAPI
* PostgreSQL
* Pandas

### Frontend

* React (TypeScript)
* Tailwind CSS
* Recharts

---

## 📊 Data Pipeline

* Base stats from player dataset
* Event-based metrics (shots, passes, duels, etc.)
* Per90 normalization
* Percentile calculation using SQL window functions

---

## 🧠 Key Concepts

* Feature Engineering (per90 + fallback estimation)
* Data Integration (multiple datasets)
* Percentile ranking (CUME_DIST)
* Hybrid analytics system

---

## ⚙️ Setup Instructions

### 1. Clone repo

```bash
git clone https://github.com/YOUR_USERNAME/football-analytics-app.git
cd football-analytics-app
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Future Improvements

* Advanced metrics (progressive passes, pressures)
* Player similarity model improvements
* Role-based UI filtering
* Deployment (Docker + Cloud)

---

## 👨‍💻 Author

B1ackVenom
