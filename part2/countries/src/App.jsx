import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import CountryWeather from './components/CountryWeather';


const App = () => {
  const [search, setSearch] = useState('') //Search country
  const [countries, setCountries] =  useState([]) //API result
  const [filteredCountries, setFilteredCountries] = useState([]) //Filtered

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);

  // Filter countries with search terms
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredCountries([]);
      return;
    }
    const result = countries.filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCountries(result);
  }, [search, countries]);  

  // Render based on the number of filtered countries

  const renderCountries = () => {
    if (filteredCountries.length > 10) {
      <p>Too many matches, specify another filter</p>
    } else if (filteredCountries.length > 1){
      return (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca3}>{country.name.common}
            <button onClick={() => setSearch(country.name.common)}>show</button>
            </li>
          ))}
        </ul>
      );
    } else if (filteredCountries.length === 1) {
      const country = filteredCountries[0];
      return (
        <div>
          <h1>{country.name.common}</h1>
          <p><strong>Capital:</strong> {country.capital}</p>
          <p><strong>Area:</strong> {country.area} km²</p>
          <h2>Laguages</h2>
          <ul>
            {Object.values(country.languages).map((lang, index) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
          <img 
          src={country.flags.png} 
          alt={country.name.common} 
          style={{width: '150px', border: '1px solid black'}}
          />
          <CountryWeather country={country}/>
        </div>
      );
    } else {
      return <p>No matches found</p>
    }
  };
  return(
    <div>
      <Filter filter={search} handleFiltering={(e) => setSearch(e.target.value)}/>
      {renderCountries()}
    </div>

  );
}; 
export default App

