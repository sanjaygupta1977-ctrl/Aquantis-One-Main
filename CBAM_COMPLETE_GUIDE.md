# 🌍 CBAM - EU Carbon Border Adjustment Mechanism

## Complete Integration Guide for AQUANTIS STP BOQ System

---

## 📖 Table of Contents

1. [What is CBAM?](#what-is-cbam)
2. [CBAM Phases & Timeline](#cbam-phases--timeline)
3. [Your Project Impact](#your-project-impact)
4. [CBAM Calculations](#cbam-calculations)
5. [API Documentation](#api-documentation)
6. [Using the CBAM Calculator](#using-the-cbam-calculator)
7. [Regulatory Compliance](#regulatory-compliance)
8. [Carbon Offset Strategies](#carbon-offset-strategies)

---

## What is CBAM?

### Definition

**CBAM (Carbon Border Adjustment Mechanism)** is an EU climate policy mechanism that puts a carbon price on imports of certain goods into the EU. It's designed to prevent carbon leakage and ensure EU companies aren't disadvantaged by stricter climate policies.

### Key Points

- **Purpose**: Prevent carbon leakage (moving production to non-EU countries with lower emission standards)
- **Coverage**: Cement, steel, aluminum, fertilizers, electricity, and organic chemicals
- **Tax Rate**: €95/ton CO2e (2024), projected to increase
- **Applies to**: Imported materials and products, not EU-produced goods (initially)

### Why It Matters for Your STP Project

Your 10 MLD MBR STP will be subject to CBAM because:

1. **Civil Works** (RCC + Steel) = 2,750 tons concrete + 250 tons steel
2. **Electrical Equipment** (Cable, transformers) = Multiple tons of copper
3. **Operations** (Electricity consumption) = ~1,050 MWh annually
4. **Chemicals** (Coagulants, disinfectants) = Fertilizer-based nutrients

---

## CBAM Phases & Timeline

### Phase 1: Transition Period (Oct 1, 2023 - Dec 31, 2025)

- **Obligation**: Quarterly reporting only
- **Tax**: NONE (no financial liability)
- **Your Action**: Start tracking embodied carbon and imports
- **Status**: Currently active

### Phase 2: Full Implementation (Jan 1, 2026 onwards)

- **Obligation**: Pay CBAM tax on covered goods
- **Tax Rate**: €95/ton CO2e (2026) → €105 (2027) → €120 (2028)
- **Your Action**: Factor CBAM into project costs
- **Your STP Timeline**: Construction completion Dec 2025 / Jan 2026 (exactly at transition!)

### Implications for Your Project

```
Oct 2023 ─────────────────── Dec 2025 ─────────────────── Dec 2030
          Phase 1 (Reporting)   │    Phase 2 (Tax Active)    │
                                ↓                             ↓
                        Your STP Operational       End of projected costs
                        (CAPEX phase complete)     (10-year OPEX running)
```

**Critical**: Your project's operational phase will be **entirely under CBAM Phase 2 tax regime**.

---

## Your Project Impact

### 10 MLD MBR STP - Carbon & CBAM Analysis

#### Embodied Carbon (One-time during construction)

| Component | Volume | CO2e Emissions | CBAM Tax |
|-----------|--------|----------------|----------|
| RCC Concrete (M35) | 2,750 m³ | ~687 tons | €65,265 |
| Steel (Fe500) | 250 tons | ~625 tons | €59,375 |
| SS 316 Components | Various | ~50 tons | €4,750 |
| Electrical Equipment | Various | ~30 tons | €2,850 |
| **Total Embodied** | **-** | **~1,392 tons** | **€132,240** |

#### Operational Carbon (Annual from 2026 onwards)

| Item | Annual | CO2e | CBAM Tax |
|------|--------|------|----------|
| Electricity (1,050 MWh @ 0.4 kg CO2/kWh) | - | ~420 tons | €39,900/year |
| Coagulant (Alum) | 150 tons | ~52.5 tons | €4,987/year |
| Disinfectant (NaOCl) | 90 tons | ~40.5 tons | €3,847/year |
| Lime (pH adjustment) | 150 tons | ~12 tons | €1,140/year |
| Nutrients (N+P) | 30 tons | ~36 tons | €3,420/year |
| **Total Annual** | **-** | **~561 tons** | **€53,294/year** |

### 10-Year CBAM Projection (2026-2035)

```
Embodied Carbon Tax (one-time): €132,240
Annual Operational Tax (Year 1): €53,294
Annual Operational Tax (Year 2): €59,125 (at €105/ton)
Annual Operational Tax (Year 3+): €67,320 (at €120/ton)

10-Year Total CBAM Liability: ~€561,640
```

---

## CBAM Calculations

### Carbon Emission Factors Used

**Construction Materials** (kg CO2e per unit)
- RCC Concrete M35: 0.25 kg CO2e/kg
- Steel Fe500: 2.5 kg CO2e/kg
- SS 316 Stainless: 5.8 kg CO2e/kg
- Galvanized Iron: 3.2 kg CO2e/kg

**Equipment Manufacturing**
- Pump motors: 0.15 kg CO2e/kW
- Blowers: 0.18 kg CO2e/kW
- Transformers: 0.12 kg CO2e/kVA

**Electricity Grid** (varies by region)
- EU Average: 0.4 kg CO2e/kWh
- India: 0.7 kg CO2e/kWh (coal-heavy)
- Renewable: 0.05 kg CO2e/kWh

**Chemicals**
- Alum coagulant: 0.35 kg CO2e/kg
- Disinfectant: 0.45 kg CO2e/kg
- Lime: 0.08 kg CO2e/kg

### Calculation Methodology

#### 1. **Embodied Carbon Calculation**

```
Embodied CO2 = Material Mass × CO2 Factor

For Concrete:
  2,750 m³ × 2,400 kg/m³ × 0.25 kg CO2/kg = 1,650 tons CO2e

For Steel:
  250 tons × 2,500 kg CO2/ton = 625 tons CO2e
```

#### 2. **Operational Carbon Calculation**

```
Operational CO2 = (Electricity × Grid Intensity) + Chemical Emissions

Electricity:
  1,050,000 kWh × 0.4 kg CO2/kWh ÷ 1,000 = 420 tons CO2e/year

Chemicals:
  150 tons Alum × 0.35 = 52.5 tons CO2e/year
  90 tons Disinfectant × 0.45 = 40.5 tons CO2e/year
  ... (total ~141 tons CO2e/year from chemicals)

Total Annual: 420 + 141 = 561 tons CO2e/year
```

#### 3. **CBAM Tax Calculation**

```
CBAM Tax = CO2 Emissions × Tax Rate (€/ton)

Year 1 (2026): 561 tons × €95 = €53,295
Year 2 (2027): 561 tons × €105 = €58,905
Year 3+ (2028): 561 tons × €120 = €67,320
```

---

## API Documentation

### CBAM Backend Routes

#### 1. POST `/api/cbam/calculate`

Calculate CBAM tax liability for your project.

**Request Body:**
```json
{
  "project_name": "10 MLD MBR STP - Bangalore",
  "capacity_mld": 10,
  "civil_data": {
    "rcc_volume": 2750,
    "steel_mass": 250000,
    "waterproofing_area": 5000,
    "epoxy_area": 3000
  },
  "mechanical_data": {
    "inlet_pump_kw": 30,
    "ras_pump_kw": 15,
    "effluent_pump_kw": 24,
    "blower_kw": 60,
    "membrane_area": 500,
    "piping_length": 2000
  },
  "electrical_data": {
    "transformer_kva": 100,
    "cable_length": 500,
    "earthing_rods": 10
  },
  "operational_data": {
    "annual_electricity_kwh": 1050000,
    "grid_intensity": 0.4,
    "renewable_fraction": 0,
    "coagulant_kg_annual": 150000,
    "disinfectant_kg_annual": 90000,
    "lime_kg_annual": 150000
  },
  "projection_years": 10
}
```

**Response:**
```json
{
  "project_name": "10 MLD MBR STP - Bangalore",
  "capacity_mld": 10,
  "timestamp": "2024-01-15T10:30:00Z",
  "emissions": {
    "civil": {
      "rcc_co2": 1650000,
      "steel_co2": 625000,
      "total_civil_tons": 2275
    },
    "mechanical": {
      "total_mechanical_tons": 85
    },
    "electrical": {
      "total_electrical_tons": 40
    },
    "operational": {
      "annual_electricity_co2": 420,
      "total_annual_operational": 561
    }
  },
  "cbam_analysis": {
    "current_phase": "Phase 1 (Reporting)",
    "phase2_start_date": "2026-01-01",
    "total_embodied_carbon": 2400,
    "annual_operational_carbon": 561,
    "embodied_carbon_tax_eur": 228000,
    "annual_operational_tax_eur": 53295,
    "total_10year_tax_eur": 561640,
    "projected_years": [
      {
        "year": 1,
        "calendar_year": 2026,
        "annual_tax_eur": 53295,
        "cumulative_tax_eur": 281295
      },
      ...
    ]
  },
  "offset_options": [
    {
      "name": "Low Carbon Cement",
      "description": "Use LC3 or slag-based cement (50% lower carbon)",
      "reduction_percent": 40,
      "reduced_carbon": 960,
      "cost_per_ton_co2": 5,
      "total_cost_eur": 4800
    },
    ...
  ]
}
```

#### 2. GET `/api/cbam/factors`

Get current carbon emission factors.

#### 3. GET `/api/cbam/parameters`

Get current CBAM tax rates and parameters.

#### 4. POST `/api/cbam/save`

Save CBAM analysis to database.

#### 5. GET `/api/cbam/projects`

Retrieve all saved CBAM analyses.

---

## Using the CBAM Calculator

### Frontend Access

**URL**: `http://localhost:3000/cbam-calculator`

### Step-by-Step Guide

1. **Enter Project Information**
   - Project Name: "10 MLD MBR STP - Bangalore"
   - Capacity: 10 MLD

2. **Input Civil Works Data**
   - RCC Volume: 2,750 m³
   - Steel Mass: 250,000 kg
   - Waterproofing: 5,000 m²

3. **Input Mechanical Data**
   - Inlet Pump: 30 kW
   - Blower: 60 kW
   - Membrane Area: 500 m²

4. **Input Electrical Data**
   - Transformer: 100 kVA
   - Cable Length: 500 m

5. **Input Operational Data**
   - Annual Electricity: 1,050,000 kWh
   - Grid CO2 Intensity: 0.4 kg/kWh
   - Renewable Energy: 0% (or enter your target)

6. **Click "Calculate CBAM"**

### Output Interpretation

The calculator shows:

- **Total Embodied Carbon**: One-time construction emissions
- **Annual Operational Carbon**: Recurring yearly emissions
- **CBAM Tax Summary**: Total tax liability over 10 years
- **Emissions Breakdown**: Contribution by component (Civil, Mechanical, Electrical, Operations)
- **Offset Options**: 4 strategies to reduce carbon footprint:
  - Low Carbon Cement (-40%)
  - Renewable Electricity (-65% of operational)
  - Carbon Credits (-100%)
  - Combined Strategy (-60%)

---

## Regulatory Compliance

### EU CBAM Reporting Requirements

#### Phase 1 (Reporting Only)

- **Timeline**: Q1 2024 → Q4 2025
- **Frequency**: Quarterly reports
- **Content**: List of imported goods and embedded emissions
- **Penalty for non-compliance**: Up to 5% of purchase value

#### Phase 2 (Tax & Compliance)

- **Timeline**: Jan 2026 onwards
- **Requirement**: Purchase and submit CBAM certificates
- **Cost**: €95-120/ton CO2e (depending on year)
- **Compliance**: Must match declared emissions with actual imports
- **Audit**: EU customs may inspect to verify carbon content

### Documentation Requirements

To demonstrate compliance, keep records of:

1. **Material Sourcing**
   - Supplier invoices showing origin
   - Material Certificates (cement, steel, etc.)
   - Carbon footprint declarations from suppliers

2. **Supply Chain**
   - Transport documentation (truck/rail logs)
   - Border crossing records
   - Customs declarations

3. **Operational**
   - Electricity purchase agreements
   - Grid provider's CO2 intensity data
   - Chemical supplier data sheets with carbon content

4. **Project**
   - Design calculations proving material quantities
   - BOQ (Bill of Quantities) detailed breakdown
   - Payment invoices and bills of lading

### Sample Compliance Document

**CBAM Compliance Summary - 10 MLD MBR STP**

```
Project: 10 MLD MBR STP - Bangalore
Period: 2024-2025 (Phase 1 Reporting)
Reporting Entity: [Your Company]

EMBODIED CARBON IMPORTS:
- RCC Concrete (imported): 2,000 m³ @ 687 tons CO2e
- Steel (imported): 150 tons @ 375 tons CO2e
- Electrical Equipment (imported): 40 tons CO2e
Total Embodied: 1,102 tons CO2e

CERTIFIED EMISSIONS:
- Certified Low-Carbon Concrete: 500 m³ (300 tons CO2e)
- Recycled Steel: 100 tons (150 tons CO2e)
Total Certified: 450 tons CO2e

UNCERTIFIED EMISSIONS (Subject to CBAM Phase 2):
- Total Uncertified: 652 tons CO2e

CBAM LIABILITY (Phase 2):
- Year 1 (2026): 652 tons × €95 = €61,940
- Year 2 (2027): 652 tons × €105 = €68,460
- Year 3+ (2028+): 652 tons × €120 = €78,240/year
```

---

## Carbon Offset Strategies

### Strategy 1: Low Carbon Cement (40% Reduction)

**What**: Use LC3 (Limestone Calcined Clay Cement) or blast furnace slag cement instead of OPC

**Implementation**:
- Communicate with concrete suppliers
- Upgrade from M35 OPC to M35 LC3
- Cost: €2-5/ton CO2e saved
- Reduction: 275 tons CO2e
- Investment: ~€1,375-€3,750

**Benefit**:
- CBAM tax saved: €26,125
- Payback: Immediate
- Bonus: Improved durability

### Strategy 2: Renewable Electricity (65% of Operational)

**What**: Source 100% renewable energy for operations

**Implementation**:
- Negotiate Power Purchase Agreement (PPA) with renewable provider
- Install solar capacity on site
- Mix of grid renewable + on-site generation
- Cost: €10-15/ton CO2e

**Reduction**: ~273 tons CO2e/year

**Investment Options**:
- On-site solar: ~€500-700/kW capacity = €52,500-70,000 for 100 kW
- Grid PPA: Usually no upfront cost, added tariff

**Benefit**:
- CBAM tax saved: €25,935/year
- Payback (solar): 2-3 years
- Long-term savings: €259,350/10 years

### Strategy 3: Carbon Credits (100% Reduction)

**What**: Purchase Verified Carbon Standard (VCS) or Gold Standard credits

**Implementation**:
- Buy 2,400 tons of carbon credits
- Each credit = 1 ton CO2e avoided elsewhere
- Cost: €8/credit
- Total: €19,200

**Benefit**:
- Complete carbon neutrality (for CBAM purposes)
- Verified by third-party auditors
- Supports climate projects globally (reforestation, renewables)

### Strategy 4: Combined Strategy (60% Reduction)

**Components**:
- Low Carbon Cement: -40% embodied (€1,500-€3,750)
- 50% Renewable Electricity: -33% operational (€26,000-€35,000 for PPA)
- Total Investment: €27,500-€38,750

**Reduction**:
- Embodied: 275 tons CO2e (once)
- Annual: 186 tons CO2e
- 10-Year: 275 + (186 × 10) = 2,135 tons CO2e

**CBAM Savings**:
- Embodied: €26,125 (one-time)
- Operational: €17,670/year
- 10-Year: €26,125 + (€17,670 × 10) = €203,825

**Payback**: 1.5-2.3 years

---

## Integration with Your STP BOQ System

### How CBAM Fits

```
STP BOQ System
├─ Civil BOQ (Carbon Impact)
│  └─ RCC Grade M35: 687 tons CO2e → €65,265 CBAM
│  └─ Steel Fe500: 625 tons CO2e → €59,375 CBAM
│
├─ Mechanical BOQ (Carbon Impact)
│  └─ Pumps, blowers: 85 tons CO2e → €8,075 CBAM
│  └─ Membrane (SS 316): 50 tons CO2e → €4,750 CBAM
│
├─ Electrical BOQ (Carbon Impact)
│  └─ Cables, transformer: 40 tons CO2e → €3,800 CBAM
│
├─ Chemical BOQ (Annual Carbon Impact)
│  └─ Coagulants, disinfectants: 141 tons CO2e/year → €13,395/year CBAM
│
└─ CBAM Calculator (NEW)
   └─ Aggregates all above
   └─ Projects 10-year liability: €561,640
   └─ Suggests offset strategies
```

### Updating Your Project Cost Estimate

**Old Estimate** (without CBAM):
- CAPEX: ₹76.2 Cr
- OPEX: ₹20 Cr/year (10 years = ₹200 Cr)
- **Total: ₹276.2 Cr**

**New Estimate** (with CBAM):
- CAPEX: ₹76.2 Cr + €132,240 (~₹1.1 Cr) = **₹77.3 Cr**
- OPEX: ₹20 Cr/year + €53,295/year (~₹44.5 Lakhs) = **₹20.45 Cr/year**
- 10-Year Total: **₹277.8 Cr** (₹1.6 Cr increase)

**Impact**: ~0.6% cost increase, but:
- Ensures EU regulatory compliance
- Qualifies project for green financing
- Demonstrates ESG commitment

---

## Key Takeaways

1. **Your project timing is critical**: It goes operational just as CBAM Phase 2 begins (Jan 2026)

2. **Total CBAM liability**: ~€561,640 over 10 years (~₹47 Cr equivalent)

3. **Largest contributors**:
   - Electricity: 75% of operational emissions
   - Concrete: 60% of embodied emissions
   - Steel: 28% of embodied emissions

4. **Best mitigation**: Low-carbon cement + renewable electricity
   - Combined cost: €27-39k
   - CBAM savings: €203k+ (breakeven in 1.5-2 years)

5. **Compliance starts now**: Track all imported materials, energy sources, and chemical suppliers

---

## Further Resources

- **EU CBAM Official**: https://taxation-customs.ec.europa.eu/customs/customs-duties/cbam_en
- **CBAM Calculator**: http://localhost:3000/cbam-calculator
- **Carbon Factors**: GET `/api/cbam/factors`
- **Your Project Analysis**: POST `/api/cbam/calculate`

---

**Next Steps for Your Project:**

1. Review CBAM calculator results
2. Engage suppliers for low-carbon alternatives
3. Negotiate renewable energy PPA with utilities
4. Update project budget to reflect CBAM costs
5. Document compliance requirements
6. Plan offset strategy implementation

---

**Document Version**: 1.0
**Last Updated**: January 2024
**System**: AQUANTIS STP BOQ + CBAM Calculator Integration
