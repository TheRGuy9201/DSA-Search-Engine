# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automating various tasks in the DSA Search Engine project.

## Workflows

### Update Codeforces Problems

**File:** `update-codeforces-problems.yml`

This workflow automatically updates the Codeforces problems database by running the scraper every two weeks.

#### Details:
- Runs automatically every two weeks (based on a cron schedule)
- Can also be triggered manually from the GitHub Actions tab
- Executes the `codeforces_scraper.py` script
- Commits and pushes any changes to the problems data file

#### Process:
1. Checks out the repository code
2. Sets up Python environment
3. Installs required dependencies
4. Runs the Codeforces scraper script
5. Commits and pushes any changes to the repository

#### Manual Trigger:
If you need to update the Codeforces problems manually:
1. Go to the GitHub repository
2. Navigate to the "Actions" tab
3. Select the "Update Codeforces Problems" workflow
4. Click "Run workflow"
