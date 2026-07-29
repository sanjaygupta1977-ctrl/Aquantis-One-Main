# ✅ VS CODE SIDEBAR - COMPLETE SETUP

## 🎉 What's Been Added

Your VS Code workspace now has a **fully organized sidebar** with:

✅ Enhanced workspace configuration
✅ Professional settings & extensions
✅ 16 pre-configured tasks
✅ 7 debug configurations
✅ Integrated terminal shortcuts
✅ Docker integration
✅ Database shortcuts

---

## 📂 New Files Created

```
.vscode/
├─ settings.json          ← IDE settings (formatting, colors, etc)
├─ extensions.json        ← Recommended extensions to install
├─ launch.json            ← Debug configurations (7 options)
└─ tasks.json             ← Tasks (16 shortcuts)

SIDEBAR_GUIDE.md           ← How to use the sidebar
Aquantis-STP-BOQ.code-workspace (updated)
```

---

## 🚀 Getting Started

### Step 1: Open Workspace
```bash
code ./Aquantis-One-main/Aquantis-STP-BOQ.code-workspace
```

### Step 2: Install Recommended Extensions
1. Click the **Extensions** icon in sidebar (Ctrl+Shift+X)
2. Click **Show Recommended Extensions**
3. Click **Install All** (blue button)

Extensions included:
- 🎨 Prettier (auto-format code)
- ✅ ESLint (code quality)
- 🐳 Docker (container management)
- 🎨 Material Icon Theme (icons)
- 📊 GitLens (git history)
- 🤖 GitHub Copilot (AI code assist)
- 📞 REST Client (API testing)
- And 8 more...

### Step 3: Start Docker
**Option A: Command Palette**
- Press **Ctrl+Shift+P**
- Type: `Docker: Build & Deploy`
- Press Enter

**Option B: Terminal**
```bash
docker-compose up -d
```

### Step 4: View the Running System
- **Frontend**: http://localhost:3000/stp-civil-boq
- **Backend**: http://localhost:5000/api/health
- **Database**: In VS Code terminal

---

## 📋 Quick Access Guide

### Left Sidebar Buttons (From Top to Bottom)

1. **📄 Explorer** (Ctrl+B)
   - All files & folders organized
   - Click to expand/collapse

2. **🔍 Search** (Ctrl+Shift+F)
   - Search code across entire project
   - Find all references

3. **🌳 Source Control** (Ctrl+Shift+G)
   - Git commands
   - View changes
   - Commit & push

4. **🚀 Run & Debug** (Ctrl+Shift+D)
   - **Launch configurations** (7 pre-built)
   - Click dropdown to select debug task
   - Click play button to start

5. **📦 Extensions** (Ctrl+Shift+X)
   - Install/manage extensions
   - View recommended extensions

6. **💬 Chat** (Ctrl+I)
   - GitHub Copilot chat (if installed)
   - Ask AI questions about code

---

## 🎯 16 Pre-Configured Tasks

### To Run a Task:
**Ctrl+Shift+P** → Type task name → Press Enter

**Docker Tasks:**
- 🐳 `Docker: Build & Deploy (Compose Up)` → Start all services
- ⛔ `Docker: Stop All (Compose Down)` → Stop all services
- 🔄 `Docker: Restart All Services` → Restart everything
- 🔧 `Backend: Restart Only` → Just backend
- 📱 `Frontend: Restart Only` → Just frontend

**View Logs:**
- 📊 `Backend: View Logs (Live)` → Stream backend logs
- 📊 `Frontend: View Logs (Live)` → Stream frontend logs
- 💾 `Database: Open Shell` → PostgreSQL terminal

**Build & Development:**
- 🏗️ `Frontend: Build Production` → Optimized build
- 📦 `NPM: Install Dependencies` → Install packages
- 🧪 `Frontend: Lint Code` → Check code quality

