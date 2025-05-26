
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
  hourly: HourlyForecast[]; // Will be 3-hourly
  daily: DailyForecast[];
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
    // Using OpenWeatherMap 5 day / 3 hour forecast API (data/2.5/forecast)
    // This endpoint is generally available on free plans.
    // Free tier for One Call API 3.0 typically includes 1-hourly forecasts for 48h and daily for 8 days.
    // However, user reported issues, so switched to data/2.5/forecast which is more common for basic free keys.
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

    const [forecastResponse, geoResponse] = await Promise.all([
      fetch(forecastUrl),
      fetch(geoUrl)
    ]);

    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      console.error("OpenWeatherMap Forecast API error:", errorData);
      return NextResponse.json({ error: `Failed to fetch weather data: ${errorData.message || forecastResponse.statusText}` }, { status: forecastResponse.status });
    }
     if (!geoResponse.ok) {
      // Geo API is supplementary; log warning but don't fail the request if it errors
      console.warn("OpenWeatherMap Geo API error:", await geoResponse.text());
    }

    const weatherApiData = await forecastResponse.json();
    let locationName = weatherApiData.city?.name || "Current Location"; 

    if (geoResponse.ok) {
        const geoApiData = await geoResponse.json();
        if (geoApiData && geoApiData.length > 0) {
            locationName = geoApiData[0].name || locationName;
            if (geoApiData[0].state) locationName += `, ${geoApiData[0].state}`;
            if (geoApiData[0].country) locationName += `, ${geoApiData[0].country}`;
        }
    }

    if (!weatherApiData.list || weatherApiData.list.length === 0) {
        return NextResponse.json({ error: 'No forecast data received from OpenWeatherMap.' }, { status: 500 });
    }
    
    const firstForecast = weatherApiData.list[0];
    const currentWeatherData: WeatherCondition = {
      dt: firstForecast.dt,
      temp: Math.round(firstForecast.main.temp),
      condition: firstForecast.weather[0]?.description || 'N/A',
      icon: getIcon(firstForecast.weather[0]?.icon),
      humidity: firstForecast.main.humidity,
      windSpeed: Math.round(firstForecast.wind.speed * 3.6), // m/s to km/h
      windDirection: getWindDirection(firstForecast.wind.deg),
      feelsLike: Math.round(firstForecast.main.feels_like),
    };

    const hourlyForecasts: HourlyForecast[] = (weatherApiData.list || []).slice(0, 8).map((hour: any) => ({ // Next 8 * 3 = 24 hours
      dt: hour.dt,
      time: new Date(hour.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
      temp: Math.round(hour.main.temp),
      condition: hour.weather[0]?.description || 'N/A',
      icon: getIcon(hour.weather[0]?.icon),
    }));

    // Process data for daily forecasts from the 3-hourly data
    const dailyDataAggregator: { [key: string]: { temps: number[], highs: number[], lows: number[], dts: number[], weatherEntries: {icon: string, condition: string, dt: number}[]} } = {};

    (weatherApiData.list || []).forEach((item: any) => {
        const dateStr = new Date(item.dt * 1000).toISOString().split('T')[0]; // Group by date string
        if (!dailyDataAggregator[dateStr]) {
            dailyDataAggregator[dateStr] = { temps: [], highs: [], lows: [], dts: [], weatherEntries: [] };
        }
        dailyDataAggregator[dateStr].temps.push(item.main.temp);
        dailyDataAggregator[dateStr].highs.push(item.main.temp_max);
        dailyDataAggregator[dateStr].lows.push(item.main.temp_min);
        dailyDataAggregator[dateStr].dts.push(item.dt);
        if (item.weather && item.weather[0]) {
            dailyDataAggregator[dateStr].weatherEntries.push({
                icon: item.weather[0].icon,
                condition: item.weather[0].description,
                dt: item.dt
            });
        }
    });
    
    const dailyForecasts: DailyForecast[] = Object.keys(dailyDataAggregator).slice(0, 5).map((dateStr, index) => {
        const dayData = dailyDataAggregator[dateStr];
        const high = Math.round(Math.max(...dayData.highs));
        const low = Math.round(Math.min(...dayData.lows));
        
        // Find weather for midday (around 12:00-15:00) for a representative icon/condition for the day
        let representativeWeather = dayData.weatherEntries.find(w => {
            const hour = new Date(w.dt * 1000).getHours();
            return hour >= 11 && hour <= 14; // Target midday hours
        });
        // Fallback: if no midday entry, try to find the entry with highest temperature or just the first one
        if (!representativeWeather && dayData.weatherEntries.length > 0) {
            // Simple fallback to the first available weather entry for the day
            representativeWeather = dayData.weatherEntries[0];
        }

        return {
            dt: new Date(dateStr + "T12:00:00Z").getTime() / 1000, // Use midday for consistent DT for the day
            day: index === 0 && new Date(dateStr).toDateString() === new Date().toDateString() ? 'Today' : new Date(dateStr).toLocaleDateString([], { weekday: 'short' }),
            high: high,
            low: low,
            condition: representativeWeather?.condition || 'N/A',
            icon: getIcon(representativeWeather?.icon || '03d'), // Default to a cloudy icon if none found
        };
    });


    const responsePayload: WeatherData = {
        locationName: locationName,
        current: currentWeatherData,
        hourly: hourlyForecasts,
        daily: dailyForecasts,
    };

    return NextResponse.json(responsePayload);

  } catch (error) {
    console.error('Error in weather API route:', error);
    // Pass specific API error messages to the client if available
    if (error instanceof Error && (error as any).message?.includes("subscription")) {
        return NextResponse.json({ error: (error as any).message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error fetching weather data' }, { status: 500 });
  }
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
