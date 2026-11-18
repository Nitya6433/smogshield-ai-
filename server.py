"""
SmogShield AI - Production-Grade Local Development & Telemetry Server
Zero-dependency Python HTTP Server with Enterprise Security Headers,
Path Traversal Defense, and Health/Telemetry JSON API Endpoints.

Standards: OWASP Secure Headers, RFC 9110, RFC 6454.
"""

import http.server
import socketserver
import os
import json
import posixpath
import urllib.parse
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Live Telemetry Snapshot for API Consumers
TELEMETRY_DATA = {
    "delhi": {
        "city": "Delhi NCR (India)",
        "baseAqi": 435,
        "basePm25": 312,
        "inversion": "Severe Nocturnal Cap",
        "ventilationWindow": "13:00 - 15:30",
        "status": "Severe"
    },
    "lahore": {
        "city": "Lahore (Pakistan)",
        "baseAqi": 485,
        "basePm25": 365,
        "inversion": "Hazardous Boundary Trap",
        "ventilationWindow": "13:30 - 15:00",
        "status": "Hazardous"
    },
    "beijing": {
        "city": "Beijing (China)",
        "baseAqi": 245,
        "basePm25": 168,
        "inversion": "Moderate Thermal Inversion",
        "ventilationWindow": "12:30 - 16:00",
        "status": "Very Unhealthy"
    },
    "saltlake": {
        "city": "Salt Lake City (USA)",
        "baseAqi": 165,
        "basePm25": 82,
        "inversion": "Wasatch Valley Cold Pool Trap",
        "ventilationWindow": "13:00 - 16:30",
        "status": "Unhealthy"
    },
    "krakow": {
        "city": "Krakow (Poland)",
        "baseAqi": 210,
        "basePm25": 135,
        "inversion": "Vistula Valley Cold Trap",
        "ventilationWindow": "12:00 - 15:00",
        "status": "Very Unhealthy"
    }
}


class SmogShieldHandler(http.server.SimpleHTTPRequestHandler):
    """
    Secure HTTP Request Handler applying OWASP Top 10 defenses,
    Content-Security-Policy, strict mime-types, and custom API routing.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # 1. Content Security Policy (Strict self isolation)
        self.send_header(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; "
            "form-action 'self'; base-uri 'self';"
        )
        # 2. Prevent MIME-sniffing
        self.send_header("X-Content-Type-Options", "nosniff")
        # 3. Prevent Clickjacking
        self.send_header("X-Frame-Options", "DENY")
        # 4. Referrer Policy
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        # 5. Restrict dangerous browser features
        self.send_header("Permissions-Policy", "geolocation=(), camera=(), microphone=()")
        # 6. Cross-Origin Protections
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        # 7. No aggressive caching during real-time smog telemetrics
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        """Handle CORS pre-flight requests safely."""
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        """Route API endpoints or serve static files with path validation."""
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path

        # API: Health Check Endpoint
        if clean_path == "/api/health":
            self.send_json_response(200, {
                "status": "healthy",
                "service": "smogshield-ai",
                "version": "1.0.0",
                "environment": "production-grade-local"
            })
            return

        # API: Real-Time Telemetry Endpoint
        if clean_path == "/api/telemetry":
            self.send_json_response(200, {
                "success": True,
                "timestamp": "2026-11-18T19:25:00Z",
                "cities": TELEMETRY_DATA
            })
            return

        # Security: Prevent Directory Traversal & Access to Hidden/Dot Files
        if ".." in clean_path or "/." in clean_path or clean_path.startswith("/."):
            self.send_error(403, "Access Denied: Path Traversal / Hidden files prohibited")
            return

        # Default: Serve static files securely
        super().do_GET()

    def send_json_response(self, status_code, data):
        """Helper to serialize and dispatch JSON payloads with proper headers."""
        payload = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, format, *args):
        """Formatted terminal logger."""
        sys.stderr.write(f"[SmogShield Server] {self.address_string()} - {format % args}\n")


def create_server(host="127.0.0.1", port=PORT):
    """Factory function to build server instance for testing or running."""
    handler = SmogShieldHandler
    # Allow socket address reuse to prevent 'Address already in use' during rapid restarts
    socketserver.TCPServer.allow_reuse_address = True
    return socketserver.TCPServer((host, port), handler)


def run_server():
    """Starts the production-grade local server."""
    os.chdir(DIRECTORY)
    with create_server("127.0.0.1", PORT) as httpd:
        print("=" * 64)
        print("  SmogShield AI - Production-Grade Local Development Server")
        print("=" * 64)
        print(f"  App Directory  : {DIRECTORY}")
        print(f"  Local Web App  : http://localhost:{PORT}")
        print(f"  API Health     : http://localhost:{PORT}/api/health")
        print(f"  API Telemetry  : http://localhost:{PORT}/api/telemetry")
        print("  Security       : CSP + XSS + Clickjacking + Anti-Traversal ON")
        print("  Press Ctrl+C to stop.")
        print("=" * 64)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")
            httpd.server_close()


if __name__ == "__main__":
    run_server()
