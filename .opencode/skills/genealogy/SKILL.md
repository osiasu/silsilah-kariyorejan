# Genealogy Website Skill

Project-specific commands for Silsilah Kariyo Rejo genealogy website.

## Project Structure

```
silsilahkariyorejo/
├── index.html              # Home/family tree
├── introduction.html       # About page
├── dashboard.html          # Admin dashboard
├── request-list.html       # Requests management
├── misc.html               # Miscellaneous
├── attendance.html         # Attendance tracking
├── biography.html          # Biography pages
├── js/                     # JavaScript files
│   ├── scroll-animations.js
│   ├── menu.js
│   ├── cursor.js
│   ├── data.js
│   └── bio-magnet.js
├── css/                    # Stylesheets
│   ├── scroll-animations.css
│   ├── menu.css
│   └── cursor.css
├── .github/workflows/       # Deployment automation
└── .opencode/skills/        # Agent skills
```

## Theme System

Theme stored in `localStorage` key: `trah_theme`
- Values: `light` or `dark`
- Applied via JavaScript on page load

## Common Tasks

### Add New Page
1. Create `newpage.html` in root
2. Add navigation links in all pages
3. Include theme toggle script
4. Add Supabase placeholders if needed
5. Test locally: `python3 -m http.server 8000`

### Update Styles
1. Edit files in `css/` directory
2. Test across all pages
3. Verify both light/dark themes

### Add JavaScript Feature
1. Edit/create file in `js/` directory
2. Include script tag in relevant HTML (e.g., `src="js/filename.js"`)
3. Test functionality
4. Check console for errors

### Credential Management
Always use placeholders (injected at deploy time):
```javascript
const supabaseUrl = '__SUPABASE_URL__';
const supabaseKey = '__SUPABASE_KEY__';
const adminPin = '__ADMIN_PIN__';
const guestPin = '__GUEST_PIN__';
```

## Deployment

### GitHub Actions Workflow
- **Trigger**: Every push to `main`
- **Manual trigger**: Workflow dispatch from Actions tab

### Credential Injection
| Placeholder | Source | Type |
|-------------|--------|------|
| `__SUPABASE_URL__` | GitHub Variables | Variable |
| `__SUPABASE_KEY__` | GitHub Secrets | Secret |
| `__ADMIN_PIN__` | GitHub Secrets | Secret |
| `__GUEST_PIN__` | GitHub Secrets | Secret |

### Configure Secrets
1. Go to **Settings → Secrets and variables → Variables**
   - Add `SUPABASE_URL` (your Supabase project URL)
2. Go to **Settings → Secrets and variables → Secrets**
   - Add `SUPABASE_KEY` (anon/public key)
   - Add `ADMIN_PIN` (admin access PIN)
   - Add `GUEST_PIN` (guest access PIN)

### Deploy Commands
```bash
# Check status
git status

# Stage and commit
git add .
git commit -m "feat: description"

# Push to trigger deployment
git push origin main

# Monitor deployment
gh run watch
```

### Troubleshooting Deployment
```bash
# View workflow runs
gh run list

# View deployment logs
gh run view <run-id> --log
```

- Check for sed errors in logs
- Verify all secrets are configured
- Ensure placeholders exist in source files (not already replaced)

## Pre-commit Checklist

- [ ] No hardcoded credentials
- [ ] All placeholders intact (`__SUPABASE__`, `__ADMIN_PIN__`, etc.)
- [ ] Theme toggle works
- [ ] Navigation links updated
- [ ] CSS/JS paths use `css/` and `js/` folders
- [ ] Tested locally
- [ ] No console errors

## File Patterns

### HTML Structure
```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title - Silsilah Kariyo Rejo</title>
  <link rel="stylesheet" href="css/menu.css">
  <link rel="stylesheet" href="css/cursor.css">
</head>
<body>
  <!-- Navigation -->
  <!-- Content -->
  <!-- Theme toggle -->
  <script src="js/menu.js"></script>
  <script src="js/cursor.js"></script>
</body>
</html>
```

### Supabase Integration
```javascript
const supabase = window.supabase.createClient(
  '__SUPABASE_URL__',
  '__SUPABASE_KEY__'
);
```

## Testing

### Local Server
```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

### Validation
```bash
# Check placeholders exist in source
grep -r "__SUPABASE" *.html
grep -r "__ADMIN_PIN" *.html
grep -r "__GUEST_PIN" *.html

# Should find placeholders, NOT actual values
```

## Troubleshooting

### Theme Not Persisting
Check `localStorage.setItem('trah_theme', value)` calls.

### Supabase Connection Failed
- Verify placeholders not replaced locally
- Check GitHub secrets configured
- Ensure deployed site shows actual values (not `__PLACEHOLDER__`)

### Deployment Failed
- Check GitHub Actions logs for sed errors
- Verify all secrets exist in repository settings
- Confirm `main` branch is the deployment target

### Page Not Loading
- Check browser console for errors
- Verify CSS path: `css/filename.css`
- Verify JS path: `js/filename.js`

### Assets Not Found
After moving files, ensure HTML references updated:
```html
<link rel="stylesheet" href="css/menu.css">
<script src="js/menu.js"></script>
```
