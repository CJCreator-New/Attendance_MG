# Git Push Instructions

## Step 1: Configure Git with Your Account

```bash
# Set your GitHub username and email
git config user.name "Your GitHub Username"
git config user.email "your-github-email@example.com"

# Verify configuration
git config user.name
git config user.email
```

## Step 2: Stage and Commit Changes

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "fix: resolve all low-priority issues

- Add ESLint and Prettier configuration
- Add Docker support
- Add environment variables template
- Replace magic numbers with constants
- Add employee ID validation
- Add max employees limit (500)
- Add comprehensive documentation
- Add Git hooks with Husky"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `attendance-app`
3. Don't initialize with README (we already have files)
4. Copy the repository URL

## Step 4: Push to GitHub

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/attendance-app.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Alternative: Using SSH

If you prefer SSH:

```bash
# Add remote with SSH
git remote add origin git@github.com:YOUR_USERNAME/attendance-app.git

# Push
git branch -M main
git push -u origin main
```

## If Repository Already Exists

```bash
# Check current remote
git remote -v

# Update remote URL if needed
git remote set-url origin https://github.com/YOUR_USERNAME/attendance-app.git

# Push
git push -u origin main
```

## Troubleshooting

### Authentication Issues
If prompted for credentials, use a Personal Access Token (PAT) instead of password:
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token with `repo` scope
3. Use token as password when prompted

### Force Push (if needed)
```bash
git push -f origin main
```

**Note:** Only use force push if you're sure you want to overwrite remote history.
