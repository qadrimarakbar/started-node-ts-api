# Node.js TypeScript API

RESTful API dengan Node.js, TypeScript, Express, MySQL, dan MongoDB.

## � Menjalankan Aplikasi

### Menggunakan Docker (Recommended)

1. **Requirements:**
   - **Docker** >= 20.0.0

2. **Setup dan Jalankan:**

   ```bash
   # Clone repository
   git clone <repository-url>
   cd NodeJs-API

   # Copy environment file
   cp .env.example .env

   # Jalankan dengan Docker
   ./docker-scripts.ps1 dev    # Mode development
   ```

   Aplikasi akan berjalan di `http://localhost:3000`

3. **Perintah Docker Lainnya:**
   ```bash
   ./docker-scripts.ps1 down     # Hentikan aplikasi
   ./docker-scripts.ps1 health   # Cek status
   ```

### Tanpa Docker (Local Development)

1. **Requirements:**
   - **Node.js** >= 18.0.0
   - **npm** >= 8.0.0
   - **MySQL** (running di localhost:3306)
   - **MongoDB** (running di localhost:27017)

2. **Setup:**

   ```bash
   # Clone dan install dependencies
   git clone <repository-url>
   cd NodeJs-API
   npm install

   # Setup environment
   cp .env.example .env
   ```

3. **Database Setup:**

   ```bash
   # Buat database MySQL
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS node_api_db;"

   # Jalankan migrasi
   npm run db:migrate
   ```

4. **Jalankan Aplikasi:**

   ```bash
   npm run dev    # Mode development
   ```

   Aplikasi akan berjalan di `http://localhost:3000`

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
