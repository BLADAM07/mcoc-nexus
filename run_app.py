"""
Launcher for MCOC Full-Stack Nexus (Backend + Frontend)
"""
import subprocess
import sys
import os
import time
import webbrowser

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

def main():
    print("=======================================================")
    print("  🚀 STARTING MCOC FULL-STACK NEXUS APPLICATION")
    print("=======================================================")
    print(f"[*] Base Directory: {BASE_DIR}")
    
    # 1. Start Backend FastAPI Server
    print("[+] Starting FastAPI Backend on http://127.0.0.1:8000...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=BASE_DIR
    )
    
    time.sleep(6)
    
    # 2. Start Frontend Vite Dev Server
    print("[+] Starting Vite Frontend on http://localhost:5173...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev", "--", "--host"],
        cwd=FRONTEND_DIR
    )
    
    time.sleep(2)
    print("\n=======================================================")
    print("  ✓ MCOC NEXUS IS LIVE AND RUNNING!")
    print("  🌐 Frontend URL: http://localhost:5173")
    print("  🔌 Backend API:  http://127.0.0.1:8000/docs")
    print("=======================================================\n")
    print("Default Accounts:")
    print("  👑 Admin Coach: username='admin' | password='admin123'")
    print("  🛡️ Summoner User: username='summoner_alpha' | password='summoner123'")
    print("\nPress Ctrl+C to stop both servers.")
    
    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\n[!] Shutting down servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("[✓] All servers stopped cleanly.")

if __name__ == "__main__":
    main()
