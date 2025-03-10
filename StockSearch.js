import React, { useState } from "react";
import "./StockSearch.css"; // Import the CSS file

const StockSearch = () => {
  const [symbol, setSymbol] = useState("");
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState("");

  const fetchStockData = async (e) => {
    e.preventDefault();
    setError(""); 
    setStockData(null);

    if (!symbol.trim()) {
      setError("Please enter a stock symbol.");
      return;
    }

    console.log("Fetching data for symbol:", symbol);

    try {
      const response = await fetch(`https://localhost:5001/api/stocks/${symbol}`);
      console.log("Response Status:", response.status);

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      if (data.Note) {
        throw new Error(data.Note);
      }

      if (!data || !data.timeSeries || Object.keys(data.timeSeries).length === 0) {
        throw new Error("No data found for the given symbol.");
      }

      setStockData(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="stock-search-container">
      <h2 className="title">Search for stock data</h2>
      <form onSubmit={fetchStockData} className="stock-search-form">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter Stock Symbol"
          required
          className="input-field"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {stockData && stockData.metaData && (
        <div className="stock-data">
          <h3>Stock Data for {stockData.metaData["2. Symbol"]}</h3>
          <ul>
            <li><strong>Information:</strong> {stockData.metaData["1. Information"]}</li>
            <li><strong>Last Refreshed:</strong> {stockData.metaData["3. Last Refreshed"]}</li>
            <li><strong>Output Size:</strong> {stockData.metaData["4. Output Size"]}</li>
            <li><strong>Time Zone:</strong> {stockData.metaData["5. Time Zone"]}</li>
          </ul>

          <h3>Time Series (Daily)</h3>
          <div className="stock-table-container">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Open</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Close</th>
                  <th>Volume</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stockData.timeSeries).map(([date, values]) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>{values.open}</td>
                    <td>{values.high}</td>
                    <td>{values.low}</td>
                    <td>{values.close}</td>
                    <td>{values.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockSearch;