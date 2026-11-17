"""
SmogShield AI - Local Development & Test Server
Zero-dependency Python HTTP Server
"""

import http.server
import socketserver
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class SmogShieldHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def run_server():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("127.0.0.1", PORT), SmogShieldHandler) as httpd:
        print("=" * 60)
        print("  SmogShield AI Local Development Server")
        print("=" * 60)
        print(f"  App Directory : {DIRECTORY}")
        print(f"  Local URL     : http://localhost:{PORT}")
        print("  Press Ctrl+C to terminate the server.")
        print("=" * 60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")
            httpd.server_close()

if __name__ == "__main__":
    run_server()

