#!/bin/bash

echo "🧪 Testing AQUANTIS Calculators..."
echo ""

API="http://localhost:5000/api"

# Test 1: ZLD Calculator
echo "1️⃣  Testing ZLD Calculator..."
curl -s -X POST "$API/zld-calculator/calculate" \
  -H "Content-Type: application/json" \
  -d '{"sector":"textile","totalWaterFlowM3PerHour":150,"treatmentEfficiency":{"pretreatment":0.85,"primary":0.75,"tertiary":0.92}}' | jq '.zldMetrics' 2>/dev/null && echo "✅ ZLD OK" || echo "❌ ZLD FAILED"

echo ""

# Test 2: Crop Water Calculator
echo "2️⃣  Testing Crop Water Calculator..."
curl -s -X POST "$API/crop-water/calculate" \
  -H "Content-Type: application/json" \
  -d '{"cropKey":"rice","areaHectares":10,"season":"normal"}' | jq '.totalWaterML' 2>/dev/null && echo "✅ Crop Water OK" || echo "❌ Crop Water FAILED"

echo ""

# Test 3: LULC Analyzer
echo "3️⃣  Testing LULC Analyzer..."
curl -s -X POST "$API/crop-water/lulc/analyze" \
  -H "Content-Type: application/json" \
  -d '{"lulcDistribution":{"built_up":10,"agricultural_kharif":40,"agricultural_rabi":25,"forests":15,"scrubland":5,"water_bodies":3,"barren":2},"totalAreaHa":1000}' | jq '.totalWaterDemandML' 2>/dev/null && echo "✅ LULC OK" || echo "❌ LULC FAILED"

echo ""
echo "✅ All tests completed!"
