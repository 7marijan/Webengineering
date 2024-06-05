import { useState } from "react";
import "../stylesheets/page.sass";
import axios from "axios";
import Weather from "./component/weather.js";
import Wikipedia from "./component/wikipedia.js";


const App = () => {
    const [weatherData, setWeatherData] = useState({});
    const [status, setStatus] = useState("");

/* fetchLocation fetches the coordinates of a city from the OpenWeatherMap API. */
  const fetchLocation = async (cityName) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${process.env.REACT_APP_APIKEY}`, {
        params: {
          q: cityName,
          units: 'imperial',
          appid: process.env.REACT_APP_APIKEY,
        },
    });
    return response.data.coord;
    } catch (error) {
      setStatus("Couldn't find city!");
    }
  };

/* fetchWeather fetches the weather data for a city using the coordinates obtained from fetchLocation. */
  const fetchWeather = async (coords) => {
    try {
      const { lat, lon } = coords;
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_APIKEY}`, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: process.env.REACT_APP_APIKEY,
        },
      });

      const weatherDataList = response.data.list;
      const weatherDataMapped = weatherDataList.reduce((acc, day) => {
          const date = day.dt_txt.split(" ")[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(day);
        return acc;
      }, {});
      setStatus("");
      setWeatherData(weatherDataMapped);
    } catch (error) {
      setStatus("Couldn't find weather!");
    }
  };

/* handleSubmit handles the form submission event. */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Loading...");
    const cityName = event.target.city.value;
    const coords = await fetchLocation(cityName);
    if (coords) {
      await fetchWeather(coords);
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <Wikipedia/>
      </div>
            
      <div className="container">
        <div className="weather-page-root">
          <h2 className="title">Wetter</h2>
          <div className="weather-page-search">
            <form onSubmit={handleSubmit}>
              <input type="text" name="city" id="city" defaultValue="Stuttgart" />
              <input type="submit" value="Anfragen" />
            </form>
          </div>
        </div>
      </div>
      <p>{status}</p>
      {
        Object.keys(weatherData).length > 0 &&
        <div className="container">
          <div className="weather-page-root">        
            <div className="weather-page-content">
              {Object.keys(weatherData).map((key) => (
                <Weather key={key} day={key} data={weatherData[key]} />
              ))}
            </div>
          </div>
        </div>
      }
    </div>
    );
};

export default App;
