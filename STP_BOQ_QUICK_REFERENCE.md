# 🚀 STP BOQ Quick Reference - VS Code

## ⚡ Quick Start

### 1. Open in VS Code
```bash
# Option A: Open workspace
code Aquantis-One-main/Aquantis-STP-BOQ.code-workspace

# Option B: Open folder
code Aquantis-One-main/
```

### 2. Start Services
```bash
# Terminal in VS Code (Ctrl + `)
cd ./Aquantis-One-main
docker-compose up -d

# Check status
docker ps
```

### 3. Access URLs
```
Frontend:      http://localhost:3000
Backend API:   http://localhost:5000
Database:      localhost:5432 (postgres)

STP Civil BOQ:      http://localhost:3000/stp-civil-boq
STP Mechanical BOQ: http://localhost:3000/stp-mechanical-boq
```

---

## 📁 File Structure

```
Aquantis-One-main/
│
├── 📖 STP_BOQ_DOCUMENTATION.md          ← FULL DOCS
├── Aquantis-STP-BOQ.code-workspace      ← This workspace
│
├── 🔧 backend/src/
│   ├── routes/
│   │   ├── stpCivilBOQ.js               ← POST /api/stp-civil-boq/save
│   │   ├── stpMechanicalBOQ.js          ← POST /api/stp-mechanical-boq/save
│   │   ├── stpElectricalBOQ.js          ← POST /api/stp-electrical-boq/save
│   │   ├── stpInstrumentationBOQ.js     ← POST /api/stp-instrumentation-boq/save
│   │   ├── stpChemicalBOQ.js            ← POST /api/stp-chemical-boq/save
│   │   ├── stpMasterLinking.js          ← POST /api/stp-master-linking/create-linked-boq
│   │   ├── geoLinking.js                ← Geographic (50km radius)
│   │   ├── moduleLinking.js             ← File linking
│   │   └── index.js                     ← All routes registered
│   └── db.js
│
├── 📱 src/pages/
│   ├── STPCivilBOQ.tsx                  ✅ LIVE: /stp-civil-boq
│   ├── STPMechanicalBOQ.tsx             ✅ LIVE: /stp-mechanical-boq
│   ├── App.tsx                          ✅ Routes configured
│   └── [Others: 35+ water/energy modules]
│
└── docker-compose.yml
```

---

## 🎯 Development Tasks

### Add a New Frontend Page (Example: Electrical BOQ)

**Step 1: Create React Component**
```typescript
// src/pages/STPElectricalBOQ.tsx
import Layout from "../components/Layout";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API_BASE = "/api";

export default function STPElectricalBOQ() {
  const [stp, setStp] = useState({
    stp_id: `STP-ELEC-${Date.now()}`,
    stp_name: "STP Electrical Works",
    design_capacity_mld: 10,
    incoming_feeder_capacity_kva: 500,
    // ... add all electrical fields from stpElectricalBOQ.js
    earthing_pit_qty: 5,
    earthing_pit_depth_m: 2,
    earthing_pit_material: "RCC",
    contingency_percent: 10,
  });

  const [boq, setBoq] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setStp({ ...stp, [field]: value });
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/stp-electrical-boq/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stp),
      });
      const result = await response.json();
      if (result.success) {
        const boqData = await fetch(`${API_BASE}/stp-electrical-boq/${stp.stp_id}`).then(r => r.json());
        setBoq(boqData);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1>🔌 STP Electrical Works BOQ</h1>
        {/* Form fields */}
        {/* Results display */}
      </div>
    </Layout>
  );
}
```

**Step 2: Register Route in App.tsx**
```typescript
import STPElectricalBOQ from "./pages/STPElectricalBOQ";

