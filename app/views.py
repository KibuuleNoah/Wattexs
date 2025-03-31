import os, json
from flask import Blueprint, current_app, jsonify, render_template

from .utils import RequestTracker

views = Blueprint("views", __name__)


@views.route("/")
def index():
    backgrounds_dir = os.path.join(current_app.root_path,
                                   'static/imgs/backgrounds/')
    backgrounds = [
        "/static/imgs/backgrounds/" + f for f in os.listdir(backgrounds_dir)
        if f.endswith(('.jpg', '.jpeg'))
    ]

    rt = RequestTracker()
    rt.record_request()

    return render_template('index.html', backgrounds=json.dumps(backgrounds))


STATS_FILE = 'request_stats.json'


@views.route('/dashboard')
def dashboard():
    """Render the dashboard"""
    return render_template('dashboard.html')


@views.route("/api/record/download")
def record_download():

    rt = RequestTracker()
    rt.record_request("download")

    return jsonify({})


@views.route('/api/stats')
def get_stats():
    """API endpoint to get the statistics data"""
    try:
        with open(STATS_FILE, 'r') as f:
            data = json.load(f)
            return jsonify(data)
    except (FileNotFoundError, json.JSONDecodeError):
        return jsonify({
            "error": "Statistics data not available",
            "total": 0,
            "daily": {},
            "monthly": {},
            "endpoints": {},
            "methods": {}
        }), 404
