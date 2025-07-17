import requests
import json
import os
from datetime import datetime

def get_difficulty(points):
    if points is None:
        return "Mid-Level"  # Default to Mid-Level if no rating is available
    try:
        points = int(points)
        if points <= 1000:
            return "Beginner"
        elif points <= 1300:
            return "Easy"
        elif points <= 1600:
            return "Lower-Mid"
        elif points <= 1900:
            return "Mid-Level"
        elif points <= 2200:
            return "Upper-Mid"
        elif points <= 2500:
            return "Hard"
        else:
            return "Very Hard"
    except Exception:
        return "Mid-Level"

def scrape_codeforces_problems():
    url = "https://codeforces.com/api/problemset.problems"
    print(f"Fetching problems from {url} ...")
    
    try:
        resp = requests.get(url)
        resp.raise_for_status()
        data = resp.json()
        
        if data["status"] != "OK":
            print("API returned error:", data.get("comment", "Unknown error"))
            return
            
    except Exception as e:
        print(f"[ERROR] Failed to fetch data from Codeforces: {e}")
        return
        
    problems = []
    problem_id = 1
    
    for problem, stats in zip(data["result"]["problems"], data["result"]["problemStatistics"]):
        try:
            name = problem.get("name")
            contest_id = problem.get("contestId")
            index = problem.get("index")
            url = f"https://codeforces.com/problemset/problem/{contest_id}/{index}"
            tags = problem.get("tags", [])
            points = problem.get("rating")
            difficulty = get_difficulty(points)
            solved_count = stats.get("solvedCount", 0)
            
            problems.append({
                "id": problem_id,
                "title": name,
                "difficulty": difficulty,
                "url": url,
                "slug": f"{contest_id}{index}",
                "tags": tags,
                "solved_count": solved_count,
                "points": points,
                "source": "codeforces",  # Add source for better matching
                "contestId": contest_id,  # Add contest ID for better matching
                "index": index  # Add index for better matching
            })
            
            problem_id += 1
            
        except Exception as e:
            print(f"[ERROR] Failed to process problem: {e}")
    
    # Ensure the output directory exists
    os.makedirs('public/data', exist_ok=True)
    
    # Create metadata
    metadata = {
        "total_problems": len(problems),
        "last_updated": datetime.now().isoformat()
    }
    
    # Create the final response
    response = {
        "metadata": metadata,
        "problems": problems
    }
    
    # Write to file
    output_path = 'public/data/codeforces_problems.json'
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(response, f, ensure_ascii=False, indent=2)
        
    print(f"Scraped {len(problems)} problems. Data saved to {output_path}")

if __name__ == "__main__":
    scrape_codeforces_problems()