
import { type NextRequest, NextResponse } from 'next/server';

// Define the expected structure for our frontend
// Note: 'icon' will now be the OpenWeatherMap icon code string (e.g., "01d")
type WeatherCondition = {
  temp: number;
  condition: string;
  icon: string; // Changed from React.ElementType to string
  humidity?: number;
  windSpeed?: number; // km/h
  windDirection?: string;
  feelsLike?: number;
  dt: number; // Unix timestamp
};

// Hourly and Daily forecasts are not provided by /data/2.5/weather endpoint
type HourlyForecast = Record<string, never>; // Empty object, effectively
type DailyForecast = Record<string, never>;  // Empty object, effectively

type WeatherData = {
  locationName: string;
  current: WeatherCondition;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
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
    // Using OpenWeatherMap current weather data API (/data/2.5/weather)
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      console.error("OpenWeatherMap API error:", errorData);
      const message = errorData.message || `Failed to fetch weather data: ${weatherResponse.statusText}`;
      return NextResponse.json({ error: message }, { status: weatherResponse.status });
    }

    const weatherApiData = await weatherResponse.json();
    
    let locationName = weatherApiData.name || "Current Location";
    if (weatherApiData.sys && weatherApiData.sys.country) {
        locationName += `, ${weatherApiData.sys.country}`;
    }
    
    const currentWeatherData: WeatherCondition = {
      dt: weatherApiData.dt,
      temp: Math.round(weatherApiData.main.temp),
      condition: weatherApiData.weather[0]?.description || 'N/A',
      icon: weatherApiData.weather[0]?.icon || '03d', // Store OWM icon code, default to '03d' (scattered clouds)
      humidity: weatherApiData.main.humidity,
      windSpeed: Math.round(weatherApiData.wind.speed * 3.6), // m/s to km/h
      windDirection: getWindDirection(weatherApiData.wind.deg),
      feelsLike: Math.round(weatherApiData.main.feels_like),
    };

    // Hourly and Daily forecasts are not available from /data/2.5/weather endpoint
    const hourlyForecasts: HourlyForecast[] = [];
    const dailyForecasts: DailyForecast[] = [];

    const responsePayload: WeatherData = {
        locationName: locationName,
        current: currentWeatherData,
        hourly: hourlyForecasts,
        daily: dailyForecasts,
    };

    return NextResponse.json(responsePayload);

  } catch (error) {
    console.error('Error in weather API route:', error);
    let errorMessage = 'Internal server error fetching weather data';
    let errorStatus = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      if ((error as any).message?.includes("Invalid API key")) {
        errorStatus = 401; // Unauthorized
      }
    }
    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
}

function getWindDirection(degrees: number): string {
  if (typeof degrees !== 'number') return '';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
