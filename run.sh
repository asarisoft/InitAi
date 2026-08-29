#!/bin/bash

# ==============================================================================
# InitAI Project Launcher Script
# ==============================================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "=================================================="
echo "⚡ InitAI — AI Agent Studio & PRD Generator"
echo "=================================================="
echo ""
echo "Pilih mode untuk menjalankan aplikasi:"
echo "1) Frontend Standalone (React + Mock AI Engine - Paling Cepat)"
echo "2) Full-Stack Lokal (FastAPI Backend + React Frontend)"
echo "3) Docker Compose (Full Containerized Services)"
echo "4) Exit"
echo ""

read -p "Masukkan pilihan [1-4] (default: 1): " choice
choice=${choice:-1}

cleanup() {
    echo ""
    echo "🛑 Menghentikan proses yang sedang berjalan..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

case "$choice" in
    1)
        echo ""
        echo "🚀 Menjalankan Frontend Standalone..."
        cd "$PROJECT_ROOT/frontend"
        if [ ! -d "node_modules" ]; then
            echo "📦 Menginstall dependencies frontend..."
            npm install
        fi
        echo "🌐 Membuka dev server di http://localhost:5173 ..."
        npm run dev
        ;;

    2)
        echo ""
        echo "⚙️ Menjalankan Full-Stack Lokal..."
        
        # 1. Setup & Start Backend
        echo "🐍 Memulai FastAPI Backend..."
        cd "$PROJECT_ROOT/backend"
        if [ ! -d "venv" ]; then
            echo "📦 Membuat virtual environment Python..."
            python3 -m venv venv
            source venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt
        else
            source venv/bin/activate
        fi
        
        python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
        BACKEND_PID=$!
        echo "✅ Backend berjalan di http://localhost:8000 (PID: $BACKEND_PID)"
        
        # 2. Setup & Start Frontend
        echo "⚛️ Memulai React Frontend..."
        cd "$PROJECT_ROOT/frontend"
        if [ ! -d "node_modules" ]; then
            echo "📦 Menginstall dependencies frontend..."
            npm install
        fi
        
        echo "✅ Frontend berjalan di http://localhost:5173"
        echo "Tekan Ctrl+C untuk menghentikan semua service."
        echo ""
        npm run dev
        ;;

    3)
        echo ""
        echo "🐳 Menjalankan via Docker Compose..."
        if ! command -v docker &> /dev/null; then
            echo "❌ Error: Docker tidak ditemukan di sistem ini."
            exit 1
        fi
        docker compose up --build
        ;;

    4)
        echo "👋 Keluar."
        exit 0
        ;;

    *)
        echo "❌ Pilihan tidak valid."
        exit 1
        ;;
esac
