import requests
import json

# Test the API endpoint
def test_api():
    url = "http://localhost:8000/api/query"
    
    payload = {
        "question": "What is physical AI?",
        "chat_history": []
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
        print("Make sure the backend server is running on port 8000")

if __name__ == "__main__":
    test_api()