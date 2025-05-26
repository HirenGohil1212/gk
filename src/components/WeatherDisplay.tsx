
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Thermometer, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun, Umbrella, Wind, MapPin, Loader2, AlertTriangle, RotateCw, Moon, Cloudy, SunSnow, MoonCloud, CloudMoon } from "lucide-react"; // Added more icons
import Image from "next/image";
import { cn } from "@/lib/utils";

// Redefine types to match what the API route will provide
type WeatherCondition = {
  temp: number;
  condition: string;
  icon: React.ElementType; // Icon component itself
  humidity?: number;
  windSpeed?: number; // km/h
  windDirection?: string;
  feelsLike?: number;
  dt: number;
};

type HourlyForecast = {
  time: string;
  temp: number;
  condition: string;
  icon: React.ElementType;
  dt: number;
};

type DailyForecast = {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: React.ElementType;
  dt: number;
};

type WeatherData = {
  locationName: string;
  current: WeatherCondition;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
};

type WeatherAlertInfo = {
  id: string;
  title: string;
  description: string;
  severity: "warning" | "info" | "danger";
  date: string;
  sender: string;
};

// This type will be the expected response from our /api/weather endpoint
type ApiWeatherResponse = {
  weatherData: WeatherData;
  weatherAlerts: WeatherAlertInfo[];
};


const WeatherIcon = ({ iconName, className }: { iconName: React.ElementType; className?: string }) => {
  const IconComponent = iconName || Cloud; // Default to Cloud if no icon provided
  return <IconComponent className={cn("h-8 w-8", className)} />;
};