**System & Info:**
- 📊 `System: Show Docker Stats` → Container resource usage
- 📊 `System: Show All Containers` → List all containers
- 🧹 `System: Clean Docker (Prune)` → Free disk space
- ✅ `API Health Check` → Test backend connection

---

## 🎮 7 Debug Configurations

### To Debug:
**Ctrl+Shift+D** → Select from dropdown → Click play button (F5)

**Available Configs:**
1. 🚀 `Docker: Build & Deploy All Services` → Deploy everything
2. 🔧 `Backend: Node.js Debugger` → Debug backend code with breakpoints
3. 📱 `Frontend: React Dev Server` → Debug frontend with live reload
4. 💾 `Database: PostgreSQL Shell` → Direct database access
5. 🐳 `Backend: View Live Logs` → Stream backend logs
6. 🐳 `Frontend: View Live Logs` → Stream frontend logs
7. 📊 `All Containers: Status` → Show container status

**Compound Config:**
- 🎯 `Full Stack: All Services` → Start backend + frontend + logs all at once

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl+B** | Toggle sidebar |
| **Ctrl+P** | Quick file search |
| **Ctrl+Shift+P** | Command palette (tasks, extensions, etc) |
| **Ctrl+Shift+F** | Find across all files |
| **Ctrl+Shift+G** | Source control (git) |
| **Ctrl+Shift+X** | Extensions |
| **Ctrl+Shift+D** | Debug/Run |
| **Ctrl+`** | Open/close terminal |
| **F5** | Start debug (from Run & Debug) |
| **Ctrl+Shift+B** | Run default build task |

---

## 💻 IDE Settings Configured

### Formatting
- ✅ Auto-format on save (Prettier)
- ✅ 2-space indentation
- ✅ Single quotes preferred
- ✅ 100 character line width

### Code Quality
- ✅ ESLint enabled
- ✅ TypeScript path resolution
- ✅ Error squiggles shown

### Explorer
- ✅ Sort by files first
- ✅ Compact folders disabled (shows all)
- ✅ Auto-reveal selected file
- ✅ Decorations enabled (git status)

### Terminal
- ✅ Default shell (PowerShell on Windows, bash on Linux/Mac)
- ✅ Font size 13px
- ✅ Integrated into editor

### Files Excluded from Sidebar
- node_modules/ (hidden)
- .git/ (hidden)
- .DS_Store (hidden)
- .env.local (hidden)
- dist/ (shown for inspection)

---

## 📚 Documentation Structure in Sidebar

When you open the workspace, your sidebar shows:

```
📦 AQUANTIS-STP-BOQ
├─ 📚 Documentation (at top level, easy to find)
│  ├─ ⭐ START_HERE.md                    ← Read this first!
│  ├─ 📋 10_MLD_MBR_STP_DPR.md           ← Complete project report
│  ├─ 📖 VS_CODE_SETUP_GUIDE.md          ← Development guide
│  ├─ 🔧 SIDEBAR_GUIDE.md                ← This file
│  ├─ ⚡ STP_BOQ_QUICK_REFERENCE.md       ← API examples
│  └─ [15 more documentation files]
│
├─ 🔧 backend/                           ← All backend routes here
│  └─ src/routes/                        ← 6 BOQ modules
│     ├─ stpCivilBOQ.js
│     ├─ stpMechanicalBOQ.js
│     ├─ stpElectricalBOQ.js
│     ├─ stpInstrumentationBOQ.js
│     ├─ stpChemicalBOQ.js
│     └─ stpMasterLinking.js
│
├─ 📱 src/pages/                         ← React components
│  ├─ STPCivilBOQ.tsx                    ✅ Live
│  ├─ STPMechanicalBOQ.tsx               ✅ Live
│  ├─ STPElectricalBOQ.tsx               ⏳ Template ready
│  └─ [3 more templates]
│
├─ 🐳 docker-compose.yml                 ← All services
├─ 🔒 .env                               ← Environment variables
└─ .vscode/                              ← IDE configuration
   ├─ settings.json
   ├─ launch.json
   ├─ tasks.json
   └─ extensions.json
