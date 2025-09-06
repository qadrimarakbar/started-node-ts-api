#!/bin/bash

# Docker management script untuk Windows (PowerShell)
# Usage: ./docker-scripts.ps1 [command]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("build", "up", "down", "restart", "logs", "dev", "prod", "clean", "health")]
    [string]$Command
)

function Show-Help {
    Write-Host "Docker Management Script"
    Write-Host "========================="
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  build   - Build Docker images"
    Write-Host "  up      - Start containers (production)"
    Write-Host "  down    - Stop and remove containers"
    Write-Host "  restart - Restart containers"
    Write-Host "  logs    - Show container logs"
    Write-Host "  dev     - Start development environment"
    Write-Host "  prod    - Start production environment"
    Write-Host "  clean   - Clean up unused Docker resources"
    Write-Host "  health  - Check container health status"
    Write-Host ""
}

switch ($Command) {
    "build" {
        Write-Host "Building Docker images..."
        docker-compose build
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Images built successfully!"
        } else {
            Write-Host "Build failed!"
            exit 1
        }
    }

    "up" {
        Write-Host "Starting production containers..."
        docker-compose up -d
        Write-Host "Containers started!"
        Write-Host "API: http://localhost:3000"
        Write-Host "Adminer: http://localhost:8080"
    }

    "down" {
        Write-Host "Stopping containers..."
        docker-compose down
        docker-compose -f docker-compose.dev.yml down
        Write-Host "Containers stopped!"
    }

    "restart" {
        Write-Host "Restarting containers..."
        docker-compose restart
        Write-Host "Containers restarted!"
    }

    "logs" {
        Write-Host "Showing logs (Press Ctrl+C to exit)..."
        docker-compose logs -f
    }

    "dev" {
        Write-Host "Starting development environment..."
        docker-compose -f docker-compose.dev.yml up -d
        Write-Host "Development environment started!"
        Write-Host "API: http://localhost:3000"
        Write-Host "Adminer: http://localhost:8080"
        Write-Host "Source code akan auto-reload saat ada perubahan"
    }

    "prod" {
        Write-Host "Starting production environment..."
        docker-compose build --no-cache
        docker-compose up -d
        Write-Host "Production environment started!"
        Write-Host "API: http://localhost:3000"
        Write-Host "Adminer: http://localhost:8080"
    }

    "clean" {
        Write-Host "Cleaning up Docker resources..."
        Write-Host "Removing stopped containers..."
        docker container prune -f
        Write-Host "Removing unused networks..."
        docker network prune -f
        Write-Host "Removing unused images..."
        docker image prune -f
        Write-Host "Cleanup completed!"
    }

    "health" {
        Write-Host "Checking container health..."
        Write-Host ""
        Write-Host "=== Container Status ==="
        docker-compose ps
        Write-Host ""
        Write-Host "=== Health Checks ==="
        docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
    }

    default {
        Show-Help
    }
}
