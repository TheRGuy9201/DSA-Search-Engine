import requests
import json
import os
from datetime import datetime

def scrape_leetcode():
    url = "https://leetcode.com/api/problems/all/"
    headers = {'User-Agent': 'Mozilla/5.0'}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error for bad status codes
        data = response.json()
    except Exception as e:
        print(f"[ERROR] Failed to fetch data from LeetCode: {e}")
        return

    problems = []

    for item in data.get("stat_status_pairs", []):
        try:
            question_id = item["stat"]["question_id"]
            title = item["stat"]["question__title"]
            slug = item["stat"]["question__title_slug"]
            level = item["difficulty"]["level"]
            total_submitted = item["stat"]["total_submitted"]
            total_acs = item["stat"]["total_acs"]
            
            # Calculate acceptance rate
            acceptance_rate = round((total_acs / total_submitted) * 100, 1) if total_submitted > 0 else 0
            
            # Map the level number to difficulty string
            difficulty = ["Easy", "Medium", "Hard"][level - 1]
            
            # Get tags if available
            tags = []
            if "tags" in item:
                tags = item["tags"]
            
            problems.append({
                "id": question_id,
                "title": title,
                "difficulty": difficulty,
                "url": f"https://leetcode.com/problems/{slug}/",
                "slug": slug,
                "acceptance_rate": acceptance_rate,
                "tags": tags,
                "source": "leetcode"  # Add source for better matching
            })

        except KeyError as e:
            print(f"[WARN] Skipping problem due to missing key: {e}")
            continue  # Skip malformed entries

    if not problems:
        print("[WARN] No problems were found. Exiting.")
        return

    # Sort problems by ID
    problems.sort(key=lambda x: x["id"])
    
    # Create metadata with timestamp
    metadata = {
        "total_problems": len(problems),
        "last_updated": datetime.now().isoformat(),
    }
    
    # Create the output structure
    output = {
        "metadata": metadata,
        "problems": problems
    }

    # Save to public/data folder for the web app to access
    os.makedirs("../public/data", exist_ok=True)
    output_path = "../public/data/leetcode_problems.json"
    with open(output_path, "w", encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"[INFO] Successfully scraped {len(problems)} problems.")
    print(f"[INFO] Data saved to {output_path}")

if __name__ == "__main__":
    scrape_leetcode()
