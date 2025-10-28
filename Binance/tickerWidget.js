function tickerBinance(base, quote, tickerElement) {
  /*
      Binance WebSocket 24hr Ticker Stream Example
      --------------------------------------------
      Raw streams:       /ws/<streamName>
      Combined streams:  /stream?streams=<streamName1>/<streamName2>/...

      Sample data payload (for one symbol):
      {
        "e": "24hrTicker",  // Event type
        "E": 1672515782136, // Event time
        "s": "BNBBTC",      // Symbol
        "p": "0.0015",      // Price change
        "P": "250.00",      // Price change percent
        "w": "0.0018",      // Weighted average price
        "x": "0.0009",      // First trade price in 24h window
        "c": "0.0025",      // Last price
        "Q": "10",          // Last quantity
        "b": "0.0024",      // Best bid price
        "B": "10",          // Best bid quantity
        "a": "0.0026",      // Best ask price
        "A": "100",         // Best ask quantity
        "o": "0.0010",      // Open price
        "h": "0.0025",      // High price
        "l": "0.0010",      // Low price
        "v": "10000",       // Total traded base asset volume
        "q": "18",          // Total traded quote asset volume
        "O": 0,             // Statistics open time
        "C": 86400000,      // Statistics close time
        "F": 0,             // First trade ID
        "L": 18150,         // Last trade ID
        "n": 18151          // Total number of trades
      }
  */
  
  // --- 1️⃣ Define the WebSocket endpoint for the given trading pair
  const tickerUrl = "wss://stream.binance.com:9443/ws/" + base + quote + "@ticker";
  const tickerSocket = new WebSocket(tickerUrl);
  
  // --- 2️⃣ Create a container for the symbol logo and pair name
  var logoDiv = document.createElement("div");
  
  // Construct logo image URL dynamically (uses base symbol name)
  const logo = "<img src='https://cdn.jsdelivr.net/gh/madenix/Crypto-logo-cdn@main/Logos/" 
                + base.toUpperCase() + ".svg' width='64' />";
  
  // Format trading pair text (e.g., BTC/USDT)
  const symbol = base.toUpperCase() + "/" + quote.toUpperCase();
  
  // Combine logo and symbol name into the same container
  logoDiv.innerHTML = logo + symbol;

  // --- 3️⃣ Apply inline styling for layout and visual design
  logoDiv.style.display = "flex";         // Use flex layout for horizontal alignment
  logoDiv.style.alignItems = "center";    // Vertically center logo and text
  logoDiv.style.gap = "16px";             // Space between logo and symbol text
  logoDiv.style.fontSize = "1.2rem";
  logoDiv.style.fontWeight = "600";
  logoDiv.style.margin = "10px 0";

  // Append logo section to the main ticker container
  document.getElementById(tickerElement).appendChild(logoDiv);

  // --- 4️⃣ Create and style the price display element
  var priceDiv = document.createElement("div");
  document.getElementById(tickerElement).appendChild(priceDiv);
  priceDiv.style.fontSize = "1.5rem";
  priceDiv.style.fontWeight = "1000";

  // --- 5️⃣ Create the daily change percentage element
  var dailyChangeDiv = document.createElement("div");
  document.getElementById(tickerElement).appendChild(dailyChangeDiv);

  // --- 6️⃣ Handle incoming WebSocket messages
  tickerSocket.onmessage = (event) => {
    console.log(event.data);
    // Parse received JSON payload
    const data = JSON.parse(event.data);
    
    // Extract and format last traded price
    let price = parseFloat(data.c);
    price = price > 1 ? price.toFixed(2) : price;  // Format decimals for readability
    priceDiv.innerHTML = "$" + price;
    
    // Extract daily percent change
    let change = parseFloat(data.P);
    const arrow = change >= 0 ? "▲" : "▼";         // Directional arrow
    const color = change >= 0 ? "green" : "red";   // Green for gain, red for loss
    change = Math.abs(change).toFixed(2);          // Remove negative sign, format
    
    // Update color and text for the daily change display
    dailyChangeDiv.style.color = color;
    dailyChangeDiv.innerHTML = arrow + change;
  };
}
