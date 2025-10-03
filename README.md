# Node.js TypeScript API

RESTful API dengan Node.js, TypeScript, Express, MySQL, dan MongoDB.

## 📋 Requirements

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Docker** >= 20.0.0 (recommended)

## 🔧 Configuration

### 1. Clone & Install

```bash
git clone <repository-url>
cd NodeJs-API
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random_123456789

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=node_api_db
DB_PORT=3306

# MongoDB
MONGODB_URI=mongodb://localhost:27017/node_api_mongo_db_dev
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_USER=
MONGODB_PASSWORD=
MONGODB_DATABASE=node_api_mongo_db_dev

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
CORS_METHODS=GET,POST,PUT,DELETE,PATCH
CORS_ALLOWED_HEADERS=Content-Type,Authorization
CORS_CREDENTIALS=true
CORS_MAX_AGE=86400
```

### 3. Database Setup

1. Pastikan MySQL berjalan dan kredensial di `.env` sesuai.
2. Buat database (jika belum ada):

   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS node_api_db;"
   ```

3. Jalankan migrasi Knex untuk membangun skema:

   ```bash
   npm run db:migrate
   ```

   Gunakan `npm run db:rollback` jika perlu membatalkan migrasi terakhir.

> **TIP:** Jika memakai Docker, `./docker-scripts.ps1 dev` tetap bisa digunakan untuk menyiapkan service MySQL/MongoDB sebelum menjalankan migrasi.

### 4. Run Application

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm run build
npm start
```

## 🐳 Docker Commands

```bash
./docker-scripts.ps1 dev      # Development
./docker-scripts.ps1 prod     # Production
./docker-scripts.ps1 down     # Stop
./docker-scripts.ps1 health   # Check status
```

## 📚 API Endpoints

```http
# Auth
POST /api/auth/register
POST /api/auth/login

# Users (Protected)
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id

# Books
GET    /api/books
GET    /api/books/:id
POST   /api/books          # Protected
PUT    /api/books/:id      # Protected
DELETE /api/books/:id      # Protected

# Health
GET /health
```

**Authentication Header:**

```http
Authorization: Bearer <jwt-token>
```

---

**Lihat [DOCKER.md](DOCKER.md) untuk dokumentasi Docker lengkap**
