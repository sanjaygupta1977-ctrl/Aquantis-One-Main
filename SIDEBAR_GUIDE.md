# VS Code Sidebar Guide

## 📦 AQUANTIS-STP-BOQ Folder Structure

When you open the workspace in VS Code, you'll see this sidebar structure:

```
📦 AQUANTIS-STP-BOQ
│
├─ 📚 Documentation Files (START HERE!)
│  ├─ ⭐ START_HERE.md                       (Master Index)
│  ├─ 📋 10_MLD_MBR_STP_DPR.md              (Complete Project Report)
│  ├─ 📖 VS_CODE_SETUP_GUIDE.md             (Development Setup)
│  ├─ ⚡ STP_BOQ_QUICK_REFERENCE.md          (API Examples)
│  ├─ 📚 STP_BOQ_DOCUMENTATION.md           (Technical Details)
│  ├─ ✅ PROJECT_COMPLETE.md                (Completion Summary)
│  └─ [12 more deployment guides]
│
├─ 🔧 backend/
│  └─ src/
│     ├─ routes/
│     │  ├─ stpCivilBOQ.js                  ✅ Civil Works
│     │  ├─ stpMechanicalBOQ.js             ✅ Mechanical Equipment
│     │  ├─ stpElectricalBOQ.js             ✅ Electrical Systems
│     │  ├─ stpInstrumentationBOQ.js        ✅ Instrumentation
│     │  ├─ stpChemicalBOQ.js               ✅ Chemical & Consumables
│     │  ├─ stpMasterLinking.js             ✅ Master Linking (Aggregates all 5)
│     │  ├─ geoLinking.js                   ✅ Geographic Linking (50km)
│     │  ├─ moduleLinking.js                ✅ File Auto-Linking
│     │  └─ index.js                        ✅ All Routes Registered
│     └─ db.js                              ✅ Database Connection
│
├─ 📱 src/
│  └─ pages/
│     ├─ STPCivilBOQ.tsx                    ✅ LIVE - /stp-civil-boq
│     ├─ STPMechanicalBOQ.tsx               ✅ LIVE - /stp-mechanical-boq
│     ├─ STPElectricalBOQ.tsx               ⏳ Template Ready
│     ├─ STPInstrumentationBOQ.tsx          ⏳ Template Ready
│     ├─ STPChemicalBOQ.tsx                 ⏳ Template Ready
│     ├─ App.tsx                            ✅ Routes Configured
│     └─ [35 other modules]
│
├─ components/
│  └─ LinkedFilesSection.tsx                ✅ Reusable Component
│
├─ 🐳 docker-compose.yml                    ✅ All Services Configured
├─ 🐋 Dockerfile (backend)                  ✅ Node.js Backend
├─ 🐋 Dockerfile (frontend)                 ✅ React Frontend
│
└─ 💾 Database Tables (Auto-Created)
   ├─ stp_civil_boq                         (35 columns)
   ├─ stp_mechanical_boq                    (85+ columns)
   ├─ stp_electrical_boq                    (77+ columns)
   ├─ stp_instrumentation_boq               (84+ columns)
   ├─ stp_chemical_boq                      (91+ columns)
   ├─ stp_master_linking                    (25+ columns - NEW!)
   ├─ geo_linked_data                       (Geographic linking)
   ├─ file_module_links                     (File linking)
   └─ thermal_power_plants                  (Thermal plant data)
```

---

## 🎯 Quick Navigation in VS Code

### Left Sidebar (Explorer View)

**Click to collapse/expand folders:**
- 📚 Documentation Files → Read in editor
- 🔧 backend/ → Modify API routes
- 📱 src/ → Edit React components
- 💾 Database → View schema

### Command Palette (Ctrl+Shift+P)

Search for these commands:
- `Docker: Build & Deploy` → Start all services
- `Docker: Stop` → Shut down containers
- `Frontend: Build` → Build React project
- `Backend: Restart` → Restart Node.js backend
- `Backend: View Logs` → Stream backend logs
- `Database: Connect` → Open PostgreSQL shell

### Run & Debug (Ctrl+Shift+D)

Click the play button or press F5 to launch:
- 🚀 Docker: Frontend → Start React dev server
- 🔧 Docker: Backend → Start Node.js debugger

---

## 📂 File Organization by Purpose

### To Understand the System
1. **START_HERE.md** ← Read first (overview)
2. **10_MLD_MBR_STP_DPR.md** ← Project details
3. **VS_CODE_SETUP_GUIDE.md** ← Development workflow

