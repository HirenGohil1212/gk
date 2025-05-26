
import { type NextRequest, NextResponse } from 'next/server';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Moon, Sun, Wind, Cloudy, SunSnow, MoonCloud, CloudMoon } from 'lucide-react';

// Helper function to map OpenWeatherMap icon codes to Lucide icons
const getIcon = (iconCode: string): React.ElementType => {
  switch (iconCode) {
    case '01d': return Sun; // clear sky day
    case '01n': return Moon; // clear sky night
    case '02d': return CloudSun; // few clouds day
    case '02n': return CloudMoon; // few clouds night
    case '03d': return Cloud; // scattered clouds day
    case '03n': return Cloud; // scattered clouds night
    case '04d': return Cloudy; // broken clouds day
    case '04n': return Cloudy; // broken clouds night
    case '09d': return CloudDrizzle; // shower rain day
    case '09n': return CloudDrizzle; // shower rain night
    case '10d': return CloudRain; // rain day
    case '10n': return CloudRain; // rain night
    case '11d': return CloudLightning; // thunderstorm day
    case '11n': return CloudLightning; // thunderstorm night
    case '13d': return CloudSnow; // snow day
    case '13n': return CloudSnow; // snow night
    case '50d': return CloudFog; // mist day
    case '50n': return CloudFog; // mist night
    default: return Cloud; // Default icon
  }
};

// Define the expected structure for our frontend
type WeatherCondition = {
  temp: number;
  condition: string;
  icon: React.ElementType;
  humidity?: number;
  windSpeed?: number; // km/h
  windDirection?: string;
  feelsLike?: number;
  dt: number; // Unix timestamp
};

type HourlyForecast = {
  time: string; // e.g., "3 PM"
  temp: number;
  condition: string;
  icon: React.ElementType;
  dt: number;
};

type DailyForecast = {
  day: string; // e.g., "Mon", "Tomorrow"
  high: number;
  low: number;
  condition: string;
  icon: React.ElementType;
  dt: number;
};

type WeatherData = {
  locationName: string;
  current: WeatherCondition;
  hourly: HourlyForecast[]; // Will be empty with /data/2.5/weather
  daily: DailyForecast[];   // Will be empty with /data/2.5/weather
};


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  if (!apiKey) {
    console.error("OPENWEATHERMAP_API_KEY is not set in environment variables.");
    return NextResponse.json({ error: 'Weather API key is not configured on the server. Please check server logs.' }, { status: 500 });
  }

  try {
    // Using OpenWeatherMap current weather data API (/data/2.5/weather)
    // This endpoint is generally available on all free plans.
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      console.error("OpenWeatherMap API error:", errorData);
      // Provide more specific error message if available from API
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
      icon: getIcon(weatherApiData.weather[0]?.icon),
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
    if (error instanceof Error && (error as any).message?.includes("Invalid API key")) {
        return NextResponse.json({ error: (error as any).message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error fetching weather data' }, { status: 500 });
  }
}

function getWindDirection(degrees: number): string {
  if (typeof degrees !== 'number') return ''; // Handle cases where degrees might be undefined
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
