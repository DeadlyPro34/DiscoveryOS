#!/bin/bash
# Phase 2 Implementation Verification Checklist
# Run this to verify all files are in place

echo "🔍 Phase 2 Implementation Verification"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Counter
TOTAL=0
PASSED=0

# Function to check file
check_file() {
  TOTAL=$((TOTAL + 1))
  if [ -f "$1" ]; then
    LINES=$(wc -l < "$1")
    echo -e "${GREEN}✓${NC} $1 ($LINES lines)"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}✗${NC} $1 (MISSING)"
  fi
}

# Function to check directory
check_dir() {
  TOTAL=$((TOTAL + 1))
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1 (directory)"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}✗${NC} $1 (MISSING)"
  fi
}

echo "📂 File Structure"
echo "================="
echo ""

# Root files
echo "Database Schema & Documentation:"
check_file "schema.sql"
check_file "PHASE2_SUMMARY.md"
check_file "PHASE2_IMPLEMENTATION.md"
check_file "PHASE2_API_REFERENCE.md"
check_file "README_PHASE2.md"
echo ""

# Type files
echo "Type Definitions:"
check_file "src/types/database.ts"
echo ""

# Service files
echo "Database Service:"
check_dir "src/services/ai/database"
check_file "src/services/ai/database/supabaseClient.ts"
echo ""

echo "RAG Pipeline Services:"
check_dir "src/services/ai/rag"
check_file "src/services/ai/rag/textExtractor.ts"
check_file "src/services/ai/rag/embeddingChunker.ts"
check_file "src/services/ai/rag/embeddingGenerator.ts"
check_file "src/services/ai/rag/vectorStore.ts"
check_file "src/services/ai/rag/documentProcessor.ts"
echo ""

# Summary
echo ""
echo "======================================"
echo "Summary: $PASSED/$TOTAL items verified"

if [ $PASSED -eq $TOTAL ]; then
  echo -e "${GREEN}✓ All files present!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some files missing!${NC}"
  exit 1
fi
