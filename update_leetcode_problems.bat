@echo off
cd %~dp0\backend
python leetcode_scraper.py
echo LeetCode problems updated: %date% %time%
