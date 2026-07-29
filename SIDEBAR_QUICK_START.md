# 🚀 SIDEBAR QUICK START - 5 MINUTES

## ONE-MINUTE SETUP

```bash
# 1. Open the workspace
code ./Aquantis-One-main/Aquantis-STP-BOQ.code-workspace

# 2. Wait for VS Code to load (10 seconds)

# 3. You're done! Sidebar is ready.
```

---

## WHAT YOU'LL SEE

When VS Code opens, on the left side you'll see:

```
Left Icons:        Click This:
━━━━━━━━━━━        ━━━━━━━━━━━━━━━━━━
📄 Explorer     →  Ctrl+B (see all files)
🔍 Search       →  Ctrl+Shift+F (find text)
🌳 Git          →  Ctrl+Shift+G (version control)
▶️  Debug        →  Ctrl+Shift+D (run/debug)
📦 Extensions   →  Ctrl+Shift+X (install tools)
💬 Chat         →  GitHub Copilot (AI assist)
```

---

## WHAT TO DO NEXT (3 STEPS)

### Step 1: Install Extensions (30 seconds)
```
1. Click 📦 Extensions icon (or Ctrl+Shift+X)
2. Search for "Recommended"
3. Click "Install All"
4. Wait 1-2 minutes
```

### Step 2: Start Services (30 seconds)
```
1. Press Ctrl+Shift+P (opens Command Palette)
2. Type: docker build
3. Select: "Docker: Build & Deploy (Compose Up)"
4. Press Enter
5. Watch the terminal (takes 30 seconds)
```

### Step 3: Verify It Works (30 seconds)
```
1. Open browser
2. Go to: http://localhost:3000/stp-civil-boq
3. You should see the Civil BOQ form
4. Done! System is running.
```

---

## ESSENTIAL KEYBOARD SHORTCUTS

```
Ctrl+B            → Show/hide sidebar
Ctrl+P            → Search for a file (type filename)
Ctrl+Shift+P      → Run a task (type what you want)
Ctrl+Shift+F      → Find text anywhere
Ctrl+`            → Open terminal
Ctrl+Shift+X      → Extensions
Ctrl+Shift+D      → Debug
F5                → Start debug (if selected)
```

---

## WHERE THINGS ARE

| Item | Location | Click Path |
|------|----------|-----------|
| **Civil API** | Backend code | `backend/src/routes/stpCivilBOQ.js` |
| **Civil Form** | Frontend | `src/pages/STPCivilBOQ.tsx` |
| **All Docs** | Top of sidebar | `*.md` files |
| **Project Report** | Top of sidebar | `10_MLD_MBR_STP_DPR.md` |
| **Docker Config** | Root | `docker-compose.yml` |
| **Settings** | Hidden folder | `.vscode/settings.json` |
| **Tasks** | Hidden folder | `.vscode/tasks.json` |

---

## COMMON TASKS (COPY & PASTE)

### View Backend Logs
```
Ctrl+Shift+P  →  Type: "Backend: View Logs"  →  Enter
```

### Open Database Shell
```
Ctrl+Shift+P  →  Type: "Database: Open"  →  Enter
```

### Stop All Services
```
Ctrl+Shift+P  →  Type: "Docker: Stop"  →  Enter
```

### Search for Text
```
Ctrl+Shift+F  →  Type search term  →  Enter
```

### Format Code
```
Ctrl+Shift+P  →  Type: "Format"  →  Enter
```

### Run All Tests
```
Ctrl+Shift+P  →  Type: "Lint"  →  Enter
```

---

## WHICH FILE TO EDIT?

### I want to change the Civil BOQ form:
→ Edit: `src/pages/STPCivilBOQ.tsx`

### I want to change the Civil API:
→ Edit: `backend/src/routes/stpCivilBOQ.js`

### I want to add a new feature:
1. Check: `backend/src/routes/` for API structure
2. Copy an existing BOQ module
3. Modify for your feature
4. Register in: `backend/src/index.js`
5. Create React component in: `src/pages/`
6. Add route in: `src/pages/App.tsx`

### I want to read the project details:
→ Read: `10_MLD_MBR_STP_DPR.md`

### I want to understand the system:
→ Read: `START_HERE.md`

---

## DEBUG MODE (5 STEPS)

1. Open file you want to debug (e.g., `stpCivilBOQ.js`)
2. Click line number to set red breakpoint dot
3. Press **Ctrl+Shift+D** (open Debug panel)
4. Select **"Backend: Node.js Debugger"** from dropdown
5. Press **F5** (play button)
6. Your code will pause at breakpoint
7. Use Variables panel to inspect

---

## IF SOMETHING BREAKS

### System won't start?
```
1. Press Ctrl+Shift+P
2. Type: "Docker: Stop"
3. Type: "Docker: Build & Deploy"
```

### Can't find a file?
```
1. Press Ctrl+P
2. Type filename (e.g., "stpCivil")
3. Click result
```

### Terminal not responding?
```
1. Click X to close
2. Press Ctrl+` to open new one
```

### Extension won't install?
```
1. Restart VS Code
2. Try installing one at a time
3. Check internet connection
```

---

## FILES YOU MIGHT NEED

| File | Purpose | When to Read |
|------|---------|-------------|
| `START_HERE.md` | Master index | First thing |
| `10_MLD_MBR_STP_DPR.md` | Project report | To understand scope |
| `VS_CODE_SIDEBAR_SETUP.md` | Full setup guide | For detailed help |
| `SIDEBAR_VISUAL_GUIDE.md` | Visual reference | For screenshots |
| `STP_BOQ_DOCUMENTATION.md` | Technical specs | To understand APIs |
| `STP_BOQ_QUICK_REFERENCE.md` | API examples | To test endpoints |

---

## YOUR FIRST CHANGE (10 MINUTES)

### Goal: Change the form title

1. **Open file:**
   - Ctrl+P → Type `STPCivil` → Click `STPCivilBOQ.tsx`

2. **Find the title:**
   - Ctrl+F → Search: `Civil BOQ`
   - You'll see the form title

3. **Change it:**
   - Click the text
   - Type your new title
   - Ctrl+S to save

4. **Test it:**
   - Go to: http://localhost:3000/stp-civil-boq
   - You should see the new title!

---

## YOUR SECOND CHANGE (15 MINUTES)

### Goal: Add a new input field to the form

1. **Open React component:**
   - Ctrl+P → `STPCivilBOQ.tsx`

2. **Find where inputs are defined:**
   - Look for other input fields
   - Copy one

3. **Add your field:**
   - Paste below
   - Change the name & label
   - Ctrl+S to save

4. **Test it:**
   - Browser refresh
   - You should see the new field!

---

## 🎯 FINAL CHECKLIST

- [ ] Workspace opened
- [ ] Extensions installing (or installed)
- [ ] Docker services running
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:5000/api/health
- [ ] Can see all folders in sidebar
- [ ] Can run tasks (Ctrl+Shift+P)
- [ ] Can set breakpoints (click line number)
- [ ] Can view logs (Task → Backend Logs)

---

## 🎉 YOU'RE READY!

You have:
- ✅ Organized sidebar
- ✅ Quick-access tasks
- ✅ Debug tools
- ✅ Full documentation
- ✅ All code ready to modify

**Now go build something!** 🚀

---

**Next Steps:**
1. Read `SIDEBAR_VISUAL_GUIDE.md` (5 minutes)
2. Read `START_HERE.md` (10 minutes)
3. Start coding!

---

*Last Updated: 2024*
*Workspace: AQUANTIS STP BOQ System*
*Ready for Development*
