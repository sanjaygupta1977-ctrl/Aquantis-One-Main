# 🎨 SIDEBAR - VISUAL QUICK REFERENCE

## Left Sidebar Icon Guide

When you open VS Code, you'll see these icons on the left:

```
 █  ← This is your sidebar
 █
 █
```

From top to bottom:

### Row 1: 📄 EXPLORER (Click or Ctrl+B)
```
┌─────────────────┐
│ 📁 Explorer     │ ← All files & folders
│ 📚 Outline      │ ← Document outline
│ 🔽 Timeline     │ ← File history
└─────────────────┘
```

### Row 2: 🔍 SEARCH (Click or Ctrl+Shift+F)
```
┌─────────────────┐
│ 🔍 Search       │ ← Find across all files
│ 🔄 Replace      │ ← Find & replace
│ 🏷️  Scopes      │ ← Search filters
└─────────────────┘
```

### Row 3: 🌳 SOURCE CONTROL (Click or Ctrl+Shift+G)
```
┌─────────────────┐
│ 📊 Changes      │ ← Modified files
│ 🔀 Branches     │ ← Git branches
│ 📝 History      │ ← Commit history
└─────────────────┘
```

### Row 4: ▶️ RUN & DEBUG (Click or Ctrl+Shift+D)
```
┌─────────────────┐
│ ▶️ Start Debug   │ ← Click play button
│ 📍 Breakpoints  │ ← Set breakpoints
│ 📊 Variables    │ ← Inspect values
└─────────────────┘
```

### Row 5: 📦 EXTENSIONS (Click or Ctrl+Shift+X)
```
┌─────────────────┐
│ 📦 Installed    │ ← Your extensions
│ ⭐ Popular     │ ← Trending extensions
│ 💡 Recommended  │ ← Workspace suggested
└─────────────────┘
```

### Row 6: 💬 CHAT (If GitHub Copilot installed)
```
┌─────────────────┐
│ 💬 Ask Copilot  │ ← AI code assistant
│ 💡 Help         │ ← Code suggestions
└─────────────────┘
```

---

## 📂 Sidebar Content When Expanded

```
📦 AQUANTIS-STP-BOQ
│
├─ 📄 10_MLD_MBR_STP_DPR.md           [Click to open]
├─ 📄 START_HERE.md                   [Click to open]
├─ 📄 VS_CODE_SIDEBAR_SETUP.md       [Click to open]
├─ 📄 VS_CODE_SETUP_GUIDE.md         [Click to open]
├─ 📄 SIDEBAR_GUIDE.md               [Click to open]
├─ 📄 STP_BOQ_DOCUMENTATION.md       [Click to open]
├─ 📄 STP_BOQ_QUICK_REFERENCE.md     [Click to open]
├─ 📄 PROJECT_COMPLETE.md            [Click to open]
│
├─ 📁 backend/                        [Click arrow to expand]
│  └─ 📁 src/
│     ├─ 📁 routes/
│     │  ├─ 📄 stpCivilBOQ.js        [✅ Complete]
│     │  ├─ 📄 stpMechanicalBOQ.js   [✅ Complete]
│     │  ├─ 📄 stpElectricalBOQ.js   [✅ Complete]
│     │  ├─ 📄 stpInstrumentationBOQ.js [✅ Complete]
│     │  ├─ 📄 stpChemicalBOQ.js     [✅ Complete]
│     │  └─ 📄 stpMasterLinking.js   [✅ Complete]
│     ├─ 📄 index.js                 [Backend entry]
│     └─ 📄 db.js                    [Database config]
│
├─ 📁 src/                           [Click arrow to expand]
│  └─ 📁 pages/
│     ├─ 📄 STPCivilBOQ.tsx          [✅ Live]
│     ├─ 📄 STPMechanicalBOQ.tsx     [✅ Live]
│     ├─ 📄 STPElectricalBOQ.tsx     [⏳ Template]
│     ├─ 📄 STPInstrumentationBOQ.tsx [⏳ Template]
│     ├─ 📄 STPChemicalBOQ.tsx       [⏳ Template]
│     └─ 📄 App.tsx                  [Routes]
│
├─ 📁 components/
│  └─ 📄 LinkedFilesSection.tsx      [Reusable component]
│
├─ 📄 docker-compose.yml             [All services config]
├─ 📄 Dockerfile                     [Backend image]
├─ 📄 Dockerfile.frontend            [Frontend image]
├─ 📄 .env                           [Environment variables]
│
├─ 📁 .vscode/                       [IDE configuration]
│  ├─ 📄 settings.json              [VS Code settings]
│  ├─ 📄 launch.json                [7 debug configs]
│  ├─ 📄 tasks.json                 [16 tasks]
│  └─ 📄 extensions.json            [22 recommended]
│
└─ 📄 Aquantis-STP-BOQ.code-workspace [Workspace file]
```

