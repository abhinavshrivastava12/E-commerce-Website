#!/bin/bash

# This script fixes all instances of malformed API URLs in your codebase

echo "🔧 Fixing API URL issues..."

# Define the correct API URL pattern
CORRECT_PATTERN=process.env.REACT_APP_API_URL || "http://localhost:5000"

# Fix client-side files
find client/src -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i.bak \
  -e 's|process\.env\.REACT_APP_API_URL || http://localhost:5000|process.env.REACT_APP_API_URL \|\| "http://localhost:5000"|g' \
  -e "s|process\.env\.REACT_APP_API_URL || 'http://localhost:5000'|process.env.REACT_APP_API_URL \|\| \"http://localhost:5000\"|g" \
  -e 's|"process\.env\.REACT_APP_API_URL || http://localhost:5000|process.env.REACT_APP_API_URL \|\| "http://localhost:5000"|g' \
  {} \;

# Fix server-side files
find server -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i.bak \
  -e 's|process\.env\.REACT_APP_API_URL || http://localhost:5000|process.env.REACT_APP_API_URL \|\| "http://localhost:5000"|g' \
  -e "s|process\.env\.REACT_APP_API_URL || 'http://localhost:5000'|process.env.REACT_APP_API_URL \|\| \"http://localhost:5000\"|g" \
  {} \;

# Remove backup files
find . -name "*.bak" -delete

echo "✅ API URLs fixed!"
echo ""
echo "Next steps:"
echo "1. Create client/.env file with: REACT_APP_API_URL=http://localhost:5000"
echo "2. Restart both frontend and backend servers"