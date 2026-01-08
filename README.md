# CART | Future Commerce 🚀

![CART Branding](/frontend/public/preview.png)

**CART** is a next-generation e-commerce platform that redefines product discovery through **Natural Language Processing (NLP)** and **Elasticsearch**. Unlike traditional keyword-matching stores, CART understands *user intent* (e.g., "blue running shoes under $100"), delivering precise, AI-powered results in milliseconds.

Wrapped in a premium **"Cyber/Electric"** design system, CART offers a futuristic, glassmorphic UI that feels as advanced as the technology powering it.

---

## ✨ Key Features

### 🧠 AI-Powered Search
*   **NLP Query Parsing**: Understands complex queries like *"comfortable red sneakers for gym"* by extracting entities (Color: Red, Category: Sneakers, Attribute: Comfortable).
*   **Elasticsearch Engine**: Powered by a hosted Elasticsearch cluster (Bonsai.io) for lightning-fast, relevance-ranked results.
*   **Smart Synonyms**: Knows that "trainers", "kicks", and "shoes" are related.

### 🎨 Premium "Cyber" UI
*   **Glassmorphism**: Translucent headers and cards with background blurs.
*   **Neon & Dark Mode**: A deep space dark theme with vibrant electric violet and cyan accents.
*   **Interactive Micro-animations**: Smooth hover states, carousel transactions, and glowing effects.

### 🛠️ Technical Depth
*   **Dual-Write Architecture**: precise data syncing between MongoDB (primary) and Elasticsearch (search index).
*   **Admin Dashboard**: Full CRUD capabilities for product management with real-time analytics.
*   **Responsive**: Fully optimized for mobile, tablet, and desktop.

---

## 🏗️ Tech Stack

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS, Shadcn UI, Lucide Icons
*   **State**: Context API
*   **Deployment**: Static Site (Render/Netlify)

### Backend
*   **API**: FastAPI (Python 3.11+)
*   **Search**: Elasticsearch 7.10+ (Bonsai.io)
*   **Database**: MongoDB Atlas
*   **NLP**: Spacy (`en_core_web_sm`)
*   **Deployment**: Web Service (Render)

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   Python 3.11+
*   MongoDB Atlas URI
*   Elasticsearch Host (Bonsai/Elastic Cloud)

### 1. Clone the Repository
```bash
git clone https://github.com/harsh07032004/CART_ECOM_SEARCH_PARSER.git
cd CART_ECOM_SEARCH_PARSER
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Create .env file
echo "MONGO_URI=your_mongo_uri" > .env
echo "ES_HOST=your_elastic_host" >> .env
echo "ES_INDEX=products" >> .env

# Run Server
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Deployment

### Render.com (Recommended)

#### Backend (Web Service)
*   **Build Command**: `cd backend && pip install -r requirements.txt && python -m spacy download en_core_web_sm`
*   **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
*   **envVars**: `MONGO_URI`, `ES_HOST`, `ES_INDEX`

#### Frontend (Static Site)
*   **Build Command**: `cd frontend && npm install && npm run build`
*   **Publish Directory**: `frontend/dist`
*   **envVars**: `VITE_API_URL` (Link to your Backend URL)

---

## 🛡️ License

This project is open-source and available under the MIT License.

**Valid Credentials (for testing only):**
*   **Admin**: `admin@cart.com` / `admin123`
