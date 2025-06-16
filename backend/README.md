# DSA Search Engine Backend

This folder contains scripts for scraping problem data from various coding platforms.

## LeetCode Scraper

The `leetcode_scraper.py` script fetches all problems from LeetCode and saves them to a JSON file.

### Requirements
- Python 3.6+
- Requests library

### Installation
```
pip install requests
```

### Usage
Run the script from the backend directory:

```
cd backend
python leetcode_scraper.py
```

The script will create a JSON file at `public/data/leetcode_problems.json` containing all LeetCode problems.

### Automation
To keep the problem data up-to-date, you can schedule this script to run periodically:

#### Windows (Task Scheduler)
Create a batch file (update_problems.bat) with:
```
cd path\to\DSA-Search-Engine\backend
python leetcode_scraper.py
```

Then add it to Task Scheduler to run daily.

#### Linux/macOS (Cron)
Add a cron job to run daily:
```
0 0 * * * cd /path/to/DSA-Search-Engine/backend && python leetcode_scraper.py
```

## Data Format
The generated JSON file has the following structure:

```json
{
  "metadata": {
    "total_problems": 2000,
    "last_updated": "2025-06-17T10:00:00"
  },
  "problems": [
    {
      "id": 1,
      "title": "Two Sum",
      "difficulty": "Easy",
      "url": "https://leetcode.com/problems/two-sum/",
      "slug": "two-sum",
      "acceptance_rate": 48.2,
      "tags": ["array", "hash-table"]
    },
    // More problems...
  ]
}
```
