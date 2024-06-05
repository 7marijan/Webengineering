import "../../stylesheets/weather.sass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faCloud, faCloudRain } from '@fortawesome/free-solid-svg-icons';

const Weather = ({ day, data }) => {

/* WeatherIcon component displays an icon based on the weather condition. */
  const WeatherIcon = ({ weather }) => {
    const icons = {
      Clear: faSun,
      Rain: faCloudRain,
      Clouds: faCloud,
    };

    return <FontAwesomeIcon icon={icons[weather] || faSun} />;
  };

/*This component receives the weather data as a prop. It calculates and displays the minimum and maximum temperatures for the day.
 It also determines the most frequent weather condition for the day and displays the corresponding icon using the WeatherIcon component. */
  const WeatherMinMaxComponent = ({ data }) => {
    const temps = data.map((value) => value.main.temp);
    const dayName = new Date(day).toLocaleDateString("de-DE", { weekday: "long" });
    const currentDayName = new Date().toLocaleDateString("de-DE", { weekday: "long" });
    const weatherMains = data.map((value) => value.weather[0].main);

    // Count occurrences of each weather condition
    const countOccurences = weatherMains.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});

    let mostFrequentWeather = "";
    let maxOccurences = 0;
    for (const key in countOccurences) {
        if (countOccurences[key] > maxOccurences) {
            mostFrequentWeather = key;
            maxOccurences = countOccurences[key];
        }
    }

    // Display the weather day card
    return (
        <div className="weather-day-card"> 
            <div className="weather-day-card-content">
                <h2>{dayName === currentDayName ? "Heute" : dayName}</h2>
                <WeatherIcon weather={mostFrequentWeather} />
            </div>
            <h3>Min: {Math.floor(Math.min(...temps))}°</h3>
            <h3>Max: {Math.floor(Math.max(...temps))}°</h3>
        </div>
    )
  };
  
  return (
    <div>
        <div className="weather-day-root">
            <WeatherMinMaxComponent data={data} />
        </div>
    </div>
  );
};

export default Weather;