// Add to <Routes>
<Route path="/stp-electrical-boq" element={<STPElectricalBOQ />} />
```

**Step 3: Build & Test**
```bash
npm run build
docker-compose restart backend
# Visit: http://localhost:3000/stp-electrical-boq
```

---

## 🔌 API Testing

### Test Civil BOQ
```bash
curl -X POST http://localhost:5000/api/stp-civil-boq/save \
  -H "Content-Type: application/json" \
  -d '{
    "stp_id": "STP-CIVIL-TEST-001",
    "stp_name": "Test STP Civil",
    "design_capacity_mld": 10,
    "treatment_type": "ASP",
    "inlet_chamber_m3": 50,
    "grit_chamber_m3": 120,
    "primary_settling_m3": 250,
    "aeration_tank_m3": 1500,
    "secondary_settling_m3": 400,
    "tertiary_filter_m3": 150,
    "chlorine_contact_m3": 80,
    "sludge_thickening_m3": 100,
    "sludge_dewatering_m3": 50,
    "rcc_grade": "M35",
    "rcc_unit_cost": 8500,
    "steel_grade": "Fe500",
    "steel_quantity_tons": 250,
    "steel_percentage": 1.5,
    "steel_unit_cost": 65000,
    "waterproofing_type": "Bituminous Membrane",
    "waterproofing_area_m2": 5000,
    "waterproofing_thickness_mm": 4,
    "waterproofing_unit_cost": 350,
    "epoxy_coating_area_m2": 3000,
    "epoxy_coating_unit_cost": 250,
    "concrete_flooring_area_m2": 2000,
    "concrete_flooring_unit_cost": 500,
    "contingency_percent": 7
  }'
```

### Test Master Linking
```bash
curl -X POST http://localhost:5000/api/stp-master-linking/create-linked-boq \
  -H "Content-Type: application/json" \
  -d '{
    "stp_id": "STP-MASTER-001",
    "stp_name": "Bangalore Central STP",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "design_capacity_mld": 10,
    "civil_boq_id": "STP-CIVIL-001",
    "mechanical_boq_id": "STP-MECH-001",
    "electrical_boq_id": "STP-ELEC-001",
    "instrumentation_boq_id": "STP-INST-001",
    "chemical_boq_id": "STP-CHEM-001"
  }'
```

### Retrieve Master STP
```bash
curl http://localhost:5000/api/stp-master-linking/STP-MASTER-001
```

---

## 🐛 Debugging

### View Backend Logs
```bash
docker logs -f aquantis-backend
```

### Restart Backend
```bash
docker-compose restart aquantis-backend
```

### Connect to Database
```bash
docker exec -it aquantis-postgres psql -U aquantis -d aquantis_db

# List STP BOQ tables
\dt stp_*

# Check civil BOQ records
SELECT stp_id, stp_name, final_civil_cost FROM stp_civil_boq;
```

### Clear & Rebuild
```bash
docker-compose down
docker system prune -a
docker-compose up -d
```

---

## 📊 Cost Formulas

### Civil BOQ
```
Total RCC Volume = inlet + grit + primary_settling + aeration + secondary_settling + 
                   tertiary + chlorine_contact + sludge_thickening + sludge_dewatering

RCC Cost = Total RCC Volume × RCC Unit Cost
Steel Cost = Steel Quantity (tons) × Steel Unit Cost
Waterproofing = Waterproofing Area × Unit Cost
Epoxy = Epoxy Area × Unit Cost
Flooring = Flooring Area × Unit Cost

Subtotal = RCC + Steel + Waterproofing + Epoxy + Flooring
Final Civil Cost = Subtotal × (1 + Contingency%)
```

### Mechanical BOQ
```
Total Power = Inlet Power + Grit Power + RAS Power + WAS Power + 
              Effluent Power + Blower Power

Pump Costs = (Inlet Qty × Cost) + (RAS Qty × Cost) + ... + (Effluent Qty × Cost)
Blower = Blower Qty × Blower Cost
Diffuser = Diffuser Qty × Cost
Membrane = Membrane Qty × Cost (SS 316 premium)
Piping = Piping Length × Unit Cost
Valves = Valve Qty × Unit Cost

Subtotal = All above
Final Mechanical Cost = Subtotal × (1 + Contingency%)
```

### Electrical BOQ
```
Cable Costs = Feeder Length × Cost + Power Cable Length × Cost + 
              Control Cable Length × Cost

