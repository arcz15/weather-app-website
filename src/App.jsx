import React, { useState, useEffect, useRef } from 'react';
import SearchIcon from './assets/icons/search.svg';
import './App.style.css';

const API_KEY = import.meta.env.VITE_API_KEY;

const getFormattedLocaltime = (localtime) => {
    let date = new Date(localtime);
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatted = {
        hours: () => { return date.getHours() < 10 ? '0' + date.getHours() : date.getHours() },
        minutes: () => { return date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() },
        weekDay: weekDays[date.getDay()],
        day: () => { return date.getDate() < 10 ? '0' + date.getDate() : date.getDate() },
        month: months[date.getMonth()],
        year: `'${ date.getFullYear().toString().substring(2) }`,
    }
    return `${formatted.hours()}:${formatted.minutes()} - ${formatted.weekDay}, ${formatted.day()} ${formatted.month} ${formatted.year}`;
}

const App = () => {

    const [weatherData, setWeatherData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [background, setBackground] = useState('clear-bg');
    const [isNight, setIsNight] = useState(false);

    const inputRef = useRef();

    const setBackgroundImage = (weatherCondition) => {
        if(weatherCondition.search(/sunny/ig) !== -1) setBackground('sunny-bg');
        else if(weatherCondition.search(/cloudy/ig) !== -1) setBackground('clouds-bg');
        else if(weatherCondition.search(/overcast/ig) !== -1) setBackground('overcast-bg');
        else if(weatherCondition.search(/mist/ig) !== -1 || weatherCondition.search(/fog/ig) !== -1) 
            setBackground('mist-bg');
        else if(weatherCondition.search(/rain/ig) !== -1) setBackground('rain-bg');
        else if(weatherCondition.search(/snow/ig) !== -1) setBackground('snow-bg');
        else if(weatherCondition.search(/blizzard/ig) !== -1) setBackground('blizzard-bg');
        else if(weatherCondition.search(/drizzle/ig) !== -1) setBackground('drizzle-bg');
        else if(weatherCondition.search(/sleet/ig) !== -1) setBackground('sleet-bg');
        else if(weatherCondition.search(/thunder/ig) !== -1) setBackground('thunder-bg');
        else setBackground('clear-bg');
    }

    const fetchWeather = async (location) => {
        setIsLoading(true);
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`)
        .then(res => res.json());
        setWeatherData(response);
        setBackgroundImage(response.current.condition.text);
        let date = new Date(response.location.localtime);
        date.getHours() <= 5 ? setIsNight(true) : setIsNight(false);
        setIsLoading(false);
    }

    const handleSearch = (e) => {
        const location = inputRef.current.value;
        if(!location || location === "") return;
        fetchWeather(location);
    }
    
    useEffect(() => {
        fetchWeather('Cracow');
    }, []);

    return (
        <div className={`app ${background} ${isNight ? 'night-bg' : 'day-bg'}`}>
            <div className='left-side'>
                <p className='text-logo'>the.weather</p>
                <div className='weather-info'>
                    { isLoading ? (
                        <div className="loading-info"/>
                    ) : (
                        <React.Fragment>
                            <h1>{ weatherData.current.temp_c }°</h1>
                            <div className='location-info'>
                                <h2>{ weatherData.location.name }</h2>
                                <p>{ getFormattedLocaltime(weatherData.location.localtime) }</p>
                            </div>
                            <div className='weather-icon'>
                                <img src={ weatherData.current.condition.icon } alt="RAINING" width='72' height='72' />
                                <p>{ weatherData.current.condition.text }</p>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
            <div className='right-side'>
                <div className='search-container'>
                    <input type='text' placeholder='Another location' ref={inputRef}/>
                    <div onClick={handleSearch}><img src={SearchIcon} alt='SEARCH' width='36' height='36'/></div>
                </div>
                <div className='example-cities'>
                    <div><p onClick={() => fetchWeather('Warsaw')}>Warsaw</p></div>
                    <div><p onClick={() => fetchWeather('Berlin')}>Berlin</p></div>
                    <div><p onClick={() => fetchWeather('Moscow')}>Moscow</p></div>
                    <div><p onClick={() => fetchWeather('Paris')}>Paris</p></div>
                </div>
                <hr className='divider-1' />
                <div className='weather-details'>
                    <h3>Weather Details</h3>
                    <div>
                        <p>Cloudy</p>
                        { isLoading ? ( 
                            <p className='loading-details' /> 
                        ) : ( 
                            <p>{ weatherData.current.cloud }%</p>
                        )}
                    </div>
                    <div>
                        <p>Humidity</p>
                        { isLoading ? ( 
                            <p className='loading-details' /> 
                        ) : ( 
                            <p>{ weatherData.current.humidity }%</p>
                        )}
                    </div>
                    <div>
                        <p>Wind</p>
                        { isLoading ? ( 
                            <p className='loading-details' /> 
                        ) : ( 
                            <p>{ weatherData.current.wind_kph } km/h</p>
                        )}
                    </div>
                    <div>
                        <p>Pressure</p>
                        { isLoading ? ( 
                            <p className='loading-details' /> 
                        ) : ( 
                            <p>{ weatherData.current.pressure_mb } hPa</p>
                        )}
                    </div>
                </div>
                <hr className='divider-2' />
            </div>
        </div>
    )
}

export default App