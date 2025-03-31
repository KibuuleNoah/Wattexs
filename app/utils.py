import json
from datetime import datetime
from collections import defaultdict
from flask import request


class RequestTracker:
    # File to store the request data
    def __init__(self) -> None:
        self.REQUEST_DATA_FILE = 'request_stats.json'

    def _load_request_data(self):
        try:
            with open(self.REQUEST_DATA_FILE, 'r') as f:
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
        data['daily'] = dict(data['daily'])
        data['monthly'] = dict(data['monthly'])
        data['endpoints'] = dict(data['endpoints'])
        data['methods'] = dict(data['methods'])

        with open(self.REQUEST_DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)

    def record_request(self, incretype=""):
        # Load existing data
        request_data = self._load_request_data()

        # Get current date info
        now = datetime.now()
        date_str = now.strftime('%Y-%m-%d')
        month_str = now.strftime('%Y-%m')

        # Update counters
        if incretype == "download":
            request_data["downloads"] += 1
        else:
            request_data['total'] += 1
            request_data['daily'][date_str] += 1
            request_data['monthly'][month_str] += 1
            request_data['endpoints'][request.path] += 1
            request_data['methods'][request.method] += 1

        # Save updated data
        self._save_request_data(request_data)
