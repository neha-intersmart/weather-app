import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [error, setError] = useState(''); // State for handling errors

  const apiKey = '895284fb2d2c50a520ea537456963d9c';

  
  const fetchWeather = (url) => {
    axios.get(url)
      .then((response) => {
        setData(response.data);
        setError(''); 
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
        setData({}); 
        setError('Oops! Weather update not available :('); 
      });
  };

  
  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
      fetchWeather(url);
      setLocation('');
    }
  };

  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  }, []);

  
  useEffect(() => {
    if (coords.lat && coords.lon) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=${apiKey}`;
      fetchWeather(url);
    }
  }, [coords]);

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text"
        />
      </div>
      <div className="container">
        {error ? ( 
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="top">
              <div className="location">
                <p>{data.name}</p>
              </div>
              <div className="temp">
                {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
              </div>
              <div className="description">
                {data.weather ? <p>{data.weather[0].main}</p> : null}
              </div>
            </div>

            {data.name !== undefined &&
              <div className="bottom">
                <div className="feels">
                  {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°F</p> : null}
                  <p>Feels Like</p>
                </div>
                <div className="humidity">
                  {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
                  <p>Humidity</p>
                </div>
                <div className="wind">
                  {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH</p> : null}
                  <p>Wind Speed</p>
                </div>
              </div>
            }
          </>
        )}
      </div>
    </div>
  );
}

export default App;
