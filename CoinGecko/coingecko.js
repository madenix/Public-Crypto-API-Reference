/**
 * CoinGecko API Endpoint Overview:
 * https://docs.coingecko.com/v3.0.1/reference/endpoint-overview
 *
 * These functions allow you to fetch simple price data from CoinGecko.
 */

/**
 * Fetches the current price of a specific cryptocurrency.
 *
 * Parameters:
 * - base:  CoinGecko ID of the token/coin (e.g., 'bitcoin', 'ripple')
 * - quote: Quote currency in which price is returned (e.g., 'usd', 'eur')
 *
 * Example URL:
 * https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd
 */
function getPriceCG(base, quote) {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=" + base + "&vs_currencies=" + quote;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return data; // { bitcoin: { usd: 12345.67 } }
        })
        .catch(error => {console.log("Error fetching price data: " + error);});
}

/**
 * Fetches the current price AND 24-hour price change of a specific cryptocurrency.
 *
 * Parameters:
 * - base:  CoinGecko ID of the token/coin (e.g., 'bitcoin', 'ripple')
 * - quote: Quote currency in which price and change are returned (e.g., 'usd', 'eur')
 *
 * Example URL:
 * https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true
 */
function getSymbolDataCG(base, quote) {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=" + base +
                "&vs_currencies=" + quote + "&include_24hr_change=true";

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return data; // { bitcoin: { usd: 12345.67, usd_24h_change: 2.34 } }
        })
        .catch(error => {console.log("Error fetching symbol data: " + error);});
}

/**
 * Fetches OHLC (candle) data from CoinGecko API.
 *
 * Candle Data Parameters:
 * - id:          The CoinGecko ID of the token/coin (e.g., 'bitcoin', 'ripple')
 * - vs_currency: The quote currency in which prices are returned (e.g., 'usd')
 * - days:        Number of past days to retrieve data for
 *                Available options: 1, 7, 14, 30, 90, 180, 365
 *
 * Notes:
 * - The free/demo CoinGecko API does NOT provide minute-level intervals.
 *   You need a Pro API key to get finer intervals (e.g., hourly or per minute).
 * - The API does NOT allow specifying a candle limit. 
 *   You will receive all candles for the requested time range, 
 *   so you may need to calculate how many candles were returned.
 * 
 *Example URL:
 *https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=1     
 */
function getCandlesCG(base, quote, days) {
    const url = "https://api.coingecko.com/api/v3/coins/" + base + "/ohlc?vs_currency=" + quote + "&days=" + days;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return data; // Array of [timestamp, open, high, low, close]
        })
        .catch(error => {console.log("Error fetching candle data: " + error);});
}