### To Develop Features
- **backend/src/routes/** → Add new BOQ modules or API endpoints
- **src/pages/** → Create/modify frontend pages
- **src/components/** → Build reusable UI components

### To Test APIs
- Open Terminal (Ctrl + `)
- Run: `curl http://localhost:5000/api/health`
- Or use REST Client extension with `.rest` files

### To Debug
- Open Docker extension (Ctrl+Shift+A then "Docker")
- View running containers
- Click container → View logs
- Or use Terminal: `docker logs -f aquantis-backend`

---

## 🔥 Pro Tips

### Keyboard Shortcuts in VS Code
- **Ctrl+P** → Quick file search (type filename)
- **Ctrl+Shift+F** → Search across all files
- **Ctrl+`** → Open/close integrated terminal
- **Ctrl+B** → Toggle sidebar
- **F1** → Help & command palette

### Recommended Extensions (Already Listed)
1. **Prettier** (esbenp.prettier-vscode) → Auto-format code
2. **ESLint** (dbaeumer.vscode-eslint) → Code quality
3. **Docker** (ms-azuretools.vscode-docker) → Docker integration
4. **GitLens** (eamodio.gitlens) → Git history
5. **Thunder Client** or **REST Client** → API testing

### Workspace Settings
- Auto-format on save ✅
- TypeScript path resolution ✅
- Hide node_modules & .git ✅
- Explorer sorted by files first ✅

---

## 🚀 Typical Workflow

### Day 1: Setup
1. Open workspace: `code ./Aquantis-One-main/Aquantis-STP-BOQ.code-workspace`
2. Read `START_HERE.md` in editor
3. Read `10_MLD_MBR_STP_DPR.md` for project details
4. Follow `VS_CODE_SETUP_GUIDE.md`
5. Open Terminal & run: `docker-compose up -d`

### Day 2+: Development
1. **Explore API**: Click `backend/src/routes/stpCivilBOQ.js` → read the code
2. **Check Frontend**: Click `src/pages/STPCivilBOQ.tsx` → see React component
3. **Edit Feature**: Modify file → Prettier auto-formats
4. **Test**: Command Palette → `Docker: Build & Deploy`
5. **Debug**: View logs with `Backend: View Logs` task
6. **Database**: Use `Database: Connect` to query directly

### Commit & Push
- Terminal → `git add .`
- Terminal → `git commit -m "Feature: ..."`
- Terminal → `git push`

---

## 📊 API Routes Quick Reference

All routes accessible from backend files:

| Route | File | Purpose |
|-------|------|---------|
| `POST /api/stp-civil-boq/save` | `stpCivilBOQ.js` | Save civil BOQ |
| `POST /api/stp-mechanical-boq/save` | `stpMechanicalBOQ.js` | Save mechanical BOQ |
| `POST /api/stp-electrical-boq/save` | `stpElectricalBOQ.js` | Save electrical BOQ |
| `POST /api/stp-instrumentation-boq/save` | `stpInstrumentationBOQ.js` | Save instrumentation BOQ |
| `POST /api/stp-chemical-boq/save` | `stpChemicalBOQ.js` | Save chemical BOQ |
| `POST /api/stp-master-linking/create-linked-boq` | `stpMasterLinking.js` | Link all 5 BOQs |

---

## 🔗 Frontend Routes Quick Reference

| Path | File | Feature |
|------|------|---------|
| `/stp-civil-boq` | `STPCivilBOQ.tsx` | Civil works estimation ✅ LIVE |
| `/stp-mechanical-boq` | `STPMechanicalBOQ.tsx` | Mechanical equipment ✅ LIVE |
| `/stp-electrical-boq` | `STPElectricalBOQ.tsx` | Electrical systems ⏳ Ready |
| `/stp-instrumentation-boq` | `STPInstrumentationBOQ.tsx` | Instrumentation ⏳ Ready |
| `/stp-chemical-boq` | `STPChemicalBOQ.tsx` | Chemical & consumables ⏳ Ready |

---

## 💡 Common Tasks

### Add a New Frontend Page
1. Right-click `src/pages/` → New File → `PageName.tsx`
2. Copy structure from `STPCivilBOQ.tsx`
3. Modify component name & form fields
4. Add route in `src/pages/App.tsx`
5. Test: `npm run build` → `docker-compose up -d`

### Add a New Backend Route
1. Right-click `backend/src/routes/` → New File → `feature.js`
2. Copy structure from `stpCivilBOQ.js`
3. Define database table in `db.js`
4. Register route in `backend/src/routes/index.js`
5. Test: `curl http://localhost:5000/api/feature`

### Debug a Container
1. Command Palette → `Backend: View Logs`
2. Or: `docker logs -f aquantis-backend`
3. Or: Click container in Docker extension

### Query Database
1. Command Palette → `Database: Connect`
2. Or: `docker exec -it aquantis-postgres psql -U aquantis -d aquantis_db`
3. Run SQL: `SELECT * FROM stp_civil_boq LIMIT 5;`

---

## 🎯 Sidebar Customization

To customize the sidebar further:
1. Click **Settings** (bottom-left gear icon)
2. Search for "sidebar" or "explorer"
3. Toggle: **Explorer: Sort Order**, **Explorer: Decorations**, **Explorer: Auto Reveal**
4. Or edit `.vscode/settings.json` directly

---

## ✅ Verification Checklist

- [ ] Sidebar shows all folders and files
- [ ] Documentation files visible at top level
- [ ] Backend routes folder expandable
- [ ] Frontend pages folder expandable
- [ ] Command Palette shows Docker tasks
- [ ] Terminal opens with Ctrl+`
- [ ] Extensions installed (Docker, Prettier, ESLint)

---

**Start exploring your project in the sidebar!** 🚀
