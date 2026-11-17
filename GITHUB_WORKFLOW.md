# SkyWings School ERP — GitHub Collaboration & Synchronization Guide

This document establishes the official Git & GitHub collaboration workflow for the **SkyWings School ERP** project. It enables multiple developers to collaborate simultaneously on the same repository without code loss, race conditions, or merge conflicts.

---

## 1. Repository Configuration & Setup

### Repository Details
- **Project Name:** Skywings School ERP (`client/` + `server/`)
- **Primary Remote:** `origin`
- **Remote URL:** `https://github.com/Ashutosh1702/skywings-school-emp.git`
- **Default Branch:** `main`

> **Note on Remote URL:** If your GitHub repository is named `skywings-school-erp` instead of `skywings-school-emp`, you can update the remote URL anytime with:
> ```bash
> git remote set-url origin https://github.com/Ashutosh1702/skywings-school-erp.git
> ```

---

## 2. GitHub Access & Permissions (Required Once)

Before both developers can push and pull code, ensure repository access is granted:

### Step 1: Invite Your Teammate as a Collaborator
1. Open GitHub in your browser and navigate to:  
   `https://github.com/Ashutosh1702/skywings-school-emp` (or your repository page).
2. Click **Settings** (tab on the top right of the repository).
3. In the left sidebar, click **Collaborators** (under *Access*).
4. Click the green **Add people** button.
5. Enter your teammate's GitHub username or email address and click **Add <user> to this repository**.
6. **Teammate action:** Your teammate must open the invitation email (or visit the repository URL on GitHub) and click **Accept invitation**.

### Step 2: GitHub Authentication on Windows
If Windows prompts for GitHub credentials during push/pull:
- **Option A (Recommended — Git Credential Manager):** When prompted in the browser/dialog, sign in with your GitHub account. Windows Credential Manager will securely cache the authentication token.
- **Option B (Personal Access Token - PAT):**
  1. On GitHub, go to **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
  2. Generate a token with the **`repo`** scope checked.
  3. When Git prompts for your password in the terminal, paste this PAT instead of your account password.

---

## 3. Daily Developer Synchronization Commands

Whenever you work on the project, follow this standard cycle:

```
┌───────────────────────────────────────────────┐
│ 1. git pull origin main (Start of work)       │
│                                               │
│ 2. Make code edits & verify locally           │
│                                               │
│ 3. git add .                                  │
│                                               │
│ 4. git commit -m "Clear descriptive message"  │
│                                               │
│ 5. git push origin main (Share with teammate) │
└───────────────────────────────────────────────┘
```

### The 4 Essential Commands:

#### 1. Pull Latest Changes Before Working
Always fetch and integrate changes made by your teammate before editing:
```bash
git pull origin main
```
*Why:* Prevents conflicts by ensuring you are building on top of the latest teammate commits.

#### 2. Stage Your Modified Files
Stage your changes for the next commit:
```bash
git add .
```
*Why:* Prepares modified, added, and deleted files for committing. Thanks to `.gitignore`, `node_modules` and `.env` files are automatically excluded.

#### 3. Commit with a Clear Message
Save your staged snapshot with an informative message:
```bash
git commit -m "feat(attendance): add bulk roll call validation"
```
*Tip:* Use conventional prefixes like `feat:`, `fix:`, `docs:`, or `refactor:`.

#### 4. Push Your Changes to GitHub
Upload your commits so your teammate can access them:
```bash
git push origin main
```

---

## 4. How Your Teammate Synchronizes (Pulling Your Latest Code)

After you push changes to GitHub, your teammate pulls the updates into their local copy:

### Scenario A: Clean Working Directory (Standard Case)
If your teammate has no pending uncommitted edits:
```bash
# 1. Pull the new commits from GitHub
git pull origin main

# 2. If new npm packages were added, update dependencies
cd client
npm install
cd ../server
npm install
```

### Scenario B: Teammate Has Uncommitted Local Work
If your teammate has uncommitted changes that they are not ready to commit yet:
```bash
# 1. Temporarily shelf local changes
git stash

# 2. Pull latest commits from GitHub
git pull origin main

# 3. Re-apply the shelved local work
git stash pop
```

---

## 5. Recommended Feature Branch Workflow (Best Practice)

When both developers work on different features at the same time, working directly on `main` can lead to overlapping edits. Using **feature branches** prevents any collisions:

```
 main ───────────────────────────────────────────────►
        \                                   / (Pull Request / Merge)
         └─── feature/timetable-matrix ────┘
```

### Creating and Merging a Feature Branch:
1. **Create and switch to a new branch:**
   ```bash
   git checkout -b feature/timetable-matrix
   ```
2. **Work and commit on your branch:**
   ```bash
   git add .
   git commit -m "feat(timetable): add teacher conflict detection"
   ```
3. **Push the branch to GitHub:**
   ```bash
   git push origin feature/timetable-matrix
   ```
4. **Create a Pull Request (PR) on GitHub:**
   - Go to GitHub repository page.
   - Click **Compare & pull request**.
   - Your teammate reviews the changes and clicks **Merge pull request**.
5. **Update your local `main` branch:**
   ```bash
   git checkout main
   git pull origin main
   ```

---

## 6. Resolving Merge Conflicts Safely

If both developers edit the same file and line simultaneously, Git will pause the merge and highlight the conflict:

```
<<<<<<< HEAD (Your local changes)
const API_URL = "http://localhost:5000/api";
=======
const API_URL = process.env.VITE_API_URL || "http://localhost:5000/api";
>>>>>>> origin/main (Teammate's pushed changes)
```

### Safe Steps to Resolve:
1. **Never use force push (`git push -f`)** — it can permanently overwrite your teammate's work.
2. Open the conflicted file in VS Code / Antigravity IDE.
3. Review both changes and choose **Accept Current Change**, **Accept Incoming Change**, or combine both.
4. Delete conflict marker lines (`<<<<<<<`, `=======`, `>>>>>>>`).
5. Run tests or start the dev server to verify both modules function properly:
   ```bash
   cd client && npm run build
   ```
6. Stage and finalize the resolved merge:
   ```bash
   git add .
   git commit -m "merge: resolve conflicts between main and teammate changes"
   git push origin main
   ```

---

## 7. Security & Environment Protection Rules

To protect the production security of SkyWings School ERP:

1. **NEVER commit environment secrets or API keys:**
   - `server/.env` and `client/.env` contain sensitive secrets like `JWT_SECRET` and `MONGO_URI`.
   - These are strictly excluded by the project `.gitignore`.
   - Never use `git add -f .env` to override the ignore rules.
2. **Use `.env.example` for team onboarding:**
   - Whenever you add a new environment variable (e.g. `SMTP_HOST`), add a dummy placeholder to `server/.env.example` and commit that instead.
   - Your teammate can then copy the new variable into their local `.env`.
3. **Never commit `node_modules`:**
   - Both `client/node_modules` and `server/node_modules` are excluded.
   - Only commit changes to `package.json` and `package-lock.json`.

---

## 8. Summary Checklist for Team Synchronization

| Action | Developer 1 (You) | Developer 2 (Teammate) |
| :--- | :--- | :--- |
| **Start of day** | `git pull origin main` | `git pull origin main` |
| **New dependency added** | Run `npm install`, commit `package.json` | Run `git pull origin main` then `npm install` |
| **Ready to share work** | `git add .` → `git commit -m "..."` → `git push origin main` | Notified by team / pulls updates |
| **Pulling updates** | Notify teammate after push | `git pull origin main` |
| **Before major feature** | `git checkout -b feature/name` | `git checkout -b feature/name` |

