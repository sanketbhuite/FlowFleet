# 🚛 FlowFleet
**Fleet Management System for Truck Owners & Drivers**

FlowFleet is a full-stack fleet management platform that helps transport owners track trucks, manage trips, monitor expenses, and view live driver locations in real time.

---

## ✨ Features

### 👨‍💼 Owner Dashboard
- Add & manage trucks
- Create and assign trips
- Track driver live location
- Monitor expenses
- View reports & analytics
- Multi-language support (English / Marathi)

### 🚚 Driver Dashboard
- View assigned trip
- Send live location
- Add trip expenses
- Update trip status
- Simple mobile-friendly UI

### 🌍 Live Tracking
- Real-time driver location
- Map-based truck tracking
- Trip-based monitoring

### 💰 Expense Management
- Fuel expenses
- Toll expenses
- Driver expenses
- Trip-based expense tracking
- Reports & summaries

---

## 🏗️ Tech Stack

### Frontend
- React.js
- Axios
- React Router
- i18n (English / Marathi)
- CSS

### Backend
- Django
- Django REST Framework
- SQLite (default)
- Token Authentication

---

## 📁 Project Structure

```
FlowFleet/
│
├── backend/            # Django backend
│   ├── users/
│   ├── trips/
│   ├── tracking/
│   ├── fleet/
│   ├── reports/
│   └── manage.py
│
├── frontend/           # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   ├── auth/
│   │   └── i18n/
│
├── LICENSE
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/sanketbhuite/FlowFleet.git
cd FlowFleet
```

---

## 🔧 Backend Setup (Django)

```bash
cd backend

python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

Backend runs at:
```
http://127.0.0.1:8000
```

---

## 🎨 Frontend Setup (React)

```bash
cd frontend

npm install
npm start
```

Frontend runs at:
```
http://localhost:3000
```

---

## 🔐 Authentication

FlowFleet supports:

- Owner Login
- Driver Login
- Token-based authentication
- Protected routes

---

## 🌐 Multi Language Support

FlowFleet supports:

- English
- Marathi

Language can be switched from UI.

---

## 📊 Modules

### Owner
- Dashboard
- Trucks
- Trips
- Expenses
- Reports
- Live Tracking

### Driver
- Current Trip
- Send Location
- Expenses
- Dashboard

---

## 📡 API Modules

- Users API
- Trips API
- Tracking API
- Fleet API
- Reports API

---

## 🚀 Future Improvements

- GPS device integration
- Notifications
- Driver salary tracking
- Fuel efficiency analytics
- Mobile app
- Export reports (PDF/Excel)

---

## 👨‍💻 Author

**Sanket Bhuite**

- GitHub: https://github.com/sanketbhuite
- Portfolio: https://myself-sanket.netlify.app

---

## 📄 License

This project is open-source and available under the MIT License.

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
