
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Thermometer, Cloud, Umbrella, Wind, MapPin, Loader2, AlertTriangle, RotateCw } from "lucide-react";
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
  hourly: HourlyForecast[]; // Will be empty with /data/2.5/weather
  daily: DailyForecast[];   // Will be empty with /data/2.5/weather
};


const WeatherIcon = ({ iconName, className }: { iconName: React.ElementType; className?: string }) => {
  const IconComponent = iconName || Cloud; // Default to Cloud if no icon provided
  return <IconComponent className={cn("h-8 w-8", className)} />;
};

export function WeatherDisplay() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<"prompt" | "granted" | "denied">("prompt");

  const fetchWeatherFromApi = useCallback(async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      const data = await response.json(); // Parse JSON first to check for error structure
      if (!response.ok) {
        // Use the error message from the API response if available
        throw new Error(data.error || `Failed to fetch weather: ${response.statusText}`);
      }
      setWeatherData(data); // data is WeatherData if successful
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      console.error(err);
      setWeatherData(null); // Clear old data on error
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

    setIsLoading(true); 
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
        setWeatherData(null); 
      }
    );
  }, [fetchWeatherFromApi]);

  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then(status => {
        setPermissionStatus(status.state);
        if (status.state === 'granted') { 
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
             setWeatherData(null);
          }
        };
      }).catch(() => {
        handleLocationRequest(); 
      });
    } else {
      handleLocationRequest();
    }
  }, [handleLocationRequest]);


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
          {error && permissionStatus === 'denied' && ( 
            <Alert variant="destructive" className="mb-4 text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Location Error</AlertTitle>
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
              <AlertTitle>Error Fetching Weather</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => location && fetchWeatherFromApi(location.latitude, location.longitude)} disabled={isLoading || !location}>
             <RotateCw className="mr-2 h-4 w-4" /> Retry
            </Button>
             {!location && permissionStatus === 'denied' && <p className="text-sm text-muted-foreground mt-2">If location access was denied, please grant it and retry.</p>}
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
        <Card className="shadow-xl text-center">
          <CardHeader>
            <CardTitle>Weather Data Not Loaded</CardTitle>
            <CardDescription>Could not load weather information. Please try again.</CardDescription>
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

      {/* Hourly and Daily forecast sections are removed as /data/2.5/weather does not provide this data */}
      
      <CardFooter className="text-xs text-muted-foreground text-center block pt-4">
        Weather data provided by OpenWeatherMap. Forecasts are not available with the current API configuration.
      </CardFooter>
    </div>
  );
}
