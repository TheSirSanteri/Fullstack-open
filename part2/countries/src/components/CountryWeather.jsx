import {useEffect, useState} from 'react'

import axios from 'axios'

const API_KEY = import.meta.env.VITE_API_KEY

const CountryWeather = ({country}) => {
    const [weather, setWeather] = useState(null)
    const capital = Array.isArray(country.capital) ? country.capital[0] : country.capital;

    useEffect(() => {
        axios
        .get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${capital}`)
        .then(response => {
            console.log('weather api response:', response.data)
            setWeather(response.data)
        })
        .catch((error) => console.error('Error fetching weather:', error));
    }, [country.capital]);
    
    if (weather === null) {
        return <p>Loading weather data...</p>
    }
    
    return (
        <div>
        <h2>Weather in {country.capital}</h2>
        <p><strong>Temperature:</strong> {weather.current.temp_c}°C</p>
        <img src={weather.current.condition.icon} alt={weather.current.condition.text} />
        <p><strong>Condition:</strong> {weather.current.condition.text}</p>
        <p><strong>Wind:</strong> {weather.current.wind_kph} km/h, direction {weather.current.wind_dir}</p>
        </div>
    )
};

export default CountryWeather