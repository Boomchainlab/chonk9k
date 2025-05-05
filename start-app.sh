#!/bin/bash

# This script starts both the server and client for the CHONK9K application
# It's designed to bypass configuration conflicts in the .replit file

# Set environment variables
export NODE_ENV=development
export PORT=3000

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install it first."
    exit 1
fi

# Start the server
echo "Starting CHONK9K server..."
node -r esbuild-register server/index.ts &
SERVER_PID=$!

# Give the server a moment to start
sleep 2

# Check if server started successfully
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "Failed to start server. Please check for errors."
    exit 1
fi

echo "Server running with PID: $SERVER_PID"
echo "CHONK9K application is available at: http://localhost:3000"
echo "Press Ctrl+C to stop the application"

# Handle cleanup on script termination
trap "echo 'Stopping CHONK9K application...'; kill $SERVER_PID; exit" INT TERM

# Keep the script running
wait $SERVER_PID