Switchgear = Qty × Cost
Distribution Panels = Qty × Cost
Motors = Motor Qty × Cost + VFD Qty × Cost + Starter Qty × Cost
Lighting = LED Qty × Cost + Pole Qty × Cost
Earthing = (Pit Qty × Cost) + (Electrode Qty × Cost) + (Conductor Length × Cost)
Protection = (MCB Qty × Cost) + (ACB Qty × Cost) + (Surge Qty × Cost)

Subtotal = All above + Testing & Commissioning
Final Electrical Cost = Subtotal × (1 + Contingency%)
```

### Instrumentation BOQ
```
Sensors = DO + pH + ORP + TSS + Flow + Level + Pressure + Temp (all qty × cost)
Redundancy Cost = Sensor Cost × (Redundancy Percent/100)
Data Logger = Qty × Cost
SCADA = Software + Hardware + Integration
Calibration = Lab Equipment + Standards
Communication = Cable Length × Unit Cost
Installation = Installation + Integration + Commissioning

Subtotal = All above
Final Inst Cost = Subtotal × (1 + Contingency%)
```

### Chemical BOQ
```
Annual Operational Costs:
  Coagulant Annual = Annual Qty (tons) × Unit Cost
  Polyelectrolyte Annual = Qty × Cost
  Disinfectant Annual = Qty × Cost
  pH Chemical Annual = Qty × Cost
  Nutrient Annual = Qty × Cost
  Anti-Foam Annual = Qty × Cost
  Membrane Cleaning = (12 / Frequency) × Per Cycle Cost
  Waste Disposal = Annual Cost

Capital Equipment:
  Safety Enclosures = Qty × Cost
  PPE & Safety Devices = Total
  Dosing Pumps = (Diaphragm Qty × Cost) + (Peristaltic Qty × Cost) + (Rotary Qty × Cost)
  Mixing Tanks = Qty × Cost
  Piping = Length × Cost
  Labor & Training = Total

Total Capital = Equipment + Labor
Total Annual OPEX = All annual costs
Final Chemical Cost = Capital + Annual OPEX × Years
```

### Master Aggregation
```
TOTAL CAPEX = Civil + Mechanical + Electrical + Instrumentation
TOTAL OPEX (Annual) = Chemical + Other O&M
TOTAL PROJECT COST = CAPEX + (OPEX × Project Life)
```

---

## ✅ Checklist

### Completed
- ✅ 5 BOQ Backend Routes
- ✅ Civil BOQ Frontend
- ✅ Mechanical BOQ Frontend (SS 316 highlighted)
- ✅ Master Linking Backend
- ✅ Geographic Auto-linking (50km radius)
- ✅ File Auto-linking
- ✅ Database Tables (9 total)
- ✅ API Endpoints (20+)

### To Do
- ⏳ Electrical BOQ Frontend
- ⏳ Instrumentation BOQ Frontend
- ⏳ Chemical BOQ Frontend
- ⏳ Master Dashboard (aggregation view)
- ⏳ PDF/Excel Export
- ⏳ Multi-STP Comparison
- ⏳ ROI Calculator
- ⏳ Cost Tracking Over Time

---

## 📚 Resources

- **Full Documentation:** `STP_BOQ_DOCUMENTATION.md`
- **Frontend Templates:** `src/pages/STP*.tsx`
- **Backend Routes:** `backend/src/routes/stp*.js`
- **Database Schema:** Check `stpCivilBOQ.js` initTable functions
- **API Testing:** Use Postman or curl

---

## 🎓 Examples

### Create & Link Complete STP (10 MLD)
1. Create Civil BOQ → ₹70M
2. Create Mechanical BOQ → ₹100M (SS 316)
3. Create Electrical BOQ → ₹76M (5 earthing pits)
4. Create Instrumentation → ₹89M (redundancy)
5. Create Chemical BOQ → ₹36M capital + ₹0.3M/year
6. Master Link All 5 → Total CAPEX ₹370M

### Geographic Auto-Link Example
- STP at (12.97°N, 77.59°E)
- Auto-finds LULC-BNG-001 at 8km
- Auto-finds LULC-BNG-002 at 25km
- Auto-finds TPP-RAICHUR at 40km
- All links stored in master record

---

**🚀 Ready to code! Happy development!**