```

---

## 🔥 Power User Tips

### Open Multiple Editors
- Split editor: Right-click file → "Open to the Side" (Ctrl+Enter)
- Compare files: Right-click → "Select for Compare", then right-click another → "Compare with Selected"

### Search Like a Pro
- Find all references: Right-click variable → "Find All References"
- Replace in file: Ctrl+H
- Replace in all files: Ctrl+Shift+H with regex enabled

### Terminal Power
- Open new terminal: Ctrl+Shift+` 
- Split terminal: Click + icon in terminal
- Kill terminal: Click X in terminal tab

### Git with VS Code
- View all changes: Ctrl+Shift+G → Click files
- Stage/unstage: Click +/- icons
- Commit: Type message → Ctrl+Enter
- Push: Ctrl+Shift+P → "Git: Push"

### Debug with Breakpoints
1. Open backend file (e.g., `stpCivilBOQ.js`)
2. Click line number to set breakpoint (red dot)
3. Run debug config: **Backend: Node.js Debugger**
4. Use Variables panel to inspect
5. Step Over/Into/Out with toolbar buttons

---

## ✅ Verification Checklist

After opening the workspace, verify:

- [ ] Sidebar visible on left with folders
- [ ] Documentation files visible at top
- [ ] Can expand backend/src/routes/
- [ ] Can expand src/pages/
- [ ] Extensions icon shows "22 Recommended"
- [ ] Terminal opens with Ctrl+`
- [ ] Command Palette opens with Ctrl+Shift+P
- [ ] Can see "Run and Debug" options
- [ ] Can see task options (Ctrl+Shift+P → "Run Task")
- [ ] Git/Source Control showing on left

---

## 🆘 Troubleshooting

### Sidebar Not Showing?
- Press **Ctrl+B** to toggle
- Or click hamburger menu (three lines, top-left)

### Extensions Not Installing?
- Restart VS Code after install
- Check internet connection
- Try installing one at a time

### Tasks Not Appearing?
- Make sure workspace is open (not just folder)
- Verify `.vscode/tasks.json` exists
- Reload VS Code: Ctrl+Shift+P → "Developer: Reload Window"

### Docker Tasks Failing?
- Verify Docker Desktop is running
- Run `docker --version` in terminal
- Check `docker-compose.yml` is in project root

### Can't Find a Task?
- Type task name in Command Palette (Ctrl+Shift+P)
- Or click **Run & Debug** on sidebar → Select from dropdown

---

## 🎓 Learning Path

1. **New to VS Code?**
   - Read: **VS_CODE_SETUP_GUIDE.md**
   - Watch: Quick YouTube tutorial on VS Code basics

2. **New to the Project?**
   - Read: **START_HERE.md** (master index)
   - Read: **10_MLD_MBR_STP_DPR.md** (project details)
   - Read: **STP_BOQ_DOCUMENTATION.md** (technical specs)

3. **Ready to Code?**
   - Open backend file: Click `backend/src/routes/stpCivilBOQ.js`
   - Understand the API route
   - Open frontend file: Click `src/pages/STPCivilBOQ.tsx`
   - Understand the React component
   - Make a small change and test

4. **Debug Like a Pro?**
   - Set breakpoint in backend code
   - Run **Backend: Node.js Debugger** from Run & Debug
   - Make API request from frontend
   - Inspect variables in debugger

---

## 📞 Support Resources

- **VS Code Docs**: https://code.visualstudio.com/docs
- **React Docs**: https://react.dev
- **Node.js Docs**: https://nodejs.org/docs
- **Docker Docs**: https://docs.docker.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

**You're all set!** 🎉

**Start by opening the workspace and exploring the sidebar. Everything is organized and ready to go!**

```bash
code ./Aquantis-One-main/Aquantis-STP-BOQ.code-workspace
```

---

*Last Updated: 2024*
*Workspace: AQUANTIS STP BOQ System*
*Ready for Development!*
