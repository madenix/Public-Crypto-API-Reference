function injectTickerStyle(){
  var style = document.createElement('style');
  style.innerHTML = `
    #tickerTape {
			display: flex ;
			overflow: hidden ;
			white-space: nowrap ;
    }

    .tickerContent {
      animation-duration: 15s ;
			animation-iteration-count: infinite ;
			animation-name: scroll ;
			animation-timing-function: linear ;
    }

    @keyframes scroll {
      from {
        transform: translateX( 0% );
      }
      to {
        transform: translateX( -100% );
      }
    }

    #tickerTape:hover .tickerContent {
  animation-play-state: paused;
}
  `;
  document.head.appendChild(style);
}

function tickerTapeBinance(symbols, quote, tickerElement) {
  injectTickerStyle();

  var contentDiv1 = document.createElement("div");
  contentDiv1.className = "tickerContent";

  var contentDiv2 = document.createElement("div");
  contentDiv2.className = "tickerContent";

  var contentDiv3 = document.createElement("div");
  contentDiv3.className = "tickerContent";

  document.getElementById(tickerElement).appendChild(contentDiv1);
  document.getElementById(tickerElement).appendChild(contentDiv2);
  document.getElementById(tickerElement).appendChild(contentDiv3);

  /* 
    This function creates a live ticker using Binance WebSocket.
    It listens to the Individual Symbol Ticker Stream for one or multiple symbols.

    Notes:
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

  // Build WebSocket URL for the requested symbols
  const stream = symbols.map(symbol => symbol + quote + "@ticker").join("/");
  const wsUrl = "wss://stream.binance.com:9443/stream?streams=" + stream;

  // Create WebSocket connection
  const ws = new WebSocket(wsUrl);

  // Connection events
  ws.onopen = () => console.log("WebSocket connected:", wsUrl);
  ws.onclose = () => console.log("WebSocket closed");
  ws.onerror = err => console.error("WebSocket error:", err);

  let tickerData = {} //create an empty object to store multiple symbol datas.

  // Handle incoming messages
  ws.onmessage = (message) => {
      // Parse JSON to JavaScript object for further processing
      const msg = JSON.parse(message.data);
      const tickerSymbol = msg.data.s.slice(0, -quote.length); // BTCUSDT → BTC
      let tickerPrice = parseFloat(msg.data.c);
      tickerPrice = tickerPrice > 1 ? tickerPrice.toFixed(2) : tickerPrice;
      const ticker24hr = msg.data.P;
      
      tickerData[tickerSymbol] = {tickerPrice, ticker24hr};

      // Build display string for all symbols
      let display = Object.keys(tickerData)
      .map(s => {
          let change = parseFloat(tickerData[s].ticker24hr);
          const arrow = change >= 0 ? "▲" : "▼";
          const color = change >= 0 ? "green" : "red";
          change = Math.abs(change).toFixed(2);

          return "<b><span style=''>" + s + "</span></b>" + 
              ": $" + tickerData[s].tickerPrice + "&nbsp;&nbsp;" + 
              "<span style='color:"+color+"'>"+ arrow + change + "</span>";
      })
      .join(" | ");

      display = display + "&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;";

      contentDiv1.innerHTML = display;
      contentDiv2.innerHTML = display;
      contentDiv3.innerHTML = display;
  };
}
