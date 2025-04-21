import requests

CMC_API_KEY = "YOUR_CMC_API_KEY"
CMC_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest"

def get_chonk9k_price():
    headers = {"X-CMC_PRO_API_KEY": CMC_API_KEY}
    params = {"symbol": "CHONK9K"}  # Ensure the correct symbol is used
    response = requests.get(CMC_URL, headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.json()
        price = data["data"]["CHONK9K"]["quote"]["USD"]["price"]
        return f"CHONK9K Price: ${price:.4f}"
    else:
        return "Error fetching price"

print(get_chonk9k_price())
