@echo off
REM Batch script untuk Windows Command Prompt
REM Usage: docker-scripts.bat [command]

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="build" goto build
if "%1"=="up" goto up
if "%1"=="down" goto down
if "%1"=="restart" goto restart
if "%1"=="logs" goto logs
if "%1"=="dev" goto dev
if "%1"=="prod" goto prod
if "%1"=="clean" goto clean
if "%1"=="health" goto health
goto help

:help
echo Docker Management Script
echo =========================
echo.
echo Commands:
echo   build   - Build Docker images
echo   up      - Start containers (production)
echo   down    - Stop and remove containers
echo   restart - Restart containers
echo   logs    - Show container logs
echo   dev     - Start development environment
echo   prod    - Start production environment
echo   clean   - Clean up unused Docker resources
echo   health  - Check container health status
echo.
goto end

:build
echo Building Docker images...
docker-compose build
if %ERRORLEVEL% EQU 0 (
    echo ✅ Images built successfully!
) else (
    echo ❌ Build failed!
    exit /b 1
)
goto end

:up
echo Starting production containers...
docker-compose up -d
echo ✅ Containers started!
echo 🌐 API: http://localhost:3000
echo 🗃️  Adminer: http://localhost:8080
goto end

:down
echo Stopping containers...
docker-compose down
docker-compose -f docker-compose.dev.yml down
echo ✅ Containers stopped!
goto end

:restart
echo Restarting containers...
docker-compose restart
echo ✅ Containers restarted!
goto end

:logs
echo Showing logs (Press Ctrl+C to exit)...
docker-compose logs -f
goto end

:dev
echo Starting development environment...
docker-compose -f docker-compose.dev.yml up -d
echo ✅ Development environment started!
echo 🌐 API: http://localhost:3000
echo 🗃️  Adminer: http://localhost:8080
echo 📁 Source code akan auto-reload saat ada perubahan
goto end

:prod
echo Starting production environment...
docker-compose build --no-cache
docker-compose up -d
echo ✅ Production environment started!
echo 🌐 API: http://localhost:3000
echo 🗃️  Adminer: http://localhost:8080
goto end

:clean
echo Cleaning up Docker resources...
echo Removing stopped containers...
docker container prune -f
echo Removing unused networks...
docker network prune -f
echo Removing unused images...
docker image prune -f
echo ✅ Cleanup completed!
goto end

:health
echo Checking container health...
echo.
echo === Container Status ===
docker-compose ps
echo.
echo === Health Checks ===
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
goto end

:end
