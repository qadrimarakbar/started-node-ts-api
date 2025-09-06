# Docker Configuration

Dokumentasi lengkap untuk menjalankan Node.js TypeScript API menggunakan Docker.

## 📁 File Konfigurasi Docker

- `Dockerfile` - Production image dengan multi-stage build
- `Dockerfile.dev` - Development image dengan hot reload
- `docker-compose.yml` - Production environment
- `docker-compose.dev.yml` - Development environment
- `.dockerignore` - File yang dikecualikan dari Docker build
- `.env.docker` - Environment variables untuk Docker
- `docker-scripts.ps1` - PowerShell script untuk management
- `docker-scripts.bat` - Batch script untuk Command Prompt

## 🚀 Quick Start

### Prerequisites

Pastikan Docker dan Docker Compose sudah terinstall:

```bash
docker --version
docker-compose --version
```

### Development Environment

Untuk development dengan hot reload:

```bash
# Windows PowerShell
./docker-scripts.ps1 dev

# Windows Command Prompt
docker-scripts.bat dev

# Manual
docker-compose -f docker-compose.dev.yml up -d
```

### Production Environment

Untuk production:

```bash
# Windows PowerShell
./docker-scripts.ps1 prod

# Windows Command Prompt
docker-scripts.bat prod

# Manual
docker-compose up -d
```

## 🛠️ Available Commands

### PowerShell Script (docker-scripts.ps1)

```powershell
# Build images
./docker-scripts.ps1 build

# Start production environment
./docker-scripts.ps1 up

# Start development environment
./docker-scripts.ps1 dev

# Stop containers
./docker-scripts.ps1 down

# Restart containers
./docker-scripts.ps1 restart

# View logs
./docker-scripts.ps1 logs

# Check health status
./docker-scripts.ps1 health

# Clean up resources
./docker-scripts.ps1 clean
```

### Batch Script (docker-scripts.bat)

```batch
REM Same commands as PowerShell but using .bat
docker-scripts.bat build
docker-scripts.bat up
docker-scripts.bat dev
docker-scripts.bat down
REM etc...
```

## 🏗️ Architecture

### Services

1. **API Service** (`api` / `api-dev`)
   - Node.js TypeScript application
   - Port: 3000
   - Health check: `/health`

2. **MySQL Database** (`mysql`)
   - MySQL 8.0
   - Port: 3307 (mapped from 3306)
   - Credentials: `apiuser` / `apipassword`

3. **Adminer** (`adminer`)
   - Database management interface
   - Port: 8080
   - URL: http://localhost:8080

### Networks

- `nodejs-api-network` (production)
- `nodejs-api-dev-network` (development)

### Volumes

- `mysql_data` - Production database data
- `mysql_dev_data` - Development database data
- `./logs:/app/logs` - Application logs

## 🔧 Configuration

### Environment Variables

Environment variables dapat dikonfigurasi di:

1. `docker-compose.yml` - Production environment
2. `docker-compose.dev.yml` - Development environment
3. `.env.docker` - Template file

Key variables:

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secret-key
DB_HOST=mysql
DB_PORT=3306
DB_USER=apiuser
DB_PASSWORD=apipassword
DB_NAME=node_api_db
```

### Database

Database schema akan otomatis di-import dari `database/schema.sql` saat container pertama kali dijalankan.

## 📊 Monitoring

### Health Checks

Semua services memiliki health check:

- **API**: `GET /health`
- **MySQL**: `mysqladmin ping`

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f mysql

# Using script
./docker-scripts.ps1 logs
```

### Container Status

```bash
# Check container status
docker-compose ps

# Check health status
./docker-scripts.ps1 health
```

## 🔐 Security Features

1. **Non-root user** - Application runs as non-root user
2. **Multi-stage build** - Minimal production image
3. **Security headers** - Helmet.js middleware
4. **Secrets management** - Environment variables for sensitive data

## 🚀 Deployment

### Local Development

```bash
# Start development environment
./docker-scripts.ps1 dev

# The application will be available at:
# - API: http://localhost:3000
# - Adminer: http://localhost:8080
# - Health check: http://localhost:3000/health
```

### Production

```bash
# Build and start production environment
./docker-scripts.ps1 prod

# Check if everything is running
./docker-scripts.ps1 health
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port conflicts**

   ```bash
   # Check what's using the port
   netstat -ano | findstr :3000
   netstat -ano | findstr :3307
   ```

2. **Permission issues**

   ```bash
   # Make scripts executable (Git Bash/WSL)
   chmod +x docker-scripts.ps1
   ```

3. **Container won't start**

   ```bash
   # Check logs
   docker-compose logs api
   docker-compose logs mysql
   ```

4. **Database connection issues**
   ```bash
   # Wait for MySQL to be ready
   docker-compose logs mysql | grep "ready for connections"
   ```

### Clean Up

```bash
# Stop all containers and clean up
./docker-scripts.ps1 down
./docker-scripts.ps1 clean

# Remove all Docker data (CAUTION: This will delete all data)
docker system prune -a --volumes
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

## 🆘 Support

Jika mengalami masalah:

1. Check container logs: `./docker-scripts.ps1 logs`
2. Check health status: `./docker-scripts.ps1 health`
3. Restart containers: `./docker-scripts.ps1 restart`
4. Clean up and retry: `./docker-scripts.ps1 clean` then `./docker-scripts.ps1 up`
