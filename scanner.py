import os
import requests

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

def send_telegram_alert(message):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print(message)
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {"chat_id": TELEGRAM_CHAT_ID, "text": message, "parse_mode": "Markdown"}
    requests.post(url, json=payload)

def scan_target():
    # Public candidate API endpoints pool
    candidate_endpoints = [
        "https://mcp-currency-converter-free.vercel.app/api",
        "https://pdf-ocr-extractor-tool.onrender.com/infer"
    ]
    
    dead_found = []
    for url in candidate_endpoints:
        try:
            res = requests.get(url, timeout=4)
            if res.status_code >= 400:
                dead_found.append(url)
        except requests.exceptions.RequestException:
            dead_found.append(url)

    if dead_found:
        msg = f"🔥 *ORPHANED ENDPOINT FOUND!*\n\nTarget ready for claim:\n`{dead_found[0]}`"
        send_telegram_alert(msg)

if __name__ == "__main__":
    scan_target()
