
import { type NextRequest, NextResponse } from 'next/server';

// Types for OpenWeatherMap API responses
type OWMCurrentWeather = {
  coord: { lon: number; lat: number };
  weather: { id: number; main: string; description: string; icon: string }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number };
  clouds: { all: number };
  rain?: { '1h'?: number; '3h'?: number };
  snow?: { '1h'?: number; '3h'?: number };
  dt: number;
  sys: { type?: number; id?: number; country: string; sunrise: number; sunset: number };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

type OWMForecastListItem = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: { id: number; main: string; description: string; icon: string }[];
  clouds: { all: number };
  wind: { speed: number; deg: number; gust: number };
  visibility: number;
  pop: number; // Probability of precipitation
  rain?: { '3h': number };
  snow?: { '3h': number };
  sys: { pod: string }; // Part of day (d or n)
  dt_txt: string;
};

type OWMForecastResponse = {
  cod: string;
  message: number | string;
  cnt: number;
  list: OWMForecastListItem[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
};

type OWMAirPollutionItem = {
  main: { aqi: number }; // AQI: 1 (Good), 2 (Fair), 3 (Moderate), 4 (Poor), 5 (Very Poor)
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
  dt: number;
};

type OWMAirPollutionResponse = {
  coord: { lon: number; lat: number };
  list: OWMAirPollutionItem[];
};


// Define the structure for our frontend
type WeatherCondition = {
  temp: number;
  condition: string;
  icon: string; // OWM icon code
  humidity?: number;
  windSpeed?: number; // km/h
  windDirection?: string;
  feelsLike?: number;
  dt: number; // Unix timestamp
};

type HourlyForecastItem = {
  dt: number;
  temp: number;
  condition: string;
  icon: string;
  pop: number; // Probability of precipitation
};

type DailyForecastItem = {
  dt: number;
  dayName: string;
  temp_min: number;
  temp_max: number;
  condition: string;
  icon: string;
  pop: number;
};

type AirQuality = {
  aqi: number; // 1-5
  co?: number;
  no2?: number;
  o3?: number;
  so2?: number;
  pm2_5?: number;
  pm10?: number;
  dt: number;
};

type WeatherData = {
  locationName: string;
  current: WeatherCondition;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQuality;
};


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    console.error("OPENWEATHERMAP_API_KEY is not set in environment variables.");
    return NextResponse.json({ error: 'Weather API key is not configured on the server. Please check server logs.' }, { status: 500 });
  }

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const airPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const [currentWeatherRes, forecastRes, airPollutionRes] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
      fetch(airPollutionUrl)
    ]);

    // Check current weather response
    if (!currentWeatherRes.ok) {
      const errorData = await currentWeatherRes.json();
      console.error("OpenWeatherMap Current Weather API error:", errorData);
      return NextResponse.json({ error: errorData.message || `Failed to fetch current weather: ${currentWeatherRes.statusText}` }, { status: currentWeatherRes.status });
    }
    const currentWeatherDataApi: OWMCurrentWeather = await currentWeatherRes.json();

    // Check forecast response
    if (!forecastRes.ok) {
      const errorData = await forecastRes.json();
      console.error("OpenWeatherMap Forecast API error:", errorData);
      return NextResponse.json({ error: errorData.message || `Failed to fetch forecast: ${forecastRes.statusText}` }, { status: forecastRes.status });
    }
    const forecastDataApi: OWMForecastResponse = await forecastRes.json();

    // Check air pollution response
    let airQualityData: AirQuality | undefined = undefined;
    if (airPollutionRes.ok) {
      const airPollutionDataApi: OWMAirPollutionResponse = await airPollutionRes.json();
      if (airPollutionDataApi.list && airPollutionDataApi.list.length > 0) {
        const aq = airPollutionDataApi.list[0];
        airQualityData = {
          aqi: aq.main.aqi,
          co: aq.components.co,
          no2: aq.components.no2,
          o3: aq.components.o3,
          so2: aq.components.so2,
          pm2_5: aq.components.pm2_5,
          pm10: aq.components.pm10,
          dt: aq.dt,
        };
      }
    } else {
      // Non-critical, log error but proceed
      const errorData = await airPollutionRes.json().catch(() => ({ message: "Failed to parse air pollution error" }));
      console.warn("OpenWeatherMap Air Pollution API error:", errorData.message || airPollutionRes.statusText);
    }
    
    const locationName = `${currentWeatherDataApi.name}, ${currentWeatherDataApi.sys.country}`;
    
    const current: WeatherCondition = {
      dt: currentWeatherDataApi.dt,
      temp: Math.round(currentWeatherDataApi.main.temp),
      condition: currentWeatherDataApi.weather[0]?.description || 'N/A',
      icon: currentWeatherDataApi.weather[0]?.icon || '03d',
      humidity: currentWeatherDataApi.main.humidity,
      windSpeed: Math.round(currentWeatherDataApi.wind.speed * 3.6), // m/s to km/h
      windDirection: getWindDirection(currentWeatherDataApi.wind.deg),
      feelsLike: Math.round(currentWeatherDataApi.main.feels_like),
    };

    // Process Hourly Forecast (next 8 segments, so 24 hours)
    const hourly: HourlyForecastItem[] = forecastDataApi.list.slice(0, 8).map(item => ({
      dt: item.dt,
      temp: Math.round(item.main.temp),
      condition: item.weather[0]?.description || 'N/A',
      icon: item.weather[0]?.icon || '03d',
      pop: Math.round(item.pop * 100),
    }));

    // Process Daily Forecast
    const daily: DailyForecastItem[] = [];
    const dailyDataAgg: { [key: string]: { temps: number[], pops: number[], icons: string[], conditions: string[], dts: number[] } } = {};

    forecastDataApi.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {timeZone: 'UTC'}); // Group by UTC date
      if (!dailyDataAgg[date]) {
        dailyDataAgg[date] = { temps: [], pops: [], icons: [], conditions: [], dts: [] };
      }
      dailyDataAgg[date].temps.push(item.main.temp);
      dailyDataAgg[date].pops.push(item.pop);
      dailyDataAgg[date].icons.push(item.weather[0].icon);
      dailyDataAgg[date].conditions.push(item.weather[0].description);
      dailyDataAgg[date].dts.push(item.dt);
    });

    const today = new Date();
    today.setUTCHours(0,0,0,0); // Start of today UTC

    for (const dateKey in dailyDataAgg) {
      const dayAgg = dailyDataAgg[dateKey];
      const dayTimestamp = dayAgg.dts.sort((a,b) => a-b)[Math.floor(dayAgg.dts.length / 2)]; // Mid-day timestamp
      
      // Skip if this day is before today (can happen due to timezone differences with API data start)
      const dayDate = new Date(dayTimestamp * 1000);
      if (dayDate < today && daily.length === 0 && Object.keys(dailyDataAgg).length > 5) continue;


      // Find icon/condition for around noon if possible, otherwise first
      let representativeIndex = dayAgg.dts.findIndex(dt => new Date(dt * 1000).getUTCHours() >= 11 && new Date(dt * 1000).getUTCHours() <= 13);
      if (representativeIndex === -1) representativeIndex = 0;
      
      daily.push({
        dt: dayTimestamp,
        dayName: new Date(dayTimestamp * 1000).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
        temp_min: Math.round(Math.min(...dayAgg.temps)),
        temp_max: Math.round(Math.max(...dayAgg.temps)),
        icon: dayAgg.icons[representativeIndex] || '03d',
        condition: dayAgg.conditions[representativeIndex] || 'Varied conditions',
        pop: Math.round(Math.max(...dayAgg.pops) * 100), // Max probability of precipitation for the day
      });
    }
    // Ensure we have up to 5 days of forecast, slicing if necessary
    const SlicedDaily = daily.slice(0, 5);


    const responsePayload: WeatherData = {
        locationName: locationName,
        current: current,
        hourly: hourly,
        daily: SlicedDaily,
        airQuality: airQualityData,
    };

    return NextResponse.json(responsePayload);

  } catch (error) {
    console.error('Error in weather API route:', error);
    let errorMessage = 'Internal server error fetching weather data';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

function getWindDirection(degrees: number): string {
  if (typeof degrees !== 'number') return '';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