---

## 🖱️ Mouse Actions on Sidebar Items

### On a **FILE**:
```
📄 example.md
│
├─ Single Click    → Preview in editor (gray tab)
├─ Double Click    → Open permanently (white tab)
├─ Right Click     → Context menu:
│  ├─ Open
│  ├─ Open with...
│  ├─ Cut
│  ├─ Copy
│  ├─ Paste
│  ├─ Delete
│  └─ Rename
│
└─ Drag & Drop     → Reorder in sidebar
```

### On a **FOLDER**:
```
📁 backend/
│
├─ Single Click    → Select folder
├─ Click Arrow (▶) → Expand/collapse contents
├─ Double Click    → Expand
├─ Right Click     → Context menu:
│  ├─ New File
│  ├─ New Folder
│  ├─ Cut
│  ├─ Copy
│  ├─ Paste
│  ├─ Delete
│  └─ Rename
│
└─ Drag & Drop     → Move folder
```

---

## ⌨️ Keyboard + Mouse Combinations

```
Ctrl + Click       → Open file in new tab
Shift + Click      → Open file in split editor (side by side)
Alt + Click        → Open file in another column
Ctrl + Shift + P   → Command palette (search anything)
Right Click        → Context menu (cut, copy, paste, etc)
```

---

## 🎯 Quick Click Path Examples

### To View Civil BOQ Backend Code:
```
1. Click 📁 backend/     (expand it)
2. Click 📁 src/         (expand it)
3. Click 📁 routes/      (expand it)
4. Click 📄 stpCivilBOQ.js  (opens in editor)
```

### To View Civil BOQ Frontend Code:
```
1. Click 📁 src/              (expand it)
2. Click 📁 pages/            (expand it)
3. Click 📄 STPCivilBOQ.tsx   (opens in editor)
```

### To Read Complete Project Report:
```
1. Find 📄 10_MLD_MBR_STP_DPR.md at top of sidebar
2. Double click to open
3. Use scroll to read all sections
```

### To Run a Task:
```
1. Press Ctrl+Shift+P        (Command Palette opens)
2. Type "run task"           (filters to task commands)
3. Select your task          (e.g., "Docker: Build & Deploy")
4. Press Enter               (task runs in terminal)
```

---

## 📍 Key Locations at a Glance

| Item | Click Path | Purpose |
|------|-----------|---------|
| **Civil API** | `backend/src/routes/stpCivilBOQ.js` | Backend endpoint |
| **Civil UI** | `src/pages/STPCivilBOQ.tsx` | Frontend form |
| **Mechanical API** | `backend/src/routes/stpMechanicalBOQ.js` | Backend endpoint |
| **Mechanical UI** | `src/pages/STPMechanicalBOQ.tsx` | Frontend form |
| **Master Link** | `backend/src/routes/stpMasterLinking.js` | Aggregates all 5 BOQs |
| **Main App** | `src/pages/App.tsx` | All routes defined |
| **Config** | `docker-compose.yml` | Services setup |
| **Database** | `.vscode/tasks.json` → "Database: Open Shell" | PostgreSQL access |
| **Logs** | `.vscode/tasks.json` → "Backend: View Logs" | Debug output |
| **Project Report** | `10_MLD_MBR_STP_DPR.md` | Complete DPR |
| **Documentation** | `START_HERE.md` | Master index |

---

## 🎮 Typical Day Workflow

