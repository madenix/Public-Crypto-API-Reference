/*
-The base endpoint is: wss://stream.binance.com:9443 or wss://stream.binance.com:443.
-Streams can be accessed either in a single raw stream or in a combined stream.
-Raw streams are accessed at /ws/<streamName>
-Combined streams are accessed at /stream?streams=<streamName1>/<streamName2>/<streamName3>
-All symbols for streams are lowercase

For more info visit : 
https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams"

Notes:
    ***It listens to the Individual Symbol Ticker Stream for one or multiple symbols.
    - 24hr rolling window ticker statistics for each symbol.
    - These are NOT the statistics of the UTC day, but the last 24 hours.
    - Stream format: <symbol>@ticker
    - Update speed: 1000ms (1 second)
    - Payload example for a single symbol:
    
    {
      "e": "24hrTicker",  // Event type
      "E": 1672515782136, // Event time
      "s": "BNBBTC",      // Symbol
      "p": "0.0015",      // Price change
      "P": "250.00",      // Price change percent
      "w": "0.0018",      // Weighted average price
      "x": "0.0009",      // First trade price before 24h window
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

(function(){
  const script = document.currentScript;
  const socketUrl = "wss://stream.binance.com:9443/stream?streams=";
  
  let bases = script.getAttribute("data-bases");
  bases = bases.split(',');
  
  const quote = script.getAttribute("data-quote");

  const streams = bases.map(base=>base+quote+"@ticker").join('/');;
  const wsUrl = socketUrl + streams;
  
  const ws = new WebSocket(wsUrl);
  
  // Connection events
  ws.onopen = () => console.log("WebSocket connected:", wsUrl);
  ws.onclose = () => console.log("WebSocket closed");
  ws.onerror = err => console.error("WebSocket error:", err);
  
  const cache = {}; 
  
  ws.onmessage = (message) => {
    const payload = JSON.parse(message.data);
    let price = parseFloat(payload.data.c);
    const symbol = payload.data.s.slice(0, -quote.length);
    let change = payload.data.P;
    const arrow = change >= 0 ? "▲" : "▼";
    const color = change >= 0 ? "green" : "red";
    change = Math.abs(change).toFixed(2);

    const logo = "https://cdn.jsdelivr.net/gh/madenix/Crypto-logo-cdn@main/Logos/"+ symbol +".svg";
    
    if(!cache[symbol]){
      document.createElement("div");
      cache[symbol] = 
    }else{
      console.log(cache[symbol]);
    }
    //console.log(symbol + price);
  } //onmessage 
})();