export function WeatherDisplay() {
  const [apiResponse, setApiResponse] = useState<ApiWeatherResponse | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<"prompt" | "granted" | "denied">("prompt");

  const fetchWeatherFromApi = useCallback(async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch weather: ${response.statusText}`);
      }
      const data: ApiWeatherResponse = await response.json();
      setApiResponse(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      console.error(err);
      setApiResponse(null); // Clear old data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLocationRequest = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      setPermissionStatus("denied");
      return;
    }

    setIsLoading(true); // Set loading true when requesting location
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setPermissionStatus("granted");
        fetchWeatherFromApi(latitude, longitude);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location access denied. Please enable location services in your browser settings to see local weather.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("The request to get user location timed out.");
            break;
          default:
            setError("An unknown error occurred while getting location.");
            break;
        }
        setPermissionStatus("denied");
        setIsLoading(false);
        setApiResponse(null); // Clear any stale data
      }
    );
  }, [fetchWeatherFromApi]);

  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then(status => {
        setPermissionStatus(status.state);
        if (status.state === 'granted' && location) { // If already granted and location known, fetch
             fetchWeatherFromApi(location.latitude, location.longitude);
        } else if (status.state === 'granted' && !location) { // Granted but no location yet (e.g. page refresh)
            handleLocationRequest();
        } else if (status.state === 'prompt') {
          setIsLoading(false); 
        } else { 
          setError("Location access denied. Please enable location services in your browser settings to see local weather.");
          setIsLoading(false);
        }
        
        status.onchange = () => {
          setPermissionStatus(status.state);
          if (status.state === 'granted') {
            handleLocationRequest();
          } else if (status.state === 'denied') {
             setError("Location access denied. Please enable location services in your browser settings to see local weather.");
             setIsLoading(false);
             setApiResponse(null);
          }
        };
      }).catch(() => {
        handleLocationRequest(); // Fallback if permission query fails
      });
    } else {
      handleLocationRequest(); // Fallback for older browsers
    }
  }, [handleLocationRequest, fetchWeatherFromApi, location]); // Add location to deps

  const weatherData = apiResponse?.weatherData;
  const weatherAlerts = apiResponse?.weatherAlerts || [];

  if (isLoading && permissionStatus === 'prompt') {
    return (
      <Card className="shadow-xl text-center">
        <CardHeader>
          <CardTitle>Local Weather</CardTitle>
          <CardDescription>Checking location permission...</CardDescription>
        </CardHeader>
        <CardContent>
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">To provide local weather, we need your location.</p>
        </CardContent>
      </Card>
    );
  }

  if (permissionStatus !== 'granted' && !isLoading) {
    return (
      <Card className="shadow-xl text-center">
        <CardHeader>
          <CardTitle>Location Access Required</CardTitle>
          <CardDescription>To show you the local weather, please grant location access.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && ( 
            <Alert variant="destructive" className="mb-4 text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={handleLocationRequest} disabled={isLoading}>
            <MapPin className="mr-2 h-4 w-4" /> Grant Location Access
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (isLoading) {
     return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Fetching weather data...</p>
      </div>
    );
  }
  
  if (error && !weatherData) {
     return (
      <Card className="shadow-xl text-center">
        <CardHeader>
          <CardTitle>Weather Unavailable</CardTitle>
        </CardHeader>
        <CardContent>
           <Alert variant="destructive" className="mb-4 text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error} Please check your OpenWeatherMap API key in the .env file or try again.</AlertDescription>
            </Alert>
            <Button onClick={() => location && fetchWeatherFromApi(location.latitude, location.longitude)} disabled={isLoading || !location}>
             <RotateCw className="mr-2 h-4 w-4" /> Retry
            </Button>
             {!location && <p className="text-sm text-muted-foreground mt-2">If location access was denied, please grant it and retry.</p>}
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
        <Card className="shadow-xl text-center">
          <CardHeader>
            <CardTitle>Weather Data Not Loaded</CardTitle>
            <CardDescription>Could not load weather information. This might be due to missing API key or network issues. Please ensure your OPENWEATHERMAP_API_KEY is set in .env.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => location && fetchWeatherFromApi(location.latitude, location.longitude)} className="mt-4" disabled={isLoading || !location}>
             <MapPin className="mr-2 h-4 w-4" /> {location ? 'Refresh Weather' : 'Get Weather'}
            </Button>
          </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <div className="relative h-48 md:h-64">
          <Image src="https://placehold.co/1200x400.png" alt="Weather background" layout="fill" objectFit="cover" data-ai-hint="sky clouds" />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white p-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">{weatherData.locationName}</h1>
            <p className="text-lg md:text-xl capitalize">{weatherData.current.condition}</p>
            {location && <p className="text-xs mt-1">(Lat: {location.latitude.toFixed(2)}, Lon: {location.longitude.toFixed(2)})</p>}
            <Button variant="outline" size="sm" onClick={() => location && fetchWeatherFromApi(location.latitude, location.longitude)} className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/50">
                <RotateCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center md:items-start">
              <WeatherIcon iconName={weatherData.current.icon} className="h-20 w-20 md:h-24 md:w-24 text-primary mb-2" />
              <p className="text-5xl md:text-6xl font-bold">{weatherData.current.temp}°C</p>
              <p className="text-muted-foreground">Feels like {weatherData.current.feelsLike}°C</p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Umbrella className="h-5 w-5 text-primary" />
                <span>Humidity: {weatherData.current.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-primary" />
                <span>Wind: {weatherData.current.windSpeed} km/h {weatherData.current.windDirection}</span>
              </div>
              <div className="flex items-center gap-2">
                 <Thermometer className="h-5 w-5 text-primary" />
                <span>Updated: {new Date(weatherData.current.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {weatherAlerts.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" /> Weather Alerts & Advisories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weatherAlerts.map((alert) => (
              <Alert key={alert.id} variant={alert.severity === "danger" ? "destructive" : "default"} 
                     className={cn(
                        alert.severity === "warning" && "border-orange-500/50 text-orange-700 dark:text-orange-400 [&>svg]:text-orange-500",
                        alert.severity === "info" && "border-blue-500/50 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-500"
                     )}
              >
                <AlertTriangle className="h-4 w-4" /> {/* Generic icon, color will hint severity */}
                <AlertTitle>{alert.title} - <span className="font-normal text-xs">({alert.sender} - {alert.date})</span></AlertTitle>
                <AlertDescription className="whitespace-pre-line">{alert.description}</AlertDescription>
              </Alert>
            ))}
             <p className="text-xs text-muted-foreground pt-2">
                Alerts are provided by meteorological agencies via OpenWeatherMap. Always consult official sources for critical decisions.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Hourly Forecast (Next 12 Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {weatherData.hourly.map((hour) => (
              <Card key={hour.dt} className="p-3 flex flex-col items-center text-center bg-muted/30 hover:bg-muted/50 transition-colors rounded-lg">
                <p className="font-medium text-sm">{hour.time}</p>
                <WeatherIcon iconName={hour.icon} className="my-2 h-8 w-8 md:h-10 md:w-10 text-primary" />
                <p className="text-lg font-semibold">{hour.temp}°C</p>
                <p className="text-xs text-muted-foreground capitalize">{hour.condition}</p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weatherData.daily.map((day) => (
            <div key={day.dt} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <p className="font-medium w-1/4 text-sm">{day.day}</p>
              <div className="w-1/2 flex items-center justify-center gap-2">
                <WeatherIcon iconName={day.icon} className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                <p className="text-xs text-muted-foreground capitalize hidden sm:block">{day.condition}</p>
              </div>
              <p className="text-sm w-1/4 text-right">
                <span className="font-semibold">{day.high}°</span> / {day.low}°
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
      <CardFooter className="text-xs text-muted-foreground text-center block pt-4">
        Weather data provided by OpenWeatherMap.
      </CardFooter>
    </div>
  );
}