```
Morning:
├─ Open workspace: code ./Aquantis-One-main/Aquantis-STP-BOQ.code-workspace
├─ Click 📄 START_HERE.md to review schedule
├─ Click 📄 10_MLD_MBR_STP_DPR.md to check specs
└─ Run Task: "Docker: Build & Deploy" (Ctrl+Shift+P)

Midday - Develop Feature:
├─ Open file: backend/src/routes/stpCivilBOQ.js
├─ Make changes
├─ Run Debug: "Backend: Node.js Debugger"
├─ Test API
├─ Open: src/pages/STPCivilBOQ.tsx
├─ Update React component
├─ Browser refresh to test

Evening:
├─ View logs: Task → "Backend: View Logs"
├─ Check git status: Ctrl+Shift+G
├─ Commit changes
├─ Stop services: Task → "Docker: Stop All"
```

---

## 🔧 Common Sidebar Tasks

### Need to Edit Database?
```
1. .vscode/tasks.json → Double-click
2. Open task definitions
3. Or use Command Palette:
   - Ctrl+Shift+P
   - Type "Database: Open Shell"
   - Press Enter
   - Now you're in PostgreSQL terminal
```

### Need to Run a Command?
```
1. Press Ctrl+Shift+P         (Command Palette)
2. Type first few letters     (e.g., "docker" or "lint")
3. See matching commands      (filtered list)
4. Press Enter to run         (check terminal for output)
```

### Need to Find Something?
```
1. Press Ctrl+Shift+F         (Find in files)
2. Type search term           (e.g., "RCC Grade")
3. See all matches            (across all files)
4. Click a match              (opens file & highlights)
```

### Need to Compare Two Files?
```
1. Right-click file 1         (Select for Compare)
2. Right-click file 2         (Compare with Selected)
3. Two-column view opens      (side by side diff)
```

---

## 🎨 Customizing the Sidebar

### Change Sidebar Location:
```
1. Ctrl+Shift+P
2. Type "Sidebar: Toggle Side Bar Location"
3. Choose Left or Right
```

### Hide Specific Files:
```
1. Settings (Ctrl+,)
2. Search "files.exclude"
3. Add patterns like "**/node_modules"
4. Restart VS Code
```

### Change File Icons:
```
1. Extensions (Ctrl+Shift+X)
2. Search "icon theme"
3. Install "Material Icon Theme"
4. Choose it as default
```

### Change Color Theme:
```
1. Ctrl+Shift+P
2. Type "Preferences: Color Theme"
3. Choose from list (e.g., "One Dark Pro")
4. Theme applies instantly
```

---

## ✅ Sidebar Checklist

When you first open VS Code, verify:

- [ ] Sidebar visible on left side
- [ ] 📄 Documentation files at top (easy to read)
- [ ] 📁 backend/ folder expandable
- [ ] 📁 src/ folder expandable
- [ ] 📁 .vscode/ folder visible
- [ ] Files have colored icons (Prettier, ESLint, Docker)
- [ ] Can see file status (modified = orange dot)
- [ ] Can see git status (added, changed, deleted)
- [ ] Terminal opens with Ctrl+`
- [ ] Run & Debug shows dropdown with 7 options

---

## 🆘 Sidebar Not Working?

### Issue: Sidebar Hidden
**Solution:** Press Ctrl+B to toggle

### Issue: Files Showing Odd Icons
**Solution:** Restart VS Code or reinstall Material Icon Theme

### Issue: Can't See Subfolders
**Solution:** Click the triangle/arrow icon next to folder name

### Issue: Tasks Not Showing
**Solution:** Verify `.vscode/tasks.json` exists, then reload window (Ctrl+Shift+P → Reload)

### Issue: Terminal Not Responding
**Solution:** Click X to close terminal, press Ctrl+` to open new one

---

## 🎓 Learning Resources

**VS Code Sidebar Help:**
- Press F1 or click Help icon (?) in sidebar
- Choose "Welcome" to see interactive guide
- Or go to https://code.visualstudio.com/docs/getstarted/userinterface

**Project Help:**
- Read START_HERE.md
- Read VS_CODE_SETUP_GUIDE.md
- Read 10_MLD_MBR_STP_DPR.md

---

## 🎉 You're Ready!

Your sidebar is fully organized and ready to use.

**Start exploring:**
```
1. Open: code ./Aquantis-One-main/Aquantis-STP-BOQ.code-workspace
2. Click files in sidebar to view them
3. Run tasks with Ctrl+Shift+P
4. Happy coding! 🚀
```

---

*Last Updated: 2024*
*Workspace: AQUANTIS STP BOQ System*
*Fully Configured & Ready to Use*
