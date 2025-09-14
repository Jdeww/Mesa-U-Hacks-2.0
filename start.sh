#!/bin/bash

# Finals Review Portal - Startup Script

echo "🚀 Starting Finals Review Portal..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python3 first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create one with your API keys."
    echo "   See INTEGRATION_README.md for details."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install API server dependencies
echo "   Installing API server dependencies..."
cd api_server
if [ ! -d node_modules ]; then
    npm install
fi
cd ..

# Install frontend dependencies  
echo "   Installing frontend dependencies..."
cd integrated_frontend
if [ ! -d node_modules ]; then
    npm install
fi
cd ..

echo "✅ Dependencies installed!"

echo "🔥 Starting servers..."

# Function to kill background processes on script exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $API_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

# Start API server in background
echo "   Starting API server on port 3001..."
cd api_server
npm start &
API_PID=$!
cd ..

# Give API server time to start
sleep 3

# Start frontend in background
echo "   Starting frontend on port 5173..."
cd integrated_frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Finals Review Portal is now running!"
echo "=================================="
echo "📱 Frontend: http://localhost:5173"
echo "🔌 API Server: http://localhost:3001" 
echo "📚 Upload files and generate study materials!"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for background processes
wait $API_PID $FRONTEND_PID