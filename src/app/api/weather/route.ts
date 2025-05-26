
import { type NextRequest, NextResponse } from 'next/server';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Moon, Sun, ThermometerSun, ThermometerSnow, Waves, Wind, Zap, Snowflake, Cloudy, SunSnow, MoonCloud, CloudMoon } from 'lucide-react'; // Added more icons

// Helper function to map OpenWeatherMap icon codes to Lucide icons
const getIcon = (iconCode: string): React.ElementType => {
  switch (iconCode) {
    case '01d': return Sun; // clear sky day
    case '01n': return Moon; // clear sky night
    case '02d': return CloudSun; // few clouds day
    case '02n': return CloudMoon; // few clouds night
    case '03d': return Cloud; // scattered clouds day
    case '03n': return Cloud; // scattered clouds night (using same as day for simplicity)
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
  time: string; // e.g., "3 PM", "Now"
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
  locationName: string; // Name of the location if available
  current: WeatherCondition;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
};

type WeatherAlertInfo = {
  id: string;
  title: string;
  description:string;
  severity: "warning" | "info" | "danger";
  date: string; // Start date of the alert
  sender: string;
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
    return NextResponse.json({ error: 'Weather API key is not configured' }, { status: 500 });
  }

  try {
    // Using OpenWeatherMap One Call API 3.0.
    // The free tier for this API typically includes 1,000 calls/day and provides:
    // - Current weather
    // - Minutely forecast for 1 hour (we exclude this with `exclude=minutely`)
    // - Hourly forecast for 48 hours (we use the first 12 hours)
    // - Daily forecast for 8 days (we use the first 7 days)
    // - National weather alerts
    // This setup is intended to stay within these free limits.
    const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${apiKey}&units=metric`;
    const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

    const [oneCallResponse, geoResponse] = await Promise.all([
      fetch(oneCallUrl),
      fetch(geoUrl)
    ]);

    if (!oneCallResponse.ok) {
      const errorData = await oneCallResponse.json();
      console.error("OpenWeatherMap OneCall API error:", errorData);
      return NextResponse.json({ error: `Failed to fetch weather data: ${errorData.message || oneCallResponse.statusText}` }, { status: oneCallResponse.status });
    }
     if (!geoResponse.ok) {
      // Non-critical, so we can proceed without location name
      console.warn("OpenWeatherMap Geo API error:", await geoResponse.text());
    }

    const weatherApiData = await oneCallResponse.json();
    let locationName = "Current Location";
    if (geoResponse.ok) {
        const geoApiData = await geoResponse.json();
        if (geoApiData && geoApiData.length > 0) {
            locationName = geoApiData[0].name || locationName;
            if (geoApiData[0].state) locationName += `, ${geoApiData[0].state}`;
            if (geoApiData[0].country) locationName += `, ${geoApiData[0].country}`;
        }
    }


    const currentWeatherData: WeatherCondition = {
      dt: weatherApiData.current.dt,
      temp: Math.round(weatherApiData.current.temp),
      condition: weatherApiData.current.weather[0]?.description || 'N/A',
      icon: getIcon(weatherApiData.current.weather[0]?.icon),
      humidity: weatherApiData.current.humidity,
      windSpeed: Math.round(weatherApiData.current.wind_speed * 3.6), // m/s to km/h
      windDirection: getWindDirection(weatherApiData.current.wind_deg),
      feelsLike: Math.round(weatherApiData.current.feels_like),
    };

    const hourlyForecasts: HourlyForecast[] = weatherApiData.hourly.slice(0, 12).map((hour: any, index: number) => ({ // Take next 12 hours
      dt: hour.dt,
      time: index === 0 ? 'Now' : new Date(hour.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
      temp: Math.round(hour.temp),
      condition: hour.weather[0]?.description || 'N/A',
      icon: getIcon(hour.weather[0]?.icon),
    }));

    const dailyForecasts: DailyForecast[] = weatherApiData.daily.slice(0, 7).map((day: any, index: number) => ({ // Take next 7 days
      dt: day.dt,
      day: index === 0 ? 'Today' : new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'short' }),
      high: Math.round(day.temp.max),
      low: Math.round(day.temp.min),
      condition: day.weather[0]?.description || 'N/A',
      icon: getIcon(day.weather[0]?.icon),
    }));
    
    const weatherAlerts: WeatherAlertInfo[] = (weatherApiData.alerts || []).map((alert: any, index: number) => ({
        id: `alert-${index}-${alert.event.replace(/\s+/g, '-')}`,
        title: alert.event,
        description: alert.description,
        // Simplified severity, real APIs might have more detailed levels
        severity: alert.event.toLowerCase().includes("warning") ? "warning" : alert.event.toLowerCase().includes("watch") ? "warning" : "info",
        date: new Date(alert.start * 1000).toLocaleDateString(),
        sender: alert.sender_name || "Meteorological Agency",
    }));


    const responsePayload: { weatherData: WeatherData, weatherAlerts: WeatherAlertInfo[] } = {
        weatherData: {
            locationName: locationName,
            current: currentWeatherData,
            hourly: hourlyForecasts,
            daily: dailyForecasts,
        },
        weatherAlerts: weatherAlerts
    };

    return NextResponse.json(responsePayload);

  } catch (error) {
    console.error('Error in weather API route:', error);
    return NextResponse.json({ error: 'Internal server error fetching weather data' }, { status: 500 });
  }
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

