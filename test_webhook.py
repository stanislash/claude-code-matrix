import urllib.request
import urllib.error

url = "https://h2sa-ai.app.n8n.cloud/webhook/6061f158-0fdc-4929-acdf-c580bb70d0ff"

try:
    with urllib.request.urlopen(url) as response:
        print(f"Status: {response.status}")
        print(f"Response: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} - {e.reason}")
except urllib.error.URLError as e:
    print(f"URL Error: {e.reason}")
