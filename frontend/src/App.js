import React, { useState } from 'react';
import './App.css';

function App() {
  // State to store the user's input (stock ticker)
  const [ticker, setTicker] = useState('');

  // State to store the response from the backend
  const [prediction, setPrediction] = useState(null);

  // State to store any error messages
  const [error, setError] = useState('');

  // This function runs when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    setError('');       // Clear any previous error
    setPrediction(null); // Clear previous prediction

    try {
      // Make a GET request to the backend's /predict endpoint
      const response = await fetch(`http://127.0.0.1:8000/predict?ticker=${ticker}`);

      // Parse the JSON result
      const data = await response.json();

      if (data.error) {
        setError(data.error); // If backend returns error, show it
      } else {
        setPrediction(data);  // Otherwise, store the prediction
      }
    } catch (err) {
      setError('Failed to connect to backend. Make sure FastAPI is running.');
    }
  };

  return (
    <div className="App">
      <h1>📈 ML Stock Ticker</h1>

      {/* Input form for stock ticker */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter Stock Symbol (e.g. INFY.NS)"
          required
        />
        <button type="submit">Predict</button>
      </form>

      {/* Show error if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Show prediction result if available */}
      {prediction && (
        <div style={{ marginTop: '20px' }}>
          <h3>Prediction Result</h3>
          <p><strong>Symbol:</strong> {prediction.symbol}</p>
          <p><strong>Last Close:</strong> ₹{prediction.last_close.toFixed(2)}</p>
          <p><strong>Predicted Next Close:</strong> ₹{prediction.predicted_next_close}</p>
        </div>
      )}
    </div>
  );
}

export default App;
