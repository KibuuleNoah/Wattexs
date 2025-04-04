import json
from datetime import datetime
from collections import defaultdict
from flask import request

REQUEST_STATS_FILE = 'request_stats.json'


class RequestTracker:

    def __init__(self) -> None:
        ...

    def _load_request_data(self) -> dict:
        try:
            with open(REQUEST_STATS_FILE, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            # Initialize with default structure if file doesn't exist or is invalid
            return {
                'total': 0,
                'downloads': 0,
                'daily': defaultdict(int),
                'monthly': defaultdict(int),
                'endpoints': defaultdict(int),
                'methods': defaultdict(int)
            }

    def _save_request_data(self, data: dict):
        # Convert defaultdicts to regular dicts for JSON serialization
        for key in ["daily", "monthly", "endpoints", "methods"]:
            data[key] = dict(data[key])

        with open(REQUEST_STATS_FILE, 'w') as f:
            json.dump(data, f, indent=2)

    def record_request(self, incretype=""):
        # Load existing data
        req_d = self._load_request_data()

        # Get current date info
        now = datetime.now()
        date_str = now.strftime('%Y-%m-%d')
        month_str = now.strftime('%Y-%m')

        # Update counters
        if incretype == "download":
            req_d["downloads"] += 1
        else:
            req_d['total'] += 1
            req_d['daily'][date_str] = req_d['daily'].get(date_str, 0) + 1
            req_d['monthly'][month_str] = req_d['monthly'].get(month_str,
                                                               0) + 1
            req_d['endpoints'][request.path] = req_d['endpoints'].get(
                request.path, 0) + 1
            req_d['methods'][request.method] = req_d['methods'].get(
                request.method, 0) + 1

        # Save updated data
        self._save_request_data(req_d)
