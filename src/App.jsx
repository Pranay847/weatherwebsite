import React, { useState, useEffect } from 'react';
import './App.css';
import { TextField, Button, CircularProgress } from '@mui/material';
import '@mui/material/styles';
import { fetchWeatherData } from './api/openWeather';
const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
import History from './components/History';
import Forecast from './components/Forecast';
import { loadHistory, addToHistory, clearHistory } from './utils/history';


//Create a search bar and get the input from the user and fetch the weather data for that city
//Create a button to fetch the weather data for the city entered by the user
//Display the weather data for the City entered by the user and the forecast data for the city entered by the user
//If the city doesn't exit display an error message and let the user choose a city again.
function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [units, setUnits] = useState('metric');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  async function fetchWeather(city, desiredUnits = units) {
    if (!city) return;
    if (!API_KEY) {
      setError('Missing OpenWeather API key. Add VITE_OPENWEATHER_KEY to .env');
      return;
    }
    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast(null);
    try {
      const { curData, foreData } = await fetchWeatherData(city, desiredUnits, API_KEY);
      setWeather(curData);
      setForecast(foreData);
      try {
        const newHist = addToHistory(curData?.name || city);
        setHistory(newHist);
      } catch {
        // ignore history errors
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }

  function handleSelectHistory(city) {
    setQuery(city);
    fetchWeather(city);
  }

  function handleClearHistory() {
    clearHistory();
    setHistory([]);
  }

  function handleSearch() {
    fetchWeather(query.trim());
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') handleSearch();
  }

  const suggestions = ['New York', 'London', 'Tokyo', 'Mumbai', 'Sydney'];

  const unitSymbol = units === 'metric' ? '°C' : '°F';

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Weather</h1>
        <p className="subtitle">Quick, beautiful, and easy weather lookup</p>
      </header>

      <main className="app-main">
        <div className="search-card">
          <div className="search-row">
            <TextField
              id="city-input"
              label="Enter city or postal code"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
              size="small"
              className="city-input"
              placeholder="e.g. Chicago"
            />

            <div className="controls">
              <div className="unit-toggle" style={{ display: 'inline-flex', gap: 8, marginRight: 8 }}>
                <Button
                  variant={units === 'metric' ? 'contained' : 'outlined'}
                  onClick={() => { setUnits('metric'); if (weather) fetchWeather(weather.name, 'metric'); }}
                  size="small"
                >
                  °C
                </Button>
                <Button
                  variant={units === 'imperial' ? 'contained' : 'outlined'}
                  onClick={() => { setUnits('imperial'); if (weather) fetchWeather(weather.name, 'imperial'); }}
                  size="small"
                >
                  °F
                </Button>
              </div>
              <Button variant="contained" onClick={handleSearch} disabled={loading || !query.trim()}>
                Search
              </Button>
              <Button variant="outlined" onClick={() => { setQuery(''); setError(null); setWeather(null); setForecast(null); }}>
                Clear
              </Button>
            </div>
          </div>

          <History history={history} onSelect={handleSelectHistory} onClear={handleClearHistory} />

          <div className="suggestions">
            <span>Try: </span>
            {suggestions.map((s) => (
              <button key={s} className="chip" onClick={() => { setQuery(s); fetchWeather(s); }}>
                {s}
              </button>
            ))}
          </div>

          {loading && <div className="loading-row"><CircularProgress size={28} /></div>}

          {error && <div className="error">{error}. Try another city.</div>}
        </div>

        {weather && (
          <section className="result-card">
            <div className="current">
              <div className="left">
                {weather.weather?.[0]?.icon && (
                  <img
                    alt={weather.weather[0].description}
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                    className="weather-icon"
                  />
                )}
              </div>
              <div className="right">
                <h2>{weather.name}, {weather.sys?.country}</h2>
                <div className="temp">{Math.round(weather.main.temp)}{unitSymbol}</div>
                <div className="desc">{weather.weather?.[0]?.description}</div>
                <div className="meta">Humidity: {weather.main.humidity}% · Wind: {weather.wind.speed} m/s</div>
              </div>
            </div>

            {forecast && <Forecast forecast={forecast} units={units} />}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;