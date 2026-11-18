"""
SmogShield AI - Master Test Suite Runner
Orchestrates Physics, Security, AI Advisor, and Server Test Suites.
"""

import subprocess
import sys
import os
import time

DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def run():
    print("=" * 70)
    print("  🚀 SmogShield AI - Automated Master Quality & Test Runner")
    print("=" * 70)
    start_time = time.time()
    all_passed = True

    # 1. Run Node.js Test Suite (Physics, Security, AI Advisor)
    print("\n[Suite 1/2] Running Node.js Unit & Integration Tests (node:test)...")
    node_cmd = [
        "node",
        "--test",
        os.path.join(DIRECTORY, "tests", "test_physics.test.mjs"),
        os.path.join(DIRECTORY, "tests", "test_security.test.mjs"),
        os.path.join(DIRECTORY, "tests", "test_advisor.test.mjs")
    ]
    node_res = subprocess.run(node_cmd, capture_output=True, text=True, cwd=DIRECTORY)
    print(node_res.stdout)
    if node_res.stderr:
        print(node_res.stderr)
    if node_res.returncode != 0:
        all_passed = False
        print("❌ Node.js test suite failed!")
    else:
        print("✅ Node.js test suite passed with 100% success!")

    # 2. Run Python Server Test Suite (Endpoints, CSP, Security Headers, Traversal)
    print("\n[Suite 2/2] Running Python Server & Security Test Suite (unittest)...")
    py_cmd = [
        sys.executable,
        os.path.join(DIRECTORY, "tests", "test_server.py")
    ]
    py_res = subprocess.run(py_cmd, capture_output=True, text=True, cwd=DIRECTORY)
    print(py_res.stdout)
    if py_res.stderr:
        print(py_res.stderr)
    if py_res.returncode != 0:
        all_passed = False
        print("❌ Python server test suite failed!")
    else:
        print("✅ Python server test suite passed with 100% success!")

    elapsed = round(time.time() - start_time, 2)
    print("=" * 70)
    if all_passed:
        print(f"  🎉 ALL TEST SUITES PASSED (100/100) in {elapsed}s")
    else:
        print(f"  ❌ TEST FAILURES DETECTED in {elapsed}s")
    print("=" * 70)

    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    run()
